let blob;

function setup() {
  createCanvas(400, 400);
  
  blob = new Blob();
}

function draw() {
  background(0);
  
  blob.draw();
}

function Blob() {
  
}

// Blob

const RAD = 100;

Blob.prototype.draw = function() {
  push();
  translate(width/2, height/2);
  beginShape();
  for (let a = 0; a < TWO_PI; a += PI / 128) {
    let offset = sin(20 * (a + frameCount / 100)) * 5;
    let r = RAD + offset;
    vertex(r * cos(a), r * sin(a));
  }
  endShape(CLOSE);
  pop();
}
