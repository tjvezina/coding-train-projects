class Bird {
  constructor(x, y, r) {
    this.r = r;
    this.body = Matter.Bodies.circle(x, y, r);
    World.add(world, this.body);
  }
  
  draw() {
    const { r } = this;
    const { x, y } = this.body.position;
    const angle = this.body.angle;
    
    push();
    {
      translate(x, y);
      rotate(angle);
      
      noStroke();
      fill(255);
      circle(0, 0, r*2);
      stroke(127);
      line(0, 0, r, 0);
    }
    pop();
  }
}