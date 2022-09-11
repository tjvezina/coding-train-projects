const RECT_RANGE = 0;
const CIRCLE_RANGE = 1;

let rangeType = RECT_RANGE;

let quadTree;
let points = [];

function setup() {
  createCanvas(600, 600);
  
  quadTree = new QuadTree(new Rect(width/2, height/2, width, height), 4);
  
  for (let i = 0; i < 1000; i++) {
    const angle = random(TWO_PI);
    const radius = random(width/2);
    addPoint(cos(angle)*radius + width/2, sin(angle)*radius + width/2);
  }
}

function mouseClicked() {
  rangeType = (rangeType + 1) % 2;
}

function addPoint(x, y) {
  const point = new Point(x, y);
  points.push(point);
  quadTree.insert(point);
}

function draw() {
  background(42);
  
  quadTree.draw();
  
  noFill();
  strokeWeight(1);
  stroke(50, 200, 100);
  rectMode(CENTER);
  
  let range;
  
  switch (rangeType) {
    case RECT_RANGE:
      range = new Rect(mouseX, mouseY, width*0.15, height*0.2);
      rect(range.x, range.y, range.w, range.h);
      break;
    case CIRCLE_RANGE:
      range = new Circle(mouseX, mouseY, width*0.1);
      circle(range.x, range.y, range.r*2);
      break;
  }
  
  const pointsNearMouse = quadTree.query(range);
  
  points.forEach(p => {
    strokeWeight(3);
    stroke(pointsNearMouse.includes(p) ? color(50, 200, 100) : color(200, 100, 50));
    point(p.x, p.y);
  });
}