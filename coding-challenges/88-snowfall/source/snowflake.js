const WIND_SCALE = 1;
const WIND_STRENGTH = 0.5;
const WIND_SPEED = 0.5;

class Snowflake {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector();
    
    this.randomize();
  }
  
  randomize() {
    this.size = 1 + abs(randomGaussian()) * 1.5;
  }
  
  update() {
    const wind = (noise(this.pos.x/width*WIND_SCALE, this.pos.y/height*WIND_SCALE, millis()/1000*WIND_SPEED)*2-1) * WIND_STRENGTH;
    
    this.vel.add(createVector(wind, 0.5));
    this.vel.limit(this.size * 0.5);
    this.pos.add(this.vel);
    
    if (this.pos.y > height + 10) {
      this.pos.y = -10;
      this.pos.x = random(-width*0.25, width*1.25);
      this.randomize();
    }
  }
  
  draw() {
    stroke(map(this.size, 1, 6, 128, 255))
    strokeWeight(4 * this.size);
    point(this.pos.x, this.pos.y);
  }
}