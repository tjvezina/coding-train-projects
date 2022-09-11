// World size
const WIDTH = 500;
let HEIGHT = 1;

// Game speed
const FPS = 60;
const ACCEL = 2;
const INITIAL_SPEED = 200;
let speed = INITIAL_SPEED;
let distance = 0;

// Game settings
const OBSTACLE_INTERVAL = 0.75; // Percentage of width

// Graphics
const DETAIL_INTERVAL = 50;

// Actors
let player;
let obstacles = [];

let score = 0;
let lastObstacle = -1;
let resetDelay = 0;

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  HEIGHT = height * (WIDTH/width);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  frameRate(FPS);
  ellipseMode(RADIUS);
  
  HEIGHT = height * (WIDTH/width);
  
  player = new Player();
  
  reset();
}

function reset() {
  if (resetDelay > 0) {
    return;
  }
  
  player = new Player();
  obstacles.length = 0;
  lastObstacle = -1;
  speed = INITIAL_SPEED;
  distance = 0;
  score = 0;
}

function draw() {
  /* UPDATE */
  
  resetDelay = max(0, resetDelay - 1/FPS);
  
  speed += ACCEL * 1/FPS;
  distance += speed * 1/FPS;
  
  while (lastObstacle < distance / (WIDTH*OBSTACLE_INTERVAL)) {
    lastObstacle++;
    const minX = lastObstacle * (WIDTH*OBSTACLE_INTERVAL) + WIDTH;
    const maxX = minX + (WIDTH*OBSTACLE_INTERVAL) * 0.75;
    obstacles.push(new Obstacle(random(minX, maxX)));
  }
  
  obstacles = obstacles.filter(x => !x.isGone());
  
  if (!player.isDead) {
    obstacles.forEach(obstacle => {
      if (!obstacle.wasJumped && (obstacle.x + obstacle.w) < (distance + player.x - player.r)) {
        obstacle.wasJumped = true;
        ++score;
      }
      if (collideRectCircle(obstacle.x-distance, 0, obstacle.w, obstacle.h, player.x, player.y+player.r, player.r*2)) {
        player.kill();
        resetDelay = 1;
      }
    });
  }
  
  player.update();
  
  /* DRAW */
  
  scale(width/WIDTH);
  translate(0, HEIGHT/2);
  scale(1, -1);
  
  background(12);
  noStroke();
  fill(32);
  rect(0, -HEIGHT/2, WIDTH, HEIGHT/2);
  
  // Horizon
  strokeWeight(1);
  stroke(200);
  line(0, 0, WIDTH, 0);
  
  // Ground details
  strokeWeight(2);
  for (let x = floor(distance/DETAIL_INTERVAL)*DETAIL_INTERVAL; x < distance+WIDTH; x += DETAIL_INTERVAL) {
    if (noise(x) > 0.5) point(x - distance, -5);
    if (noise(x+10) > 0.5) point((x+10) - distance, -8);
    if (noise(x+20) > 0.5) point((x+25) - distance, -6);
    if (noise(x+30) > 0.5) point((x+38) - distance, -10);
  }
  
  obstacles.forEach(obstacle => obstacle.draw());
  
  player.draw();
  
  if (score > 0 || player.isDead) {
    translate(WIDTH/2, HEIGHT/4);
    scale(1, -1);
    
    noStroke();
    fill(player.isDead ? 200 : 32);
    textAlign(CENTER);
    textStyle(BOLD);
    textSize(32);
    text(score, 0, 0);
  }
}

function mouseClicked() {
  if (player.isDead) {
    reset();
  } else if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) {
    player.jump();
  }
}

function keyPressed() {
  if (player.isDead) {
    reset();
  } else if (key === ' ') {
    player.jump();
  }
}