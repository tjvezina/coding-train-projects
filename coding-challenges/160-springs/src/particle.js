const SIZE = 16;
const DAMPENING = 0.99;

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.mass = 1;
    this.isLocked = false;
  }
  
  addForce(force) {
    this.acc.add(p5.Vector.div(force, this.mass));
  }
  
  update() {
    if (this.isLocked) {
      return;
    }
    
    this.vel.mult(DAMPENING);
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    
    this.acc.mult(0);
  }
  
  draw() {
    const { x, y } = this.pos;
    
    noStroke();
    fill(45, 197, 244);
    circle(x, y, SIZE);
  }
}