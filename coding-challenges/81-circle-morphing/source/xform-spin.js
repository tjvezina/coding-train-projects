class TransformSpin extends Transform {
  get displayName() { return 'Spin' }
  
  _draw() {
    const angle = (isReverse ? 1-ts : ts) * PI*2/3
    const start = createVector(1, 0)
    const target = angleToVector(angle)
    const end = angleToVector(PI*2/3)
    
    this.strokeDetail()
    beginShape()
    {
      for (let i = 0; i < 3; i++) {
        const vertAngle = i * PI*2/3 + angle
        vertex(cos(vertAngle), sin(vertAngle))
      }
    }
    endShape(CLOSE)
    
    this.strokeMain()
    for (let i = 0; i < 3; i++) {
      if (!isReverse) {
        line(start.x, start.y, target.x, target.y)
        arc(0, 0, 2, 2, angle, PI*2/3 + 0.0001)
      } else {
        arc(0, 0, 2, 2, 0, angle + 0.0001)
        line(target.x, target.y, end.x, end.y)
      }
      
      rotate(PI*2/3)
    }
  }
}