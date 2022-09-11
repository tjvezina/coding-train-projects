class Particle extends VerletParticle2D {
  constructor(x, y) {
    super(x, y)
  }
  
  draw() {
    fill(this.isLocked ? 128 : 255)
    ellipse(this.x, this.y, 8)
  }
}