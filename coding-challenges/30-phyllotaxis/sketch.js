let n = 0;

let cSlider;
let speedSlider;
let sizeSlider;
let angleSlider;
let tSlider;
let rSlider;

function setup() {
  createCanvas(600, 600);
  angleMode(DEGREES);
  colorMode(HSB, 100); 
  reset();
  
  UIElement.setRowWidth(`${width}px`);
  speedSlider = new PowerSlider('Speed', 0, 12, 2);
  cSlider = new Slider('Zoom', 1, 20, 8, 0.01);
  sizeSlider = new Slider('Size', 0.01, 10, 4, 0.01);
  angleSlider = new Slider('Angle', 135, 140, 137.5, 0.01);
  tSlider = new Slider('Theta Strength', 0, 1, 0.78, 0.01);
  rSlider = new Slider('Radius Strength', 0, 1, 0, 0.01);

  UIElement.controlList.forEach(control => control.changed(reset));
}

function reset() {
  background(0);
  n = 0;
}

function draw() {
  translate(width / 2, height / 2);
  
  let c = cSlider.value;
  let speed = speedSlider.value;
  let size = sizeSlider.value * c / 4;
  let angle = angleSlider.value;
  let tHue = tSlider.value;
  let rHue = rSlider.value;
  
  for (let i = 0; i < speed; ++i) {
    let t = n * angle;
    let r = c * sqrt(n);
    
    let pos = createVector(r, 0);
    pos.rotate(t);
    
    let hue = ((t * tHue) - (r * rHue)) % 100;
    
    noStroke();
    fill(hue, 100, 100);
    circle(pos.x, pos.y, size);
    
    ++n;
  }
}