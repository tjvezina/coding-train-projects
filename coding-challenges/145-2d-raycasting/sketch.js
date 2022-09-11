let boundaries = [];
let rays = [];

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  
  boundaries.push(new Boundary(width*0.03, height*0.41, width*0.86, height*0.27));
  boundaries.push(new Boundary(width*0.22, height*0.18, width*0.54, height*0.09));
  boundaries.push(new Boundary(width*0.15, height*0.62, width*0.28, height*0.02));
  boundaries.push(new Boundary(width*0.38, height*0.48, width*0.45, height*0.10));
  boundaries.push(new Boundary(width*0.52, height*0.78, width*0.78, height*0.74));
  boundaries.push(new Boundary(width*0.52, height*0.78, width*0.68, height*0.92));
  boundaries.push(new Boundary(width*0.68, height*0.92, width*0.78, height*0.74));
  
  for (let a = 0; a < TWO_PI; a += TWO_PI/512) {
    rays.push(new Ray(0, 0, cos(a), sin(a)));
  }
}

function draw() {
  background(0);
  
  rays.forEach(ray => {
    ray.p = { x: mouseX, y: mouseY };
    ray.calculateLength(boundaries);
  });
  
  boundaries.forEach(boundary => boundary.draw());
  rays.forEach(ray => ray.draw());
}

