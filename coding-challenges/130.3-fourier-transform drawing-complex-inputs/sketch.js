const PADDING = 1/50;

const DRAW_TIME = 60;

let time = 0;
let n = 0;

let path = [];
let lastPath = [];

let drawingSize;
let drawingCenter;

let transform;

let drawingScale;

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateLayout();
}

function updateLayout() {
  canvasSize = min(width, height);
  drawingScale = (canvasSize * (1 - 2*PADDING)) / max(drawingSize.x, drawingSize.y);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  strokeJoin(ROUND);
  frameRate(60);
  
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  drawing.forEach(p => {
    minX = min(minX, p.x);
    maxX = max(maxX, p.x);
    minY = min(minY, p.y);
    maxY = max(maxY, p.y);
  });
  
  drawingSize = createVector(maxX - minX, maxY - minY);
  drawingCenter = createVector((minX + maxX)/2, (minY + maxY)/2);
  
  updateLayout();
  
  noStroke();
  fill(127);
  textAlign(CENTER);
  textSize(width/30);
  text('Generating fourier transform...', width/2, height/2);
}

function generateTransforms() {
  const values = [];
  for (let i = 0; i < drawing.length; i++) {
    const p = drawing[i];
    values.push({ x: p.x - drawingCenter.x, y: p.y - drawingCenter.y });
  }
  transform = dft(values);
}

function draw() {
  // Wait until first frame to generate data, so we can render a loading message in setup
  if (transform === undefined) {    
    generateTransforms();
  }
  
  colorMode(HSB);
  clear();
  
  translate(width/2, height/2);
  scale(drawingScale);
  
  time += min(deltaTime/1000, 1/60);
  const nTarget = floor((time % DRAW_TIME) / DRAW_TIME * transform.length);
  while (n !== nTarget) {
    step();
  }
  
  const pos = drawTransform();
    
  noFill();
  strokeWeight(2);
  
  strokeWeight(2/drawingScale);
  if (lastPath !== undefined) {
    stroke(0, 0, 80, 0.1);
    beginShape();
    for (let i = 0; i < lastPath.length; i++) {
      const p = lastPath[i];
      vertex(p.x, p.y);
    }
    endShape();
  }
  
  stroke(0, 0, 80);
  beginShape();
  for (let i = 0; i < path.length; i++) {
    const p = path[i];
    vertex(p.x, p.y);
  }
  endShape();
}

function step() {
  path.push(solveTransform());
  
  n++;
  if (n === transform.length) {
    n = 0;
    lastPath = [...path];
    path = [];
  }
}

function solveTransform() {
  const t = (n / transform.length) * TWO_PI;
  
  let x = 0;
  let y = 0;
  
  for (let i = 0; i < transform.length; i++) {
    const { freq, amp, phase } = transform[i];
    
    const angle = t * freq + phase;
    x += cos(angle) * amp;
    y += sin(angle) * amp;
  }
  
  return { x, y };
}

function drawTransform() {
  noFill();
  strokeWeight(2/drawingScale);
  
  const t = (n / transform.length) * TWO_PI;
  
  let lastPosRendered;
  let x = 0;
  let y = 0;
  for (let i = 0; i < transform.length; i++) {
    const { freq, amp, phase } = transform[i];
    
    const angle = t * freq + phase;
    const p = { x: cos(angle) * amp, y: sin(angle) * amp };

    // Improve performance by skipping circles that are too small to see
    if (amp > 1) {
      const hue = min(1, i/64) * 360;
      
      stroke(hue, 80, 100, 0.1);
      circle(x, y, amp*2);

      stroke(hue, 80, 100, 0.5);
      line(x, y, x + p.x, y + p.y);
    } else if (lastPosRendered === undefined) {
      lastPosRendered = { x, y };
    }

    x += p.x;
    y += p.y;
  }
  
  if (lastPosRendered !== undefined) {
    stroke(0, 80, 100);
    line(lastPosRendered.x, lastPosRendered.y, x, y);
  }
  
  return { x, y };
}
