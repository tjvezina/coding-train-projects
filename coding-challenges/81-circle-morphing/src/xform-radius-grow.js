class TransformRadiusGrow extends Transform {
  get displayName() { return 'Radius Grow' }
  
  _draw() {
    const offset = tan(min(ts, 0.999) * PI/2)
    const w = sin(PI/3)
    const theta = atan(w / (offset + 1/2))
    const diam = 2 * w / sin(theta)
    
    rotate(PI)
    for (let i = 0; i < 3; i++) {
      this.strokeDetail()
      line(1/2, -w, -offset, 0)
      line(1/2,  w, -offset, 0)
      arc(-offset, 0, 1/3, 1/3, -theta, theta)
      
      this.strokeMain()
      arc(-offset, 0, diam, diam, -theta, theta)
      rotate(PI*2/3)
    }
  }
}