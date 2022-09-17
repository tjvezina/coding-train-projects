const GRAVITY = -2500;
const JUMP_FORCE = 600;

class Player {
  constructor() {
    this.x = 50;
    this.y = 0;
    this.r = 10;
    
    this.yVel = 0;
    this.isJumping = false;
    this.hasPendingJump = false;
    this.deathDistance = null;
  }
  
  get isDead() {
    return this.deathDistance !== null;
  }
  
  kill() {
    this.deathDistance = distance;
  }
  
  jump() {
    if (this.y === 0) {
      this.isJumping = true;
      this.yVel = JUMP_FORCE;
    } else {
      this.hasPendingJump = true;
    }
  }
  
  update() {
    if (this.isDead) {
      return;
    }
    
    if (this.isJumping) {
      this.yVel += GRAVITY * 1/FPS;
      this.y += this.yVel * 1/FPS;
      
      if (this.y <= 0) {
        this.y = 0;
        this.yVel = 0;
        this.isJumping = false;
        
        if (this.hasPendingJump) {
          this.hasPendingJump = false;
          this.jump();
        }
      }
    }
  }
  
  draw() {
    const { x, y, r, isDead } = this;
    
    const deathOffset = (this.deathDistance === null ? 0 : distance - this.deathDistance);
    
    push();
    {
      translate(x - deathOffset, y+r);
      
      noStroke();
      fill(isDead ? color(180, 0, 0) : 180);
      circle(0, 0, r);
      fill(isDead ? color(200, 0, 0) : 200);
      circle(0, r*0.1, r*0.9);
      
      rotate(-(distance - deathOffset) / r);
      
      fill(0, 127, 255);
      circle(0, r*0.3, r*0.4);
      fill(30);
      circle(0, r*0.3, r*0.15);
    }
    pop();
  }
}