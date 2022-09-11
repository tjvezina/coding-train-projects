const LIFESPAN = 5 * 60;

function DNA(parentA, parentB) {
  this.genes = [];
  
  if (parentA === undefined || parentB === undefined) {
    this.generate();
  } else {
    this.evolve(parentA, parentB);
  }
}

DNA.prototype.generate = function() {
  for (let i = 0; i < LIFESPAN; ++i) {
    this.genes.push(p5.Vector.random2D());
  }
}

DNA.prototype.evolve = function(parentA, parentB) {
  for (let i = 0; i < LIFESPAN; ++i) {
    this.genes.push(random() < 0.5 ? parentA.genes[i] : parentB.genes[i]);
  }
  this.mutate();
}

DNA.prototype.mutate = function() {
  let mutation = floor(random(LIFESPAN));
  this.genes[mutation].rotate(random(-PI / 4, PI / 4));
}
