/*
  I was too tired to set up sliders - play with these values to see different patterns!
  Examples: 3/0.5, 4/0.55, 5/0.65, 6/0.5, 12/0.79, 60/0.875, 80/0.95
*/
const SEED_COUNT = 3;
const STEP_LERP = 0.5;
const STEPS_PER_FRAME = 1000;

const seedPoints = [];
let p;

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  generateSeedPoints();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  translate(width*0.5, (SEED_COUNT === 3 ? height*0.6 : height*0.5));
  generateSeedPoints();
}

function draw() {
  translate(width*0.5, height*(SEED_COUNT === 3 ? 0.6 : 0.5));
  for (let i = 0; i < STEPS_PER_FRAME; i++) {
    step();
  }
}

function generateSeedPoints() {
  seedPoints.length = 0;
  const size = min(width, height)/2;
  for (let i = 0; i < SEED_COUNT; i++) {
    seedPoints.push(createVector(sin(TWO_PI/SEED_COUNT*i)*size, -cos(TWO_PI/SEED_COUNT*i)*size));
  }
  
  clear();
  
  strokeWeight(5);
  stroke(255);
  seedPoints.forEach(p => {
    point(p.x, p.y);
  });
  
  strokeWeight(1);
  p = seedPoints[0].copy();
  point(p.x, p.y);
}

function step() {
  const i = floor(random(seedPoints.length));
  
  colorMode(HSB);
  stroke(i/seedPoints.length*360, 90, 100);
  p.lerp(seedPoints[i], STEP_LERP);
  point(p.x, p.y);
}