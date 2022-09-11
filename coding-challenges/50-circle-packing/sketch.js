let circles = [];

function setup() {
  createCanvas(400, 400);
  colorMode(HSB, 100);
}

function draw() {
  background(0);

  tryCreateCircle();

  circles.forEach(c => {
    c.update();
    c.draw();
  });
}

function tryCreateCircle() {
  let newCircle = new Circle(createVector(random(width), random(height)));
  if (!isIntersectingCircle(newCircle)) {
    circles.push(newCircle);
  }
}

function isIntersectingCircle(circ) {
  return circles.some(other => {
    return (other != circ) && circ.pos.dist(other.pos) < circ.r + other.r;
  });
}