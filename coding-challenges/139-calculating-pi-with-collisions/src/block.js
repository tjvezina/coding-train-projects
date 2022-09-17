class Block {
  constructor({ x, w, m, vel, col }) {
    Object.assign(this, { x, w, m, vel, col });
    this.y = height - w;
  }
  
  checkCollision(block) {
    const { x: x1, w: w1 } = this;
    const { x: x2, w: w2 } = block;
    
    return (x1 > x2-w1 && x1 < x2+w2);
  }
  
  update() {
    this.x += this.vel;
    
    if (this.x < 0) {
      this.vel *= -1;
      this.x *= -1;
      
      onCollision();
    }
  }
  
  draw() {
    const { x, y, w, col } = this;
    
    strokeWeight(3);
    stroke(col);
    fill(lerpColor(col, color(0), 0.25));
    rect(x, y, w, w);
  }
}