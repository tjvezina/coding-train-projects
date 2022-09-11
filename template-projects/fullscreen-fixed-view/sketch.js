const VIEW_WIDTH = 800;
const VIEW_HEIGHT = 600;
let viewScale = 1;
let viewExtents = { x: 0, y: 0, w: VIEW_WIDTH, h: VIEW_HEIGHT };

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
}

function draw() {
  background(42);
  
  viewScale = (width/height < VIEW_WIDTH/VIEW_HEIGHT ? width/VIEW_WIDTH : height/VIEW_HEIGHT);
  viewExtents = { x: -width/2 / viewScale + VIEW_WIDTH/2, y: -height/2 / viewScale + VIEW_HEIGHT/2, w: width/viewScale, h: height/viewScale };
  translate(width/2, height/2);
  scale(viewScale);
  translate(-VIEW_WIDTH/2, -VIEW_HEIGHT/2);
}
