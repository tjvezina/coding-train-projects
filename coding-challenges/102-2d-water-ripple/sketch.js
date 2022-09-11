const SIZE = 400;
let buffer1 = [];
let buffer2 = [];

const DAMPING = 0.999;

function setup() {
  createCanvas(SIZE, SIZE);
  pixelDensity(1);
  
  for (let i = 0; i < SIZE; i++) {
    buffer1.push(new Array(SIZE).fill(0));
    buffer2.push(new Array(SIZE).fill(0));
  }
  
  buffer1[SIZE/2][SIZE/2] = 1000;
}

function draw() {
  background(42);
  loadPixels();
  
  const hold = buffer2;
  buffer2 = buffer1;
  buffer1 = hold;
  
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const value = ((getValue(buffer2, x, y-1) + getValue(buffer2, x, y+1) + getValue(buffer2, x-1, y) + getValue(buffer2, x+1, y)) / 2 - buffer1[y][x]) * DAMPING;
      buffer1[y][x] = value;
      
      const i = x+y*SIZE;
      pixels[i*4+0] = buffer1[y][x];
      pixels[i*4+1] = buffer1[y][x];
      pixels[i*4+2] = buffer1[y][x];
      pixels[i*4+3] = 255;
    }
  }
  
  updatePixels();
}

function getValue(buffer, x, y) {
  if (x >= 0 && x < SIZE && y >= 0 && y < SIZE) {
    return buffer[y][x];
  }
  return 0;
}

function mousePressed() {
  if (mouseX >= 0 && mouseX < SIZE && mouseY >= 0 && mouseY < SIZE) {
    buffer1[floor(mouseY)][floor(mouseX)] = 1000;
  }
}