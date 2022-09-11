const PlayerState = {
  ALIVE: 'alive',
  DROWNED: 'drowned',
  FLAT: 'flat',
}
Object.freeze(PlayerState)

class Player {
  constructor(image, onMove) {
    this.image = image
    this.size = ROW_HEIGHT * 0.8
    
    this.onMove = onMove
    
    this.inputKeys = [UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW]
    this.keyMap = this.inputKeys.map(key => false)
    
    this.reset()
  }
  
  reset() {
    this.state = PlayerState.ALIVE
    
    // X = pixels, Y = row index
    this.pos = createVector(width/2, ROWS - 1)
    this.rotation = 0
    this.isMoving = false
    
    this.pendingKey = null
  }
  
  drown() {
    this.state = PlayerState.DROWNED
    setTimeout(this.reset.bind(this), 1000)
  }
  
  flatten() {
    this.state = PlayerState.FLAT
    setTimeout(this.reset.bind(this), 1000)
  }
  
  get rect() {
    return new Rect(this.pos.x - this.size/2, Row.getY(this.pos.y) + ROW_HEIGHT/2 - this.size/2, this.size, this.size)
  }
  
  get center() {
    return createVector(this.pos.x, Row.getY(this.pos.y) + ROW_HEIGHT/2)
  }
  
  onKeyPressed(key) {
    if (this.state !== PlayerState.ALIVE) {
      return
    }
    
    if (!this.isMoving) {
      this.move(key)
    } else {
      this.pendingKey = key
    }
  }
  
  move(key) {
    const target = this.pos.copy()
    if (key === UP_ARROW) {
      if (this.pos.y > -1) {
        target.y--
        this.rotation = 0
      }
    } else if (key === DOWN_ARROW) {
      if (this.pos.y < ROWS - 1) {
        target.y++
        this.rotation = PI
      }
    } else if (key === LEFT_ARROW) {
      if (this.pos.x > ROW_HEIGHT * 1.39) {
        target.x -= ROW_HEIGHT
        this.rotation = PI * 1.5
      }
    } else if (key === RIGHT_ARROW) {
      if (this.pos.x < width - ROW_HEIGHT * 1.39) {
        target.x += ROW_HEIGHT
        this.rotation = PI * 0.5
      }
    }

    this.isMoving = true
    tweener.tweenVector(this.pos, target, 40, () => {
      this.isMoving = false
      if (this.onMove !== undefined) {
        this.onMove()
      }
      if (this.pendingKey !== null) {
        const key = this.pendingKey
        this.pendingKey = null
        this.onKeyPressed(key)
      }
    })
  }
  
  draw() {
    // Ensure one event is sent per key press (keyPressed/keyReleased repeats if the key is held)
    this.inputKeys.forEach(key => {
      const isDown = keyIsDown(key)
      if (isDown && !this.keyMap[key]) {
        this.onKeyPressed(key)
      }
      this.keyMap[key] = isDown
    })
    
    const size = this.size
    const x = this.pos.x
    const y = Row.getY(this.pos.y)
    
    switch (this.state) {
      case PlayerState.ALIVE: noTint(); break
      case PlayerState.DROWNED: tint(0, 63, 255); break
      case PlayerState.FLAT: tint(255, 63, 0); break
    }
    
    translate(x, y + ROW_HEIGHT/2)
    rotate(this.rotation)
    image(this.image, -size/2, -size/2, size, size)
  }
}