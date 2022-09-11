const BLACK = 0;
const WHITE = 1;
const EITHER = 2;

const BUTTON_SIZE = 300;
const PIXEL_SIZE = 10;

let r, g, b;
let brain;
let brainChoice = EITHER;

function setup() {
  createCanvas(BUTTON_SIZE*2 + 100, BUTTON_SIZE + 200);
  
  createP('The neural network will guess whether black or white text looks better on a given color (below is a map of its current guesses for any hue). Click on the text color you think looks best to further train it!');
  
  brain = new NeuralNetwork(3, 3, 2);
  
  randomizeColor();

  for (let i = 0; i < 10000; i++) {
    const col = color(random(255), random(255), random(255));
    const bright = brightness(col) / 100;
    brain.train([red(col)/255, green(col)/255, blue(col)/255], [bright, 1-bright]);
  }
}

function draw() {
  colorMode(RGB);
  background(42);
  
  fill(r, g, b);
  stroke(0);
  strokeWeight(brainChoice !== WHITE ? 10 : 0);
  circle(BUTTON_SIZE/2, BUTTON_SIZE/2, BUTTON_SIZE*0.85);
  stroke(255);
  strokeWeight(brainChoice !== BLACK ? 10 : 0);
  circle(width-BUTTON_SIZE/2, BUTTON_SIZE/2, BUTTON_SIZE*0.85);
  
  noStroke();
  textSize(BUTTON_SIZE*0.2);
  // textStyle(BOLD);
  textAlign(CENTER, CENTER);
  fill(0);
  text('BLACK', BUTTON_SIZE/2, BUTTON_SIZE/2);
  fill(255);
  text('WHITE', width-BUTTON_SIZE/2, BUTTON_SIZE/2);

  noStroke();
  fill(28);
  rect(BUTTON_SIZE, 0, 100, BUTTON_SIZE);
  
  push();
  {
    translate(width/2, BUTTON_SIZE/2);
    rotate(-PI/2);
    textAlign(CENTER, CENTER);
    textSize(BUTTON_SIZE*0.2);
    noStroke();
    fill(84);
    text('EITHER', 0, 5);
  }
  pop();

  colorMode(HSB);
  strokeWeight(1);
  for (let y = 0; y < height-BUTTON_SIZE; y += PIXEL_SIZE) {
    for (let x = 0; x < width; x += PIXEL_SIZE) {
      const col = color(map(x, 0, width, 0, 360), 80, map(y, 0, height-BUTTON_SIZE, 100, 0));
      const [black, white] = brain.predict([red(col)/255, green(col)/255, blue(col)/255]);
      fill(0, 0, white/(white+black)*100);
      stroke(col);
      rect(x, y + BUTTON_SIZE, PIXEL_SIZE, PIXEL_SIZE);
    }
  }
}

function randomizeColor() {
  r = random(255);
  g = random(255);
  b = random(255);
  
  const [black, white] = brain.predict([r/255, g/255, b/255]);

  brainChoice = (black > white*2 ? BLACK : (white > black*2 ? WHITE : EITHER));
}

function mouseClicked() {
  if (mouseX < 0 || mouseX >= width ||  mouseY < 0 || mouseY >= BUTTON_SIZE) {
    return;
  }
  
  if (mouseX < BUTTON_SIZE) {
    brain.train([r/255, g/255, b/255], [1, 0]);
  } else if (mouseX > width - BUTTON_SIZE) {
    brain.train([r/255, g/255, b/255], [0, 1]);
  } else {
    brain.train([r/255, g/255, b/255], [0.5, 0.5]);
  }
  
  randomizeColor();
}
