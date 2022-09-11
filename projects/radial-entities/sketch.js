const FPS = 30;
const OUTER_RADIUS = 0.8; // Percent of width

const ScaleType = {
  Default: 'Default',
  Grow: 'Grow',
  Shrink: 'Shrink',
  Bulge: 'Bulge',
}

const Sprite = {
  Circle: 'Circle',
  Star: 'Star',
  Ring: 'Ring',
  Hexagon: 'Hexagon',
}

// General
let durationSlider;
// Shape
let armsSlider;
let branchSlider;
let pointsSlider;
let innerRadiusSlider;
let sizeSlider;
let scaleSelect;
let spriteSelect;
// Color
let darkToggle;
let colorHueSliders = [];
let backgroundHue1Slider;
let backgroundHue2Slider;
let fogToggle;
let fogDepthSlider;
// Animation
let spiralAmpSlider;
let spiralFreqSlider;
let spiralOffsetSlider;

const controls = [];

const sprites = {};

let t = 0;

let gl;

let recordingTimer = null;

function preload() {
  for (let spriteName of Object.values(Sprite)) {
    sprites[spriteName] = loadImage(`assets/${spriteName}.png`);
  }
}

function setup() {
  createCanvas(512, 512, WEBGL);
  pixelDensity(1);
  colorMode(HSB);
  imageMode(CENTER);
  frameRate(FPS);
  smooth();
  
  gl = this._renderer.GL;
  
  createButton('Save GIF').style('margin-top', '1rem').mouseClicked(saveToGif);
  
  // new Button('Shuffle', onShuffle);
  
  new Header('General');
  durationSlider = new Slider('Duration', 1, 5, 2, 0.1);
  
  new Header('Shape');
  armsSlider = new Slider('Arms', 2, 20, 12);
  branchSlider = new Slider('Branches', 1, 3, 2);
  pointsSlider = new Slider('Points', 2, 42, 7);
  innerRadiusSlider = new Slider('Inner Radius', 0.1, 0.75, 0.2, 0.01);
  sizeSlider = new Slider('Size', 0.05, 0.15, 0.1, 0.01);
  scaleSelect = new Select('Arm Scale', Object.values(ScaleType), ScaleType.Grow);
  spriteSelect = new Select('Sprite', Object.values(Sprite), Sprite.Circle);
  
  new Header('Color');
  darkToggle = new Toggle('Dark Mode', true);
  for (let i = 0; i < 3; i++) {
    colorHueSliders.push(new Slider(`Color ${i+1}`, 0, 360, 42 + 60*i));
  }
  backgroundHue1Slider = new Slider('Background 1', 0, 360, 242);
  backgroundHue2Slider = new Slider('Background 2', 0, 360, 262);
  fogToggle = new Toggle('Fog', true);
  fogDepthSlider = new Slider('Fog Depth', 0.2, 2, 1, 0.1);
  
  new Header('Animation');
  spiralAmpSlider = new Slider('Amplitude', 0.01, 0.2, 0.1, 0.01);
  spiralFreqSlider = new Slider('Frequency', -4, 4, 1, 0.1);
  spiralOffsetSlider = new Slider('Arm Spirals', 0, 6, 2);  
}

function draw() {
  colorMode(HSB);
  
  /*** SETTINGS ***/
  
  const duration = durationSlider.value;
  
  const armCount = armsSlider.value;
  const branchCount = branchSlider.value;
  const pointCount = pointsSlider.value;
  const innerRadius = innerRadiusSlider.value * OUTER_RADIUS;
  const size = sizeSlider.value;
  const scaleType = scaleSelect.value;
  const sprite = sprites[spriteSelect.value];
  
  const isDark = darkToggle.enabled;
  const backgroundColor1 = color(backgroundHue1Slider.value, isDark ? 56 : 24, isDark ? 21 : 100);
  const backgroundColor2 = color(backgroundHue2Slider.value, isDark ? 42 : 14, isDark ? 21 : 100);
  const colors = colorHueSliders.map(slider => color(slider.value, 78, 72));
  const fogEnabled = fogToggle.enabled;
  const fogDepth = fogDepthSlider.value;

  const spiralAmp = spiralAmpSlider.value;
  const spiralFreq = spiralFreqSlider.value;
  const spiralOffset = spiralOffsetSlider.value;
  
  /*** UPDATE ***/
  
  t += 1/FPS / durationSlider.value;
  while (t > 1) t -= 1;
  
  if (recordingTimer !== null) {
    --recordingTimer;
    if (recordingTimer < 0) {
      recordingTimer = null;
    }
  }
  
  /*** DRAW ***/
  
  clear();
  
  // Normalize canvas to 2x2 units (bottom-left = -1,-1 / top-right = 1, 1)
  scale(width/2);
  scale(1, -1);
  
  colorMode(RGB); // Color lerp needs to use RGB space to immitate alpha blending
  for (let i = 2; i > 0; i -= 0.02) {
    strokeWeight(i*width/2);
    stroke(lerpColor(backgroundColor1, backgroundColor2, i/2));
    point(0, 0, 0);
  }
  colorMode(HSB);
  noStroke();

  // Clear depth after drawing background, disable drawing to alpha channel for better transparency
  gl.clearDepth(1);
  gl.clear(this._renderer.GL.DEPTH_BUFFER_BIT);
  gl.colorMask(true, true, true, false);
  
  // Calculate particle positions, then render back-to-front for transparency
  const particles = [];
  
  // Calculate each branch's particle sizes, for use in spacing them out evenly
  const scales = new Array(pointCount).fill(0).map((p, i) => {
    switch (scaleType) {
      case ScaleType.Default: return size;
      case ScaleType.Grow: return size * ((i+1) / pointCount);
      case ScaleType.Shrink: return size * (1 - (i / pointCount));
      case ScaleType.Bulge: return size * sin(PI * ((i+1) / (pointCount+1)));
    }
  });

  let scaleSum = 0;
  scales.forEach((scale, i) => scaleSum += (i === 0 || i === scales.length-1 ? scale/2 : scale));
  const gapScale = min(1, (OUTER_RADIUS - innerRadius) / scaleSum);
  const g = ((OUTER_RADIUS - innerRadius) - (scaleSum * gapScale)) / (pointCount-1);
  
  for (let a = 0; a < armCount; a++) {
    for (let b = 0; b < branchCount; b++) {
      let prevY = null;
      for (let p = 0; p < pointCount; p++) {
        let scale = scales[p];
        let y = (prevY === null ? innerRadius : prevY + g + (scale + scales[p-1])/2*gapScale);
        prevY = y;
        
        const r = (y - innerRadius) / (OUTER_RADIUS - innerRadius);
        
        const radius = spiralAmp * y;
        const angle = TWO_PI * ((a / armCount * spiralOffset) + (b / branchCount) + (r * spiralFreq + t));
        const x = cos(angle) * radius;
        const z = sin(angle) * radius;

        let alpha = 1

        if (fogEnabled) {
          const fog = constrain((-z/radius)/fogDepth, 0, 1);
          alpha -= fog;
        }
        
        particles.push({
          x, y, z,
          a, b,
          alpha,
          scale,
        });
      }
    }
  }

  particles.sort((a, b) => a.z - b.z);
  
  for (let particle of particles) {
    const { x, y, z, a, b, alpha, scale } = particle
    
    let col = color(colors[b]);
    col.setAlpha(alpha);
    
    push();
    {
      rotate(-TWO_PI/armCount * a);
      translate(x, y, z);
      tint(col);
      texture(sprite);
      plane(scale, scale);
    }
    pop();
  }
}

function mouseClicked() {
  if (recordingTimer !== null) {
    return;
  }
  
  if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) {
    onShuffle();
  }
}

function keyPressed() {
  if (key === 'S') {
    const uiRoot = select('.ui-root');
    uiRoot.style('display', (uiRoot.style('display') === 'none' ? 'block' : 'none'))
  }
}

function saveToGif() {
  if (recordingTimer !== null) {
    return;
  }
  
  recordingTimer = ceil(durationSlider.value * FPS);
  createLoop({
    duration: durationSlider.value,
    gif: {
      render: false,
      download: true,
      fileName: 'radial-entity.gif',
    },
  });
}

function onShuffle() {
  controls.forEach(control => control.randomize());
}
