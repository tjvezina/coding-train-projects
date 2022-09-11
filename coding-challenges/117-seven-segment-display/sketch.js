// 0GFEDCBA Format
const HEX = [0x3F, 0x06, 0x5B, 0x4F, 0x66, 0x6D, 0x7D, 0x07, 0x7F, 0x6F];

let displays = [];

function setup() {
  createCanvas(400, 400);
  
  for (let i = 0; i < 4; ++i) {
    displays.push(new SevenSegmentDisplay(70 + 70 * i, 150));
  }
  
  setInterval(() => setNumber(floor(random(10000))), 2000);
}

function draw() {
  background(42);
  
  for (let display of displays) {
    display.draw();
  }
}

function setNumber(num) {
  let digits = floor(log(num) / log(10) + 1e-10) + 1;
  
  for (let i = displays.length - 1; i >= 0; --i) {
    if (digits > 0) {
      displays[i].hex = HEX[num % 10];
    } else {
      displays[i].hex = 0x0;
    }
    
    num = floor(num / 10);
    --digits;
  }
}
