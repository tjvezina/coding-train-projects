const WIDTH = 65;
const DEPTH = 80;
const SIZE = 20;

let offset = 0;

function setup() {
  createCanvas(400, 400, WEBGL);
}

function draw() {
  background(0, 20, 50);
  rotateX(PI * 0.4);
  translate(-WIDTH * SIZE / 2, -DEPTH * SIZE * 0.75);
  
  ambientMaterial(20, 60, 40);
  ambientLight(63);
  directionalLight(color(127), -1, 1, -1);

  // fill(20, 60, 40);
  stroke(20);
  for (let y = 0; y < DEPTH; ++y) {
    beginShape(TRIANGLE_STRIP);
    for (let x = 0; x < WIDTH + 1; ++x) {
      vertex(x * SIZE, y * SIZE, getNoise(x, y, offset));
      vertex(x * SIZE, (y+1) * SIZE, getNoise(x, y+1, offset));
    }
    endShape();
  }
  
  offset -= 1;
}

function getNoise(x, y, offset) {
  return noise(x/5, (y+offset)/5) * 100;
}
