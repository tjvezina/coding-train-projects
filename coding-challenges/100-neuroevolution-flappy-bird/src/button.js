class Button {
  constructor(x, y, w, h, text) {
    Object.assign(this, {
      pos: createVector(x, y),
      size: createVector(w, h),
      text
    });
  }
  
  draw(isActive) {
    strokeWeight(0.6);
    stroke(0);
    fill(isActive ? '#ADF1AF' : 255);
    rectMode(CENTER);
    rect(this.pos.x, this.pos.y, this.size.x, this.size.y);
    
    strokeWeight(1);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(this.size.y*0.8);
    text(this.text, this.pos.x+0.3, this.pos.y-0.2);
  }
}