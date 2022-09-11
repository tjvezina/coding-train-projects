let bubble1;
let bubble2;

function setup() {
  createCanvas(400, 400);
  bubble1 = new Bubble(12, 350, 10);
  bubble2 = new Bubble(24, 200, 300);
}

function draw() {
  background(0);
  
  bubble1.move();
  bubble1.show();
  
  bubble2.move();
  bubble2.show();
}

class Bubble {
  constructor(r, x, y) {
    this.r = r;
    this.x = x;
    this.y = y;
  }
  
  move() {
    this.x = min(width - this.r, max(this.r, this.x + random(-5, 5)));
    this.y = min(height - this.r, max(this.r, this.y + random(-5, 5)));
  }
  
  show() {
    stroke(255);
    strokeWeight(4);
    noFill();
    ellipse(this.x, this.y, this.r * 2);
  }
}