const transforms = [
  { p: 0.01, apply: ({ x, y }) => ({ x: 0, y: 0.16*y }) },
  { p: 0.85, apply: ({ x, y }) => ({ x: 0.85*x + 0.04*y, y: -0.04*x + 0.85*y + 1.6 }) },
  { p: 0.07, apply: ({ x, y }) => ({ x: 0.2*x - 0.26*y, y: 0.23*x + 0.22*y + 1.6 }) },
  { p: 0.07, apply: ({ x, y }) => ({ x: -0.15*x + 0.28*y, y: 0.26*x + 0.24*y + 0.44 }) },
]

let p = { x: 0, y: 0 };

function setup() {
  createCanvas(600, 600);
  background(42);
}

function draw() {
  translate(width/2, height);
  scale(1, -1);
  scale(height/11);
  
  for (let i = 0; i < 1000; i++) {
    drawPoint();
    nextPoint();
  }
}

function drawPoint() {
  strokeWeight(0.02);
  stroke(50, 220, 70);
  noFill();  
  point(p.x, p.y);
}

function nextPoint() {
    let r = random(1);
    let i = 0;
    while (r > transforms[i].p) {
      r -= transforms[i++].p;
    }
    p = transforms[i].apply(p);
}