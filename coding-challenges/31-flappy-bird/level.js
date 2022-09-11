const PIPE_SPACE = 92;
const SPEED = 53.5; // Pixels/sec

function Level() {
  this.background = loadImage('images/background.png');
  this.ground = loadImage('images/ground.png');
  pipeImage = loadImage('images/pipe.png');
  
  this.dist = 0;
  this.pipes = [];
  for (let i = 0; i < 2; ++i) {
    this.pipes.push(new Pipe(pipeImage));
  }
  
  this.reset();
}

Level.prototype.reset = function() {
  this.pipes[0].reset(WIDTH + PIPE_SPACE, 0.25);
  this.pipes[1].reset(WIDTH + PIPE_SPACE * 2, 0.75);
  
  this.dist = 0;
}

Level.prototype.update = function() {
  if (frameRate()) {
    this.dist += SPEED / frameRate();
  }
  
  this.pipes.forEach(p => p.update());
}

Level.prototype.draw = function() {
  image(this.background, 0, 0);
  
  this.pipes.forEach(p => p.draw());
  
  let offset = this.dist % WIDTH;
  image(this.ground, -offset, HEIGHT - this.ground.height);
  image(this.ground, -offset + this.ground.width, HEIGHT - this.ground.height);
}