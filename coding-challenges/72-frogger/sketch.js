const WIDTH = 540
const HEIGHT = 720
const HEADER = 120
const ROWS = 12
const ROW_HEIGHT = (HEIGHT - HEADER) / ROWS

let tweener

let level1Data
let level

let player
let playerImage

let gameWon = false

function preload() {
  level1Data = loadJSON('data/level1.json')
  playerImage = loadImage('assets/frog.png')
}

function setup() {
  createCanvas(WIDTH, HEIGHT)
  
  tweener = new Tweener()
  
  level = new Level(level1Data.rows)
  
  player = new Player(playerImage, onPlayerMoved)
}

function draw() {
  if (gameWon === true) {
    textAlign(CENTER, CENTER)
    textSize(100)
    textStyle(BOLD)
    fill(255, 230, 0)
    stroke(207, 188, 17)
    strokeWeight(12)
    text('YOU WIN', width/2, height/2)

    noLoop()
    return
  }
  
  background(42)
  
  if (player.state === PlayerState.ALIVE && !player.isMoving) {
    const row = level.rows[player.pos.y]

    if (row.type === RowType.RIVER) {
      player.pos.x += (deltaTime / 1000) * row.speed
      if (player.pos.x < -player.size/2 || player.pos.x > width + player.size/2) {
        player.reset()
      }
    } else if (row.type === RowType.ROAD) {
      const playerRect = player.rect
      if (row.units.some(unit => unit.intersects(playerRect))) {
        player.flatten()
      }
    }
  }
  
  tweener.update()
  
  level.draw()
  player.draw()
}

function onPlayerMoved() {
  const playerCenter = player.center
  
  if (player.pos.y === -1) {
    const slot = level.slots.filter(slot => slot.contains(playerCenter))[0]
    if (slot === undefined || slot.filled) {
      player.drown()
    } else {
      slot.filled = true
      if (level.slots.some(slot => !slot.filled)) {
        player.reset()
      } else {
        gameWon = true
      }
    }
    
    return
  }
  
  const row = level.rows[player.pos.y]
  
  if (row.type === RowType.RIVER) {
    if (!row.units.some(unit => unit.contains(playerCenter))) {
      player.drown()
    }
  }
}