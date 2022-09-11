class AnimDir {
  static get Right() { return 'Right'; }
  static get Left() { return 'Left'; }
}

class Wave {
  static get height() { return min(width, height)*0.1; }
  static get width() { return min(width, height)*0.85; }
  static get weight() { return min(width, height)*0.004; }
  static get resolution() { return 1600; } // Vertices per wave
  static get falloffRatio() { return 0.16; } // Percent of width
  
  constructor(pos, color, animDir) {
    Object.assign(this, { pos: pos || createVector(0, 0), color, animDir });
    this.yValues = new Array(Wave.resolution).fill(0);
  }
  
  draw() {
    push();
    {
      translate(this.pos.x, this.pos.y);
      
      const dir = (gameState === GameState.Outro ? (this.animDir === AnimDir.Right ? AnimDir.Left : AnimDir.Right) : this.animDir);
      
      const count = round(this.yValues.length * smoothStep(waveAnimRatio));
      const iStart = (dir === AnimDir.Right ? 0 : this.yValues.length - 1);
      const iEnd = (dir === AnimDir.Right ? iStart + count : iStart - count);
      const iInc = (dir === AnimDir.Right ? 1 : -1);
      
      noFill();
      strokeWeight(Wave.weight);
      stroke(this.color);
      beginShape();
      for (let i = iStart; i != iEnd; i += iInc) {
        const y = this.yValues[i];
        const t = i / (Wave.resolution - 1);
        const xPos = (t-0.5) * Wave.width;
        const yPos = -y * Wave.height/2; // Invert for p5.js so that -1 is bottom, 1 is top
        vertex(xPos, yPos);
      }
      endShape();
    }
    pop();
  }
}