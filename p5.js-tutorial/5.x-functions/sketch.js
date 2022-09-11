const depth = 500;
let depthScale = 1 / ((depth / 500) + 1);

// JavaScript object literal
var ball = {
  x: 50,
  y: 50,
  z: 50,
  r: 20
}

var vel = {
  x: 2,
  y: 2,
  z: 2
}

function setup() {
  createCanvas(600, 400);
}

function draw() {
  background(0);
  
  drawBox();
  
  bounce();
  move();
  display();
}

function drawBox() {
  strokeWeight(1);
  stroke(100);
  var min = map(depthScale, 0, 1, 0.5, 0);
  var max = map(depthScale, 0, 1, 0.5, 1);
  var p0 = { x: width * min, y: height * min };
  var p1 = { x: width * max, y: height * min };
  var p2 = { x: width * min, y: height * max };
  var p3 = { x: width * max, y: height * max };
  line(0, 0, p0.x, p0.y);
  line(width, 0, p1.x, p1.y);
  line(0, height, p2.x, p2.y);
  line(width, height, p3.x, p3.y);
  line(p0.x, p0.y, p1.x, p1.y);
  line(p2.x, p2.y, p3.x, p3.y);
  line(p0.x, p0.y, p2.x, p2.y);
  line(p1.x, p1.y, p3.x, p3.y);
}

function bounce() {
  if (ball.x < ball.r || ball.x > width - ball.r) {
    vel.x *= -1;
  }
  if (ball.y < ball.r || ball.y > height - ball.r) {
    vel.y *= -1;
  }
  if (ball.z < ball.r || ball.z > depth - ball.r) {
    vel.z *= -1;
  }
}

function move() {
  ball.x += vel.x;
  ball.y += vel.y;
  ball.z += vel.z;
}

function display() {
  var scale =  map(ball.z, 0, depth, 1, depthScale);
  stroke(255);
  strokeWeight(0);//4 * scale);
  fill(map(ball.x, 0, width, 0, 255), map(ball.y, 0, height, 0, 255), map(ball.z, 0, depth, 0, 255));
  var x = (ball.x - width / 2) * scale + width / 2;
  var y = (ball.y - height / 2) * scale + height / 2;
  var diam = (ball.r * 2) * scale;
  ellipse(x, y, diam, diam);
}