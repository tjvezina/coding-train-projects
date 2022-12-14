const MAX_VEL = 1;

function Particle(posX, posY) {
  this.pos = createVector(posX || random(width), posY || random(height));
  this.vel = createVector(0, 0);
  this.acc = createVector(0, 0);
}

Particle.prototype.update = function() {
  this.vel.add(this.acc);
  this.vel.setMag(min(this.vel.mag(), MAX_VEL));
  this.pos.add(this.vel);
  this.acc.mult(0);
  
  if (this.pos.x < 0) this.pos.x += width;
  if (this.pos.x >= width) this.pos.x -= width;
  if (this.pos.y < 0) this.pos.y += height;
  if (this.pos.y >= height) this.pos.y -= height;
}

Particle.prototype.applyForce = function(force) {
  this.acc.add(force);
}

Particle.prototype.draw = function() {
  let hue = map(this.vel.heading(), -PI, PI, 0, 100);
  let val = map(this.vel.mag(), 0, MAX_VEL, 0, 100);
  strokeWeight(2);
  stroke(hue, 100, val);
  point(this.pos.x, this.pos.y);
}
