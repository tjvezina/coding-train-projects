class Camera2D {
  constructor(position, zoom) {
    this.position = position || createVector(width/2, height/2)
    this.zoom = zoom || 1
  }
  
  onMouseDragged(event) {
    this.position.sub(createVector(movedX, movedY))
  }
  
  onMouseWheel(event) {
    this.zoom *= 1 + (event.delta * -0.0005)
  }
  
  draw() {
    translate(-(this.position.x - width/2), -(this.position.y - height/2))
    scale(this.zoom)
  }
}