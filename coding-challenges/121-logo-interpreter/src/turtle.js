class Turtle {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.dir = -90;
    this.isDrawing = true;
    
    this.graphics = createGraphics(width, height);
    this.graphics.translate(this.graphics.width/2, this.graphics.height/2);
    this.graphics.background(42);
    this.graphics.stroke(255);
    this.graphics.strokeWeight(2);
  }
  
  move(distance) {
    const newX = this.x + cos(this.dir)*distance;
    const newY = this.y + sin(this.dir)*distance;
    
    if (this.isDrawing) {
      this.graphics.line(this.x, this.y, newX, newY);
    }
    
    this.x = newX;
    this.y = newY;
  }
  
  turn(degrees) {
    this.dir += degrees;
  }
}