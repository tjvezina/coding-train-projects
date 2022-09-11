const LASER_LIFE = 480; // Distance
const LASER_VEL = 10;

Laser.prototype = Object.create(GameObject.prototype);
Laser.prototype.constructor = Laser;
function Laser(pos, vel) {
  GameObject.prototype.constructor.call(this, pos, vel.setMag(LASER_VEL));
  this.dist = 0;
}

Laser.prototype.isAlive = function() {
  return this.dist < LASER_LIFE;
}

Laser.prototype.update = function() {
  GameObject.prototype.update.call(this);
  this.dist += LASER_VEL;
}

Laser.prototype.draw = function() {
  push();
  translate(this.pos.x, this.pos.y);
  rotate(this.vel.heading());
  circle(0, 0, 2);
  pop();
}
