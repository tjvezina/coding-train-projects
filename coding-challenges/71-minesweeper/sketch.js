const GRID_SIZE = 20
const BEE_RATIO = 0.1

let grid

let resultsDiv
let gameIsStarted = false
let gameIsOver = false

function setup() {
  // Disable context menu on right click
  document.oncontextmenu = function() { return false; }
  
  createCanvas(600, 600);
  if (width !== height) {
    throw Error('Canvas must be square')
  }
  
  const restartButton = createButton("Restart")
  restartButton.style('margin-top', '16px')
  restartButton.mousePressed(clearGrid)
    
  resultsDiv = createDiv()
  resultsDiv.style('padding', '16px')
  resultsDiv.style('font-weight', 'bold')
  
  clearGrid()
}

function clearGrid() {
  gameIsStarted = false
  gameIsOver = false
  
  resultsDiv.style('color', 'gold')
  resultsDiv.html('Avoid the bees!')
  
  grid = []
  for (let x = 0; x < GRID_SIZE; x++) {
    grid[x] = []
    for (let y = 0; y < GRID_SIZE; y++) {
      grid[x][y] = new Cell(x, y)
    }
  }
}

function placeBees(ignoreCell) {  
  gameIsStarted = true
  
  const cells = []
  grid.forEach(col => col.forEach(cell => cells.push(cell)))
  cells.splice(cells.indexOf(ignoreCell), 1)
  
  const totalBees = round((GRID_SIZE * GRID_SIZE) * BEE_RATIO)
  for (let i = 0; i < totalBees && i < GRID_SIZE * GRID_SIZE - 1; i++) {
    const cell = cells.splice(floor(random(cells.length)), 1)[0]
    cell.hasBee = true
    getNeighbors(cell).forEach(neighbor => neighbor.neighborBeeCount++)
  }  
}

function draw() {
  background(42)
  
  grid.forEach(col => col.forEach(cell => cell.draw()))
}

function mouseReleased() {
  if (gameIsOver) {
    return
  }
  
  if (mouseX < 0 || mouseX >= width || mouseY < 0 || mouseY >= height) {
    return
  }
    
  const cellX = floor(mouseX / (width / GRID_SIZE))
  const cellY = floor(mouseY / (height / GRID_SIZE))
  const cell = grid[cellX][cellY]
  
  if (mouseButton === LEFT) {
    if (!gameIsStarted) {
      placeBees(cell)
    }
    
    if (!cell.isRevealed) {
      onReveal(cell)
    } else {
      const flagCount = getNeighbors(cell).filter(neighbor => neighbor.isFlagged).length
      if (flagCount === cell.neighborBeeCount) {
        getNeighbors(cell).forEach(neighbor => onReveal(neighbor))
      }
    }
    
    checkWin()
  } else if (mouseButton === RIGHT) {
    if (!cell.isRevealed) {
      cell.isFlagged = !cell.isFlagged
    }
  }
}
    
function onReveal(cell) {
  if (cell.tryReveal()) {
    if (cell.hasBee) {
      onBeeRevealed(cell)
    } else if (cell.neighborBeeCount === 0) {
      getNeighbors(cell).forEach(neighbor => onReveal(neighbor))
    }
  }      
}
  
function getNeighbors(cell) {
  const neighbors = []
  
  for (let xOff = -1; xOff <= 1; xOff++) {
    for (let yOff = -1; yOff <= 1; yOff++) {
      if (xOff === 0 && yOff === 0) {
        continue
      }
        
      const nX = cell.x + xOff
      const nY = cell.y + yOff

      if (nX >= 0 && nX < GRID_SIZE && nY >= 0 && nY < GRID_SIZE) {
        neighbors.push(grid[nX][nY])
      }
    }
  }
    
  return neighbors
}
  
function onBeeRevealed(cell) {
  cell.didSting = true
  for (let x = 0; x < GRID_SIZE; x++) {
    for (let y = 0; y < GRID_SIZE; y++) {
      if (grid[x][y].hasBee) {
        grid[x][y].isRevealed = true
      }
    }
  }
  resultsDiv.style('color', 'red')
  resultsDiv.html('GAME OVER!')
  gameIsOver = true
}
  
function checkWin() {
  for (let x = 0; x < grid.length; x++) {
    const col = grid[x]
    for (let y = 0; y < col.length; y++) {
      const cell = col[y]
      if (!cell.isRevealed && !cell.hasBee) {
        return
      }
    }
  }
    
  resultsDiv.style('color', 'green')
  resultsDiv.html('YOU WIN!')
  gameIsOver = true
}
  