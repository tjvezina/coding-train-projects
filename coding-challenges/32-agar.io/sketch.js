// PROJECT DIDN'T SAVE DESPITE CLICKING SAVE, LOST A BUNCH OF PROGRESS :(

const WORLD_SIZE = 1000;
const TILE_SIZE = 100;

let playerBlob;
let blobs = [];

function setup() {
  createCanvas(600, 600);
  playerBlob = new PlayerBlob(WORLD_SIZE / 2, WORLD_SIZE / 2, 64);
  
  for (let i = 0; i < 10; ++i) {
    blobs[i] = new Blob(random(width), random(height), 16);
  }
}

function draw() {
  drawWorld();
  
  playerBlob.update();
  playerBlob.draw();
  
  blobs.forEach(b => b.draw());
}

function drawWorld() {
  translate(width/2 - playerBlob.pos.x, height/2 - playerBlob.pos.y);
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