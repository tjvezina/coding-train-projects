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
  
  for (let i = segments.length - 1; i >= 0; i--) {
    segments[i].follow()
  }
   
  segments.forEach(segment => segment.draw())
}