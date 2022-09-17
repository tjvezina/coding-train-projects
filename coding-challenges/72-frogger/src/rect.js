class Rect {
  constructor(x, y, w, h) {
    Object.assign(this, { x, y, w, h })
    this._min = createVector(x, y)
    this._max = createVector(x + w, y + h)
  }
  
  get min() {
    return createVector(this.x, this.y)
  }
  
  get max() {
    return createVector(this.x + this.w, this.y + this.h)
  }
  
  intersects(other) {
    const { min: min1, max: max1 } = this
    const { min: min2, max: max2 } = other
    
    return (min1.x < max2.x && min2.x < max1.x && min1.y < max2.y && min2.y < max1.y)
  }
  
  contains(point) {
    const { min, max } = this
    return point.x >= min.x && point.x <= max.x && point.y >= min.y && point.y <= max.y
  }
  
  draw() {
    rect(this.x, this.y, this.w, this.h)
  }
}