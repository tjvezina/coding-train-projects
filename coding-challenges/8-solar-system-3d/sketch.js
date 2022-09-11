let zoom = 1;
let drag;
let prevMouse;

let sun;

function windowResized() {
  resizeCanvas(windowWidth, windowHeight - 4);
}

function setup() {
  drag = createVector(0, 0);
  
  createCanvas(windowWidth, windowHeight - 4, WEBGL);
  
  sun = new Body(24, 0, null, loadImage("Textures/sun.jpg"), color(255));
  m = new Body(5, 60, sun, loadImage("Textures/mercury.jpg"));
  v = new Body(8, 120, sun, loadImage("Textures/venus.jpg"));
  e = new Body(9, 190, sun, loadImage("Textures/earth.jpg"));
  new Body(2, 25, e, loadImage("Textures/moon.jpg"));
  r = new Body(7, 260, sun, loadImage("Textures/mars.jpg"));
  new Body(3, 22, r, loadImage("Textures/phobos.jpg"));
  new Body(2, 30, r, loadImage("Textures/deimos.jpg"));
}

function draw() {
  background(0);
  
  noStroke();
  ambientMaterial(255);
  ambientLight(42);
  
  orbitControl();
  // translate(drag.x, drag.y);
  rotateX(PI/2);
  // scale(1 / zoom);

  sun.update();
  sun.draw();
}

function mousePressed() {
  prevMouse = createVector(mouseX, mouseY);
}

// function mouseDragged() {
//   let mousePos = createVector(mouseX, mouseY);
//   drag.add(mousePos.copy().sub(prevMouse));
//   prevMouse = mousePos.copy();
  
//   return false;
// }

function mouseWheel(event) {
  zoom += event.delta * 0.0005;
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
      stroke(20);
      noFill();
      ellipse(0, 0, this.distance * 2);
    }
    pop();
    
    if (this.emission) {
      fill(this.emission);
      scale(100);
      pointLight(this.emission, drag.x, drag.y, 0);
      scale(0.01);
    }
    
    rotate(-this.angle);
    translate(this.distance, 0);
    if (this.emission) {
      ambientLight(this.emission);
    }
    ambientMaterial(255);
    texture(this.tex);
    sphere(this.radius);
    for (let body of this.children) {
      body.draw();
    }
  }
  pop();
}
