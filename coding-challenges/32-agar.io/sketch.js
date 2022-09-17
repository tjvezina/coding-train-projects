// PROJECT DIDN'T SAVE DESPITE CLICKING SAVE, LOST A BUNCH OF PROGRESS :(

const WORLD_SIZE = 1000;
const TILE_SIZE = 100;

let playerBall;
let balls = [];

function setup() {
  createCanvas(600, 600);
  playerBall = new PlayerBall(WORLD_SIZE / 2, WORLD_SIZE / 2, 64);
  
  for (let i = 0; i < 10; ++i) {
    balls[i] = new Ball(random(width), random(height), 16);
  }
}

function draw() {
  drawWorld();
  
  playerBall.update();
  playerBall.draw();
  
  balls.forEach(b => b.draw());
}

function drawWorld() {
  translate(width/2 - playerBall.pos.x, height/2 - playerBall.pos.y);
  noStroke();
  
  // Outer walls
  background(42);
  
  // Floor
  fill(96);
  rect(0, 0, WORLD_SIZE, WORLD_SIZE);
  
  // Tiles
  stroke(64);
  for (let x = 0; x <= WORLD_SIZE; x += TILE_SIZE) {
    line(x, 0, x, WORLD_SIZE);
  }
  for (let y = 0; y <= WORLD_SIZE; y += TILE_SIZE) {
    line(0, y, WORLD_SIZE, y);
  }
}