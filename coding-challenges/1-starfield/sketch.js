let stars = [];
let depth = 400;

function windowResized() {
  resizeCanvas(windowWidth, windowHeight - 4);
}

function setup() {
  createCanvas(windowWidth, windowHeight - 4);
  
  let count = 500 * pow((windowWidth / 400), 2);
  for (let i = 0; i < count; ++i) {
    let x = random(-width / 2, width / 2);
    let y = random(-height / 2, height / 2);
    let z = random(depth);
    stars.push(new Star(createVector(x, y, z)));
  }
}

function draw() {
  background(0);
  translate(width/2, height/2);
  
  for (let i = 0; i < stars.length; ++i) {
    stars[i].draw();
  }
  
  fill(127);
  textSize(8);
  noStroke();
  text(round(frameRate()), -width/2 + 4, height/2 - 28);
}

function Star(pos) {
  this.pos = pos;
  this.prevPos = createVector(pos.x, pos.y, pos.z);
}

Star.prototype.draw = function() {
  this.pos.z -= 5;
  if (this.pos.z < 0) {
    this.pos.z = depth;
    this.pos.x = random(-width / 2, width / 2);
    this.pos.y = random(-height / 2, height / 2);
    this.prevPos = createVector(this.pos.x, this.pos.y, this.pos.z);
  }
  
  let sx = map(this.pos.x / this.pos.z, 0, 1, 0, width/2);
  let sy = map(this.pos.y / this.pos.z, 0, 1, 0, height/2);
  let px = map(this.prevPos.x / this.prevPos.z, 0, 1, 0, width/2);
  let py = map(this.prevPos.y / this.prevPos.z, 0, 1, 0, height/2);
  
  stroke(map(this.pos.z, 0, depth, 255, 0));
  strokeWeight(map(this.pos.z, 0, depth, 2, 0));
  line(px, py, sx, sy);
  
  this.prevPos.x = this.pos.x;
  this.prevPos.y = this.pos.y;
  this.prevPos.z = this.pos.z;
}