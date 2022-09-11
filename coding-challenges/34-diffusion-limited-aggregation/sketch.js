const START_DIAM = 10;
const MAX_ANGLE = 0.66;
const SHRINK_RATE = 0.975;

let nodes;
let root;
let smallestDiam = START_DIAM;

function Node(x, y) {
  this.d = START_DIAM;
  this.pos = createVector(x, y);
  this.children = [];
}

function setup() {
  createCanvas(640, 640);
  colorMode(HSB, 100);
  reset();
}

function reset() {
  root = new Node(width / 2, height / 2);
  nodes = [ root ];
}

function draw() {
  background(0);
  
  let lastPos;
  let walker = createEdgeNode();
  while (true) {
    let results = getNearest(walker.pos);
    let n = results[0];
    if (results[1] <= n.d*n.d) {
      walker.d = n.d * SHRINK_RATE;
      // let dir = p5.Vector.sub(walker.pos, n.pos);
      // walker.pos = n.pos.copy();
      // walker.pos.add(dir.setMag(n.d/2 + walker.d/2));
      
      n.children.push(walker);
      nodes.push(walker);
      
      smallestDiam = min(smallestDiam, walker.d);
      
      break;
    }
    
    lastPos = walker.pos.copy();
    
    // Complete random walking (VERY SLOW)
    // walker.add(p5.Vector.random2D().mult(d));
    // Towards home-ish walking
    let dir = p5.Vector.sub(walker.pos, nodes[0].pos).setMag(2).mult(-1);
    dir.rotate(random(-PI * MAX_ANGLE, PI * MAX_ANGLE));
    walker.pos.add(dir);
    
    walker.pos.x = constrain(walker.pos.x, 0, width - 1);
    walker.pos.y = constrain(walker.pos.y, 0, height - 1);
    
    strokeWeight(1);
    stroke(100 / 6 * 3.25, 100, 100, 100);
    line(lastPos.x, lastPos.y, walker.pos.x, walker.pos.y);
  }
  
  drawBranch(nodes[0]);
  
  // let index = 0;
  // nodes.forEach(n => {
  //   let i = index++ / 800;
  //   // strokeWeight(map(constrain(i, 0, 1), 0, 1, 10, 2));
  //   strokeWeight(d);
  //   stroke((i * 100 + 16.66) % 100, 100, 100);
  //   point(n.pos.x, n.pos.y);
  // });
}

function drawBranch(node, depth) {
  let i = 0;
  node.children.forEach(n => {
    drawBranch(n, (depth || 0) + 1);
    strokeWeight(node.d / 4);
    stroke((depth * 1.5 + 16.66) % 100, 100, 100);
    line(node.pos.x, node.pos.y, n.pos.x, n.pos.y);
  });
}

function createEdgeNode() {
  let pos = createVector();
  if (random() < width / (width + height)) {
    pos.x = random(width);
    pos.y = (random() < 0.5 ? 0 : height);
  } else {
    pos.x = (random() < 0.5 ? 0 : width);
    pos.y = random(height);
  }
  return new Node(pos.x, pos.y);
}

function getNearest(pos) {
  let shortestSqrMag = width * width;
  let nearest;
  for (let i = 0; i < nodes.length; ++i) {
    let n = nodes[i];
    let sqrMag = p5.Vector.sub(pos, n.pos).magSq();
    if (shortestSqrMag > sqrMag) {
      shortestSqrMag = sqrMag;
      nearest = n;
    }
  }
  return [ nearest, shortestSqrMag ];
}
