const WIDTH = 144;
const HEIGHT = 256;

let canvas;
let displayScale;
let font;

let difficultySlider;

let running = false;

let bird;
let level;
let score = 0;
let highScore = 0;

let speed = 1;

function preload() {
  font = loadFont('fonts/flappy.TTF');
  
  bird = new Bird();
  level = new Level();
}

function setup() {
  canvas = createCanvas(WIDTH, HEIGHT);
  resetCanvas();
  reset();
}

function windowResized() {
  resetCanvas();
}

function resetCanvas() {
  displayScale = windowHeight / HEIGHT;
  resizeCanvas(WIDTH * displayScale, HEIGHT * displayScale);
  canvas.position((windowWidth - width) / 2, 0);
}

function reset() {
  highScore = max(highScore, score);
  score = 0;
  running = false;
  
  bird.reset();
  level.reset();
}

function draw() {
  scale(displayScale);
  
  if (running) {
    level.update();
    bird.update();
  }
  
  level.draw();
  bird.draw();
  
  textFont(font);
  textSize(28);
  textAlign(CENTER);
  stroke(0);
  strokeWeight(2);
  fill(0);
  text(score, WIDTH / 2 + 1, HEIGHT / 5 + 1);
  fill(255);
  text(score, WIDTH / 2, HEIGHT / 5);
  textSize(8);
  strokeWeight(1);
  text("High Score: " + highScore, WIDTH / 2, HEIGHT - 5);
}

function keyPressed() {
  if (key == ' ') {
    running = true;
    bird.flap();
  }
}

function mousePressed() {
  if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) {
    running = true;
    bird.flap();
  }
}