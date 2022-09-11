// 2, 1.2, -0.5, -0.5, 98, 19, 42, 1

let canvas;

let sliders = [];

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

const scale = 100;
const space = 60;

class labelSlider {
  constructor(i, text, start, end, initial, scale) {
    this.slider = createSlider(start * scale, end * scale, initial * scale);
    this.label = createElement("p", text);
    this.value = createElement("p", "");
    this.scale = scale;
    this.i = i;

    this.slider.size(400, AUTO);
    this.label.style("color", "#368");
    this.label.style("font-size", "16pt");
    this.value.style("color", "#AAA");
    this.value.style("font-size", "16pt");
  }
  
  getValue() {
    return this.slider.value() / this.scale;
  }

  getY() {
    return (this.i + 1) * space + height;
  }

  reset() {
    let startX = (windowWidth - this.slider.width) / 2;
    this.slider.position(startX, this.getY());
    this.label.position(startX, this.getY() - 28);
    this.value.position(startX + this.slider.width + 20, this.getY() - 10);
  }

  update() {
    this.value.html(this.slider.value() / this.scale);
  }
}

function windowResized() {
  reset();
}

function setup() {
  canvas = createCanvas(400, 400);
  
  select("body").style("background-color", "black");

  sliderX = new labelSlider(0, "X Speed", 0, 2, 1, scale);
  sliderY = new labelSlider(1, "Y Speed", 0, 2, 1, scale);
  sliderXOffset = new labelSlider(2, "X Offset", -0.5, 0.5, 0, 2);
  sliderYOffset = new labelSlider(3, "Y Offset", -0.5, 0.5, -0.5, 2);
  sliderSpeed = new labelSlider(4, "Speed", 1, 100, 5, 1);
  sliderColor = new labelSlider(5, "Color Speed", 1, 20, 1, 1);
  sliderSat = new labelSlider(6, "Color Saturation", 0, 100, 100, 1);
  sliderWidth = new labelSlider(7, "Width", 1, 40, 4, 1);
  
  sliders = [sliderX, sliderY, sliderXOffset, sliderYOffset, sliderSpeed, sliderColor, sliderSat, sliderWidth];
  
  for (let slider of sliders) {
    slider.slider.input(reset);
  }
  
  colorMode(HSB, 100);

  reset();
}

function reset() {
  canvas.position((windowWidth - width) / 2, 20);

  for (let slider of sliders) {
    slider.reset();
  }
  
  time = 0;
  prevPos = createVector(0, 0);
  
  background(0);
}

function draw() {
  for (let slider of sliders) {
    slider.update();
  }

  let pos = createVector(0, 0);
  pos.x = map(sin(time * sliderX.getValue() + PI * sliderXOffset.getValue()), -1, 1, 0.05, 0.95) * width;
  pos.y = map(sin(time * sliderY.getValue() + PI * sliderYOffset.getValue()), -1, 1, 0.05, 0.95) * height;
  
  if (time > 0) {
    strokeWeight(sliderWidth.getValue());
    stroke(color((time * sliderColor.getValue()) % 100, sliderSat.getValue(), 100));
    line(prevPos.x, prevPos.y, pos.x, pos.y);
  }
  
  prevPos = pos;
  
  time += 0.01 * sliderSpeed.getValue();
}