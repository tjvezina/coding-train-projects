/*
  Project inspired by Kerflux: https://play.google.com/store/apps/details?id=com.PunkLabs.Kerflux
*/

class GameState {
  static get Intro() { return 'Intro'; } // Waves animating in
  static get Normal() { return 'Normal'; } // Player interaction
  static get Win() { return 'Win'; } // Target matched
  static get Outro() { return 'Outro'; } // Waves animating out
}

let WAVE_DEFINITIONS;

const MARGIN_TOP = 0.1666;
const MARGIN_BOT = 0.25;
const TUTORIAL_TIME = 2.0;
const ANIM_TIME = 1.5;
const WIN_TIME = 3.0;
const WIN_THRESHOLD = 0.025; // Maximum average error
const WIN_MIN_TIME = 0.5;

const GUESS_ALPHA = 0.6;

let targetWave;
let guessWave;
let simpleWaves = [];

let showingTutorial = true;
let tutorialAnimRatio = 1;

let draggingWave = null;
let lastMouseX;

const solutionOffsets = [];

let gameState = GameState.Intro;
let waveAnimRatio = 0;
let generateLevelIsPending = false;

let winTimer = 0;
let winAnimRatio = 0;
let winDeltas = [];

let font;

let waveSelect;
let mixWaveformsCheckbox;
let hardModeCheckbox;

let showingDebugOverlay = false;

function preload() {
  font = loadFont('assets/LEMONMILK-Medium.otf');
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  
  positionWaves();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  strokeJoin(ROUND);
  textFont(font);
  
  if (getItem('hasSeenTutorial')) {
    showingTutorial = false;
    tutorialAnimRatio = 0;
  }
  
  WAVE_DEFINITIONS = {
    "Sine": new WaveDefinition(x => sin(x*TWO_PI)),
    "Sawtooth": new WaveDefinition(x => 2*x-1, true),
    "Square": new WaveDefinition(x => x < 0.5 ? 1 : -1),
    "Triangle": new WaveDefinition(x => 2*abs(2*x-1)-1),
    "Bounce": new WaveDefinition(x => 2*sin(x*PI)-1, true)
  };
  
  buildUI();
  
  targetWave = new CombineWave({ color: color(16), animDir: AnimDir.Left });
  guessWave = new CombineWave({ color: color(255), animDir: AnimDir.Right });
  
  generateLevel();
}

function buildUI() {  
  const uiRoot = createDiv().class('ui-root');
  
  const mainContainer = createDiv().class('container').parent(uiRoot);
  
  waveSelect = createSelect()
    .parent(mainContainer)
    .changed(onSettingChanged);
  Object.keys(WAVE_DEFINITIONS).forEach(name => waveSelect.option(name));
  
  createButton('Next Level')
    .parent(mainContainer)
    .mousePressed(onSettingChanged);
  
  const optionsContainer = createDiv().class('container').parent(uiRoot);
  
  mixWaveformsCheckbox = createCheckbox('Mix Functions', true)
    .parent(optionsContainer)
    .changed(onSettingChanged);
  hardModeCheckbox = createCheckbox('Hard Mode')
    .parent(optionsContainer)
    .changed(onSettingChanged);
}

function onSettingChanged() {
  if (mixWaveformsCheckbox.checked()) {
    waveSelect.attribute('disabled', '');
  } else {
    waveSelect.removeAttribute('disabled');
  }
  
  switch (gameState) {
    case GameState.Intro:
      generateLevelIsPending = true;
      break;
    case GameState.Normal:
      gameState = GameState.Outro;
      break;
  }
}

function generateLevel() {
  gameState = GameState.Intro;
  waveAnimRatio = 0;
  winAnimRatio = 0;
  draggingWave = null;
  
  simpleWaves.length = 0;
  const waveCount = (hardModeCheckbox.checked() ? 4 : 3);
  
  const startHue = random(360);
  const hueOffset = random(15, 30) * (random(1) < 0.5 ? 1 : -1);
  
  let definition = WAVE_DEFINITIONS[waveSelect.value()];
  
  colorMode(HSB);
  for (let i = 0; i < waveCount; i++) {
    if (mixWaveformsCheckbox.checked()) {
      definition = random(Object.values(WAVE_DEFINITIONS));
    }
    
    const wave = new SimpleWave({
      color: color(modulo(startHue + hueOffset*i, 360), 80, 100),
      animDir: (i % 2 === 0 ? AnimDir.Right : AnimDir.Left),
      definition,
      invert: definition.canInvert ? (random(1) < 0.5) : false,
      reverse: definition.canReverse ? (random(1) < 0.5) : false,
      scale: randomWaveScale(),
      offset: random(1)
    });
    
    // Avoid very similar waves that could result in multiple solutions
    let retryCount = 0;
    let wasUpdated = true;
    while (wasUpdated && retryCount++ < 100) {
      wasUpdated = false;
      for (let i = 0; i < simpleWaves.length; i++) {
        const otherWave = simpleWaves[i];
        if (wave.definition === otherWave.definition && wave.invert === otherWave.invert && wave.reverse === otherWave.reverse) {
          const ratio = (wave.scale > otherWave.scale ? wave.scale / otherWave.scale : otherWave.scale / wave.scale);
          if (ratio < 1.25) {
            wave.scale = randomWaveScale();
            wasUpdated = true;
            break;
          }
        }
      }
    }
    
    simpleWaves.push(wave);
  }
  colorMode(RGB);
  
  positionWaves();
  
  solutionOffsets.length = 0;
  for (let wave of simpleWaves) {
    wave.generatePoints();
    
    solutionOffsets.push(wave.offset);
  }
  
  targetWave.combine(simpleWaves);
  
  // TODO: Avoid shuffling offsets in such a way that the solution is visible
  simpleWaves.forEach((wave, i) => {
    wave.offset += random(0.1, 0.9);
  });
}

function positionWaves() {
  const spacing = height * (1 - MARGIN_TOP - MARGIN_BOT) / (simpleWaves.length + 0.5);
  const startY = height*MARGIN_TOP + spacing*1.5;
  
  simpleWaves.forEach((wave, i) => wave.pos = createVector(width/2, startY + spacing * i));
  
  targetWave.pos = createVector(width/2, height * MARGIN_TOP);
  guessWave.pos = createVector(width/2, targetWave.pos.y);
}

function update() {
  switch (gameState) {
    case GameState.Intro:
      waveAnimRatio += deltaTime/1000 / ANIM_TIME;
      if (waveAnimRatio >= 1) {
        waveAnimRatio = 1;
        gameState = GameState.Normal;
        if (generateLevelIsPending) {
          generateLevelIsPending = false;
          gameState = GameState.Outro;
        }
      }
      break;
    case GameState.Normal:
      if (calculateGuessAccuracy() < WIN_THRESHOLD) {
        winTimer += deltaTime/1000;
        if (winTimer > WIN_MIN_TIME) {
          gameState = GameState.Win;
          winAnimRatio = 0;
          winDeltas = simpleWaves.map((wave, i) => wave.getDelta(solutionOffsets[i]));
        }
      } else {
        winTimer = 0;
      }
      break;
    case GameState.Win:
      winAnimRatio += deltaTime/1000 / WIN_TIME;
      if (winAnimRatio >= 1) {
        winAnimRatio = 1;
        gameState = GameState.Outro;
      }
      simpleWaves.forEach((wave, i) => {
        const t = smoothStep(min(1, winAnimRatio*3));
        const target = solutionOffsets[i];
        wave.offset = lerp(target + winDeltas[i], target, t);
      });
      break;
    case GameState.Outro:
      waveAnimRatio -= deltaTime/1000 / ANIM_TIME;
      if (waveAnimRatio <= 0) {
        waveAnimRatio = 0;
        generateLevel();
      }
      break;
  }
  
  simpleWaves.forEach(wave => wave.generatePoints());
  guessWave.combine(simpleWaves);
}

function draw() {
  clear();
  
  update();
  
  if (tutorialAnimRatio > 0) {
    if (!showingTutorial) {
      tutorialAnimRatio = max(0, tutorialAnimRatio - deltaTime/1000 / TUTORIAL_TIME);
    }
    
    noStroke();
    fill(60, 60, 60, 255 * tutorialAnimRatio);
    textAlign(CENTER, CENTER);
    textSize(min(height/50, width/36));
    text('Move the colored waves to match the black one above', width/2, (guessWave.pos.y + simpleWaves[0].pos.y)/2);
  }
  
  // Win pulse
  stroke(255, 255, 255, 255 * (1 - winAnimRatio) * 0.2);
  strokeWeight(height*2 * winAnimRatio);
  line(width/2 - Wave.width/2, guessWave.pos.y, width/2 + Wave.width/2, guessWave.pos.y);
  // Win rainbow
  colorMode(HSB);
  guessWave.color = color((millis()/1000*180) % 360, sqrt(winAnimRatio)*80, 100, GUESS_ALPHA);
  colorMode(RGB);
  
  targetWave.draw();
  guessWave.draw();
  simpleWaves.forEach(wave => wave.draw());

  if (showingDebugOverlay) {
    noStroke();
    fill(60);
    textAlign(CENTER, BOTTOM);
    textSize(height/60);
    text('Error: ' + calculateGuessAccuracy().toFixed(4), width/2, simpleWaves[0].pos.y - Wave.height*2/3);
  
    simpleWaves.forEach((wave, i) => {
      const delta = wave.getDelta(solutionOffsets[i]) / wave.scale;
      const xOff = Wave.width * delta;
      
      stroke(targetWave.color);
      strokeWeight(Wave.weight);
      line(width/2, wave.pos.y - Wave.height/2, width/2, wave.pos.y + Wave.height/2);      
      stroke(255);
      line(width/2 + xOff, wave.pos.y - Wave.height/2, width/2 + xOff, wave.pos.y + Wave.height/2);
    });
  }
}

function calculateGuessAccuracy() {
  // Alternate means of calculating accuracy
  // const deltas = simpleWaves.map((wave, i) => wave.getDelta(solutionOffsets[i]) / wave.scale * 2);
  // const dist = sqrt(deltas.map(x => x*x).reduce((a, b) => a + b));
  
  const guessErrors = guessWave.yValues.map((y, i) => abs(y - targetWave.yValues[i]));
  const avgError = guessErrors.reduce((a, b) => a + b) / guessWave.yValues.length;
  
  return avgError;
}

function mousePressed() {
  if (gameState !== GameState.Normal) {
    return;
  }
  
  for (let wave of [...simpleWaves, guessWave]) {
    if (mouseX > wave.pos.x - Wave.width/2 && mouseX < wave.pos.x + Wave.width/2 &&
        mouseY > wave.pos.y - Wave.height/2 && mouseY < wave.pos.y + Wave.height/2) {
      draggingWave = wave;
      lastMouseX = mouseX;
      if (showingTutorial) {
        showingTutorial = false;
        storeItem('hasSeenTutorial', true);
      }
      break;
    }
  }
}

function mouseWheel(e) {
  // There's no reliable way to detect touchpad vs. mouse, and there's no way to disable swipe navigation (would require changing
  // the window.top.body style, which is disallowed for security reasons), so just ignore what is probably touchpad input
  if (abs(e.delta) < 20) return;
  
  if (gameState === GameState.Normal) {
    let scrollWave;
    
    for (let wave of [...simpleWaves, guessWave]) {
      if (mouseX > wave.pos.x - Wave.width/2 && mouseX < wave.pos.x + Wave.width/2 &&
          mouseY > wave.pos.y - Wave.height/2 && mouseY < wave.pos.y + Wave.height/2) {
        scrollWave = wave;
        if (showingTutorial) {
          showingTutorial = false;
          storeItem('hasSeenTutorial', true);
        }
        break;
      }
    }
    
    if (scrollWave === guessWave) {
      for (let wave of simpleWaves) {
        wave.offset += (e.deltaY < 0 ? 1 : -1) * 0.001 * wave.scale;
      }
    } else if (scrollWave !== undefined) {
      scrollWave.offset += (e.deltaY < 0 ? 1 : -1) * 0.001 * scrollWave.scale;
    }
  }
}

function mouseReleased() {
  draggingWave = null;
}

function mouseDragged() {
  const deltaX = mouseX - lastMouseX;
  lastMouseX = mouseX;
  
  if (gameState === GameState.Normal && draggingWave !== null) {
    if (draggingWave === guessWave) {
      simpleWaves.forEach(wave => wave.offset += (deltaX / Wave.width) * wave.scale);
    } else {
      draggingWave.offset += (deltaX / Wave.width) * draggingWave.scale;
    }
  } else {
    draggingWave = null;
  }
}

function keyPressed() {
  if (key === 'D') {
    showingDebugOverlay = !showingDebugOverlay;
  }
  if (key === 'R') {
    storeItem('hasSeenTutorial', false);
  }
}

function randomWaveScale() {
  const e = 10; // Tend towards smaller scales
  const t = (pow(e, random(1)) - 1) / (e-1);
  return map(t, 0, 1, 1.5, 15);
}

function modulo(x, m) {
  return ((x % m) + m) % m;
}

function smoothStep(x) {
  return x * x * (3 - 2*x)
}
