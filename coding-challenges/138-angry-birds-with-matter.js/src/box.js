class Box {
  constructor(x, y, w, h, options) {
    Object.assign(this, { w, h });
    
    this.body = Matter.Bodies.rectangle(x, y, w, h);
    World.add(world, this.body);
    
    if (options && options.isStatic) {
      this.body.isStatic = true;
    }
  }
  
  draw() {
    const { w, h } = this;
    const { x, y } = this.body.position;
    const angle = this.body.angle;
    
    push();
    {
      translate(x, y);
      rotate(angle);
      
      noStroke();
      fill(255);
      rect(0, 0, w, h);
    }
    pop();
  }
}