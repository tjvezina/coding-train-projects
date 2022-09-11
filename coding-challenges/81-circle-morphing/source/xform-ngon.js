class TransformNgon extends Transform {
  get displayName() { return 'n-gon' }
  
  _draw() {
    rotate(PI)
    
    const n = 3 + (tan(min(1-ts, 0.999) * PI/2) * 10)
    const s = floor((n+1)/2) - 0.5
    
    const p1 = angleToVector(s/n * TWO_PI)
    const p2 = angleToVector((s+1)/n * TWO_PI)
    const t = -p1.y / (p2.y - p1.y)
    const mid = p5.Vector.lerp(p1, p2, t)
    mid.x = min(mid.x, p1.x)
    
    this.strokeDetail()
    line(0, 0, cos(-0.5/n * TWO_PI), sin(-0.5/n * TWO_PI))
    line(0, 0, cos( 0.5/n * TWO_PI), sin( 0.5/n * TWO_PI))
    arc(0, 0, 1/3, 1/3, -PI/n, PI/n)
    
    this.strokeMain()
    beginShape()
    {
      vertex(mid.x, mid.y)
      for (let x = -s; x <= s; x++) {
        const a = x/n * TWO_PI
        vertex(cos(a), sin(a))
      }
    }
    endShape(CLOSE)
  }
}