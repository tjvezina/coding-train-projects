const G = 10;

let particles = [];
let attractors = [];

function setup() {
  createCanvas(800, 800);

  createP('Click to create particles');
  createButton('Restart').mousePressed(restart);

  restart();
}

function restart() {
  background(0);

  particles.length = 0;
  attractors.length = 0;

  for (let i = 0; i < 3; ++i) {
    attractors.push(createVector(random(-width/4, width/4), random(-height/4, height/4)));
  }
}

function mouseClicked() {
  if (mouseButton === LEFT && mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) {
    particles.push(new Particle(mouseX - width/2, mouseY - height/2));
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

    this.prevPos = this.pos.copy();
  }
  
  update(attractors) {
    for (let i = 0; i < attractors.length; ++i) {
      this.attract(attractors[i]);
    }

    this.prevPos.set(this.pos);

    this.vel.add(this.acc);
    this.pos.add(this.vel);

    this.acc.mult(0);
  }
  
  draw() {
    stroke(255).strokeWeight(0.5);
    line(this.prevPos.x, this.prevPos.y, this.pos.x, this.pos.y);
  }
  
  attract(target) {
    let dir = p5.Vector.sub(target, this.pos);
    let distSqr = constrain(dir.magSq(), 25, 500);
    this.acc.add(dir.setMag(G / distSqr));
  }
}
