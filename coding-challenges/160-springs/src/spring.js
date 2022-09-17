class Spring {
  constructor(k, restLength, particleA, particleB) {
    Object.assign(this, { k, restLength, particleA, particleB });
  }
  
  update() {
    const { k, restLength, particleA: a, particleB: b } = this;
    
    const force = p5.Vector.sub(b.pos, a.pos);
    const x = force.mag() - restLength;
    force.setMag(k * x);
    a.addForce(force);
    force.mult(-1);
    b.addForce(force);
  }
  
  draw() {
    const { particleA: a, particleB: b } = this;
    
    strokeWeight(4);
    stroke(255);
    line(a.pos.x, a.pos.y, b.pos.x, b.pos.y);
  }
}