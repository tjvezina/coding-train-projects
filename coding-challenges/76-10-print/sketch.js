const SIZE = 400
const GRID_SIZE = 20
const CELL_SIZE = SIZE / GRID_SIZE

let x = 0
let y = 0

function setup() {
  createCanvas(SIZE, SIZE)
  background(12, 12, 24)
  
  stroke(200, 140, 60)
  strokeWeight(CELL_SIZE/3)
}

function draw() {  
  if (random(1) < 0.5) {
    drawForwardSlash(x * CELL_SIZE, y * CELL_SIZE)
  } else {
    drawBackwardSlash(x * CELL_SIZE, y * CELL_SIZE)
  }
  
  x++
  if (x === GRID_SIZE) {
    x = 0
    y++
    if (y === GRID_SIZE) {
      y = 0
      noLoop()
    }
  }
}

function drawForwardSlash(x, y) {
  line(x, y, x + CELL_SIZE, y + CELL_SIZE)
}

function drawBackwardSlash(x, y) {
  line(x, y + CELL_SIZE, x + CELL_SIZE, y)
}