class Tweener {
  constructor() {
    this.tweens = []
  }
  
  tweenVector(vector, endValue, duration, onComplete) {
    this.tweens.push({
      target: vector,
      start: vector.copy(),
      end: endValue.copy(),
      duration,
      onComplete,
      startTime: millis(),
    })
  }
    
  update() {
    for (let i = this.tweens.length - 1; i >= 0; i--) {
      const tween = this.tweens[i]
      
      const t = (millis() - tween.startTime) / tween.duration
      
      if (t < 1) {
        tween.target.set(p5.Vector.lerp(tween.start, tween.end, t))
      } else {
        tween.target.set(tween.end)
        if (tween.onComplete !== undefined) {
          tween.onComplete()
        }
        
        this.tweens.splice(i, 1)
      }
    }
  }
}