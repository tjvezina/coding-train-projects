// SPACE COLONIZATION (Misleading name, generates trees)
// - Begins with a series of points (the ends of the branches)
// - "Grows" segments that are attracted to the points, until all are reached

const MIN_DIST = 16;
const MAX_DIST = 128;
const LEAF_COUNT = 800;

let tree;
let interval = null;

function setup() {
  createCanvas(windowWidth, windowHeight - 4, WEBGL);
  
  tree = new Tree();
  interval = setInterval(grow, 50);
}

function draw() {
  background(28, 36, 48);
  
  orbitControl();
  
  tree.draw();
}

function grow() {
  if (!tree.grow()) {
    clearInterval(interval);
    interval = null;
  }
}
