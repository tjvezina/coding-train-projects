let zoom = 1;

let sun;

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {  
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  sun = new Body(24, 0, null, loadImage("./assets/sun.jpg"), color(255));
  m = new Body(5, 60, sun, loadImage("./assets/mercury.jpg"));
  v = new Body(8, 120, sun, loadImage("./assets/venus.jpg"));
  e = new Body(9, 190, sun, loadImage("./assets/earth.jpg"));
  new Body(2, 25, e, loadImage("./assets/moon.jpg"));
  r = new Body(7, 260, sun, loadImage("./assets/mars.jpg"));
  new Body(3, 22, r, loadImage("./assets/phobos.jpg"));
  new Body(2, 30, r, loadImage("./assets/deimos.jpg"));
}

function draw() {
  background(0);
  
  noStroke();
  // ambientMaterial(255);
  // ambientLight(42);
  
  orbitControl(1, 1, 0);
  rotateX(PI/2);
  scale(1 / zoom);

  sun.update();
  sun.draw();
}

function mouseWheel(event) {
  zoom = constrain(zoom + event.delta * 0.0005, 0.05, 1);
}

//****************************************
// BODY

function Body(radius, distance, parent, tex, emission) {
  this.radius = radius;
  this.distance = distance;
  this.orbitLength = distance * 2 * PI;
  this.angle = random(2 * PI);
  this.tex = tex;
  this.emission = emission;
  this.children = [];
  this.parent = parent;
  if (parent) {
    parent.children.push(this);
  }
}

Body.prototype.update = function() {
  if (this.orbitLength > 0) {
    let speed = pow((width - this.distance) / (width), 0.5);
    this.angle += (speed / this.orbitLength) * (2 * PI);
  }
  for (let body of this.children) {
    body.update();
  }
}

Body.prototype.draw = function() {
  push();
  {
    push();
    {
      strokeWeight(0.5);
      stroke(42);
      noFill();
      ellipse(0, 0, this.distance * 2);
    }
    pop();
    
    if (this.emission) {
      fill(this.emission);
      scale(100);
      pointLight(this.emission, 0, 0, 0);
      scale(0.01);
    }
    
    rotate(-this.angle);
    translate(this.distance, 0);

    push();
    {
      if (this.emission) {
        ambientLight(this.emission);
      }
      ambientMaterial(255);
      texture(this.tex);
      sphere(this.radius);
    }
    pop();

    for (let body of this.children) {
      body.draw();
    }
  }
  pop();
}
