const MAX_COPIES = 60

let font

let startTime

function preload() {
  font = loadFont('assets/digital-7 (mono).ttf')
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
  
  initCamera()
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL)
    
  initCamera()
  
  startTime = Date.now()
}

function initCamera() {
  camera(2000, -1600, 2400, 0, 0, 0)
  ortho(-width/2, width/2, -height/2, height/2, 0.01, 10000)
}

function draw() {
  background(0)
  
  const time = Date.now()
  const millis = time % 1000
  const seconds = floor(time / 1000 % 60)
  
  textAlign(CENTER, CENTER)
  textSize(width/4)
  textFont(font)
  
  noStroke()
  colorMode(HSB)
  for (let i = MAX_COPIES - 1; i >= 0; i--) {
    const copyTime = (time - millis) - (i * 1000)
    
    if (copyTime < startTime) {
      continue
    }
     
    const copySeconds = (i < seconds ? seconds - i : seconds - i + 60)
    let offset = (i + (millis / 1000))
    offset *= pow(1.012, offset)
    
    push()
    {
      fill(color(copySeconds * 6, 90, 80))
      translate(0, 0, -width*0.025 * offset)
      text(format(copyTime), 0, 0)
    }
    pop()
  }

  fill(200)
  text(format(time), 0, 0)
  
  stroke(4, 100, 32)
  strokeWeight(4)
  for (let i = 0; i < 60; i++) {
    const offset = (pow(1.25, i) - 1) * 32
    line(-width, width*0.1 + offset, width, width*0.1 + offset)
  }
}

function format(time) {
  const date = new Date(time)
  return `${nf(date.getHours(), 2)}:${nf(date.getMinutes(), 2)}:${nf(date.getSeconds(), 2)}`
}
