const WIDTH = 144;
const HEIGHT = 256;
const SIM_FPS = 60;
const BIRDS = 100;

let canvas;
let displayScale;
let font;

let birds = [];
let level;
let score = 0;
let highScore = 0;
let generation = 1;

const buttons = [];
const BUTTON_SPEEDS = [1, 2, 10, Infinity];
let currentSpeed = BUTTON_SPEEDS[0];

const birdSprites = [];

function preload() {
  font = loadFont('./assets/fonts/flappy.TTF');
  
  for (let i = 1; i <= 3; ++i) {
    birdSprites.push(loadImage('./assets/images/bird' + i + '.png'));
  }
  birdSprites.push(birdSprites[1]);
}

function setup() {
  canvas = createCanvas(WIDTH, HEIGHT);
  
  for (let i = 0; i < BUTTON_SPEEDS.length; i++) {
    buttons.push(new Button(
      map(i, 0, BUTTON_SPEEDS.length-1, WIDTH*0.25, WIDTH*0.75), HEIGHT - 38,
      18, 10,
      BUTTON_SPEEDS[i] === Infinity ? 'MAX' : `${BUTTON_SPEEDS[i]}x`
    ));
  }
  
  for (let i = 0; i < BIRDS; i++) {
    birds.push(new SmartBird());
  }
  
  level = new Level();
  
  resetCanvas();
  resetGame();
}

function windowResized() {
  resetCanvas();
}

function resetCanvas() {
  displayScale = windowHeight / HEIGHT;
  resizeCanvas(WIDTH * displayScale, HEIGHT * displayScale);
  canvas.position((windowWidth - width) / 2, 0);
}

function resetGame() {
  highScore = max(highScore, score);
  score = 0;
  
  birds.forEach(bird => bird.reset());
  level.reset();
}

function evolve() {
  const viableParents = birds.filter(birds => birds.finalScore > 0).sort((a, b) => b.finalScore - a.finalScore);
  
  if (viableParents.length === 0) {
    birds.forEach(bird => bird.mutate());
  } else {
    const newBirds = [];

    const finalScoreSum = viableParents.map(x => x.finalScore).reduce((a, b) => a + b);
    for (let i = 0; i < birds.length; i++) {
      let i = 0;
      let r = random(1);
      while (r > 0) {
        r -= viableParents[i].finalScore / finalScoreSum;
        i++;
      }
      const newBird = new SmartBird(viableParents[i-1].brain.copy());
      newBird.mutate();
      newBirds.push(newBird);
    }
    
    birds = newBirds;
  }

  generation++;
}

function draw() {  
  scale(displayScale);

  if (currentSpeed === Infinity) {
    const startTime = millis();
    while (millis() - startTime < 1000/60) {
      updateGame();
    }
  } else {
    for (let simStep = 0; simStep < currentSpeed; simStep++) {
      updateGame();
    }
  }
  
  const liveBirds = birds.filter(bird => !bird.isDead);
  
  level.draw();
  liveBirds.forEach(bird => bird.draw());
  
  buttons.forEach((button, i) => button.draw(currentSpeed === BUTTON_SPEEDS[i]));
  
  textFont(font);
  textSize(28);
  textAlign(CENTER, CENTER);
  stroke(0);
  strokeWeight(2);
  fill(0);
  text(score, WIDTH / 2 + 1, HEIGHT / 5 + 1);
  fill(255);
  text(score, WIDTH / 2, HEIGHT / 5);
  textSize(8);
  strokeWeight(1);
  text("High Score: " + highScore, WIDTH / 2, HEIGHT - 6);
  text("Generation: " + generation, WIDTH / 2, HEIGHT - 16);
  textAlign(LEFT, CENTER);
  text("Birds: ", WIDTH*0.31, HEIGHT - 26);
  textAlign(RIGHT, CENTER);
  text(`${liveBirds.length}/${birds.length}`, WIDTH*0.69, HEIGHT - 26);
}

function updateGame() {
  const liveBirds = birds.filter(bird => !bird.isDead);

  if (liveBirds.length > 0) {
    level.update();
    score = max(0, floor((level.dist - WIDTH - PIPE_WIDTH + BIRD_POS_X - BIRD_WIDTH/2)/PIPE_SPACE));
    const nextPipePos = level.nextPipePos
    liveBirds.forEach(bird => {
      bird.think(nextPipePos);
      bird.update();
    });
  } else {
    evolve();
    resetGame();
  }
}

function mousePressed() {
  const mouse = { x: mouseX / displayScale, y: mouseY / displayScale };
  buttons.forEach((button, i) => {
    const left = button.pos.x - button.size.x/2;
    const right = button.pos.x + button.size.x/2;
    const top = button.pos.y - button.size.y/2;
    const bottom = button.pos.y + button.size.y/2;
    
    if (mouse.x > left && mouse.x < right && mouse.y > top && mouse.y < bottom) {
      currentSpeed = BUTTON_SPEEDS[i];
    }
  });
}
