class Cell {
  constructor(x, y) {
    this.x = x
    this.y = y
    
    this.hasBee = false
    this.isRevealed = false
    this.isFlagged = false
    this.didSting = false
    this.neighborBeeCount = 0
  }
  
  tryReveal() {
    if (!this.isRevealed && !this.isFlagged) {
      this.isRevealed = true
      return true
    }
    return false
  }
  
  draw() {
    const size = width / GRID_SIZE
    const x = this.x * size
    const y = this.y * size

    textStyle(BOLD)
    textSize(size * 0.75)
    textAlign(CENTER, CENTER)
    
    if (!this.isRevealed) {
      this.drawHiddenBox(x, y, size)      
    } else {
      if (!this.hasBee) {
        if (this.neighborBeeCount > 0) {
          noStroke()
          fill(200)
          text(this.neighborBeeCount, x + size/2, y + size/2)
        }
      } else {
        if (this.didSting) {
          noStroke()
          fill(200, 0, 0)
          rect(x, y, size, size)
        }
        stroke(0)
        fill(180, 160, 0)
        ellipse(x + size/2, y + size/2, size * 0.5, size * 0.3)
      }
    }
    
    if (this.isFlagged) {
      noStroke()
      fill(200, 0, 0)
      text('!', x + size/2, y + size/2)
    }

    stroke(21)
    noFill()
    rect(x, y, size, size)
  }
  
  drawHiddenBox(x, y, size) {
    const HUE = 195
    const SAT = 50
    const BRIGHT = 42
    const BEVEL = 5
    const DEPTH = 6
    
    push()
    
    colorMode(HSB)
    noStroke()

    fill(color(HUE, SAT, BRIGHT))
    rect(x, y, size, size)
    
    fill(color(HUE, SAT, BRIGHT + DEPTH))
    beginShape()
    {
      vertex(x, y)
      vertex(x + size, y)
      vertex(x + size - BEVEL, y + BEVEL)
      vertex(x + BEVEL, y + BEVEL)
    }
    endShape(CLOSE)
    
    fill(color(HUE, SAT, BRIGHT + DEPTH/2))
    beginShape()
    {
      vertex(x, y)
      vertex(x, y + size)
      vertex(x + BEVEL, y + size - BEVEL)
      vertex(x + BEVEL, y + BEVEL)
    }
    endShape(CLOSE)
    
    fill(color(HUE, SAT, BRIGHT - DEPTH/2))
    beginShape()
    {
      vertex(x + size, y)
      vertex(x + size, y + size)
      vertex(x + size - BEVEL, y + size - BEVEL)
      vertex(x + size - BEVEL, y + BEVEL)
    }
    endShape(CLOSE)
    
    fill(color(HUE, SAT, BRIGHT - DEPTH))
    beginShape()
    {
      vertex(x, y + size)
      vertex(x + size, y + size)
      vertex(x + size - BEVEL, y + size - BEVEL)
      vertex(x + BEVEL, y + size - BEVEL)
    }
    endShape(CLOSE)
    
    pop()
  }
}