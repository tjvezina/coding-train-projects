const G = 10;

let particles = [];
let attractors = [];

function setup() {
  createCanvas(400, 400);
  background(0);
  
  for (let i = 0; i < 3; ++i) {
    attractors.push(createVector(random(-width/4, width/4), random(-height/4, height/4)));
  }
  
  for (let i = 0; i < 10; ++i) {
    particles.push(new Particle(random(-width/2, width/2), random(-height/2, height/2)));
  }
}

function draw() {
  translate(width/2, height/2);
  
  strokeWeight(4);
  stroke(0, 255, 0);
  attractors.forEach(a => {
    point(a.x, a.y);
  });
  
  particles.forEach(p => {
    p.update(attractors);
    p.draw();
  });
}

// Particle

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(0.1);
    this.acc = createVector();
  }
  
  update(attractors) {
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.acc.mult(0);
    
    for (let i = 0; i < attractors.length; ++i) {
      this.attract(attractors[i]);
    }
  }
  
  draw() {
    strokeWeight(2);
    stroke(255, 16);
    point(this.pos.x, this.pos.y);
  }
  
  attract(target) {
    let dir = p5.Vector.sub(target, this.pos);
    let distSqr = constrain(dir.magSq(), 25, 500);
    this.acc.add(dir.setMag(G / distSqr));
  }
}
