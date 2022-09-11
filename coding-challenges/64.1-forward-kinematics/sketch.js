const segments = []
let time = 0

function setup() {
  createCanvas(1000, 800);
  
  segments.push(Segment.createRoot(createVector(width/2, height), -PI/2, 50))
  for (let i = 0; i < 12; i++) {
    segments.push(Segment.createChild(segments[segments.length-1], 50))
  }
}

function draw() {
  background(42);
  
  time += deltaTime / 1000
  let t = time
  let s = 1
  segments.forEach(segment => {
    segment.localAngle = sin(t) * PI/24 * s
    t += 0.4
    s -= 0.01
  })
  
  segments.forEach(segment => segment.draw())
}