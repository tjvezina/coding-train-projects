var dim = 400;

// JavaScript object notation
var circleData = {
  x: 100,
  y: 100,
  d: 50
};

function setup() {
  createCanvas(dim, dim);
}

function draw() {
  background(map(mouseX, 0, dim, 0, 255));
  circle(circleData.x, circleData.y, circleData.d, circleData.d);
}

function mousePressed() {
  fill(random(100, 255), random(100, 255), random(100, 255));
  strokeWeight(random()*8);
}