const GRID_SIZE = 201;

const COLORS = [
  { r: 28,  g: 28,  b: 28  },
  { r: 140, g: 108, b: 38  },
  { r: 194, g: 155, b: 14  },
  { r: 255, g: 222, b: 0   },
  { r: 255, g: 239, b: 135 }
];

let buffer1 = [];
let buffer2 = [];

const fullCells = [];

let img;

function windowResized() {
  const size = min(windowWidth, windowHeight);
  resizeCanvas(size, size);
}

function setup() {
  const size = min(windowWidth, windowHeight);
  createCanvas(size, size);
  pixelDensity(1);
  noSmooth();
  
  img = createImage(GRID_SIZE, GRID_SIZE);
  
  for (let y = 0; y < GRID_SIZE; y++) {
    buffer1.push(new Array(GRID_SIZE).fill(0));
    buffer2.push(new Array(GRID_SIZE).fill(0));
  }
  
  addSand(floor(GRID_SIZE/2), floor(GRID_SIZE/2), pow(2, 16));
  
  updateImage();
}

function draw() {
  const start = millis();
  while (millis() - start < 1000/60) {
    topple();
  }
  
  image(img, 0, 0, width, height);
}

function addSand(x, y, amount) {
  buffer1[y][x] += amount;
  if (buffer1[y][x] > 3 && buffer1[y][x] - amount <= 3) {
    fullCells.push({ x, y });
  }
}

function topple() {
  const prevFullCells = [...fullCells];
  fullCells.splice(0);
  
  img.loadPixels();
  for (let cell of prevFullCells) {
    const { x, y } = cell;
    
    buffer1[cell.y][cell.x] -= 4;
    if (buffer1[cell.y][cell.x] > 3) {
      fullCells.push(cell);
    }
    updatePixel(x, y);
    
    if (cell.x > 0) {
      if (++buffer1[cell.y][cell.x-1] === 4) {
        fullCells.push({ x: x-1, y });
      }
      updatePixel(x-1, y);
    }
    if (cell.x < GRID_SIZE-1) {
      if (++buffer1[cell.y][cell.x+1] === 4) {
        fullCells.push({ x: x+1, y });
      }
      updatePixel(x+1, y);
    }
    if (cell.y > 0) {
      if (++buffer1[cell.y-1][cell.x] === 4) {
        fullCells.push({ x, y: y-1 });
      }
      updatePixel(x, y-1);
    }
    if (cell.y < GRID_SIZE-1) {
      if (++buffer1[cell.y+1][cell.x] === 4) {
        fullCells.push({ x, y: y+1 });
      }
      updatePixel(x, y+1);
    }
  }
  img.updatePixels();
}

function updateImage() {
  img.loadPixels();
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      updatePixel(x, y);
    }
  }
  img.updatePixels();
}

function updatePixel(x, y) {
  const i = (x + y*GRID_SIZE) * 4;
  const col = COLORS[min(4, buffer1[y][x])];
  img.pixels[i+0] = col.r;
  img.pixels[i+1] = col.g;
  img.pixels[i+2] = col.b;
  img.pixels[i+3] = 255;
}
