const MOUSE_RING_COUNT = 4
const MOUSE_RING_SIZE = 80

const segments = []
let time = 0

function setup() {
  createCanvas(800, 600);
  
  segments.push(Segment.createRoot(createVector(width/2, height), 20, -PI/2))
  for (let i = 0; i < 20; i++) {
    segments.push(Segment.createChild(segments[segments.length-1], 20, -PI/2))
  }  
}

function draw() {
  background(42);
  
  time += deltaTime / 1000
  
  // Mouse cursor
  if (0 < mouseX && mouseX < width && 0 < mouseY && mouseY < height) {
    for (let i = 0; i < MOUSE_RING_COUNT; i++) {
      let t = fract(time * 0.5 + (i/MOUSE_RING_COUNT))
      noFill()
      strokeWeight(t * 6)
      stroke(80, 180, 225, t * 180)
      circle(mouseX, mouseY, (1-t) * MOUSE_RING_SIZE)
    }
  }
  
  for (let i = segments.length - 1; i >= 0; i--) {
    segments[i].follow()
  }
  
  for (let i = 0; i < segments.length; i++) {
    segments[i].anchor()
  }
   
  segments.forEach(segment => segment.draw())
}