let segments = [];

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  
  const radius = min(width, height) * 0.45;
  for (let i = 0; i < 3; i++) {
    const startAngle = TWO_PI/3 * i;
    const endAngle = TWO_PI/3 * (i+1);
    
    const start = createVector(cos(startAngle) * radius, sin(startAngle) * radius);
    const end = createVector(cos(endAngle) * radius, sin(endAngle) * radius);
    
    segments.push(new Segment(start, end));
  }
}

function draw() {
  background(42);
  
  translate(width/2, height/2);
  rotate(PI/2);
  
  segments.forEach(x => x.draw());
}

function mouseClicked() {
  segments = segments.flatMap(x => x.divide());
}
