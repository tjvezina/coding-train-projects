const DA = 1.0; // Diffusion rate A
const DB = 0.5; // Diffusion rate B
const F = 0.055; // Feed rate
const K = 0.062; // Kill rate
const DT = 1/1; // Time delta
const WC = -1.0; // Center weight
const WA = 0.2; // Adjascent weight
const WD = 0.05; // Diagonal weight

let colA;
let colB;

let grid = [];
let next = [];

function setup() {
  createCanvas(200, 200);
  pixelDensity(1);
  
  colA = createVector(232, 211, 150);
  colB = createVector(39, 158, 232).mult(2.5);
  
  for (let x = 0; x < width; ++x) {
    grid[x] = [];
    next[x] = [];
    for (let y = 0; y < height; ++y) {
      grid[x][y] = { a: 1, b: 0 };
      next[x][y] = { a: 1, b: 0 };
    }
  }
  
	for (let y = (height/2) - 10; y <= (height/2) + 10; ++y) {
  	for (let x = (width/2) - 10; x <= (width/2) + 10; ++x) {
      grid[x][y].b = 1;
    }
  }

}

function draw() {
  update();
  
  background(42);

  loadPixels();
  for (let y = 0; y < height; ++y) {
    for (let x = 0; x < width; ++x) {
      let i = (x + y * width) * 4;
      let c = p5.Vector.mult(colA, grid[x][y].a).add(p5.Vector.mult(colB, grid[x][y].b));
      pixels[i + 0] = c.x;
      pixels[i + 1] = c.y;
      pixels[i + 2] = c.z;
      pixels[i + 3] = 255;
    }
  }
  updatePixels();
}

function mousePressed() {
  if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) {
		for (let y = mouseY - 10; y <= mouseY + 10; ++y) {
      for (let x = mouseX - 10; x <= mouseX + 10; ++x) {
        let p = createVector(x, y);
        if (p.dist(createVector(mouseX, mouseY)) < 10) {
          let p = validateCoords(createVector(x, y));
          grid[p.x][p.y].a = 0;
          grid[p.x][p.y].b = 1;
        }
      }
    }
  }
}

function update() {
  for (let y = 0; y < height; ++y) {
    for (let x = 0; x < width; ++x) {
      let a = grid[x][y].a;
      let b = grid[x][y].b;
      let l = laplace(x, y);
      let na = a + (DA * l.a - a * b * b + F * (1 - a)) * DT;
      let nb = b + (DB * l.b + a * b * b - (K + F) * b) * DT;
      next[x][y].a = constrain(na, 0, 1);
      next[x][y].b = constrain(nb, 0, 1);
    }
  }
  
  let hold = grid;
  grid = next;
  next = hold;
}

function laplace(x, y) {
  let sum = { a: 0, b: 0 };
  sumCell(sum, x    , y    , WC);
  sumCell(sum, x - 1, y    , WA);
  sumCell(sum, x + 1, y    , WA);
  sumCell(sum, x    , y - 1, WA);
  sumCell(sum, x    , y + 1, WA);
  sumCell(sum, x - 1, y - 1, WD);
  sumCell(sum, x + 1, y - 1, WD);
  sumCell(sum, x - 1, y + 1, WD);
  sumCell(sum, x + 1, y + 1, WD);
  return sum;
}

function sumCell(sum, x, y, w) {
  let p = validateCoords(createVector(x, y));
  sum.a += grid[p.x][p.y].a * w;
  sum.b += grid[p.x][p.y].b * w;
}

function validateCoords(p) {
  if (p.x < 0) p.x += width;
  if (p.x >= width) p.x -= width;
  if (p.y < 0) p.y += height;
  if (p.y >= height) p.y -= height;
  return p;
}
