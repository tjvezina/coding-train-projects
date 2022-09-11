const WIDTH = 800;
const HEIGHT = 600;
const VALUE_COUNT = 200;
const BAR_WIDTH = WIDTH/VALUE_COUNT;

const ITER_PER_FRAME = 1;

const values = [];

const partitions = [];

let iCur = VALUE_COUNT-1;

function setup() {
  createCanvas(WIDTH, HEIGHT);
  
  values.length = 0;
  for (let i = 1; i <= VALUE_COUNT; i++) {
    values.splice(floor(random(i)), 0, i);
  }
  
  partitions.push({ start: 0, end: VALUE_COUNT-1 });
}

function draw() {
  background(42);
  translate(0, height);
  scale(1, -1);
  
  noStroke();
  for (let i = 0; i < values.length; i++) {
    if (i === iCur) {
      fill('#DB5F26');
    } else if (!partitions.some(part => part.start <= i && i <= part.end)) {
      fill('#278DD6');
    } else {
      fill(`#FFF`);
    }
    rect(i * BAR_WIDTH, 0, BAR_WIDTH, height*values[i]/VALUE_COUNT);
  }
  
   for (let i = 0; i < ITER_PER_FRAME; i++) {
    if (partitions.length > 0) {
      quicksortStep(partitions.shift());
    }
  }
}

function quicksortStep({ start, end }) {
  const pivot = values[end];
  const lesser = [];
  const greater = [];
  
  for (let i = start; i < end; i++) {
    const value = values[i];
    if (value < pivot) {
      lesser.push(value);
    } else {
      greater.push(value);
    }
  }
  
  values.splice(start, end - start + 1, ...lesser, pivot, ...greater);
  
  if (greater.length > 1) {
    partitions.unshift({ start: end - greater.length + 1, end });
  }
  if (lesser.length > 1) {
    partitions.unshift({ start, end: start + lesser.length - 1 });
  }
  
  iCur = start + lesser.length;
}
