function GameObject(pos, vel) {
  this.pos = pos || createVector();
  this.vel = vel || createVector();
}

GameObject.prototype.update = function() {
  this.pos.add(this.vel);
  
  if (this.pos.x < 0) this.pos.x += width;
  if (this.pos.y < 0) this.pos.y += height;
  if (this.pos.x >= width) this.pos.x -= width;
  if (this.pos.y >= height) this.pos.y -= height;
}
