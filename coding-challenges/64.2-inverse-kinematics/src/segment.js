class Segment {
  static createRoot(start, length, angle) {
    return new Segment(start, null, length, angle)
  }
  
  static createChild(parent, length, angle) {
    const child = new Segment(parent.end.copy(), parent, length, angle)
    parent.child = child
    return child
  }
  
  constructor(start, parent, length, angle) {
    Object.assign(this, { start, parent, length, angle })
    this.child = null
    push()
    {
      colorMode(HSB)
      this.color = color(10 + this.index * 6, 60, 100)
    }
    pop()
  }
  
  get index() {
    return (this.parent !== null ? this.parent.index : 0) + 1
  }
  
  get size() {
    if (this.parent !== null) {
      return max(2, this.parent.size - 1)
    }
    return 16
  }
  
  get end() {
    const { angle } = this
    const dir = createVector(cos(angle), sin(angle))
    return this.start.copy().add(dir.mult(this.length))
  }
  
  draw() {
    const { start, end, size } = this
    
    strokeWeight(size+2)
    stroke(0)
    line(start.x, start.y, end.x, end.y)
    
    strokeWeight(size)
    stroke(this.color)
    line(start.x, start.y, end.x, end.y)
  }
  
  follow() {
    const target = (this.child !== null ? this.child.start : createVector(mouseX, mouseY))
    const delta = p5.Vector.sub(target, this.start)
    this.angle = delta.normalize().heading()
    this.start = p5.Vector.add(target, delta.mult(-this.length))
  }
}