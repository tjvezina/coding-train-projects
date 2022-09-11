// Alias some key namespaces in the Matter.js 2D physics library
const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;

const ROWS = 6;
const COLS = 7;
const PEG_Y_START = 0.2;
const PEG_Y_END = 0.9;

const WALL_THICK = 20;
const BIN_THICK = 8;
const BIN_HEIGHT = 32;

let engine;

let ball;
const pegs = [];
const walls = [];

function setup() {
  createCanvas(520, 720);
  
  engine = Engine.create();
  
  // ball = new Ball(width*0.5, width*0.05);
  
  const pegSpace = {
    x: width / COLS / 2,
    y: height * (PEG_Y_END - PEG_Y_START) / ROWS / 2
  }
  
  for (let y = 0; y < ROWS * 2 + 1; y++) {
    let yPos = map(y, 0, ROWS * 2, height * PEG_Y_START, height * PEG_Y_END);
    for (let x = 0; x < COLS * 2 + 1; ++x) {      
      let xPos = map(x, 0, COLS * 2, 0, width)
      if (y % 2 == x % 2) {
        pegs.push(new Peg(xPos, yPos));
      }
    }
  }
  
  // Screen boundaries
  walls.push(new Wall(-WALL_THICK + 1, 0, WALL_THICK, height));
  walls.push(new Wall(width - 1, 0, WALL_THICK, height));
  walls.push(new Wall(0, height - 1, width, WALL_THICK));
  
  for (let i = 0; i < COLS - 1; ++i) {
    const x = (i + 1) * (width / COLS) - (BIN_THICK / 2);
    walls.push(new Wall(x, height - BIN_HEIGHT, BIN_THICK, BIN_HEIGHT));
  }
}

function draw() {  
  background(42);
  
  Engine.update(engine);
  
  if (ball) {
    ball.draw();
  }
  
  walls.forEach(w => w.draw());
  pegs.forEach(p => p.draw());
}

function mouseClicked() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height * PEG_Y_START) {
    if (ball !== undefined) {
      ball.destroy();
    }
    ball = new Ball(mouseX, mouseY);
  }
}