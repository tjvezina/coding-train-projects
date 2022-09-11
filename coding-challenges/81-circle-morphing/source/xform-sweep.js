class TransformSweep extends Transform {
  get displayName() { return 'Sweep' }
  
  _draw() {
    this.strokeDetail()
    const sweepAngle = (isReverse ? 1-ts : ts) * TWO_PI
    line(0, 0, cos(sweepAngle), sin(sweepAngle))
    
    this.strokeMain()
    for (let i = 0; i < 3; i++) {
      const t1 = max(0, min(1, (isReverse ? 1-ts : ts)*3 - i))
      const angle = t1 * PI*2/3
      const target = angleToVector(angle)
      const end = angleToVector(PI*2/3)
      
      if (!isReverse) {
        line(1, 0, target.x, target.y)
        arc(0, 0, 2, 2, angle, PI*2/3 + 0.0001)
      } else {
        arc(0, 0, 2, 2, 0, angle + 0.0001)
        line(target.x, target.y, end.x, end.y)
      }
      
      rotate(PI*2/3)
    }
  }
}