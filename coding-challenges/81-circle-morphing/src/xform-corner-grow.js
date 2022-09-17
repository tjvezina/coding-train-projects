class TransformCornerGrow extends Transform {
  get displayName() { return 'Corner Grow' }
  
  _draw() {
    const radius = 1 - ts
    const end = createVector(1 - radius/2, radius * sin(PI/3))
    const end2 = createVector(end.x, -end.y).rotate(PI*2/3)
    
    for (let i = 0; i < 3; i++) {
      const arcDiam = radius/3
      
      this.strokeDetail()
      line(ts, 0, end.x, -end.y)
      line(ts, 0, end.x,  end.y)
      arc(ts, 0, arcDiam, arcDiam, -PI/3, PI/3)

      this.strokeMain()
      arc(ts, 0, 2*radius, 2*radius, -PI/3, PI/3)
      line(end.x, end.y, end2.x, end2.y)
      
      rotate(PI*2/3)
    }
  }
}