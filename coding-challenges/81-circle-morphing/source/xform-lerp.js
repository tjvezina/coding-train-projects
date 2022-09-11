class TransformLerp extends Transform {
  get displayName() { return 'Lerp' }
  
  _draw() {
    const verts = circleVerts.map((v, i) => p5.Vector.lerp(v, triangleVerts[i], ts))
    
    this.strokeDetail()
    verts.forEach((v, i) => {
      const end = (isReverse ? circleVerts[i] : triangleVerts[i])
      line(end.x, end.y, v.x, v.y)
    })
    
    this.strokeMain()
    beginShape()
    {
      verts.forEach(v => vertex(v.x, v.y))
    }
    endShape(CLOSE)
  }
}