class Grid {
  constructor(width, height) {
    noSmooth()
    
    this.neighbors = new Array(width)
    for (let x = 0; x < this.neighbors.length; x++) {
      this.neighbors[x] = new Array(height).fill(0)
    }
    
    this.img = createImage(width, height)
    
    // Initialize all alpha values to 255 (opaque black image)
    this.img.loadPixels()
    this.img.pixels.fill(0)
    for (let i = 3; i < this.img.pixels.length; i += 4) {
      this.img.pixels[i] = 255
    }
    this.img.updatePixels()    
  }
  
  get width() { return this.img.width }
  get height() { return this.img.height }
  
  draw() {
    image(this.img, 0, 0, width, height)
  }
  
  getCell(x, y) {
    return this.img.pixels[(x + y*this.width) * 4] > 0
  }
  
  setCell(x, y, isAlive) {
    const i = (x + y*this.width) * 4
    this.img.pixels.fill(isAlive ? 255 : 0, i, i+3)
  }
  
  apply() {
    this.img.updatePixels()
  }
  
  clear() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.setCell(x, y, false)
      }
    }
  }
  
  randomize() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.setCell(x, y, random(1) > 0.5)
      }
    }
  }
  
  update() {
    this.neighbors.forEach(column => column.fill(0))
    
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.getCell(x, y)) {
          for (let yOff = -1; yOff <= 1; yOff++) {
            for (let xOff = -1; xOff <= 1; xOff++) {
              if (xOff !== 0 || yOff !== 0) {
                const x2 = this._validateIndex(x + xOff, this.width)
                const y2 = this._validateIndex(y + yOff, this.height)
                if (x2 >= 0 && y2 >= 0) {
                  this.neighbors[x2][y2]++
                }
              }
            }
          }
        }
      }
    }
    
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const isAlive = this.getCell(x, y)
        const neighbors = this.neighbors[x][y]
        
        if (isAlive && (neighbors < 2 || neighbors > 3)) {
          this.setCell(x, y, false)
        }
        if (!isAlive && neighbors === 3) {
          this.setCell(x, y, true)
        }
      }
    }
  }
  
  _validateIndex(i, max) {
    if (wrapToggle.checked()) {
      return ((i % max) + max) % max
    } else {
      return (i >= 0 && i < max ? i : -1)
    }
  }
}