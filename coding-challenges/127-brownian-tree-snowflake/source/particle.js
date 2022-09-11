class Particle {
  static get diam() { return 8; }
  static get randomness() { return 3; }
  
  constructor() {
    this.pos = createVector(width*0.4, 0);
  }
  
  update() {
    this.pos.x -= 1;
    this.pos.y += random(-Particle.randomness, Particle.randomness);
  }
  
  draw() {
    noStroke();
    fill(255, 255, 255, 200);
    circle(this.pos.x, this.pos.y, Particle.diam);
  }
}