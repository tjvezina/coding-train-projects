const PIPE_GAP = 60;
const PIPE_PAD = 40;
const PIPE_MIN = PIPE_PAD + PIPE_GAP/2;
const PIPE_MAX = GROUND_HEIGHT - PIPE_PAD - PIPE_GAP/2;
const PIPE_WIDTH = 26;

class Pipe {
  constructor(image, startPosX) {
    this.pipe = image;
    this.posX = startPosX;
  }
  
  get localPosX() { return this.posX - level.dist; }

  reset(posX, posYRatio) {
    this.posX = posX;
    this.posY = lerp(PIPE_MIN, PIPE_MAX, posYRatio);
  }

  update() {
    const { localPosX } = this;

    if (localPosX < BIRD_POS_X + BIRD_WIDTH/2 && localPosX > BIRD_POS_X - BIRD_WIDTH/2 - PIPE_WIDTH) {
      for (let bird of birds.filter(bird => !bird.isDead)) {
        if (bird.posY - BIRD_HEIGHT/2 < this.posY - PIPE_GAP/2 ||
            bird.posY + BIRD_HEIGHT/2 > this.posY + PIPE_GAP/2) {
          bird.kill();
        } 
      }
    }

    if (localPosX < -PIPE_WIDTH) {
      this.reset(this.posX + PIPE_SPACE * 2, random());
    }
  }

  draw() {
    push();
      translate(this.posX - level.dist, this.posY);
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
}