function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0, 0, 30/255*100);
  
  camera(3, -((mouseY || height/2) - height/2)/height*6, 6);
  perspective(PI/3, width/height, 0.1, 1000);
  
  rotateY(-millis()/1000*TWO_PI / 6);
  
  colorMode(HSB);
  
  strokeWeight(6);
  for (let beta = 0; beta < PI; beta += PI/600) {
    const r = 0.8 + 1.6*sin(6*beta)
    const theta = 2*beta
    const phi = 0.6*PI*sin(12*beta)
    const hue = ((beta/PI + millis()/1000/5) * 360) % 360

    strokeWeight(12*abs(r)+2);
    stroke(hue, 80, 80);
    point(r*cos(phi)*cos(theta), r*cos(phi)*sin(theta), r*sin(phi));
  }
}