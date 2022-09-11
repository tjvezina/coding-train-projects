const MAX_DEPTH = 12

function setup() {
  createCanvas(600, 400)

  colorMode(HSB)
  noFill()
}

function draw() {
  background(0, 0, 42/255*100)

  drawCircle(width/2, height/2, height * 0.75)
}

function drawCircle(x, y, d, depth = 0) {
  if (depth >= MAX_DEPTH) {
    return
  }

  stroke(map(depth, 0, MAX_DEPTH, 0, 360), 100, 100)

  circle(x, y, d)

  const offset = map(mouseX, 0, width, 0, d)
  const scale = map(mouseY, 0, height, 0, d)

  drawCircle(x - offset, y, scale, depth + 1)
  drawCircle(x + offset, y, scale, depth + 1)
}
