const BALL_RADIUS = 16
const BALL_SPEED = 10

class Ball {
  constructor() {
    this.hue = 0
    this.reset()
  }
  
  reset() {
    this.position = createVector(width/2, height/2)
    const angle = random(1) < 0.5 ? PI : 0
    this.velocity = createVector(cos(angle), sin(angle)).mult(BALL_SPEED)
  }
  
  update() {
    this.hue += 5
    if (this.hue > 360) {
      this.hue -= 360
    }
    
    this.position.add(this.velocity)
    
    if (this.position.y < BALL_RADIUS) {
      this.position.y = BALL_RADIUS
      this.velocity.y *= -1
    }
    if (this.position.y > height - BALL_RADIUS) {
      this.position.y = height - BALL_RADIUS
      this.velocity.y *= -1
    }
    
    if (this.position.x < -BALL_RADIUS) {
      this.reset()
      return -1
    }
    
    if (this.position.x > width + BALL_RADIUS) {
      this.reset()
      return 1
    }
    
    return 0
  }
  
  checkCollision(paddle) {
    if (this.velocity.x > 0 &&
        this.position.x + BALL_RADIUS > paddle.position.x - paddle.size.x / 2 &&
        this.position.x + BALL_RADIUS < paddle.position.x + paddle.size.x / 2
    ) {
      const t = map(this.position.y, paddle.position.y, paddle.position.y + paddle.size.y / 2, 0, 1)

      if (-1 <= t && t <= 1) {
        this.position.x = paddle.position.x - paddle.size.x / 2 - BALL_RADIUS
        const angle = map(t, -1, 1, 5*PI/4, 3*PI/4)
        this.velocity.set(cos(angle), sin(angle))
        this.velocity.mult(BALL_SPEED)
      }
    }
    
    if (this.velocity.x < 0 &&
        this.position.x - BALL_RADIUS < paddle.position.x + paddle.size.x / 2 &&
        this.position.x - BALL_RADIUS > paddle.position.x - paddle.size.x / 2
    ) {
      const t = map(this.position.y, paddle.position.y, paddle.position.y + paddle.size.y / 2, 0, 1)
      
      if (-1 <= t && t <= 1) {
        this.position.x = paddle.position.x + paddle.size.x / 2 + BALL_RADIUS
        const angle = map(t, -1, 1, -PI/4, PI/4)
        this.velocity.set(cos(angle), sin(angle))
        this.velocity.mult(BALL_SPEED)
      }
    }
  }
  
  draw() {
    push()
    {
      colorMode(HSB)
      noStroke()
      fill(this.hue, 60, 100)
      circle(this.position.x, this.position.y, BALL_RADIUS * 2)
    }
    pop()
  }
}
