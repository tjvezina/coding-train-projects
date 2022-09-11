var dim = 400;

// JavaScript object notation
var circle = {
  x: 100,
  y: 100,
  d: 50
};

function setup() {
  createCanvas(dim, dim);
}

function draw() {
  background(map(mouseX, 0, dim, 0, 255));
  ellipse(circle.x, circle.y, circle.d, circle.d);
}

function mousePressed() {
  fill(random(100, 255), random(100, 255), random(100, 255));
  strokeWeight(random()*8);
}