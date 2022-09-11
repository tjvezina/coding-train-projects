let points = [];
let hull = [];

let leftMost = null;
let edgeOptions = [];
let ccwMost = null;

let isDone = false;

function setup() {
  createCanvas(600, 600);
  pixelDensity(1);
  
  for (let i = 0; i < 16; i++) {
    points.push(createVector(random(50, width-50), random(50, height-50)));
  }
}

function draw() {
  background(42);
  
  noFill();

  strokeWeight(2);
  stroke(0, 50, 200);
  beginShape();
  hull.forEach(p => vertex(p.x, p.y));
  endShape();
  
  const next = hull.slice(-1)[0];
  strokeWeight(1);
  stroke(255, 255, 255, 127);
  edgeOptions.forEach(p => line(next.x, next.y, p.x, p.y));
  
  if (ccwMost !== null) {
    strokeWeight(2);
    stroke(0, 200, 0);
    line(next.x, next.y, ccwMost.x, ccwMost.y);
  }
  
  strokeWeight(5);
  stroke(255);
  points.forEach(p => point(p.x, p.y));
  
  if (hull.length > 0) {
    stroke(0, 200, 0);
    point(hull[0].x, hull[0].y);
  }
}

function mouseClicked() {
  if (!isDone && mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) {
    step();
  }
}

function step() {
  if (leftMost === null) {
    points.sort((a, b) => a.x - b.x);
    leftMost = points[0];
    hull.push(leftMost);
    return;
  }
  
  if (edgeOptions.length === 0) {
    const next = hull.slice(-1)[0];
    edgeOptions = points.filter(p => p !== next);
    return;
  }
  
  if (ccwMost === null) {
    const next = hull.slice(-1)[0];
    const edges = edgeOptions.map(p => ({ p, dir: p5.Vector.normalize(p5.Vector.sub(p, next)) }));
    edges.sort((a, b) => p5.Vector.cross(b.dir, a.dir).z);
    ccwMost = edges[0].p;
    return;
  }
  
  hull.push(ccwMost);
  
  if (ccwMost === leftMost) {
    isDone = true;
  }
  
  edgeOptions.length = 0;
  ccwMost = null;
}