const VIEW_WIDTH = 32;

const blocks = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  for (let x = -7; x <= 7; x++) {
    for (let y = -7; y <= 7; y++) {
      blocks.push(new Block(x, y))
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  clear();
  
  const aspect = width/height;
  camera(100, -100, 100);
  ortho(-VIEW_WIDTH/2, VIEW_WIDTH/2, -(VIEW_WIDTH/aspect)/2, (VIEW_WIDTH/aspect)/2, 0.1, 1000);
  
  directionalLight(color('#E3DBA4'), -1, 0, 0)
  directionalLight(color('#7AA9B0'), 0, 1, 0)
  directionalLight(color('#344B7A'), 0, 0, -1)
  
  blocks.forEach(b => b.draw());
}