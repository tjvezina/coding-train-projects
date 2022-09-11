const WORD = 'dots';
const SIZE = 160;

let font;
let vehicles = [];
let mousePos;

function preload() {
  font = loadFont('CODE.otf');
}

function setup() {
  createCanvas(800, 480);
  mousePos = createVector();
  
  let points = font.textToPoints(WORD, 0, 0, SIZE, {
    sampleFactor: 0.1,
    simplifyThreshold: 0
  });
  
  let bounds = font.textBounds(WORD, 0, 0, SIZE);
  for (let i = 0; i < points.length; ++i) {
    points[i].x += (width - bounds.w) / 2;
    points[i].y += (height + bounds.h) / 2;
  }
  
  points.forEach(p => vehicles.push(new Vehicle(p.x, p.y)));
}

function draw() {
  background(42);
  
  mousePos.x = mouseX;
  mousePos.y = mouseY;
  
  vehicles.forEach(v => {
    v.update();
    v.draw();
  });
}

// Vehicle

class Vehicle {
  constructor(x, y) {
    this.pos = createVector(x, y).add(p5.Vector.random2D().setMag(200));
    this.target = createVector(x, y);
    this.vel = createVector();
    this.acc = createVector();
  }
  
  update() {
    this.acc.add(this.attract());
    this.acc.add(this.repel());
    
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.acc.mult(0);
  }
  
  attract() {
    let desired = p5.Vector.sub(this.target, this.pos).mult(0.1);
    desired.setMag(min(desired.mag(), 3));
    this.acc.add(p5.Vector.sub(desired, this.vel));
  }
  
  repel() {
    let desired = p5.Vector.sub(this.pos, mousePos);
    desired.setMag(max(75 - desired.mag(), 0)).mult(0.25);
    this.acc.add(p5.Vector.sub(desired, this.vel));
  }
  
  draw() {
    stroke(255);
    strokeWeight(6);
    point(this.pos.x, this.pos.y);
  }
}
