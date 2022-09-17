function Population(size) {
  this.rockets = [];
  this.size = size || 100;
  this.step = 0;
  this.fitnessSum = 0;
  
  for (let i = 0; i < this.size; ++i) {
    this.rockets.push(new Rocket());
  }
}

Population.prototype.update = function() {
  this.rockets.forEach(r => r.update(this.step));
  ++this.step;
  
  if (this.step == LIFESPAN) {
    this.iterate();
  }
}

Population.prototype.draw = function() {
  this.rockets.forEach(r => r.draw());
}

Population.prototype.iterate = function() {
  this.fitnessSum = 0;
  this.rockets.forEach(r => {
    r.calcFitness();
    this.fitnessSum += r.fitness;
  });
  
  let nextRockets = [];
  for (let i = 0; i < this.size; ++i) {
    let parentA = this.selectParent();
    let parentB = this.selectParent();
    nextRockets.push(new Rocket(parentA, parentB));
  }
  this.rockets = nextRockets;
  this.step = 0;
}

Population.prototype.selectParent = function() {
  let sel = random(this.fitnessSum);
  let sub = 0;
  for (let i = 0; i < this.rockets.length; ++i) {
    sub += this.rockets[i].fitness;
    if (sub > sel) {
      return this.rockets[i];
    }
  }
  print("ERROR: Failed to select next parent: " + sel + " / " + this.fitnessSum);
}
