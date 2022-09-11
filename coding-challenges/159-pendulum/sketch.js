const GRAVITY = 1;
let angle; // Relative to Y-axis
let angleVel = 0;
let arm;
let bob;

let lengthSlider;

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  
  canvas.style('position', 'relative');
  lengthSlider = createSlider(0.05, 0.9, 0.4, 0.01)
    .style('position: absolute; left: 40%; right: 40%; bottom: 2rem;');
  
  angle = PI/4;
  bob = createVector();
}

function draw() {
  background(42);
  
  arm = lengthSlider.value() * height;
  
  const force = -GRAVITY * sin(angle) / arm;
  angleVel += force;
  angle += angleVel;
  
  bob.x = arm * sin(angle);
  bob.y = arm * cos(angle);
  
  translate(width/2, 0);
  
  noStroke();
  fill(100);
  circle(bob.x, bob.y, 80);
  
  strokeWeight(10);
  stroke(200);
  line(0, 0, bob.x, bob.y);
}
