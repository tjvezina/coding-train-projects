class TransformSubdivide extends Transform {
  get displayName() { return 'Subdivide' }
  
  _draw() {
    const e = (1-cos((1-t)*PI/2)) * 6
    const n = pow(2, e)
    const segments = pow(2, floor(e))
    const segmentAngle = PI*2/3 / segments
        
    for (let i = 0; i < 3; i++) {
      this.strokeDetail()
      for (let i = 0; i < e; i++) {
        const n2 = pow(2, i)
        for (let j = 0; j < n2; j++) {
          const a = angleToVector(j/n2 * PI*2/3)
          const b = angleToVector((j+1)/n2 * PI*2/3)
          line(a.x, a.y, b.x, b.y)
        }
      }

      for (let s = 0; s < segments; s++) {
        const aStart = segmentAngle * s
        const aMid = segmentAngle * (s+0.5)
        const aEnd = segmentAngle * (s+1)
        
        const start = createVector(cos(aStart), sin(aStart))
        const midEnd = createVector(cos(aMid), sin(aMid))
        const end = createVector(cos(aEnd), sin(aEnd))
        const midStart = p5.Vector.lerp(start, end, 0.5)
        const mid = p5.Vector.lerp(midStart, midEnd, fract(e))
        
        this.strokeMain()
        line(start.x, start.y, mid.x, mid.y)
        line(mid.x, mid.y, end.x, end.y)
      }
      
      rotate(PI*2/3)
    }
  }
}