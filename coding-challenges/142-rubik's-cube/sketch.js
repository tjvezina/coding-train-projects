const SIZE = 3;

const SIDE_COLORS = [
  '#FF2222', '#FFA500', // RIGHT (X+) | LEFT (X-)
  '#FFFFFF', '#FFFF00', // UP    (Y+) | DOWN (Y-)
  '#00FF00', '#00A5FF', // FRONT (Z+) | BACK (Z-)
];

const cubies = [];

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  pixelDensity(1);
  
  for (let z = 0; z < SIZE; z++) {
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        // Skip interior cubes
        if (x > 0 && x < SIZE-1 && y > 0 && y < SIZE-1 && z > 0 && z < SIZE-1) {
          continue;
        }
        cubies.push(new Cubie({ x, y, z }));
      }
    }
  }
}

function draw() {
  background(42);
  
  orbitControl(5, 5, 0);
  scale(min(width, height)/3);
  scale(1, -1, 1);
  
  cubies.forEach(cubie => cubie.draw());
}
