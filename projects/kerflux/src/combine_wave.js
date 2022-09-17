class CombineWave extends Wave {
  constructor({ pos, color, animDir }) {
    super(pos, color, animDir);
  }
  
  combine(waves) {
    this.yValues.fill(0);
    
    for (let i = 0; i < Wave.resolution; i++) {
      for (let j = 0; j < waves.length; j++) {
        this.yValues[i] += waves[j].yValues[i];
      }
      
      this.yValues[i] /= waves.length;
    }
  }
}