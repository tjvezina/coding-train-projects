class Spring extends VerletSpring2D {
  constructor(particleA, particleB) {
    super(particleA, particleB, clothSpacing, 0.5)
  }
  
  draw() {
    stroke(map(this.a.y, 0, height, 50, 200), 150, 175)
    strokeWeight(1)
    line(this.a.x, this.a.y, this.b.x, this.b.y)
  }
}