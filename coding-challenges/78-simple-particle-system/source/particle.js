class Particle {
  constructor() {
    this.pos = createVector(width/2 + random(-10, 10), height-20)
    this.velocity = createVector(random(-1.5, 1.5), random(-PI, -PI/2))
    
    this.size = random(10, 20)
    this.color = lerpColor(color(214, 39, 19), color(191, 108, 25), random(1))
    this.color.setAlpha(255)
    
    this.life = 1
  }
  
  update() {
    this.life -= 0.01
    this.pos.add(this.velocity)
  }
  
  draw() {
    const currentColor = color(this.color.toString())
    currentColor.setAlpha(alpha(this.color) * this.life)
    fill(currentColor)
    circle(this.pos.x, this.pos.y, this.size)
  }
}