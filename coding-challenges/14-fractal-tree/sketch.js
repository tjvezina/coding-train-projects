let lengthSlider;
let lengthMultiplierSlider;
let angleSlider;

function setup() {
  createCanvas(400, 400);
  
  createElement("p", "Start Length").style("color", "#FFF").style("margin-bottom", "0px");
  lengthSlider = createSlider(10, 200, 100);
  createElement("p", "Length Multiplier").style("color", "#FFF").style("margin-bottom", "0px");
  lengthMultiplierSlider = createSlider(0.01, 1, 0.7, 0.01);
  createElement("p", "Angle").style("color", "#FFF").style("margin-bottom", "0px");
  angleSlider = createSlider(2, 16, 8, 0.25);
}

function draw() {
  background(150, 80, 24);
  
  translate(width/2, height);
  scale(1, -1);
  branch(PI / angleSlider.value(), lengthSlider.value());
}

function branch(angle, length, depth = 1) {
  strokeWeight(3 - (depth * 0.25));
  line(0, 0, 0, length);
  translate(0, length);
  
  length *= lengthMultiplierSlider.value();
  if (depth < 12) {
    push();
      rotate(-angle);
      branch(angle, length, depth + 1);
    pop();
    push();
      rotate(angle);
      branch(angle, length, depth + 1);
    pop();
  }
}
