class Wall {
  constructor(x, y, w, h) {
    this.size = { w, h }
    this.body = Bodies.rectangle(x + w/2, y + h/2, w, h, {
      isStatic: true
    });
    World.add(engine.world, this.body);
  }
  
  draw() {
    fill(160, 170, 180);
    noStroke();
    let pos = this.body.position;
    push();
    translate(pos.x, pos.y);
    rectMode(CENTER);
    rect(0, 0, this.size.w, this.size.h);
    pop();
  }
}
