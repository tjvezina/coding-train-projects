const PIPE_SPACE = 92;
const SPEED = 53.5; // Pixels/sec

class Level {
  constructor() {
    this.background = loadImage('./assets/images/background.png');
    this.ground = loadImage('./assets/images/ground.png');
    const pipeImage = loadImage('./assets/images/pipe.png');

    this.dist = 0;
    this.pipes = [];
    for (let i = 0; i < 2; ++i) {
      this.pipes.push(new Pipe(pipeImage));
    }

    this.reset();
  }
  
  get nextPipePos() {
    const nextPipe = this.pipes
      .filter(pipe => pipe.localPosX > BIRD_POS_X - BIRD_WIDTH/2 - PIPE_WIDTH)
      .sort((a, b) => a.posX - b.posX)[0];
    return { x: nextPipe.localPosX, y: nextPipe.posY };
  }

  reset() {
    this.pipes[0].reset(WIDTH + PIPE_SPACE, random());
    this.pipes[1].reset(WIDTH + PIPE_SPACE * 2, random());

    this.dist = 0;
  }

  update() {
    this.dist += SPEED / SIM_FPS;

    this.pipes.forEach(p => p.update());
  }

  draw() {
    image(this.background, 0, 0);

    this.pipes.forEach(p => p.draw());

    let offset = this.dist % WIDTH;
    image(this.ground, -offset, HEIGHT - this.ground.height);
    image(this.ground, -offset + this.ground.width, HEIGHT - this.ground.height);
  }
}