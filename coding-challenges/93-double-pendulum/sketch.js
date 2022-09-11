const r1 = 100;
const r2 = 100;
const m1 = 12;
const m2 = 8;
let a1 = 0;
let a2 = 0;
let a1Vel = 0;
let a2Vel = 0;
let a1Acc = 0;
let a2Acc = 0;
const g = 0.2;

let trailCanvas;
let prevX2;
let prevY2;

function setup() {
  createCanvas(500, 500);
  trailCanvas = createGraphics(width, height);
  trailCanvas.background(42);
  
  a1 = PI/2;
  a2 = PI/2;
}

function draw() {
  trailCanvas.background(42, 42, 42, 1);
  translate(width/2, height/2);
  image(trailCanvas, -width/2, -height/2);
  
  calculateAcceleration();
  
  a1Vel += a1Acc;
  a2Vel += a2Acc;
  a1 += a1Vel;
  a2 += a2Vel;
  
  const x1 = r1 * sin(a1);
  const y1 = r1 * cos(a1);
  const x2 = r2 * sin(a2) + x1;
  const y2 = r2 * cos(a2) + y1;
  
  if (prevX2 !== undefined) {
    trailCanvas.strokeWeight(1.5);
    trailCanvas.stroke(0, 200, 220);
    trailCanvas.line(prevX2 + width/2, prevY2 + height/2, x2 + width/2, y2 + height/2);
  }
  prevX2 = x2;
  prevY2 = y2;
  
  noFill();
  strokeWeight(1);
  stroke(255, 255, 255, 10);
  circle(0, 0, (r1+r2)*2);
  
  strokeWeight(2);
  stroke(220);
  line(0, 0, x1, y1);
  line(x1, y1, x2, y2);
  
  noStroke();
  fill(250, 100, 0);
  circle(x1, y1, m1 * 2);
  circle(x2, y2, m2 * 2);
}

function calculateAcceleration() {
  a1Acc = (-g*(2*m1+m2)*sin(a1) - m2*g*sin(a1-2*a2) - 2*sin(a1-a2)*m2*(a2Vel*a2Vel*r2 + a1Vel*a1Vel*r1*cos(a1-a2))) /
    (r1*(2*m1+m2-m2*cos(2*a1-2*a2)));
  
  a2Acc = (2*sin(a1-a2)*(a1Vel*a1Vel*r1*(m1+m2) + g*(m1+m2)*cos(a1) + a2Vel*a2Vel*r2*m2*cos(a1-a2))) /
    (r2*(2*m1+m2-m2*cos(2*a1-2*a2)))
}
