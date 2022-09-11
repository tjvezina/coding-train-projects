const SPACING = 50;
const K = 0.1; // Spring constant
let GRAVITY;

const particles = [];
const springs = [];

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  
  GRAVITY = createVector(0, 0.1);
  
  for (let i = 0; i < 10; i++) {
    particles.push(new Particle(0, SPACING * i));
    if (i === 0) {
      particles[i].isLocked = true;
    } else {
      const prev = particles[i-1];
      const next = particles[i];
      springs.push(new Spring(K, SPACING, prev, next));
    }
  }
}

function draw() {
  background(42);
  
  translate(width/2, 0);
  
  springs.forEach(spring => spring.update());
  
  noFill();
  stroke(255);
  strokeWeight(8);
  beginShape();
  {
    particles.forEach((p, i) => {
      p.addForce(GRAVITY);
      p.update();
      curveVertex(p.pos.x, p.pos.y);
      // curveVertex requires an additional point at each end for calculating the curve, which isn't drawn
      if (i === 0 || i === particles.length - 1) {
        curveVertex(p.pos.x, p.pos.y);
      }
    });
  }
  endShape();
  
  const tail = particles.slice(-1)[0];
  fill(45, 244, 197);
  circle(tail.pos.x, tail.pos.y, 64);
  
  if (mouseIsPressed) {
    tail.pos.set(mouseX - width/2, mouseY);
    tail.vel.mult(0);
  }
}