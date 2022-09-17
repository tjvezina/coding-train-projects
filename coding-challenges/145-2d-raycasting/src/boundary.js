class Boundary {
  constructor(x1, y1, x2, y2) {
    this.a = { x: x1, y: y1 };
    this.b = { x: x2, y: y2 };
  }
  
  draw() {
    const { a, b } = this;
    
    strokeWeight(2);
    stroke(255);
    line(a.x, a.y, b.x, b.y);
  }
}