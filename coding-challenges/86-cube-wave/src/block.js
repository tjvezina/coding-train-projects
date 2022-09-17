const SPEED = 0.75;
const FREQ = 0.66;
const AMP_MAX = 12;
const AMP_MIN = 4;

class Block {
  constructor(x, z) {
    this.pos = createVector(x, 0, z);
    this.size = createVector(1, 1, 1);
  }
  
  draw() {
    const { pos, size } = this;
    
    const offset = -pos.mag() * FREQ
    size.y = map(sin(millis()/1000 * PI * SPEED + offset), -1, 1, AMP_MIN, AMP_MAX);
    
    push();
    {
      noStroke();
      
      translate(pos.x, pos.y, pos.z);
      box(this.size.x, this.size.y, this.size.z);
    }
    pop();
  }
}