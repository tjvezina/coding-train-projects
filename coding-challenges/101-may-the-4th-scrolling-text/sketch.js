let words;
let font;

let posY = 420;

function preload() {
  loadStrings('assets/innocuous_text.txt', result => words = result.reduce((a, b) => a + b));
  font = loadFont('assets/fonts/coolvetica rg.otf');
}

function setup() {
  createCanvas(900, 600, WEBGL);  
}

function draw() {
  background(0);
  textFont(font);
  
  posY -= 20 * (1/(frameRate() || 60));
  
  // Position (x, y, z), Target (x, y, z), Up (x, y, z)
  camera(0, 300, 300, 0, 0, 0, 0, 1, 0);
  // Field of view, aspect ratio, near plane, far plane
  perspective(PI*0.6, width/height, 3, 10000);
  
  noStroke();
  fill(238, 213, 75);
  textSize(height/10);
  textAlign(CENTER);
  textLeading(height/10);
  text(words, -width*0.4, posY, width*0.8);
}