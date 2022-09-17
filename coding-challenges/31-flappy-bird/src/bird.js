const GRAVITY = 0.1;//0.15;
const LIFT = 2.4;//3.6;
const BIRD_POS_X = 16;
const BIRD_WIDTH = 17;
const BIRD_HEIGHT = 12;
const GROUND_HEIGHT = HEIGHT - 56;
const FRAME_COUNT = 4;
const FRAME_SPEED = 1/3 / FRAME_COUNT;

function Bird() {
  this.pos = 0;
  this.vel = 0;
  this.frameTimer = 0;
  
  this.sprites = [];
  for (let i = 1; i <= 3; ++i) {
    this.sprites.push(loadImage('./assets/images/bird' + i + '.png'));
  }
  this.sprites.push(this.sprites[1]);
  
  this.reset();
}

Bird.prototype.reset = function() {
  this.pos = GROUND_HEIGHT / 3;
  this.vel = 0;
  this.frameTimer = 0;
}

Bird.prototype.update = function() {
  this.vel += GRAVITY;
  this.pos += this.vel;
  
  this.frameTimer = max(0, this.frameTimer - (1 / (frameRate() || 60)));
  
  if (this.pos < 0 || this.pos >= GROUND_HEIGHT) {
    reset();
  }
}

Bird.prototype.draw = function() {
  push();
    imageMode(CENTER);
    translate(BIRD_POS_X, this.pos);
    rotate(map(this.vel, -10, 10, -PI/3, PI/3));
    image(this.sprites[ceil(this.frameTimer / FRAME_SPEED)], 0, 0);
  pop();
}

Bird.prototype.flap = function() {
  this.vel = -LIFT;
  this.frameTimer = FRAME_SPEED * (FRAME_COUNT - 1);
}