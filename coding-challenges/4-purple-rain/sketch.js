let colPurple;
let colWhite;

let drops = [];

function setup() {
  createCanvas(720, 480);
  
  colPurple = color(138, 43, 226);
  colWhite = color(230, 230, 250);
  
  for (let i = 0; i < 500; ++i) {
    drops.push(new Drop());
  }
}

function draw() {
  background(colWhite);
  
  for (let drop of drops) {
    drop.update();
    drop.draw();
  }
}

function Drop() {
  this.x = random(width);
  this.y = random(height);
  this.speed = random(6, 20);
}

Drop.prototype.update = function() {
  this.y += this.speed;
  if (this.y > height) {
    this.y = -this.speed;
    this.x = random(width);
  }
}

Drop.prototype.draw = function() {
  stroke(colPurple);
  strokeWeight(this.speed / 8);
  line(this.x, this.y, this.x, this.y + this.speed);
}
