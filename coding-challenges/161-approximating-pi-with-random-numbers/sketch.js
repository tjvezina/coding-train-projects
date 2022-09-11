// The ratio of coprime to non-coprime interger pairs is 6/pi^2 = 0.6079...
// So by generating random pairs and tracking how many were coprime, we can estimate pi

const MAX_VALUE = 10e8;

let iterPerFrame = 1;
let total = 0;
let coprime = 0;

function setup() {
  createCanvas(600, 600);
  pixelDensity(1);
}

function draw() {
  background(42);
  
  for (let i = 0; i < iterPerFrame; i++) {
    const a = floor(random(MAX_VALUE));
    const b = floor(random(MAX_VALUE));

    ++total;
    if (gcd(a, b) === 1) {
      ++coprime;
    }
  }
  ++iterPerFrame;
  
  fill('#9AC6DD');
  textSize(width/16);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text(`${coprime} / ${total} = ${nf(coprime/total, 1, 6)}`, width/2, height/2 - 50);
  
  const piEstimate = sqrt(6 * total / coprime);
  text(nf(piEstimate, 1, 15), width/2, height/2 + 50);
}

function gcd(a, b) {
  if (a < b) {
    [b, a] = [a, b];
  }

  while (b > 0) {
    const r = a % b;
    a = b;
    b = r;
  }

  return a;
}