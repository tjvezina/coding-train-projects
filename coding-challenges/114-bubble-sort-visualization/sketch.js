const WIDTH = 800;
const HEIGHT = 600;
const VALUE_COUNT = 200;
const BAR_WIDTH = WIDTH/VALUE_COUNT;

const values = [];

let iEnd = VALUE_COUNT-1;
let iCur = 0;

function setup() {
  createCanvas(WIDTH, HEIGHT);
  
  values.length = 0;
  for (let i = 0; i < VALUE_COUNT; i++) {
    values.splice(floor(random(i)), 0, i);
  }
}

function draw() {
  background(42);
  translate(0, height);
  scale(1, -1);
  
  noStroke();
  for (let i = 0; i < values.length; i++) {
    fill(i === iCur ? '#DB5F26' : '#278DD6');
    rect(i * BAR_WIDTH, 0, BAR_WIDTH, height*values[i]/VALUE_COUNT);
  }
  
   for (let i = 0; i < 12; i++) {
    if (iEnd > 0) {
      bubbleSortStep();
    }
  }
}

function bubbleSortStep() {
  if (values[iCur] > values[iCur+1]) {
    [values[iCur], values[iCur+1]] = [values[iCur+1], values[iCur]];
  }
  iCur++;
  if (iCur === iEnd) {
    iCur = 0;
    iEnd--;
  }
}
