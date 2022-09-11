const VEHICLE_MAX_SPEED = 3
const VEHICLE_MAX_STEER_FORCE = 0.5
const VEHICLE_DRAG = 0.98
const VEHICLE_SIZE = 5
const VEHICLE_SIGHT_RANGE = 150
const VEHICLE_SIGHT_ANGLE = 3.14159265 / 2

class Vehicle {
  constructor(x, y, parent) {
    const angle = random(TWO_PI)
    
    this.acceleration = createVector(0, 0)
    this.velocity = createVector(cos(angle), sin(angle)).mult(VEHICLE_MAX_SPEED)
    this.position = createVector(x, y)
    
    this.health = 0.5
    this.dna = {}
      
    if (parent === undefined) {
      Object.values(BerryType).forEach(type => this.dna[type] = random(-1, 1)) 
    } else {
      parent.health *= 0.5
      this.position.set(parent.position)
      Object.assign(this.dna, parent.dna)
      this.mutate()
    }
  }
    
  mutate() {
    Object.entries(this.dna).forEach(pair => {
      this.dna[pair[0]] = max(-1, min(1, pair[1] + random(-0.1, 0.1)))
    })
  }
  
  get isDead() {
    return this.health === 0
  }
  
  get color() {
    return this.isDead ? color(32) : lerpColor(color(64), color(232, 217, 9), this.health)
  }
  
  update(berries) {
    this.health = max(0, this.health - 0.001)
    
    if (!this.isDead) {
      this.search(berries)
    } else {
      this.velocity.mult(VEHICLE_DRAG)
    }
    
    this.velocity.add(this.acceleration)
    this.velocity.limit(VEHICLE_MAX_SPEED)
    this.position.add(this.velocity)
    // Acceleration is applied and "consumed" each frame
    this.acceleration.set(0, 0)
    
    if (this.position.x < 0 || this.position.x >= width) {
      this.velocity.x *= -1
    }
    
    if (this.position.y < 0 || this.position.y >= height) {
      this.velocity.y *= -1
    }
  }
  
  search() {
    const visibleBerries = berries.filter(berry => {
      const dist = this.position.dist(berry.position)
      const angle = this.velocity.angleBetween(p5.Vector.sub(berry.position, this.position))
      return (dist < VEHICLE_SIGHT_RANGE) && (abs(angle) < VEHICLE_SIGHT_ANGLE / 2)
    })
    
    // Visualize sight
    // noStroke()
    // fill(255, 255, 0, 127)
    // visibleBerries.forEach(berry => circle(berry.position.x, berry.position.y, 20))
   
    // Steer towards all visible
//     if (visibleBerries.length === 0) {
//       this.acceleration.add(this.velocity)
//     } else {
//       visibleBerries.forEach(berry => {
//         stroke(0, 200, 200)
//         const force = p5.Vector.lerp(this.position, berry.position, this.dna[berry.type])
//         line(this.position.x, this.position.y, force.x, force.y)
        
//         this.steer(berry)
//         if (this.position.dist(berry.position) < VEHICLE_SIZE) {
//           this.eat(berry)
//         }
//       })
//     }
    
    // Steer towards nearest
    let minDist = Infinity
    let closest
    for (let i = 0; i < visibleBerries.length; i++) {
      const berry = visibleBerries[i]
      const dist = this.position.dist(berry.position)
      if (dist < minDist) {
        minDist = dist
        closest = berry
      }
    }

    if (closest !== undefined) {
      stroke(0, 200, 200)
      const force = p5.Vector.lerp(this.position, closest.position, this.dna[closest.type])
      line(this.position.x, this.position.y, force.x, force.y)
      
      this.steer(closest)
      if (minDist < VEHICLE_SIZE) {
        this.eat(closest)
      }
    } else {
      this.acceleration.add(this.velocity)
    }
  }
  
  steer(berry) {
    // Desired velocity, i.e. max speed towards the target
    const desired = p5.Vector.sub(berry.position, this.position)
    desired.setMag(VEHICLE_MAX_SPEED)
    
    const steerForce = p5.Vector.sub(desired, this.velocity)
    steerForce.limit(VEHICLE_MAX_STEER_FORCE)
    steerForce.mult(this.dna[berry.type])
    
    this.acceleration.add(steerForce)
  }
  
  eat(berry) {
    this.health += berry.value
    berry.position = createVector(random(width), random(height))
  }
  
  draw() {    
    noStroke()
    fill(this.color)
    
    push()
    {
      translate(this.position.x, this.position.y)
      rotate(this.velocity.heading())
      
      beginShape()
      {
        const s = VEHICLE_SIZE
        vertex(s*2, 0)
        vertex(-s*2, s)
        vertex(-s*2, -s)
      }
      endShape(CLOSE)
      
      if (!this.isDead) {
        const sightSize = VEHICLE_SIGHT_RANGE * 2
        const sightHalfAngle = VEHICLE_SIGHT_ANGLE / 2
        noStroke()
        fill(255, 255, 255, 4)
        arc(0, 0, sightSize, sightSize, -sightHalfAngle, sightHalfAngle)
      }
    }
    pop()
    
    if (!this.isDead) {
      push()
      {
        translate(this.position.x, this.position.y)
        noFill()
        strokeWeight(3)
        stroke(0, 140, 70)
        arc(0, 0, VEHICLE_SIZE * 6, VEHICLE_SIZE * 6, -PI/2, map(this.health, 0, 1, -PI/2, PI*1.5))
        
        // translate(this.position.x, this.position.y)
        // noStroke()
        // fill(200)
        // rect(-VEHICLE_SIZE * 2, VEHICLE_SIZE * 3, VEHICLE_SIZE * 4, 4)
        // fill(0, 140, 70)
        // rect(-VEHICLE_SIZE * 2, VEHICLE_SIZE * 3, VEHICLE_SIZE * 4 * this.health, 4)
      }
      pop()
    }
  }
}
