class Drill {
  static get turnSpeed() { return PI/5; }
  
  constructor() {
    this.pos = createVector((VIEW_WIDTH - RIVER_WIDTH) / 6, GROUND_Y);
    this.dir = p5.Vector.fromAngle(PI/12);
    
    this.bias = 1;
    
    this.path = [{ x: this.pos.x, y: this.pos.y }];
  }
  
  update() {
    this.pos.add(this.dir);
    this.dir.rotate(Drill.turnSpeed * this.bias * (deltaTime/1000));
    this.path.push({ x: this.pos.x, y: this.pos.y });
  }
  
  flip() {
    this.bias *= -1;
  }
  
  draw() {
    noFill();
    stroke(0);
    strokeWeight(2);
    beginShape();
    {
      this.path.forEach(p => vertex(p.x, p.y));
    }
    endShape();
    
    const tip = p5.Vector.rotate(this.dir, PI/8 * this.bias);
    tip.setMag(16);
    line(this.pos.x, this.pos.y, this.pos.x + tip.x, this.pos.y + tip.y);
  }
}