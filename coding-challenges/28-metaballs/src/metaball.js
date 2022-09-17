function Metaball() {
  this.radius = 40;
  this.pos = createVector(random(width), random(height));
  this.vel = p5.Vector.random2D();
}

Metaball.prototype.update = function() {
  this.pos.add(this.vel);
  
  if (this.pos.x < 0 || this.pos.x >= width) {
    this.vel.x *= -1;
  }
  if (this.pos.y < 0 || this.pos.y >= height) {
    this.vel.y *= -1;
  }
}