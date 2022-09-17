class PenState {
  static get Down() { return 'down'; }
  static get Up() { return  'up'; }
  static get End() { return 'end'; }
}

class Pen {
  constructor() {
    this.reset();
  }
  
  reset() {
    this.pos = createVector(0, 0);
    this.state = PenState.Down;
  }
  
  move(path) {
    const nextPos = p5.Vector.add(this.pos, createVector(path.dx, path.dy));
    
    if (this.state === PenState.Down) {
      strokeWeight(4);
      stroke(200);
      line(this.pos.x, this.pos.y, nextPos.x, nextPos.y);
    }
    
    this.pos = nextPos;
    this.state = path.pen;
  }
}