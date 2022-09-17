const LENGTH = 12;

function Branch(pos, dir, parent = null) {
  this.pos = pos;
  this.dir = dir;
  this.parent = parent;
  this.growCount = 0;
  this.growDir = createVector(0, 0);
}

Branch.prototype.draw = function(t) {
  strokeWeight(map(t, 0, 1, 5, 1));
  stroke(122, 93, 55);
  if (this.parent) {
    line(this.parent.pos.x, this.parent.pos.y, this.parent.pos.z,
         this.pos.x, this.pos.y, this.pos.z);
  }
}

Branch.prototype.pull = function(leaf) {
  this.growDir.add(p5.Vector.sub(leaf.pos, this.pos).normalize());
  this.growCount++;
}

Branch.prototype.grow = function() {
  let offset = p5.Vector.add(this.dir, this.growDir).div(1 + this.growCount);
  this.growDir = createVector(0, 0, 0);
  this.growCount = 0;
  return new Branch(p5.Vector.add(this.pos, p5.Vector.mult(offset, LENGTH)), offset, this);
}
