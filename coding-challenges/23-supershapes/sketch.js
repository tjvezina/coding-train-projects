const INC = 0.1;
let i = 0;
let last = null;

let n1Slider;
let n2Slider;
let n3Slider;
let mSlider;
let aSlider;
let bSlider;

function setup() {
  createCanvas(400, 400);
  background(42);
  
  createElement("div");
  n1Slider = createSlider(0.25, 10, 1, 0.25).style("width", "400px");
  n2Slider = createSlider(0.25, 10, 1, 0.25).style("width", "400px");
  n3Slider = createSlider(0.25, 10, 1, 0.25).style("width", "400px");
  mSlider = createSlider(0, 10, 0).style("width", "400px");
  aSlider = createSlider(0, 2, 1, 0.01).style("width", "400px");
  bSlider = createSlider(0, 2, 1, 0.01).style("width", "400px");
  
  n1Slider.input(reset);
  n2Slider.input(reset);
  n3Slider.input(reset);
  mSlider.input(reset);
  aSlider.input(reset);
  bSlider.input(reset);
}

function reset() {
  background(42);
  i = 0;
  last = null;
}

function draw() {
  translate(width/2, height/2);
  
  stroke(63);
  line(-width/2, 0, width/2, 0);
  line(0, -height/2, 0, height/2);
  
  fill(127);
  // text("n1 = " + n1Slider.value(), -width/2, height/2);
  
  stroke(255);
  noFill();
  
  for (let iter = 0; iter < 64 * 4; ++iter) {
    let t = i++ * INC;

    let rad = superShape(t);
    let vert = createVector(150 * rad * cos(t), -150 * rad * sin(t));

    if (last != null) {
      line(last.x, last.y, vert.x, vert.y);
    }

    last = vert;
  }
}

function superShape(theta) {
  let n1 = n1Slider.value();
  let n2 = n2Slider.value();
  let n3 = n3Slider.value();
  let m = mSlider.value();
  let a = aSlider.value();
  let b = bSlider.value();
  
  let p1 = pow(abs((1 / a) * cos(m / 4 * theta)), n2);
  let p2 = pow(abs((1 / b) * sin(m / 4 * theta)), n3);
  
  return 1 / pow(sqrt(p1 + p2), 1 / n1);
}

function sign(x) {
  return (x > 0 ? 1 : (x < 0 ? -1 : 0));
}
