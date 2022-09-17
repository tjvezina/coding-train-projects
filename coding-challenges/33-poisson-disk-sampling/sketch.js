const k = 30; // Maximum samples before rejection
const n = 2; // Number of dimensions in background (2D canvas!)
const MAX_CANVAS_SIZE = 512;

let r; // Minimum distance between sample points
let cols;
let rows;

let w; // Grid cell dimensions
let grid;
let active;

let rSlider;
let aSlider; // Radius alpha
let cSlider; // Cell alpha
let gSlider; // Grid alpha
let speedSlider;
let pointSlider;

function setup() {
  createCanvas(MAX_CANVAS_SIZE, MAX_CANVAS_SIZE);
  
  new Header('Simulation');
  rSlider = new PowerSlider('Min distance', 4, 7, 5);
  speedSlider = new Slider('Speed', 1, 10, 1);

  new Header('Style');
  aSlider = new Slider('Radius alpha', 0, 0.25, 0.1, 0.01);
  cSlider = new Slider('Cell alpha', 0, 0.25, 0.0, 0.01);
  gSlider = new Slider('Grid alpha', 0, 0.25, 0.1, 0.01);
  pointSlider = new Slider('Point size', 1, 10, 4);

  rSlider.changed(reset);
  
  reset();
}

function reset() {
  r = rSlider.value;
  w = r;// / sqrt(n); // Algorithm says r/sqrt(n) but then you have to search a 5x5 area?
  cols = floor(MAX_CANVAS_SIZE / w);
  rows = floor(MAX_CANVAS_SIZE / w);
  resizeCanvas(cols * w, rows * w);
  
  grid = [];
  for (let i = 0; i < cols*rows; ++i) {
    grid[i] = undefined;
  }
  
  // STEP 1 - Begin with a random point
  let pos = createVector(random(width), random(height));
  let ix = floor(pos.x / w);
  let iy = floor(pos.y / w);
  grid[ix + iy * cols] = pos;
  active = [ pos ];
}

function draw() {
  background(0);
  drawGrid();
  
  for (let iter = 0; iter < speedSlider.value; ++iter) {
    // STEP 2 - While active points, continue generating
    if (active.length > 0) {
      let sampleFound = false;
      let activeIndex = floor(random(active.length));
      let p1 = active[activeIndex];
      for (let i = 0; i < k; ++i) {
        let p2 = p5.Vector.random2D();
        p2.setMag(random(r, 2*r));
        p2.add(p1);
        
        let valid = true;
        let ix = floor(p2.x / w);
        let iy = floor(p2.y / w);
        
        if (ix < 0 || ix >= cols || iy < 0 || iy >= rows) {
          --i;
          continue;
        }
        
        for (let y = max(iy - 1, 0); y < min(iy + 2, rows); ++y) {
          for (let x = max(ix - 1, 0); x < min(ix + 2, cols); ++x) {
            let test = grid[x + y * cols];
            if (test && test.dist(p2) < r) {
              valid = false;
            }
          }
        }
        
        if (valid) {
          sampleFound = true;
          grid[ix + iy * cols] = p2;
          active.push(p2);
          break;
        }
      }
      
      if (!sampleFound) {
        active.splice(activeIndex, 1);
      }
    }
  }
  
  stroke(255);
  grid.forEach(p => {
    if (p) {
      strokeWeight(0);
      fill(255, 255, 255, 255 * aSlider.value);
      circle(p.x, p.y, r);
      fill(255, 255, 255, 255 * cSlider.value);
      rect(floor(p.x / w) * w, floor(p.y / w) * w, w, w);
      strokeWeight(pointSlider.value);
      point(p.x, p.y);
    }
  });
  
  stroke(0, 255, 0);
  active.forEach(p => {
    point(p.x, p.y);
  });
}

function drawGrid() {
  strokeWeight(1);
  stroke(255 * gSlider.value);
  for (let d = 0; d <= width; d += w) {
    line(d, 0, d, height);
    line(0, d, width, d);
  }
}