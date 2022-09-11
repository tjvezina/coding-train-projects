function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
}

function draw() {
  background(42);
  
  translate(width/2, height/2);
  scale(min(width, height)/3);
  scale(1, -1);
  
  fill(200, 0, 0, 15);
  strokeWeight(0.005);
  
  stroke(60);
  line(-1, 0, 1, 0);
  line(0, -1, 0, 1);
  
  stroke(255);
  beginShape();
  const size = 0.06 + 0.005 * (sin(millis()/1000*4));
  for (let a = -PI; a < PI; a += TWO_PI/256) {
    const x = (16*pow(sin(a), 3)) * size;
    const y = (13*cos(a) - 5*cos(2*a) - 2*cos(3*a) - cos(4*a)) * size;
    vertex(x, y);
  }
  endShape(CLOSE);
}
