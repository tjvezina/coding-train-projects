class Countdown {
  constructor(timerElement) {
    this.timerElement = timerElement
    this.startTime = null
    this.duration = null
    
    timerElement.html('')
  }
  
  get isRunning() {
    return this.duration !== null
  }
  
  start(duration) {
    this.duration = duration
    this.startTime = millis() / 1000
  }
  
  stop() {
    this.duration = null
    this.startTime = null
  }
  
  update() {
    const time = max(0, this.duration - (millis() / 1000 - this.startTime))
    const min = floor(time / 60)
    const sec = floor(time % 60)
    this.timerElement.html(`${min}:${nf(sec, 2)}`)
    
    return time > 0
  }
}