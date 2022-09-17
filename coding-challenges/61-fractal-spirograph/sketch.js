const SPEED = 0.1;

let rootCircle;
let path = [];

function setup() {
  createCanvas(600, 600);
  strokeJoin(ROUND);
  strokeCap(ROUND);

  rootCircle = new Circle(140);
}

function draw() {
  if (frameCount < 6) {
    return;
  }
  
  background(42);
  translate(width/2, height/2);
  
  path.push(rootCircle.draw());
  rootCircle.update();
  
  stroke(0, 191, 0);
  beginShape();
  path.forEach(p => vertex(p.x, p.y));
  endShape();
}

// Circle

class Circle {
  constructor(radius, n) {
    n = n || 0;
    this.radius = radius;
    this.speed = pow(-4, n-1);
    this.angle = -PI/2;
    this.child = (n == 10 ? undefined : new Circle(radius / 3, ++n));
  }

  update() {
    this.angle += this.speed / frameRate() * SPEED;
    
    if (this.child) {
      this.child.update();
    }
  }

  draw(parentRadius, parentPos) {
    let pos = parentPos || createVector();
    
    if (parentRadius) {
      let dist = parentRadius + this.radius;
      pos.x += dist * cos(this.angle);
      pos.y += dist * sin(this.angle);
    }

    noFill();
    strokeWeight(2);
    stroke(127);
    circle(pos.x, pos.y, this.radius * 2);

    if (this.child) {
      return this.child.draw(this.radius, pos);
    } else {
      return pos;
    }
  }
}