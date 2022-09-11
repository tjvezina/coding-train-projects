const AST_VEL = 1;

Asteroid.prototype = Object.create(GameObject.prototype);
Asteroid.prototype.constructor = Asteroid;
function Asteroid() {
  GameObject.call(this, createVector(random(width), random(height)), p5.Vector.random2D().setMag(AST_VEL));
  print(this.vel);
  this.r = random(15, 50);
  this.segments = max(3, ceil((this.r*this.r) / 50)); 
  this.segmentScales = [];
  for (let i = 0; i < this.segments; ++i) {
    this.segmentScales[i] = random(0.85, 1.1);
  }
}

Asteroid.prototype.draw = function() {
  push();
  translate(this.pos.x, this.pos.y);
  beginShape();
  for (let i = 0; i < this.segments; ++i) {
    let r = this.r * this.segmentScales[i];
    let a = (i / this.segments) * TWO_PI;
    vertex(r * cos(a), r * sin(a));
  }
  endShape(CLOSE);
  pop();
}
