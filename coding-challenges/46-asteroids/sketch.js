let ship;
let lasers = [];
let asteroids = [];

function setup() {
  createCanvas(640, 480);
  
  ship = new Ship();
  for (let i = 0; i < 5; ++i) {
    asteroids.push(new Asteroid());
  }
  
  noFill();
  strokeWeight(2);
  stroke(0, 140, 0);
}

function draw() {
  background(0);
  
  if (keyIsDown(LEFT_ARROW)) {
    ship.rotate(-1);
  }
  if (keyIsDown(RIGHT_ARROW)) {
    ship.rotate(1);
  }
  if (keyIsDown(UP_ARROW)) {
    ship.thrust();
  }
  if (keyIsDown(DOWN_ARROW)) {
    ship.brake();
  }
  if (keyIsDown(32)) { // Spacebar
  }
  
  for (let i = 0; i < lasers.length; ++i) {
    let l = lasers[i];
    l.update();
    l.draw();
    if (!l.isAlive()) {
      lasers.splice(i--, 1);
    }
  }
  
  ship.update();
  ship.draw();
  
  for (let i = 0; i < asteroids.length; ++i) {
    let a = asteroids[i];
    a.update();
    a.draw();
  }
}

function keyPressed() {
  if (key == ' ') {
    lasers.push(new Laser(ship.pos.copy(), createVector(1, 0).rotate(ship.angle)));
  }
}
