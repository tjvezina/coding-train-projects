const BARRIER_HEIGHT = 0.25;
const BAR_WIDTH = 0.15;
const BAR_INSET = 0.05;

class Obstacle {
  constructor(x) {
    this.x = x;
    this.w = 25;
    this.h = 30;
    
    this.wasJumped = false;
  }
  
  isGone() {
    return (this.x + this.w) < distance;
  }
  
  draw() {
    const { x, w, h } = this;
    
    const h1 = h*BARRIER_HEIGHT;
    const w1 = w*BAR_WIDTH;
    const w2 = w*BAR_INSET;
    
    push();
    {
      translate(x-distance, 0);

      noStroke();
      // Bars
      fill(180);
      rect(w2, 0, w1, h-h1);
      rect(w-w1-w2, 0, w1, h-h1);
      // Barrier
      fill(200);
      rect(0, h-h1, w, h1);
      // Stripes
      fill(180, 100, 100);
      for (let i = 0; i < 4; i++) {
        const x1 = i*(w/4);
        const x2 = (i+0.5)*(w/4);
        const x3 = (i+1)*(w/4);
        const y1 = h-h1;
        const y2 = h;
        beginShape();
        vertex(x1, y1);
        vertex(x2, y2);
        vertex(x3, y2);
        vertex(x2, y1);
        endShape(CLOSE);
      }
    }
    pop();
  }
}