let pos;
let speedSlider;
let stepCount = 0

function setup() {
  createCanvas(640, 480);
  frameRate(30);
  colorMode(HSB, 100);
  background(0);

  pos = createVector(width / 2, height / 2);

  UIElement.setLabelWidth('5rem');
  speedSlider = new PowerSlider('Speed', 0, 10, 0);
}

function draw() {
  stroke(255);
  strokeWeight(2);

  let iterations = speedSlider.value;
  for (let i = 0; i < iterations; ++i) {
    let prev = pos.copy();
    let step = p5.Vector.random2D();

    if (random() < 0.01) step.mult(random(75, 100));
    else step.mult(random(1, 3));

    pos.add(step);

    stroke(((stepCount++) / 10) % 100, 100, 100);
    line(prev.x, prev.y, pos.x, pos.y);

    let wrapped = false;
    if (pos.x < 0)       { pos.x += width; prev.x += width; wrapped = true; }
    if (pos.x >= width)  { pos.x -= width; prev.x -= width; wrapped = true; }
    if (pos.y < 0)       { pos.y += height; prev.y += height; wrapped = true; }
    if (pos.y >= height) { pos.y -= height; prev.y -= height; wrapped = true; }

    if (wrapped) {
      line(prev.x, prev.y, pos.x, pos.y);
    }
  }
}