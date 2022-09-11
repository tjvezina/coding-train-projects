const PLATE_Y_OFF = 30;
const PLATE_W = 100;
const PLATE_H = 16;

class Plate {
  constructor() {
    this.pos = createVector(width/2, height - PLATE_Y_OFF);
  }
  
  update() {
    this.pos.x = constrain(mouseX, PLATE_W/2, width-PLATE_W/2);
    
    for (let i = 0; i < pies.length; i++) {
      const pie = pies[i];
      if (collideRectCircle(this.pos.x - PLATE_W/2, this.pos.y, PLATE_W, PLATE_H, pie.pos.x, pie.pos.y, PIE_DIAM)) {
        onPieCaught(pie);
        pies.splice(i, 1);
        --i;
      }
    }
  }
  
  draw() {
    // Pivot is top-center
    const { x, y } = this.pos;
    image(plateImg, x, y + PLATE_H/2, PLATE_W, PLATE_H);
  }
}