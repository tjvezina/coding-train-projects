const GRID_SIZE = 16;
let cellSize;
let speed;

let snake;
let food;

let lose = false;

function setup() {
  createCanvas(400, 400);
  reset();
}

function mousePressed() {
  if (lose) {
    reset();
  }
}

function reset() {
  lose = false;
  snake = new Snake();
  food = generateFood();
  
  speed = 4;
  frameRate(speed);
}

function draw() {
  background(42);
  
  push();
  strokeWeight(1);
  stroke(63);
  cellSize = width / GRID_SIZE;
  for (let i = 1; i < GRID_SIZE; ++i) {
    line(cellSize * i, 0, cellSize * i, height);
    line(0, cellSize * i, width, cellSize * i);
  }
  pop();
  
  if (lose) {
    textAlign(CENTER);
    fill(255, 0, 0);
    textSize(60);
    text("GAME OVER", width/2, height/2 + 20);
    return;
  }
  
	if (snake.update()) {
    food = generateFood();
    speed += 0.05;
    frameRate(speed);
  }
  snake.draw();
  
  fill(220, 50, 0);
  rect(food.x * cellSize, food.y * cellSize, cellSize, cellSize);
}

function generateFood() {
  while (true) {
    let newFood = createVector(floor(random(GRID_SIZE)), floor(random(GRID_SIZE)));
    let invalid = false;
    for (let part of snake.body) {
      if (newFood.x == part.x && newFood.y == part.y) {
        invalid = true;
        break;
      }
    }
    if (!invalid) {
      return newFood;
    }
  }
}

function keyPressed() {
  if (lose) {
    reset();
    return;
  }
  
  switch (keyCode) {
    case UP_ARROW: if (snake.dir != "D") snake.dir = "U"; break;
    case DOWN_ARROW: if (snake.dir != "U") snake.dir = "D"; break;
    case LEFT_ARROW: if (snake.dir != "R") snake.dir = "L"; break;
    case RIGHT_ARROW: if (snake.dir != "L") snake.dir = "R"; break;
  }
}

function Snake() {
  this.head = createVector(0, 0);
  this.body = [createVector(this.head.x, this.head.y)];
  this.dir = "R";
  this.len = 1;
}

Snake.prototype.update = function() {
  switch (this.dir) {
    case "U": --this.head.y; break;
    case "D": ++this.head.y; break;
    case "L": --this.head.x; break;
    case "R": ++this.head.x; break;
  }
  this.head.x = constrain(this.head.x, 0, GRID_SIZE - 1);
  this.head.y = constrain(this.head.y, 0, GRID_SIZE - 1);
  
  for (let part of this.body) {
    if (this.head.x == part.x && this.head.y == part.y) {
      lose = true;
      return;
    }
  }
  
  this.body.push(createVector(this.head.x, this.head.y));
  
  if (this.head.x == food.x && this.head.y == food.y) {
    ++this.len;
    return true;
  }
  
  while (this.body.length > this.len) {
    this.body.splice(0, 1);
  }
  
  return false;
}

Snake.prototype.draw = function() {
  fill(50, 140, 80);
  noStroke();
  let prevPart = this.body[this.body.length - 1];
  ellipse((prevPart.x + 0.5) * cellSize, (prevPart.y + 0.5) * cellSize, cellSize, cellSize);
  
  push();
  stroke(50, 140, 80);
  for (let i = this.body.length - 2; i >= 0; --i) {
    let nextPart = this.body[i];
    strokeWeight(map(i, this.body.length - 1, 0, cellSize, cellSize / 2));
    line((prevPart.x + 0.5) * cellSize, (prevPart.y + 0.5) * cellSize,
         (nextPart.x + 0.5) * cellSize, (nextPart.y + 0.5) * cellSize);
    prevPart = nextPart;
  }
  pop();
}
