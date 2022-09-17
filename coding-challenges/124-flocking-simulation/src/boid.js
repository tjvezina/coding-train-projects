const BOID_SIZE = 4;
const BOID_RANGE = 24;
const MAX_ACC = 0.1;
const MAX_VEL = 2;
const BORDER = 32;

class Boid {
  constructor(x, y) {
    this.pos = createVector(x || random(width), y || random(height));
    this.vel = p5.Vector.random2D().setMag(MAX_VEL);
    this.acc = createVector();
  }
  
  _alignment(localBoids) {
    let steering = createVector();
    
    localBoids.forEach(x => steering.add(x.vel));
    steering.div(localBoids.length);
    steering.setMag(MAX_VEL);
    steering.sub(this.vel);
    
    return steering;
  }
  
  _separation(localBoids) {
    let steering = createVector();
    
    localBoids.forEach(x => {
      const delta = p5.Vector.sub(this.pos, x.pos);
      delta.setMag(BOID_RANGE - delta.mag());
      steering.add(delta);
    });
    
    return steering;
  }
  
  _cohesion(localBoids) {
    let steering = createVector();
    
    localBoids.forEach(x => steering.add(x.pos));
    steering.div(localBoids.length);
    steering.sub(this.pos);
    
    return steering;
  }
  
  _boundary() {
    let steering = createVector();
    
    if (this.pos.x < BORDER) {
      steering.x++;
    }
    if (this.pos.x > width-BORDER) {
      steering.x--;
    }
    if (this.pos.y < BORDER) {
      steering.y++;
    }
    if (this.pos.y > height-BORDER) {
      steering.y--;
    }
    
    steering.setMag(MAX_VEL*5);
    
    return steering;
  }
  
  flock(localBoids) {
    let steering = createVector();
    if (localBoids.length > 0) {
      steering.add(this._alignment(localBoids));
      steering.add(this._separation(localBoids));
      steering.add(this._cohesion(localBoids));
      steering.add(this._boundary());
    }
    
    this.acc.set(steering).limit(MAX_ACC);
  }

  update() {
    this.vel.add(this.acc).limit(MAX_VEL);
    this.pos.add(this.vel);
  }
  
  draw() {
    strokeWeight(2);
    stroke(200);
    fill(255);
    push();
    {
      translate(this.pos.x, this.pos.y);
      rotate(atan2(this.vel.y, this.vel.x))
      
      triangle(BOID_SIZE/2, 0, -BOID_SIZE/2, BOID_SIZE/3, -BOID_SIZE/2, -BOID_SIZE/3);      
    }
    pop();
  }
}