// Blob

function Blob(x, y, r) {
  this.pos = createVector(x, y);
  this.r = r;
}

Blob.prototype.update = function() {
  print("Blob.update()");
}

Blob.prototype.draw = function() {
  fill(255);
  circle(this.pos.x, this.pos.y, this.r * 2);
}

// Player Blob

function PlayerBlob() {
  Blob.call(this, WORLD_SIZE / 2, WORLD_SIZE / 2, 64);  
}
PlayerBlob.prototype = Object.create(Blob.prototype);
PlayerBlob.prototype.constructor = PlayerBlob;

PlayerBlob.prototype.update = function() {
  print("PlayerBlob.update()");
  let toMouse = createVector(mouseX - width/2, mouseY - height/2)
  toMouse.setMag(min(3, toMouse.mag() / 30));
  this.pos.add(toMouse);
  
  if (this.pos.x < this.r) this.pos.x = this.r;
  if (this.pos.y < this.r) this.pos.y = this.r;
  if (this.pos.x > WORLD_SIZE - this.r) this.pos.x = WORLD_SIZE - this.r;
  if (this.pos.y > WORLD_SIZE - this.r) this.pos.y = WORLD_SIZE - this.r;
}
