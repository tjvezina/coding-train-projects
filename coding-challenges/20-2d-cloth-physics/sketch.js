// SETTINGS
const clothSpacing = 20
const lockCount = 8
const paddingHoriz = 0.1
const paddingVert = 0.05

const particles = []
const springs = []
let physics

function setup() {
  createCanvas(960, 600)
  
  physics = new VerletPhysics2D()
  physics.addBehavior(new GravityBehavior(new Vec2D(0, 1)))
  
  for (let y = height * paddingVert; y < height * (1 - paddingVert); y += clothSpacing) {
    let row = []
    for (let x = width * paddingHoriz; x < width * (1 - paddingHoriz); x += clothSpacing) {
      const particle = new Particle(x, y)
      row.push(particle)
      physics.addParticle(particle)
    }
    particles.push(row)
  }
  
  for (let y = 0; y < particles.length; y++) {
    for (let x = 0; x < particles[y].length; x++) {
      const particle = particles[y][x]

      if (x < particles[y].length - 1) {
        const spring = new Spring(particle, particles[y][x+1])
        springs.push(spring)
        physics.addSpring(spring)
      }
      
      if (y < particles.length - 1) {
        const spring = new Spring(particle, particles[y+1][x])
        springs.push(spring)
        physics.addSpring(spring)
      }
    }
  }
  
  for (let i = 0; i < lockCount; i++) {
    particles[0][round(map(i, 0, lockCount - 1, 0, particles[0].length - 1))].lock()
  }
}

function draw() {
  background(40)
  
  physics.update()
  
  springs.forEach(spring => spring.draw())
  // particles.forEach(row => row.forEach(particle => particle.draw()))
}