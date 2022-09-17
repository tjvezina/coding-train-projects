class Level {
  constructor(rows) {
    const SLOT_COUNT = 5
    const SLOT_SIZE = 40
    
    if (rows.length !== ROWS) {
      throw Error(`Expected ${ROWS} rows in level data, but got ${rows.length}`)
    }
    this.rows = []
    rows.forEach(row => this.rows.push(new Row(row, this.rows.length)))
    
    this.slots = []
    
    for (let i = 0; i < SLOT_COUNT; i++) {
      const x = map(i, 0, 4, -width * 0.42, width * 0.42) + width/2 - SLOT_SIZE/2
      const y = HEADER - SLOT_SIZE
      
      this.slots.push(new Rect(x, y, SLOT_SIZE, SLOT_SIZE))
    }
  }
  
  draw() {
    // HEADER ROW
    noStroke()
    fill(Row.getColor(RowType.GRASS))
    rect(0, 0, width, HEADER)
    
    fill(Row.getColor(RowType.RIVER))
    this.slots.forEach(slot => {
      slot.draw()
      if (slot.filled) {
        noTint()
        image(playerImage, slot.x+4, slot.y+4, slot.w-8, slot.h-8)
      }
    })
    
    // ROWS
    this.rows.forEach(row => row.draw())
    
    // UI
    fill(0)
    rect(0, 0, width, HEADER/2)
    strokeWeight(3)
    stroke(200)
    line(0, HEADER/2-1, width, HEADER/2-1)
  }
}