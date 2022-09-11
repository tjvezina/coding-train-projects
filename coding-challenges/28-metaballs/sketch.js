let blobs = [];

function setup() {
  createCanvas(300, 200);
  colorMode(HSB, 100);
  
  for (let i = 0; i < 5; ++i) {
    blobs.push(new Blob());
  }
}

function draw() {
  background(42);
  
  loadPixels();
  for (let y = 0; y < height; ++y) {
    for (let x = 0; x < width; ++x) {
      let dist = 0;
      for (let i = 0; i < blobs.length; ++i) {
        dist += 600 / createVector(x, y).dist(blobs[i].pos);
      }
      
      let col = color(dist, 100, 100);
      
      let index = (x + (y * width)) * 4;
      pixels[index + 0] = red(col);
      pixels[index + 1] = green(col);
      pixels[index + 2] = blue(col);
    }
  }
  updatePixels();
  
  strokeWeight(0);
  blobs.forEach((b) => {
    b.update();
    // circle(b.pos.x, b.pos.y, b.radius);
  });
}