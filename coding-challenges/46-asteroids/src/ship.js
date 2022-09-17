const SHIP_W = 32;
const SHIP_H = 32;
const SHIP_ROT_SPEED = 0.1;
const SHIP_ACC_SPEED = 0.1;
const SHIP_BRAKE_POW = 0.95;
const SHIP_MAX_VEL = 10;

Ship.prototype = Object.create(GameObject.prototype);
Ship.prototype.constructor = Ship;
function Ship() {
  GameObject.call(this, createVector(width/2, height/2));
  this.angle = -PI / 2;
}

Ship.prototype.draw = function() {
  push();
  translate(this.pos.x, this.pos.y);
  rotate(this.angle);
  beginShape();
  vertex(SHIP_H/2, 0);
  vertex(-SHIP_H/2, SHIP_W/2);
  vertex(-SHIP_H/3, 0);
  vertex(-SHIP_H/2, -SHIP_W/2);
  endShape(CLOSE);
  pop();
}

Ship.prototype.rotate = function(direction) {
  this.angle += SHIP_ROT_SPEED * direction;
}

Ship.prototype.thrust = function() {
  this.vel.add(createVector(1, 0).rotate(this.angle).setMag(SHIP_ACC_SPEED));
  this.vel.setMag(min(this.vel.mag(), SHIP_MAX_VEL));
}

Ship.prototype.brake = function() {
  this.vel.mult(SHIP_BRAKE_POW);
}
