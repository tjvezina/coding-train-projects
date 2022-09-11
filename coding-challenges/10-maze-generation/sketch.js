const COLS = 20;
const ROWS = 20;
const SIZE = 20;

let wallsH = [];
let wallsV = [];

let generator = null;
let interval = null;

let game = null;

function setup() {
  createCanvas(SIZE * COLS, SIZE * ROWS);
  
  for (let c = 0; c < COLS; ++c) {
    let hCol = [];
    let vCol = [];
	  for (let r = 0; r < ROWS; ++r) {
      if (r < ROWS - 1) {
        hCol.push(new Wall(c, r, true));
      }
      if (c < COLS - 1) {
        vCol.push(new Wall(c, r, false));
      }
    }
    wallsH.push(hCol);
    wallsV.push(vCol);
  }
  
  generator = new MazeGenerator();
  generator.begin();
  interval = setInterval(generatorStep, 1);
}

function generatorStep() {
  if (generator.step()) {
    clearInterval(interval);
    interval = null;
    
    generator = null;
    game = new Game();
  }
}

function draw() {
  background(42);
  
  if (generator) {
	  generator.draw();
  }
  if (game) {
    game.draw();
  }
  
  stroke(127);
  for (let y = 0; y < ROWS; ++y) {
    for (let x = 0; x < COLS; ++x) {
      if (x < COLS - 1) {
        wallsV[x][y].draw();
      }
      if (y < ROWS - 1) {
        wallsH[x][y].draw();
      }
    }
  }
}

function keyPressed() {
  if (game) {
    game.keyPressed(keyCode);
  }
}

//****************************************
// GENERATOR

function MazeGenerator() {
  this.isRunning = false;
  this.current = null;
  this.cells = null;
  this.stack = null;
}

MazeGenerator.prototype.begin = function() {
  this.isRunning = true;
  
  for (let wall of wallsH) {
    wall.enabled = true;
  }
  for (let wall of wallsV) {
    wall.enabled = true;
  }

  this.current = createVector(0, 0); // Select a random start on the left
  this.stack = [this.current];
  
  this.cells = [];
  for (let x = 0; x < COLS; ++x) {
    let col = [];
    for (let y = 0; y < ROWS; ++y) {
      col.push(false);
    }
    this.cells.push(col);
  }
  
  this.cells[this.current.x][this.current.y] = true;
}

MazeGenerator.prototype.step = function() {
  if (this.isDone()) {
    this.isRunning = false;
    return true;
  }
  
  let neighbors = this.getValidNeighbors();
  
  if (neighbors.list.length) {
    let next = random(neighbors.list);
    this.stack.push(next.cell);
    this.current = next.cell;
    this.cells[next.cell.x][next.cell.y] = true;
    next.wall.enabled = false;
  } else {
    this.stack.splice(this.stack.length - 1, 1);
    this.current = this.stack[this.stack.length - 1];
  }
}

MazeGenerator.prototype.getValidNeighbors = function() {
  let neighbors = { list: [] };
  let c = this.current;
  this.validateNeighbor(neighbors, c.x - 1, c.y, wallsV, c.x - 1, c.y    );
  this.validateNeighbor(neighbors, c.x + 1, c.y, wallsV, c.x    , c.y    );
  this.validateNeighbor(neighbors, c.x, c.y - 1, wallsH, c.x    , c.y - 1);
  this.validateNeighbor(neighbors, c.x, c.y + 1, wallsH, c.x    , c.y    );
  return neighbors;
}

MazeGenerator.prototype.validateNeighbor = function(neighbors, x, y, walls, wallX, wallY) {
  if (x >= 0 && x < COLS && y >= 0 && y < ROWS && !this.cells[x][y]) {
    neighbors.list.push({
      cell: createVector(x, y),
      wall: walls[wallX][wallY]
    });
  }
}

MazeGenerator.prototype.isDone = function() {
  for (let x = 0; x < COLS; ++x) {
    for (let y = 0; y < ROWS; ++y) {
      if (!this.cells[x][y]) {
        return false;
      }
    }
  }
  
  return true;
}

MazeGenerator.prototype.draw = function() {
  if (this.isRunning) {
    noStroke();
    fill(63, 0, 63);
    for (let x = 0; x < COLS; ++x) {
      for (let y = 0; y < ROWS; ++y) {
        if (this.cells[x][y]) {
          rect(x * SIZE, y * SIZE, SIZE, SIZE);
        }
      }
    }
    
    fill(0, 127, 0);
    rect(this.current.x * SIZE, this.current.y * SIZE, SIZE, SIZE);
  }
}

//****************************************
// GAME

function Game() {
  this.entrance = createVector(0, 0);
  this.exit = createVector(COLS - 1, ROWS - 1);
  this.player = this.entrance.copy();
}

Game.prototype.keyPressed = function(keyCode) {
  let cell = this.player.copy();
  let wall = null;
  switch (keyCode) {
    case LEFT_ARROW:
      if (cell.x == 0) return;
      wall = wallsV[cell.x - 1][cell.y];
      --cell.x;
      break;
    case RIGHT_ARROW:
      if (cell.x == COLS - 1) return;
      wall = wallsV[cell.x][cell.y];
      ++cell.x;
      break;
    case UP_ARROW:
      if (cell.y == 0) return;
      wall = wallsH[cell.x][cell.y - 1];
      --cell.y;
      break;
    case DOWN_ARROW:
      if (cell.y == ROWS - 1) return;
      wall = wallsH[cell.x][cell.y];
      ++cell.y;
      break;
  }
  
  if (!wall.enabled) {
    this.player = cell.copy();
  }
}

Game.prototype.draw = function() {
  noStroke();
  
  fill(127, 63, 0);
  rect(this.entrance.x * SIZE, this.entrance.y * SIZE, SIZE, SIZE);
  
  fill(0, 127, 63);
  rect(this.exit.x * SIZE, this.exit.y * SIZE, SIZE, SIZE);
  
  fill(200, 200, 20);
  ellipse((this.player.x + 0.5) * SIZE, (this.player.y + 0.5) * SIZE, SIZE * 0.8);
}

//****************************************
// WALLS

function Wall(x, y, isHorizontal) {
  this.x = x;
  this.y = y;
  this.isHorizontal = isHorizontal;
  this.enabled = true;
}

Wall.prototype.draw = function() {
  if (this.enabled) {
    if (this.isHorizontal) {
      line(this.x * SIZE, (this.y + 1) * SIZE, (this.x + 1) * SIZE, (this.y + 1) * SIZE);
    } else {
      line((this.x + 1) * SIZE, this.y * SIZE, (this.x + 1) * SIZE, (this.y + 1) * SIZE);
    }
  }
}
