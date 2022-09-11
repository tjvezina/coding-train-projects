const BALL_R = 16;

class Ball {
  constructor(x, y) {
    this.body = Bodies.circle(x, y, BALL_R, {
      restitution: 0.75,
      friction: 0.25
    });
    World.add(engine.world, this.body);
  }
  
  destroy() {
    World.remove(engine.world, this.body);
  }
  
  draw() {
    fill(30, 160, 180);
    noStroke();
    let pos = this.body.position;
    push();
    translate(pos.x, pos.y);
    ellipse(0, 0, BALL_R * 2);
    pop();
  }
}
