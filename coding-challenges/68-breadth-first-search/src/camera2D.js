class Camera2D {
  constructor(position, zoom, minZoom, maxZoom) {
    this.position = position ?? createVector(width/2, height/2);
    this.zoom = zoom ?? 1;
    this.minZoom = minZoom;
    this.maxZoom = maxZoom;
  }
  
  onMouseDragged(event) {
    this.position.sub(createVector(movedX, movedY));
  }
  
  onMouseWheel(event) {
    this.zoom *= 1 + (event.delta * -0.0005);
    if (this.minZoom !== undefined) {
      this.zoom = max(this.zoom, this.minZoom);
    }
    if (this.maxZoom !== undefined) {
      this.zoom = min(this.zoom, this.maxZoom);
    }
  }
  
  apply() {
    translate(-(this.position.x - width/2), -(this.position.y - height/2));
    scale(this.zoom);
  }
}