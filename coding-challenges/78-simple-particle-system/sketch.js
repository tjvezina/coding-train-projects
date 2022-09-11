let particles = []

function setup() {
  createCanvas(600, 400)
  
  noStroke()
  fill(255, 10)
}

function draw() {
  background(42)
  
  particles.push(new Particle())
  
  particles.forEach(particle => {
    particle.update()
    particle.draw()
  })
  
  particles = particles.filter(particle => particle.life > 0)
}