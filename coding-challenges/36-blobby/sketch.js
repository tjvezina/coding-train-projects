let blob;

function setup() {
  createCanvas(400, 400);
  
  blob = new Blobby();
}

function draw() {
  background(0);
  
  blob.draw();
}

class Blobby {
  draw() {
    push();
    translate(width/2, height/2);
    beginShape();
    for (let a = 0; a < TWO_PI; a += PI / 128) {
      let offset = sin(20 * (a + frameCount / 100)) * 5;
      let r = 100 + offset;
      vertex(r * cos(a), r * sin(a));
    }
    endShape(CLOSE);
    pop();
  }
}
