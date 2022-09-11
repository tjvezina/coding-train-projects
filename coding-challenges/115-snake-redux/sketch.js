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
    text('GAME OVER', width/2, height/2 + 20);
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
    case UP_ARROW: snake.move('U'); break;
    case DOWN_ARROW: snake.move('D'); break;
    case LEFT_ARROW: snake.move('L'); break;
    case RIGHT_ARROW: snake.move('R'); break;
  }
}
