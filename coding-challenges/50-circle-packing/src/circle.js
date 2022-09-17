class Circle {
  constructor(pos) {
    this.pos = pos;
    this.r = 4;
    this.growing = true;
  }
  
  draw() {
    push();
    {
      translate(this.pos.x, this.pos.y);
      noFill();
      strokeWeight(2);
      stroke((100 - (this.r * 2) + 50) % 100, 100, 100);
      circle(0, 0, this.r * 2 - 3); // Buffer to prevent visual overlap with stroke
    }
    pop();
  }
  
  update() {
    if (!this.growing) {
      return;
    }
    
    ++this.r;
    
    this.growing = !this.hasTouchedEdge() && !isIntersectingCircle(this);
  }
  
  hasTouchedEdge() {
    let x = this.pos.x, y = this.pos.y, r = this.r;
    return (x - r <= 0 || x + r >= width - 1 || y - r <= 0 || y + r >= height - 1);
  }
}