const SEGMENTS = 512;
const STEPS_PER_FRAME = 1;
const DEPTH = 10;

let radius;
let kList;
let kSlider;

let k;
let angleInc;
let steps;

let step;
let display;

function setup() {
  createCanvas(600, 600);
  radius = min(width, height) * 0.48;
  angleInc = TWO_PI / SEGMENTS;
  
  kList = buildKList();
  kSlider = createSlider(0, kList.length - 1, floor(kList.length/2))
    .style('margin-top', '10px')
    .style('width', (width-3)+'px');
  kSlider.input(reset);
  
  reset();
}

function buildKList() {
  let list = [ new KPair(1, 1) ];
  for (let a = 2; a <= DEPTH; ++a) {
    for (let b = 1; b <= a; ++b) {
      if (getGCF(a, b) == 1) {
        list.push(new KPair(a, b));
        list.push(new KPair(b, a));
      }
    }
  }
  list.sort((a, b) => a.k - b.k);
  return list;
}

function getGCF(a, b) {
  let limit = min(a, b);
  let gcf = 1;
  for (let i = 2; i <= limit; ++i) {
    if (a % i == 0 && b % i == 0) {
      gcf = i;
    }
  }
  return gcf;
}

function reset() {
  let pair = kList[kSlider.value()];
  k = pair.k;
  steps = SEGMENTS * pair.d;
  
  step = 0;
  display = pair.n + ' / ' + pair.d;
}

function draw() {
  background(0);
  
  push();
  translate(width/2, height/2);
  rotate(-PI/2);
  
  noFill();
  strokeWeight(2);
  
  // circle(0, 0, radius*2);
  
  beginShape();
  for (let i = 0; i < steps; ++i) {
    let a = i * angleInc;
    let r = cos(k * a) * radius;
    let x = r * cos(a);
    let y = r * sin(a);
    vertex(x, y);
    
    if (i == step) {
      strokeWeight(4);
      stroke(0, 63, 0);
      line(0, 0, radius * cos(a), radius * sin(a));
     
      strokeWeight(2);
      stroke(32);
      line(0, 0, x, y);
      circle(0, 0, r*2);
      noStroke();
      fill(255, 0, 0);
      circle(x, y, 10);
    }
  }
  noFill();
  stroke(127, 191, 255);
  endShape(CLOSE);
  pop();
  
  fill(255);
  noStroke();
  textSize(20);
  text(display, 0, height - 10);
  
  step = (step + STEPS_PER_FRAME) % steps;
}
  
function KPair(n, d) {
  this.n = n;
  this.d = d;
  this.k = n / d;
}