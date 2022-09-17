const PIPE_GAP = 60;
const PIPE_PAD = 40;
const PIPE_MIN = PIPE_PAD + PIPE_GAP/2;
const PIPE_MAX = GROUND_HEIGHT - PIPE_PAD - PIPE_GAP/2;
const PIPE_WIDTH = 26;

function Pipe(image, startPos) {
  this.pipe = image;
  this.pos = startPos;
}

Pipe.prototype.reset = function(pos, offsetRatio) {
  this.pos = pos;
  this.offset = lerp(PIPE_MIN, PIPE_MAX, offsetRatio);
}

Pipe.prototype.update = function() {
  let posX = this.pos - level.dist;
  if (posX < BIRD_POS_X + BIRD_WIDTH/2 && posX > BIRD_POS_X - BIRD_WIDTH/2 - PIPE_WIDTH) {
    if (bird.pos - BIRD_HEIGHT/2 < this.offset - PIPE_GAP/2 ||
        bird.pos + BIRD_HEIGHT/2 > this.offset + PIPE_GAP/2) {
      reset();
    }
  }
  
  if (posX < -PIPE_WIDTH) {
    this.reset(this.pos + PIPE_SPACE * 2, random());
    ++score;
  }
}

Pipe.prototype.draw = function() {
  push();
    translate(this.pos - level.dist, this.offset);
    push();
      translate(0, -PIPE_GAP/2);
      scale(1, -1);
      image(this.pipe, 0, 0);
    pop();
    push();
      translate(0, PIPE_GAP/2);
      image(this.pipe, 0, 0);
    pop();
  pop();
}
