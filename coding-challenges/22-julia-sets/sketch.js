const START_SCALE = 200;
const START_OFFSET_X = 0.0;
const MAX_ITER = 100;
const THRESHOLD = 10000;
const COLOR_POW = 0.5;
const SCROLL_SPEED = 0.02;

let scale;
let offset;

function setup() {
  createCanvas(400, 400);
  pixelDensity(1);
  colorMode(HSB, 100);
  
  resetView();
}

function resetView() {
  offset = createVector(START_OFFSET_X, 0);
  scale = START_SCALE;
}

function draw() {
  updateOffset();
  
  let rangeA = createVector(-width/2/scale + offset.x, width/2/scale + offset.x);
  let rangeB = createVector(-height/2/scale + offset.y, height/2/scale + offset.y);
  
  loadPixels();
  for (let y = 0; y < height; ++y) {
    for (let x = 0; x < width; ++x) {
      let i = (y * width + x) * 4;
      let ac = map(x, 0, width, rangeA.x, rangeA.y);
      let bc = map(y, 0, height, rangeB.x, rangeB.y);
      
      let n = 0;
      let z = 0;
      let a = ac;
      let b = bc;
      
      while (n < MAX_ITER) {
        let az = a*a - b*b;
        let bz = 2 * a * b;
        
        a = az + map(mouseX, 0, width, -1, 1);
        b = bz + map(mouseY, 0, height, -1, 1);
        
        if (a + b > THRESHOLD) {
          break;
        }
        
        ++n;
      }
      
      let p = map(n, 0, MAX_ITER, 0, 1);
      let hue = map(pow(p, COLOR_POW), 0, 1, 100, 0);
      let col = color(hue, 100, 100);
      
      if (n == MAX_ITER) {
        col = color(0, 0, 0);
      }
      
      pixels[i + 0] = red(col);
      pixels[i + 1] = green(col);
      pixels[i + 2] = blue(col);
      pixels[i + 3] = 255;
    }
  }
  updatePixels();
  
  stroke(0, 0, 100, 33);
  line(0, height/2, width, height/2);
  line(width/2, 0, width/2, height);
}

function keyPressed() {
  if (keyCode == 32) { // SPACEBAR
    resetView();
  }
}

function mouseWheel(event) {
  scale /= pow(2, event.delta/1000);
}

function updateOffset() {
  let speedMult = 1 / (scale / START_SCALE);
  
  if (keyIsDown(LEFT_ARROW)) {
    offset.x -= SCROLL_SPEED * speedMult;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    offset.x += SCROLL_SPEED * speedMult;
  }
  if (keyIsDown(UP_ARROW)) {
    offset.y -= SCROLL_SPEED * speedMult;
  }
  if (keyIsDown(DOWN_ARROW)) {
    offset.y += SCROLL_SPEED * speedMult;
  }
}