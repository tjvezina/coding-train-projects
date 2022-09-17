class Transform {
  static get displayRadius() { return width/3 }
  
  draw() {
    push()
    {
      strokeJoin(ROUND)
      
      // Transform for displaying a unit circle with 0˚ up
      translate(width/2, height/2)
      rotate(-PI/2)
      scale(Transform.displayRadius)
      this._draw()
    }
    pop()
  }
  
  strokeMain() {
    noFill()
    strokeWeight(4 / Transform.displayRadius)
    stroke(PENCIL_COLOR)
    drawingContext.setLineDash([])
  }
  
  strokeDetail() {
    const radius = Transform.displayRadius
    
    noFill()    
    strokeWeight(1.5 / radius)
    stroke(PENCIL_COLOR, 128 * tf)
    drawingContext.setLineDash([6 / radius, 9 / radius])
    drawingContext.lineDashOffset = 3 / radius
  }
}