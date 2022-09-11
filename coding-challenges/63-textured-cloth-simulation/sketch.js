// SETTINGS
const clothSpacing = 20
const lockCount = 8
const paddingHoriz = 0.1
const paddingVert = 0.1

const grid = []
const springs = []
let physics

let img

// Maximum distance to grab cloth particles from
const grabThreshold = 20
let grabbedParticle = null
let grabTime = 0

function preload() {
  img = loadImage('assets/texture.jpg')
}

function setup() {
  // Disable context menu on right click
  document.oncontextmenu = function() { return false; }
  
  createCanvas(960, 800, WEBGL)
  
  physics = new VerletPhysics2D()
  physics.addBehavior(new GravityBehavior(new Vec2D(0, 1)))
  
  for (let y = height * paddingVert; y < height * (1 - paddingVert); y += clothSpacing) {
    let row = []
    for (let x = width * paddingHoriz; x < width * (1 - paddingHoriz); x += clothSpacing) {
      const particle = new Particle(x, y)
      row.push(particle)
      physics.addParticle(particle)
    }
    grid.push(row)
  }
  
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const particle = grid[y][x]

      if (x < grid[y].length - 1) {
        const spring = new Spring(particle, grid[y][x+1])
        springs.push(spring)
        physics.addSpring(spring)
      }
      
      if (y < grid.length - 1) {
        const spring = new Spring(particle, grid[y+1][x])
        springs.push(spring)
        physics.addSpring(spring)
      }
    }
  }
  
  for (let i = 0; i < lockCount; i++) {
    grid[0][round(map(i, 0, lockCount - 1, 0, grid[0].length - 1))].lock()
  }  
}

function draw() {
  background(42)
  
  physics.update()
  handleInput()
  
  const fov = PI / 3; // 60˚
  const camZ = (height/2) / tan(fov/2); // Makes XY plane 1:1 with pixels
  
  // CAMERAS
  // Position (x, y, z), Target (x, y, z), Up (x, y, z)
  camera(width/2, height/2, camZ, width/2, height/2, 0, 0, 1, 0);
  // Field of view, aspect ratio, near plane, far plane
  perspective(fov, width/height, 3, 10000);
  
  // LIGHTS
  ambientLight(50);
  directionalLight(255, 255, 255, -1, 1, -1);
  
  stroke(255)
  textureMode(NORMAL)
  texture(img)
  
  // TODO: Don't draw quads that include a cut string
  for (let y = 0; y < grid.length - 1; y++) {
    beginShape(TRIANGLE_STRIP)
    for (let x = 0; x < grid[0].length; x++) {
      const particleA = grid[y][x]
      const particleB = grid[y+1][x]
      
      // TODO: Simulate normals based on neighbor positions
      normal(0, 0, 1)
      vertex(particleA.x, particleA.y, 0, map(x, 0, grid[0].length - 1, 0, 1), map(y, 0, grid.length - 1, 0, 1))
      normal(0, 0, 1)
      vertex(particleB.x, particleB.y, 0, map(x, 0, grid[0].length - 1, 0, 1), map(y+1, 0, grid.length - 1, 0, 1))
    }
    endShape()
  }
  
  grid.forEach(row => row.forEach(particle => particle.draw()))
  
  // Mouse cursor
  noFill()
  stroke(50, 220, 80)
  strokeWeight(4)
  circle(mouseX, mouseY, 12)
}

function mousePressed() {
  if (mouseX < 0 || width < mouseX || mouseY < 0 || height < mouseY) {
    return
  }
  
  if (mouseButton === LEFT) {
    const particles = grid.reduce((acc, row) => acc = [...acc, ...row], [])
      .map(particle => ({ particle, dist: dist(mouseX, mouseY, particle.x, particle.y) }))
    const nearest = particles.sort((a, b) => a.dist - b.dist)[0]
    if (nearest.dist < grabThreshold) {
      grabbedParticle = nearest.particle
    }
  }
}
  
function mouseReleased() {
  if (mouseButton === LEFT) {
    if (grabbedParticle !== null && grabTime < 100) {
      if (grabbedParticle.isLocked) {
        grabbedParticle.unlock()
      } else {
        grabbedParticle.lock()
      }
    }
    
    grabbedParticle = null
    grabTime = 0
  }
}

function handleInput() {
  if (grabbedParticle !== null) {
    grabTime += deltaTime
    if (!grabbedParticle.isLocked) {
      grabbedParticle.addForce(new Vec2D(mouseX - grabbedParticle.x, mouseY - grabbedParticle.y))
    } else {
      grabbedParticle.x = mouseX
      grabbedParticle.y = mouseY
    }
  }
  
  // TODO: Uncomment to enable cutting strings with right-click + drag, when rendering is implemented
  // if (mouseIsPressed && mouseButton === RIGHT && (abs(movedX) > 0 || abs(movedY) > 0)) {
  //   springs.forEach(spring => {
  //     if (collideLineLine(spring.a.x, spring.a.y, spring.b.x, spring.b.y, mouseX, mouseY, mouseX - movedX, mouseY - movedY)) {
  //       springs.splice(springs.indexOf(spring), 1)
  //       physics.removeSpring(spring)
  //     }
  //   })
  // }
}
