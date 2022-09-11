let ship;
let bullets = [];
let alienManager;
let canShoot = true;

function setup() {
  createCanvas(224 * 2, 256 * 2);
  
  ship = new Ship();
  alienManager = new AlienManager();
  setInterval(() => alienManager.update(), 500);
}

function draw() {
  background(0);
  
  if (keyIsDown(LEFT_ARROW)) {
    ship.move(-1);
  }
  if (keyIsDown(RIGHT_ARROW)) {
    ship.move(1);
  }
  if (keyIsDown(32) && canShoot) {
    canShoot = false;
    bullets.push(new Bullet(ship.x));
    setTimeout(() => canShoot = true, 500);
  }
  
  collisionCheck();
  
  for (let i = bullets.length - 1; i >= 0; --i) {
    if (!bullets[i].update()) {
      bullets.splice(i, 1);
    } else {
      bullets[i].draw();
    }
  }
  
  ship.draw();
  alienManager.draw();
}

function collisionCheck() {
  for (let i = bullets.length - 1; i >= 0; --i) {
    for (let alien of alienManager.aliens) {
      if (alien.isHit(bullets[i])) {
        alienManager.kill(alien);
        bullets.splice(i, 1);
        break;
      }
    }
  }
}

//****************************************
// SHIP

function Ship() {
  this.x = width/2;
  this.y = height - 10;
}

Ship.prototype.move = function(dir) {
  this.x += 2 * dir;
}

Ship.prototype.draw = function() {
  noStroke();
  fill(255);
  rect(this.x - 13, this.y - 8, 26, 8);
  rect(this.x - 11, this.y - 10, 22, 10);
  rect(this.x - 3, this.y - 16, 6, 16);
  rect(this.x - 1, this.y - 18, 2, 18);
}

//****************************************
// BULLET

function Bullet(x) {
  this.x = x;
  this.y = height - 20;
}

Bullet.prototype.update = function() {
  this.y -= 4;
  return this.y > 0;
}

Bullet.prototype.draw = function() {
  strokeWeight(2);
  stroke(255);
  line(this.x, this.y, this.x, this.y + 5);
}

//****************************************
// ALIEN MANAGER

const ALIEN_ROWS = 5;
const ALIEN_COLS = 11;
const ALIEN_SPACING = 36;
const ALIEN_PAD = 18;
const ALIEN_WIDTH = 20;
const ALIEN_HEIGHT = 16;

function AlienManager() {
  this.dropping = false;
  this.aliens = [];
  for (let y = 0; y < ALIEN_ROWS; ++y) {
    for (let x = 0; x < ALIEN_COLS; ++x) {
      this.aliens.push(new Alien(ALIEN_PAD + ALIEN_WIDTH / 2 + ALIEN_SPACING * x, 50 + ALIEN_SPACING * y));
    }
  }
  
  this.update = function() {
    if (this.dropping) {
      for (let alien of this.aliens) {
        alien.drop();
      }
      this.dropping = false;
    } else {
      let collision = false;
      for (let alien of this.aliens) {
        collision |= alien.move();
      }

      if (collision) {
        this.dropping = true;
        for (let alien of this.aliens) {
          alien.xDir *= -1;
        }
      }
    }
  }
  
  this.draw = function() {
    for (let alien of this.aliens) {
      alien.draw();
    }
  }
  
  this.kill = function(alien) {
    for (let i = 0; i < this.aliens.length; ++i) {
      if (this.aliens[i] === alien) {
        this.aliens.splice(i, 1);
        break;
      }
    }
  }
}

//****************************************
// ALIEN

function Alien(x, y) {
  this.x = x;
  this.y = y;
  this.xDir = 1;
}

Alien.prototype.isHit = function(bullet) {
  return (bullet.x > this.x - ALIEN_WIDTH / 2 && bullet.x < this.x + ALIEN_WIDTH / 2) &&
    		 (bullet.y > this.y - ALIEN_HEIGHT / 2 && bullet.y < this.y + ALIEN_HEIGHT / 2);
}

Alien.prototype.move = function() {
  this.x += this.xDir * 5;
  return (this.x - ALIEN_PAD <= ALIEN_WIDTH / 2 || this.x + ALIEN_PAD >= width - ALIEN_WIDTH / 2);
}

Alien.prototype.drop = function() {
  this.y += 5;
}

Alien.prototype.draw = function() {
  push();
  noStroke();
  fill(255);
  rectMode(CENTER);
  rect(this.x, this.y, ALIEN_WIDTH, ALIEN_HEIGHT);
  pop();
}