let fireworks = [];
let gravity;

function setup() {
  createCanvas(600, 400);
  colorMode(HSB, 100);
  
  stroke(255);
  strokeWeight(3);
  
  gravity = createVector(0, 0.2);
  
}

function draw() {
  background(0, 0, 0, 25);
  
  if (random(1) < 0.05) {
    fireworks.push(new Firework());
  }
  
  for (var i = 0; i < fireworks.length; ++i) {
    if (!fireworks[i].update()) {
      fireworks.splice(i--, 1);
      continue;
    }
    fireworks[i].draw();
  }
}