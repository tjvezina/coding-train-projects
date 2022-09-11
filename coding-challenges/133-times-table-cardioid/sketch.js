const ANIM_TIME = 6;

let radius = 0;
let s = 0;

let pointCount = 1;

let monochromeToggle;
let pointsSlider;
let factorSlider;
let animateToggle;
let speedSlider;

let time = 0;

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateLayout();
}

function updateLayout() {
  const size = min(windowWidth, windowHeight);
  radius = size * 0.38;
  s = size/1000;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  updateLayout();
  
  const uiContainer = createDiv().class('ui-container');
    
  createP('Points').parent(uiContainer);
  pointsSlider = createSlider(0, 6, 3).parent(uiContainer);
  
  createP('').parent(uiContainer);
  
  createP('Factor').parent(uiContainer);
  factorSlider = createSlider(2, 20, 2).parent(uiContainer);
  
  createP('').parent(uiContainer);
  
  animateToggle = createCheckbox('Animate', true).parent(uiContainer).changed(onAnimateToggled);
  monochromeToggle = createCheckbox('Monochrome').parent(uiContainer);
  
  onAnimateToggled();
}

function onAnimateToggled() {
  time = (animateToggle.checked() ? 0 : 1);
}

function draw() {
  background(42);
  
  if (animateToggle.checked()) {
    time += (min(deltaTime/1000, 1/30)) / ANIM_TIME;
    if (time > 1) time -= 2;
  }
  
  translate(width/2, height/2);
  
  fill(64);
  strokeWeight(4*s);
  stroke(127);
  circle(0, 0, radius*2);
  
  pointCount = 10 * pow(2, pointsSlider.value());
  
  const labelInterval = ceil(pointCount / 40);
  for (let i = 0; i < pointCount; i++) {
    const p = getPoint(i);
    noFill();
    stroke(127);
    strokeWeight(16*s);
    point(p.x, p.y);
    
    if (i % labelInterval === 0) {
      const p2 = getPoint(i, radius*1.08);
      noStroke();
      fill(80);
      textAlign(CENTER, CENTER);
      textStyle(BOLD);
      textSize(20*s);
      text(i, p2.x, p2.y);
    }
  }

  const p = ((time+1)%1) * pointCount;
  const a = getPoint(p);
  const b = getPoint(p*factorSlider.value());
  push();
  colorMode(HSB);
  strokeWeight(2*s);
  if (!monochromeToggle.checked()) {
    stroke(p/pointCount * 360, 80, 100, 0.5);
  } else {
    stroke(0, 0, 100, 0.25);
  }
  line(a.x, a.y, b.x, b.y);
  pop();
  
  const iStart = (time >= 0 ? 0 : ceil((time+1)*pointCount));
  const iEnd = (time >= 0 ? ceil(time*pointCount) : pointCount);
  for (let i = iStart; i < iEnd; i++) {
    const a = getPoint(i);
    const b = getPoint(i*factorSlider.value());
    
    push();
    colorMode(HSB);
    strokeWeight(2*s);
    if (!monochromeToggle.checked()) {
      stroke(i/pointCount * 360, 80, 100, 0.5);
    } else {
      stroke(0, 0, 100, 0.25);
    }
    line(a.x, a.y, b.x, b.y);
    pop();
  }
}

function getPoint(i, rad = radius) {
  const angle = -HALF_PI + TWO_PI*(i/pointCount);
  return { x: cos(angle) * rad, y: sin(angle) * rad };
}
