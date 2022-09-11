const treeParticles = [];

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
}

function draw() {
  background('#2D383B');
  
  step();
  
  translate(width/2, height/2);
  rotate(-PI/2);
  
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 6; j++) {
      treeParticles.forEach(x => x.draw());
      rotate(PI/3);
    }
    scale(1, -1);
  }
}

function mouseClicked() {
  treeParticles.length = 0;
}

function step() {
  const particle = new Particle();
  
  while (particle.pos.x > 0 && treeParticles.every(p => p.pos.dist(particle.pos) > Particle.diam)) {
    particle.update();
    
    const limit = particle.pos.x * tan(PI/6);
    particle.pos.y = constrain(particle.pos.y, -limit, limit);
  }
  
  treeParticles.push(particle);
}