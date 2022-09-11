const LAYERS = 64;

let state = 0; // 0 = Grid, 1 = Spiral
let t = 0;

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
}

function draw() {
  if (state === 0) {
    t = max(0, t - deltaTime/1000);
  } else {
    t = min(1, t + deltaTime/1000);
  }
  
  background(42);
  
  translate(width/2, height/2);
  scale(min(width, height) / (LAYERS*2 + 0.5));
  
  const points = {};
  
  const rings = LAYERS * 1.41 * max(width/height, height/width) + 1;
  const pCount = 4*rings*rings + 3*rings + 1;
  
  let pos = { x: 0, y: 0 };
  let dir = 0;
  let step = 0;
  let sideLen = 1;
  for (let n = 1; n <= pCount; n++) {
    if (isPrime(n)) {
      points[n] = { spiral: spiralize(n), grid: { x: pos.x, y: pos.y } };
    }
    switch (dir) {
      case 0: ++pos.x; break;
      case 1: --pos.y; break;
      case 2: --pos.x; break;
      case 3: ++pos.y; break;
    }
    ++step;
    if (step === sideLen) {
      step = 0;
      if (dir % 2 === 1) {
        ++sideLen;
      }
      dir = (dir+1) % 4;
    }
  }
  
  strokeWeight(0.4);
  stroke(255);
  Object.values(points).forEach(p => point(lerp(p.grid.x, p.spiral.x, t), lerp(p.grid.y, p.spiral.y, t)));
  
  // Grid lines
  noFill();
  strokeWeight(0.03);
  stroke(255, 255, 255, 255*(1-t));
  const squares = LAYERS * max(width/height, height/width) + 1;
  for (let s = 1; s < squares; s++) {
    line(-s+1, s-1, s, s-1);
    line(s, s-1, s, -s);
    line(s, -s, -s, -s);
    line(-s, -s, -s, s);
  }
  
  // Spiral lines
  noFill();
  strokeWeight(0.03);
  stroke(255, 255, 255, 255*t);
  beginShape();
  for (let s = 1; s <= rings; s++) {
    for (let a = 0; a < TWO_PI; a += TWO_PI/128) {
      const r = (s-1) + a/TWO_PI;
      vertex(sin(a)*r, cos(a)*r);
    }
  }
  endShape();
}

function mouseClicked() {
  state = (state+1) % 2;
}

function spiralize(n) {
  // n = 4x^2 + 3x + 1
  const a = 4, b = 3, c = 1-n;
  
  const x = (-b + sqrt(b*b - 4*a*c)) / (2*a);

  const t = TWO_PI * x;
  return { x: sin(t)*x, y: cos(t)*x };
}

function isPrime(n) {
  if (n <= 1) return false;
  const limit = sqrt(n);
  for (let i = 2; i <= limit; i++) {
    if (n % i === 0) return false;
  }
  return true;
}
