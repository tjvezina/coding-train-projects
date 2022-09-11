const WIDTH = 300;
const HEIGHT = 200;
const SCROLL_SPEED = 1.2; // Units per second

let buffer1;
let buffer2;
let coolingLUT;

const DAMPING = 0.999;

function setup() {
  createCanvas(WIDTH*2, HEIGHT);
  pixelDensity(1);
  
  buffer1 = createGraphics(WIDTH, HEIGHT);
  buffer2 = createGraphics(WIDTH, HEIGHT);
  coolingLUT = createImage(WIDTH, HEIGHT);
  
  buffer1.loadPixels();
  buffer2.loadPixels();
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      setPixel(buffer1, x, y, 0);
      setPixel(buffer2, x, y, 0);
    }
  }
  buffer1.updatePixels();
  buffer2.updatePixels();
}

function draw() {
  background(42);
  fillRows(4);
  generateCoolingLUT();
  
  if (mouseX > 0 && mouseX < WIDTH && mouseY > 0 && mouseY < HEIGHT) {
    buffer1.noStroke();
    buffer1.fill(255);
    buffer1.circle(mouseX, mouseY, 50);
  }
  
  buffer1.loadPixels();
  buffer2.loadPixels();
  coolingLUT.loadPixels();
  for (let x = 0; x < WIDTH; x++) {
    for (let y = 0; y < HEIGHT; y++) {
      if (x === 0 || x === WIDTH-1 || y === 0 || y === HEIGHT-1) {
        setPixel(buffer2, x, y, 0);
        continue;
      }
      
      const a = getPixel(buffer1, x-1, y);
      const b = getPixel(buffer1, x+1, y);
      const c = getPixel(buffer1, x, y-1);
      const d = getPixel(buffer1, x, y+1);
      const cool = getPixel(coolingLUT, x, y);
      
      setPixel(buffer2, x, y-1, max(0, (a+b+c+d)/4 - cool));
    }
  }
  buffer2.updatePixels();
  
  const hold = buffer1;
  buffer1 = buffer2;
  buffer2 = hold;
  
  tint('#AC2F15');
  image(buffer1, 0, 0);
  noTint();
  image(coolingLUT, WIDTH, 0);
}

function fillRows(rows) {
  buffer1.loadPixels();
  for (let x = 0; x < WIDTH; x++) {
    for (let y = HEIGHT-rows; y < HEIGHT; y++) {
      setPixel(buffer1, x, y, 255);
    }
  }
  buffer1.updatePixels();
  
  for (let i = 0; i < 100; i++) setPixel(buffer1, floor(random(WIDTH)), floor(random(HEIGHT)), 255);
}

function generateCoolingLUT() {
  coolingLUT.loadPixels();
  let xOff = 0;
  let inc = 0.02;
  for (let x = 0; x < WIDTH; x++) {
    xOff += inc;
    let yOff = (millis()/1000) * SCROLL_SPEED;
    for (let y = 0; y < HEIGHT; ++y) {
      yOff += inc;
      
      setPixel(coolingLUT, x, y, pow(noise(xOff, yOff), 3) * 255);
    }
  }
  coolingLUT.updatePixels();
}

function getPixel(buffer, x, y) {
  return buffer.pixels[(x+y*WIDTH)*4];
}

function setPixel(buffer, x, y, col) {
  const i = (x + y*WIDTH) * 4;
  buffer.pixels[i+0] = col;
  buffer.pixels[i+1] = col;
  buffer.pixels[i+2] = col;
  buffer.pixels[i+3] = 255;
}
