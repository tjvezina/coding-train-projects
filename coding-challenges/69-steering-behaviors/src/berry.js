const BerryType = {
  JUICY: 'juicy',
  POISON: 'poison',
}
Object.freeze(BerryType)

class Berry {  
  constructor(type) {
    if (!Object.values(BerryType).includes(type)) {
      throw new Error('Invalid berry type: ' + type)
    }
    
    this.type = type
    this.position = createVector(random(width - 20) + 10, random(height - 20) + 10)
  }
  
  get value() {
    switch (this.type) {
      case BerryType.JUICY: return 0.05
      case BerryType.POISON: return -0.1
    }
  }
  
  get color() {
    switch (this.type) {
      case BerryType.JUICY: return color(101, 171, 48)
      case BerryType.POISON: return color(117, 32, 21)
    }
  }
  
  draw() {
    strokeWeight(2)
    stroke(lerpColor(this.color, color(0), 0.5))
    fill(this.color)
    circle(this.position.x, this.position.y, 8)
  }
}