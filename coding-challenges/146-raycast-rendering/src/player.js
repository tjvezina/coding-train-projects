const MOVE_SPEED = 75;
const TURN_SPEED = 3.14159265;

class Player {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.dir = createVector(1, 0);
  }
  
  move(mult) {
    this.pos.add(p5.Vector.mult(this.dir, MOVE_SPEED*(deltaTime/1000) * mult));
    
    if (this.pos.x <= 0) this.pos.x = 1;
    if (this.pos.x >= width-1) this.pos.x = width-2;
    if (this.pos.y <= 0) this.pos.y = 1;
    if (this.pos.y >= height/2-1) this.pos.y = height/2-2;
  }
  
  turn(mult) {
    this.dir.rotate(TURN_SPEED*(deltaTime/1000) * mult);
  }
  
  draw() {
    const { x, y } = this.pos;
    
    strokeWeight(10);
    stroke(255, 200, 0);
    point(x, y);
  }
}