class Grid {
  constructor(width, height) {
    noSmooth()
    
    this.ant = { pos: createVector(0, 0), dir: 3 }
    
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
    
    noStroke()
    fill(200, 0, 0)
    circle((this.ant.pos.x + 0.5) * CELL_SIZE, (this.ant.pos.y + 0.5) * CELL_SIZE, CELL_SIZE)
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
  
  reset() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.setCell(x, y, false)
      }
    }
    
    this.ant.pos.set(floor(this.width/2), floor(this.height/2))
    this.ant.dir = 2
  }
  
  update() {
    const { ant } = this
    
    const cell = this.getCell(ant.pos.x, ant.pos.y)
    
    if (cell) {
      ant.dir--
    } else {
      ant.dir++
    }
    
    ant.dir = (ant.dir < 0 ? 3 : (ant.dir > 3 ? 0 : ant.dir))
    
    this.setCell(ant.pos.x, ant.pos.y, !cell)
    
    switch (ant.dir) {
      case 0: ant.pos.x++; break;
      case 1: ant.pos.y++; break;
      case 2: ant.pos.x--; break;
      case 3: ant.pos.y--; break;
    }
    
    if (ant.pos.x < 0) ant.pos.x += this.width
    if (ant.pos.x >= this.width) ant.pos.x -= this.width
    if (ant.pos.y < 0) ant.pos.y += this.height
    if (ant.pos.y >= this.height) ant.pos.y -= this.height
  }
}