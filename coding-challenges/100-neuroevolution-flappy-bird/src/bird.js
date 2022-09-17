const GRAVITY = 360;
const LIFT = 144;
const BIRD_POS_X = 16;
const BIRD_WIDTH = 17;
const BIRD_HEIGHT = 12;
const GROUND_HEIGHT = HEIGHT - 56;
const FRAME_COUNT = 4;
const FRAME_SPEED = 1/3 / FRAME_COUNT;

class Bird {
  constructor() {
    this.posY = 0;
    this.velY = 0;
    this.frameTimer = 0;
    this.isDead = false;

    this.sprites = birdSprites;
    
    this.reset();
  }

  reset() {
    this.posY = GROUND_HEIGHT / 3;
    this.velY = 0;
    this.frameTimer = 0;
    this.isDead = false;
    this.finalScore = 0;
  }

  update() {
    this.velY += GRAVITY / (SIM_FPS*SIM_FPS);
    this.posY += this.velY;

    this.frameTimer = max(0, this.frameTimer - (1/SIM_FPS));

    if (this.posY < BIRD_HEIGHT/2 || this.posY >= GROUND_HEIGHT - BIRD_HEIGHT/2) {
      this.kill();
    }
  }

  draw() {
    push();
      imageMode(CENTER);
      translate(BIRD_POS_X, this.posY);
      rotate(map(this.velY, -10, 10, -PI/3, PI/3));
      image(this.sprites[ceil(this.frameTimer / FRAME_SPEED)], 0, 0);
    pop();
  }

  flap() {
    this.velY = -LIFT / SIM_FPS;
    this.frameTimer = FRAME_SPEED * (FRAME_COUNT - 1);
  }
  
  kill() {
    this.finalScore = max(0, (level.dist - WIDTH - PIPE_WIDTH + BIRD_POS_X - BIRD_WIDTH/2)/PIPE_SPACE);
    this.isDead = true;
  }
}