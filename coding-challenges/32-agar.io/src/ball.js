// Ball

function Ball(x, y, r) {
  this.pos = createVector(x, y);
  this.r = r;
}

Ball.prototype.update = function() {
  print("Blob.update()");
}

Ball.prototype.draw = function() {
  fill(255);
  circle(this.pos.x, this.pos.y, this.r * 2);
}

// Player Ball

function PlayerBall() {
  Ball.call(this, WORLD_SIZE / 2, WORLD_SIZE / 2, 64);  
}
PlayerBall.prototype = Object.create(Ball.prototype);
PlayerBall.prototype.constructor = PlayerBall;

PlayerBall.prototype.update = function() {
  print("PlayerBlob.update()");
  let toMouse = createVector(mouseX - width/2, mouseY - height/2)
  toMouse.setMag(min(3, toMouse.mag() / 30));
  this.pos.add(toMouse);
  
  if (this.pos.x < this.r) this.pos.x = this.r;
  if (this.pos.y < this.r) this.pos.y = this.r;
  if (this.pos.x > WORLD_SIZE - this.r) this.pos.x = WORLD_SIZE - this.r;
  if (this.pos.y > WORLD_SIZE - this.r) this.pos.y = WORLD_SIZE - this.r;
}
