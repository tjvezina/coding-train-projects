function Firework() {
  this.exploded = false;
  this.explodeTime = 0;
  this.hue = random(100);
  
  this.firework = new Particle(random(width), height);
  this.firework.vel = createVector(random(-0.5, 0.5), random(-12, -10));
  
  this.particles = [];
}

Firework.prototype.update = function() {
  if (!this.exploded) {
    this.firework.applyForce(gravity);
    this.firework.update();

    if (this.firework.vel.y >= 0) {
      this.explode();
    }
  } else {
    ++this.explodeTime;
    this.particles.forEach((p) => {
      p.applyForce(gravity);
      p.vel.mult(0.95);
      p.update();
    });
  }
  return this.explodeTime < 100;
}

Firework.prototype.draw = function() {
  if (!this.exploded) {
    stroke(0, 0, 50);
    this.firework.draw();
  } else {
    this.particles.forEach((p) => {
      stroke(this.hue, 100, random(100 - this.explodeTime));
      p.draw();
    });
  }
}

Firework.prototype.explode = function() {
  this.exploded = true;
  
  for (var i = 0; i < 100; ++i) {
    let p = new Particle(this.firework.pos.x, this.firework.pos.y);
    p.vel = p5.Vector.random2D();
    p.vel.mult(random(0, 6));
    this.particles.push(p);
  }
}