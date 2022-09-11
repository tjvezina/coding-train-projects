const TILE_MOVE_SPEED = 0.075; // Seconds per cell

class Tile {
  constructor(pos) {
    this.pos = pos.copy();
    this.baseValue = 1;
    
    this.mergeTile = null;
    this.startPos = null;
    this.targetPos = null;
    this.totalMoveTime = 0;
    this.moveTimer = 0;
    
    this.isNew = true;
  }
  
  move(targetPos, mergeTile = null) {
    if (targetPos.x === this.pos.x && targetPos.y === this.pos.y) {
      return;
    }
    
    this.mergeTile = mergeTile;
    
    this.startPos = this.pos.copy();
    this.targetPos = targetPos;
    this.totalMoveTime = p5.Vector.dist(this.startPos, this.targetPos) * TILE_MOVE_SPEED;
    this.moveTimer = 0;
  }
  
  get isMoving() {
    return this.targetPos != null;
  }
  
  update() {
    if (this.isMoving) {
      this.moveTimer += deltaTime/1000;      
      const t = this.moveTimer / this.totalMoveTime;
      
      if (t < 1) {
        p5.Vector.lerp(this.startPos, this.targetPos, t, this.pos);
      } else {
        this.pos.set(this.targetPos);
        this.startPos = null;
        this.targetPos = null;
        this.totalMoveTime = 0;
        this.moveTimer = 0;
        
        if (this.mergeTile !== null) {
          this.baseValue++;
          onTileMerged(this.mergeTile);
          this.mergeTile = null;
          return;
        }
      }
    }
  }
  
  draw() {
    push();
    {
      translate((this.pos.x + 0.5) * width/4, (this.pos.y + 0.5) * width/4);
      
      colorMode(HSB);
      stroke(0, 0, 100);
      strokeWeight(this.isNew ? 4 : 0);
      fill((this.baseValue - 1) / 10 * 300, 40, 90);
      rectMode(CENTER);
      rect(0, 0, width*0.225, height*0.225, width*0.02);
      
      noStroke();
      fill(0);
      textSize(width*0.08)
      textAlign(CENTER, CENTER);
      textStyle(BOLD);
      text(pow(2, this.baseValue), 0, 0);
    }
    pop();
  }
}