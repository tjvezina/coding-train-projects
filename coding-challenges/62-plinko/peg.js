const PEG_R = 4;

class Peg {
  constructor(x, y) {
    this.body = Bodies.circle(x, y, PEG_R, {
      isStatic: true,
      friction: 0
    });
    World.add(engine.world, this.body);
  }
  
  draw() {
    fill(255, 127, 0);
    noStroke();
    let pos = this.body.position;
    push();
    translate(pos.x, pos.y);
    ellipse(0, 0, PEG_R * 2);
    pop();
  }
}
