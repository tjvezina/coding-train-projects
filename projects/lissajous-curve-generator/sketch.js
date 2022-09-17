// 2, 1.2, -0.5, -0.5, 98, 19, 42, 1

let sliderX;
let sliderY;
let sliderXOffset;
let sliderYOffset;
let sliderSpeed;
let sliderColor;
let sliderSat;
let sliderWidth;

let time;
let prevPos;

function setup() {
  canvas = createCanvas(400, 400);
  
  new Header('Position');
  sliderX = new Slider("X Speed", 0, 2, 1, 0.01);
  sliderY = new Slider("Y Speed", 0, 2, 1, 0.01);
  sliderXOffset = new Slider("X Offset", -0.5, 0.5, 0, 0.5);
  sliderYOffset = new Slider("Y Offset", -0.5, 0.5, -0.5, 0.5);

  new Header('Speed');
  sliderSpeed = new Slider("Speed", 1, 100, 5);
  sliderColor = new Slider("Color Speed", 1, 20, 1);

  new Header('Style');
  sliderSat = new Slider("Saturation", 0, 100, 100);
  sliderWidth = new Slider("Width", 1, 40, 4);
  
  UIElement.controlList.forEach(control => control.changed(reset));

  colorMode(HSB, 100);

  reset();
}

function reset() {
  time = 0;
  prevPos = createVector(0, 0);
  
  clear();
}

function draw() {
  for (let i = 0; i < sliderSpeed.value; i++) {
    let pos = createVector(0, 0);
    pos.x = map(sin(time * sliderX.value + PI * sliderXOffset.value), -1, 1, 0.05, 0.95) * width;
    pos.y = map(sin(time * sliderY.value + PI * sliderYOffset.value), -1, 1, 0.05, 0.95) * height;
    
    if (time > 0) {
      strokeWeight(sliderWidth.value);
      stroke(color((time * sliderColor.value) % 100, sliderSat.value, 100));
      line(prevPos.x, prevPos.y, pos.x, pos.y);
    }
    
    prevPos = pos;
    
    time += 0.01;
  }
}