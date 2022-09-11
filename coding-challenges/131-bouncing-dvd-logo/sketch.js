let logo;
let hue = 0;

let pos = { x: 0, y: 0 };
let vel = { x: 3, y: 2.5 };

function preload() {
  logo = loadImage('assets/dvd_logo.png');
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  colorMode(HSB);
  
  randomHue();
}

function randomHue() {
  hue = (hue + random(0.1, 0.9)*360) % 360;
}

function draw() {
  background(0);
  
  pos.x += vel.x;
  pos.y += vel.y;
  
  if (pos.x < 0) {
    pos.x = 0;
    vel.x *= -1;
    randomHue();
  }
  if (pos.x >= width - logo.width) {
    pos.x = width - logo.width - 1;
    vel.x *= -1;
    randomHue();
  }
  if (pos.y < 0) {
    pos.y = 0;
    vel.y *= -1;
    randomHue();
  }
  if (pos.y >= height - logo.height) {
    pos.y = height - logo.height - 1;
    vel.y *= -1;
    randomHue();
  }
  
  tint(hue, 80, 100);  
  image(logo, pos.x, pos.y);
}
