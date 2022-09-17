class WaveDefinition {
  constructor(func, canInvert = false, canReverse = false) {
    Object.assign(this, { func, canInvert, canReverse });
  }
}

class SimpleWave extends Wave {
  constructor({ pos, color, animDir, definition, invert = false, reverse = false, scale = 1, offset = 0 }) {
    super(pos, color, animDir);
    Object.assign(this, { definition, invert, reverse, scale, offset });
    this.localPoints = [];
  }
  
  // Normalized target delta in range [-1, 1]
  getDelta(target) {
    return (modulo(this.offset - target + 0.5, 1) - 0.5);
  }
  
  generatePoints() {
    for (let i = 0; i < Wave.resolution; i++) {
      const t = i / (Wave.resolution - 1);
      const x = t * this.scale - this.offset;
      let y = constrain(this.definition.func(((x % 1) + 1) % 1), -1, 1);
      
      y *= smoothStep(min(1, (-abs(t-0.5)+0.5) / Wave.falloffRatio));
      
      this.yValues[i] = (this.invert ? -y : y);
    }
    
    if (this.reverse) {
      this.yValues.reverse();
    }
  }
}