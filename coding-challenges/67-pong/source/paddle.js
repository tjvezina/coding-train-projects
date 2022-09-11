const PADDLE_MOVE_SPEED = 10

class Paddle {
  constructor(x, color, upKey, downKey) {
    this.position = createVector(x, height/2)
    this.size = createVector(16, 100)
    this.color = color
    this.upKey = upKey
    this.downKey = downKey
  }
  
  update() {
    if (keyIsDown(this.upKey)) {
      this.position.y = max(this.size.y/2, this.position.y - PADDLE_MOVE_SPEED)
    }
    if (keyIsDown(this.downKey)) {
      this.position.y = min(height - this.size.y/2, this.position.y + PADDLE_MOVE_SPEED)
    }
  }
  
  draw() {
    noStroke()
    fill(this.color)
    rectMode(CENTER)
    rect(this.position.x, this.position.y, this.size.x, this.size.y)
  }
}