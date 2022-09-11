class TransformPush extends Transform {
  get displayName() { return "Push" }
  
  _draw() {
    if (!isReverse) {
      const scale = 1 + (1 - ts)
      this.strokeDetail()
      for (let i = 0; i < 3; i++) {
        const a = angleToVector(i * PI*2/3).mult(scale)
        const b = angleToVector((i+1) * PI*2/3).mult(scale)
        const c = p5.Vector.lerp(a, b, 0.5)
        line(c.x, c.y, a.x, a.y)
        line(c.x, c.y, b.x, b.y)
      }
        
      this.strokeMain()
      for (let i = 0; i < 3; i++) {
        beginShape()
        {
          for (let p = 0; p <= VERTEX_COUNT/3; p++) {
            const a = map(p, 0, VERTEX_COUNT/3, -PI/3, PI/3) + PI
            const v = createVector(cos(a), sin(a))
            vertex(max(v.x, -scale/2), v.y)
          }
        }
        endShape()
        rotate(PI*2/3)
      }
    } else {
      const minRadius = ((1 - ts) * 0.5 + 0.5)
      
      this.strokeDetail()
      for (let i = 0; i < 3; i++) {
        const a = -PI + i * PI*2/3
        arc(0, 0, minRadius*2, minRadius*2, a, a + PI*2/3)
      }
      
      this.strokeMain()
      beginShape()
      {
        triangleVerts.forEach(v => {
          const scale = max(minRadius, v.mag()) / v.mag()
          vertex(v.x * scale, v.y * scale)
        })
      }
      endShape(CLOSE)
    }
  }
}