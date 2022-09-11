let canvas;
let header;
let para;
let button;
let sliders = [];
let textInput;
let rectColor;

let canvasY = 360;

function setup() {
  canvas = createCanvas(400, 400);
  // Overrides the default layout with an absolute position
  // canvas.position(0, canvasY);

  header = createElement("h1", "Header created in JS!");
  
  // Modify classes with "p.class('className');" and "p.removeClass('className');"
  // Use "createA" to create an anchor (link)
  para = createP("This paragraph was created at run-time!");
  para.mouseOver(paraMouseOver);
  para.mouseOut(paraMouseOut);
  paraMouseOut();
  
  let div = createElement("div");
  
  div.child(canvas); // Same as canvas.parent(div);
  
  // select() returns one elements; with classes/tags, it returns the first
  let customPara = select('#customPara');
  customPara.style("color", "#C94");
  
  let headers = selectAll('h1');
  for (let h of headers) {
    h.style("background-color", "#222");
    h.style("padding", "12px");
  }
  
  let paras = selectAll('p');
  for (let p of paras) {
    p.mouseOver(paraIndent);
    p.mouseOut(paraUnIndent);
  }

  button = createButton("RANDOM COLOR");
  button.position(width / 2 - button.width / 2, canvasY + 50);
  button.mousePressed(changeColor);

  for (let i = 0; i < 3; ++i) {
    sliders[i] = initSlider(i);
  }

  textInput = createInput("TEXT");
  textInput.position(width / 2 - textInput.width / 2, canvasY + 320);

  rectColor = color(0, 155, 0);
  updateSliders();
}

function initSlider(i) {
  slider = createSlider(0, 255);
  slider.position(width / 2 - slider.width / 2, canvasY + 140 + (40 * i));
  slider.input(updateColor);
  return slider;
}

// Fired for every click within the page, not just on the canvas
function mousePressed() {
  // Change the element's content
  para.html(random());
}

function changeColor() {
  rectColor = color(random(255), random(255), random(255));
  updateSliders();
}

function updateSliders() {
  sliders[0].value(red(rectColor));
  sliders[1].value(green(rectColor));
  sliders[2].value(blue(rectColor));
}

function updateColor() {
  rectColor = color(sliders[0].value(), sliders[1].value(), sliders[2].value());
}

function paraMouseOver() {
  // Override style defined in style.css (or index.html)
  para.style("background-color", "rgb(0, 200, 0)");
}

function paraMouseOut() {
  // Override style defined in style.css (or index.html)
  para.style("background-color", "green");
}

// 'this' magically refers to the DOM element calling this function (thanks p5.js!)
function paraIndent() {
  this.style("margin-left", "20px");
}

function paraUnIndent() {
  this.style("margin-left", "0px");
}

function draw() {
  clear();

  rectMode(CENTER);
  fill(rectColor);
  strokeWeight(1);
  textSize(50);
  text(textInput.value(), mouseX, mouseY);

  textSize(20);
  fill(sliders[0].value(), 0, 0);
  text("R", 115, 157);
  fill(0, sliders[1].value(), 0);
  text("G", 115, 197);
  fill(0, 0, sliders[2].value());
  text("B", 115, 237);

  rectMode(CORNER);
  noFill();
  strokeWeight(2);
  rect(0, 0, width, height);
}