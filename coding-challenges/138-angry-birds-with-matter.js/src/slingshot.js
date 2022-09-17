class Slingshot {
  constructor(targetBody) {
    const { x, y } = targetBody.position;
    this.constraint = Constraint.create({
      pointA: { x, y },
      bodyB: targetBody,
      stiffness: 0.02,
      length: 40,
    });
    World.add(world, this.constraint);
  }
  
  break() {
    this.constraint.bodyB = null;
  }
  
  attach(targetBody) {
    this.constraint.bodyB = targetBody;
  }
  
  draw() {
    if (this.constraint.bodyB === null) {
      return;
    }
    
    const { x: x1, y: y1 } = this.constraint.pointA;
    const { x: x2, y: y2 } = this.constraint.bodyB.position;
    
    stroke(255);
    line(x1, y1, x2, y2);
  }
}