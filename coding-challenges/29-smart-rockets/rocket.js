const LEN = 3;
const WID = 4;

function Rocket(parentA, parentB) {
  this.pos = createVector(width / 2, height - 1);
  this.vel = createVector();
  this.acc = createVector();
  this.dna = new DNA(parentA ? parentA.dna : undefined,
                     parentB ? parentB.dna : undefined);
  this.targetDist = 0;
  this.fitness = 0;
  this.targetStep = 0;
}

Rocket.prototype.applyForce = function(force) {
  this.acc.add(force);
}

Rocket.prototype.update = function(step) {
  if (this.targetStep > 0) {
    return;
  }
  
  let force = this.dna.genes[step];
  this.applyForce(createVector(force.x, force.y).setMag(0.1));
  
  this.vel.add(this.acc);
  this.pos.add(this.vel);
  this.acc.mult(0);
  
  if (this.pos.x < 0) { this.pos.x = 0; this.vel.x *= -1; }
  if (this.pos.x >= width) { this.pos.x = width - 1; this.vel.x *= -1; }
  if (this.pos.y < 0) { this.pos.y = 0; this.vel.y *= -1; }
  if (this.pos.y >= height) { this.pos.y = height - 1; this.vel.y *= -1; }
  
  this.targetDist = dist(this.pos.x, this.pos.y, target.x, target.y);
  
  if (this.targetDist < 10) {
    this.targetStep = step;
  }
}

Rocket.prototype.draw = function() {
  push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    strokeWeight(0);
    fill(this.targetStep ? color(0, 255, 0) : map(this.targetDist, 0, width, 255, 0));
    beginShape();
      vertex(0, 0);
      vertex(-LEN, WID);
      vertex(LEN * 2, 0);
      vertex(-LEN, -WID);
    endShape(CLOSE);
  pop();
}

Rocket.prototype.calcFitness = function() {
  this.fitness = pow(1.02, -this.targetDist);
  if (this.targetStep) {
    this.fitness *= 2;
  }
}
