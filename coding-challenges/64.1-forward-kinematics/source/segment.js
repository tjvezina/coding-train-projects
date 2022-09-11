class Segment {
  static createRoot(position, rotation, length, angle = 0) {
    return new Segment(position, rotation, null, length, angle)
  }
  
  static createChild(parent, length, angle = 0) {
    const child = new Segment(null, null, parent, length, angle)
    parent.child = child
    return child
  }
  
  constructor(position, rotation, parent, length, angle) {
    Object.assign(this, { position, rotation, parent, length, localAngle: angle })
    this.child = null
    push()
    {
      colorMode(HSB)
      this.color = color(240 - this.index * 6, 60, 100)
    }
    pop()
  }
  
  get index() {
    return (this.parent !== null ? this.parent.index : 0) + 1
  }
  
  get angle() {
    if (this.parent !== null) {
      return this.parent.angle + this.localAngle
    }
    return this.rotation + this.localAngle
  }
  
  get size() {
    if (this.parent !== null) {
      return max(2, this.parent.size - 2)
    }
    return 32
  }
  
  get start() {
    if (this.parent !== null) {
      return this.parent.end
    }
    return this.position
  }
  
  get end() {
    const dir = createVector(cos(this.angle), sin(this.angle))
    return this.start.copy().add(dir.mult(this.length))
  }
  
  draw() {
    const { start, end, angle, size } = this
    
    strokeWeight(size+2)
    stroke(0)
    line(start.x, start.y, end.x, end.y)
    
    strokeWeight(size)
    stroke(this.color)
    line(start.x, start.y, end.x, end.y)
  }
}