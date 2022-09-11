const PIE_DIAM = 64;
const FALL_SPEED = 50; // Pixels per second
const FALL_ACC = 2; // Multiplier per second

class Pie {
  constructor() {
    this.pos = createVector(map(random(1), 0, 1, PIE_DIAM, width-PIE_DIAM), -PIE_DIAM/2);
    this.speedMult = random(0.8, 1.2);
    this.rotationSpeed = PI * random(0.1, 0.2) * (random(1) < 0.5 ? 1 : -1);
    
    const rand = random(1);
    this.sliceCount = (rand < 0.25 ?
      Number(digits[iDigit]) :
      (rand < 0.35 ?
        Number(digits[iDigit+1]) :
        floor(random(10))
      )
    );
  }
  
  update() {
    this.speedMult += FALL_ACC * (deltaTime/1000);
    this.pos.y += FALL_SPEED * this.speedMult * (deltaTime/1000);
  }
  
  draw() {
    const { sliceCount, rotationSpeed } = this;
    const { x, y } = this.pos;
    push();
    {
      translate(x, y);
      rotate(rotationSpeed * millis()/1000);
      image(sliceCount > 0 ? pieImg : pieTinImg, 0, 0, PIE_DIAM, PIE_DIAM);
      
      if (sliceCount > 1) {
        noFill();
        strokeWeight(2);
        stroke(0, 0, 0, 127);
        for (let i = 0; i < sliceCount; i++) {
          const a = map(i, 0, sliceCount, 0, TWO_PI) - PI/2;
          line(0, 0, cos(a)*PIE_DIAM/2, sin(a)*PIE_DIAM/2);
        }
      }
    }
    pop();
  }
}