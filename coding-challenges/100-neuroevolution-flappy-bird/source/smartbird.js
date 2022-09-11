class SmartBird extends Bird {
  constructor(brain = undefined) {
    super();
    
    if (brain === undefined) {
      this.brain = new NeuralNetwork(4, 4, 1);
    } else {
      this.brain = brain;
    }
    this.inputs = [];
  }
  
  mutate() {
    this.brain.mutate(0.1, 0.05);
  }
  
  think(nextPipePos) {
    const inputs = [
      this.posY / GROUND_HEIGHT,
      Math.tanh(2*this.velY/LIFT) * 0.5 + 0.5,
      min(1, map(nextPipePos.x, BIRD_POS_X - BIRD_WIDTH/2 - PIPE_WIDTH, WIDTH, 0, 1)),
      map(nextPipePos.y, PIPE_MIN, PIPE_MAX, 0, 1),
    ];
    
    if (this.brain.predict(inputs)[0] > 0.5) {
      this.flap();
    }
  }
}