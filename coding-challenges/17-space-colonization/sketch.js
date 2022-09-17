const MIN_DIST = 16;
const MAX_DIST = 128;
const LEAF_COUNT = 800;

let tree;
let interval = null;

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  tree = new Tree();
  interval = setInterval(grow, 50);
}

function draw() {
  background(28, 36, 48);
  
  orbitControl(1, 1, 0);
  
  tree.draw();
}

function grow() {
  if (!tree.grow()) {
    clearInterval(interval);
    interval = null;
  }
}
