class Segment {
  constructor(a, b) {
    Object.assign(this, { a, b });
  }
  
  draw() {
    const { a, b } = this;
    
    strokeWeight(2);
    stroke(200);
    line(a.x, a.y, b.x, b.y);
  }
  
  divide() {
    const { a, b } = this;
    
    const c = p5.Vector.lerp(a, b, 1/3);
    const d = p5.Vector.lerp(a, b, 2/3);
    
    const e = p5.Vector.lerp(a, b, 1/2).add(
      p5.Vector.sub(b, a).rotate(-PI/2).setMag(a.dist(b)/6 * tan(PI/3))
    );
    
    return [
      new Segment(a, c),
      new Segment(c, e),
      new Segment(e, d),
      new Segment(d, b)
    ]
  }
}