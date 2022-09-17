const MARGIN = 1/3;
const PADDING = 1/50;

const DRAW_TIME = 20;

let time = 0;
let n = 0;

let path = [];
let lastPath = [];

let drawingSize;
let drawingCenter;

let xTransform;
let yTransform;

let canvasSize;
let canvasOffset;
let xTransformPos;
let yTransformPos;
let drawingScale;

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateLayout();
}

function updateLayout() {
  canvasSize = min(width, height);
  canvasOffset = createVector((width - canvasSize)/2, (height - canvasSize)/2);
  
  xTransformPos = createVector(canvasSize*(1+MARGIN)/2, canvasSize*MARGIN/2);
  yTransformPos = createVector(canvasSize*MARGIN/2, canvasSize*(1+MARGIN)/2);
  
  drawingScale = (canvasSize * (1 - MARGIN - 2*PADDING)) / max(drawingSize.x, drawingSize.y);
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
  text('Generating fourier transforms...', width/2, height/2);
}

function generateTransforms() {
  const xValues = [];
  const yValues = [];
  for (let i = 0; i < drawing.length; i++) {
    const p = drawing[i];
    xValues.push(p.x - drawingCenter.x);
    yValues.push(p.y - drawingCenter.y);
  }
  xTransform = dft(xValues);
  yTransform = dft(yValues);
}

function draw() {
  // Wait until first frame to generate data, so we can render a loading message in setup
  if (xTransform === undefined) {    
    generateTransforms();
  }
  
  colorMode(HSB);
  clear();
  
  translate(canvasOffset.x, canvasOffset.y);
  
  time += min(deltaTime/1000, 1/60);
  const nTarget = floor((time % DRAW_TIME) / DRAW_TIME * xTransform.length);
  while (n !== nTarget) {
    step();
  }
  
  const xPos = drawTransform(xTransform, xTransformPos, 0);
  const yPos = drawTransform(yTransform, yTransformPos, HALF_PI);
    
  noFill();
  strokeWeight(2);
  stroke(0, 0, 100, 0.1);
  const xStart = createVector(xTransformPos.x + xPos.x*drawingScale, xTransformPos.y + xPos.y*drawingScale);
  const yStart = createVector(yTransformPos.x + yPos.y*drawingScale, yTransformPos.y + yPos.x*drawingScale);
  line(xStart.x, xStart.y, xStart.x, yStart.y);
  line(yStart.x, yStart.y, xStart.x, yStart.y);
  
  line(canvasSize*MARGIN, canvasSize*0.01, canvasSize*MARGIN, canvasSize*(1-0.01));
  line(canvasSize*0.01, canvasSize*MARGIN, canvasSize*(1-0.01), canvasSize*MARGIN);
  
  translate(xTransformPos.x, yTransformPos.y);
  scale(drawingScale);
  
  strokeWeight(2/drawingScale);
  if (lastPath !== undefined) {
    stroke(0, 0, 20);
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
  const xPos = solveTransform(xTransform);
  const yPos = solveTransform(yTransform);
  
  path.push(createVector(xPos.x, yPos.x));
  
  n++;
  if (n === xTransform.length) {
    n = 0;
    lastPath = [...path];
    path = [];
  }
}

function solveTransform(transform) {
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

function drawTransform(transform, center, angle) {
  push();
  
  translate(center.x, center.y);
  rotate(angle);
  scale(drawingScale);
  
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
      
      stroke(hue, 80, 100, 0.2);
      circle(x, y, amp*2);

      stroke(hue, 80, 100);
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
  
  pop();
  
  return { x, y };
}
