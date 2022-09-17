class Curve {
  constructor(x, y) {
    Object.assign(this, { x, y });
    this.verts = [];
    
    this._buildCurve();
  }
  
  _buildCurve() {
    const segments = 16 * (this.x + this.y);
    for (let i = 0; i < segments; i++) {
      this.verts.push(getPoint(this.x, this.y, i/segments));
    }
  }
  
  draw(posX, posY, gcd) {    
    noFill();
    strokeWeight(DIAM*0.02);
    if (selected.x === this.x && selected.y === this.y) {
      stroke(selected.gcd === gcd ? '#ed8545' : '#FFF');
    } else {
      stroke(selected.x === 0 || selected.y === 0 ? 255 : 127);
    }
    
    const p = getPoint(this.x, this.y, loopTime*gcd);
    
    const iEnd = floor(min(1, loopTime*gcd) * this.verts.length);
    beginShape();
    {
      for (let i = 0; i <= iEnd && i < this.verts.length; i++) {
        vertex(posX + this.verts[i].x, posY + this.verts[i].y);
      }
      if (loopTime*gcd < 1) {
        vertex(posX + p.x, posY + p.y);
      }
    }
    if (loopTime*gcd >= 1) {
      endShape(CLOSE);
    } else {
      endShape();
    }
    
    strokeWeight(DIAM*0.06);
    stroke(255);
    point(posX + p.x, posY + p.y);
  }
}