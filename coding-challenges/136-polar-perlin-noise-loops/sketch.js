const COUNT = 32;
const DURATION = 3;
const SIZE = 300;
let time = 0;

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  frameRate(30);
}

function draw() {
  background(42);
  
  time += 1/30;
  
  translate(width/2, height/2);
  
  noFill();
  stroke(255);
  
  const t = time*TWO_PI / DURATION;
  for (let c = 1; c <= COUNT; c++) {
    const s = c / COUNT;
    stroke(255*(s*2/3+1/3));
    beginShape();
    for (let a = 0; a < TWO_PI; a += TWO_PI/256) {
      const n = noise(
        10 + cos(a) + 5*cos(t+s*TWO_PI),
        10 + sin(a) + 5*sin(t+s*TWO_PI),
        s*10
      );
      const r = map(n, 0, 1, SIZE*0.75, SIZE) * (s*2/3+1/3);
      const x = cos(a) * r;
      const y = sin(a) * r;
      vertex(x, y);
    }
    endShape(CLOSE);
  }
}

function keyPressed() {
  if (key === 'S') {
    createLoop({
      duration: DURATION,
      gif: {
        render: false,
        download: true,
        fileName: 'perlin-noise-loop.gif',
      }
    });
  }
}