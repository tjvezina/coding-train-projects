function Leaf() {
  let mag = pow(random(), 0.25) * (width/3);
  this.pos = p5.Vector.random3D().setMag(mag).add(createVector(0, -height/8, 0));
  this.isReached = false;
}

Leaf.prototype.draw = function() {
  strokeWeight(4);
  stroke(this.isReached ? color(10, 180, 30) : color(127));
  point(this.pos.x, this.pos.y, this.pos.z);
}
