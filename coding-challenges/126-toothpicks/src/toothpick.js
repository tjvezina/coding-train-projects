class Direction {
  static get Horizontal() { return 0; }
  static get Vertical() { return 1; }
}

class Toothpick {
  constructor(pos, dir) {
    Object.assign(this, { pos, dir, isNew: true });
  }
  
  getChildren() {
    if (this.dir === Direction.Horizontal) {
      return [
        new Toothpick(createVector(this.pos.x-1, this.pos.y), Direction.Vertical),
        new Toothpick(createVector(this.pos.x+1, this.pos.y), Direction.Vertical)
      ];
    } else {
      return [
        new Toothpick(createVector(this.pos.x, this.pos.y-1), Direction.Horizontal),
        new Toothpick(createVector(this.pos.x, this.pos.y+1), Direction.Horizontal)
      ];
    }
  }
  
  draw() {
    strokeWeight(0.2);
    stroke(this.isNew ? '#5879a7 ' : '#A78458');
    
    push();
    {
      translate(this.pos.x, this.pos.y);
      
      if (this.dir === Direction.Vertical) {
        rotate(PI/2);
      }
      
      line(-0.9, 0, 0.9, 0);
    }
    pop();
  }
}