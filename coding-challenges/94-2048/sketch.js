const grid = [];
const tiles = [];
let pendingMove = null;
let isMoving = false;
let isGameOver = false;
let isYouWin = false;

function setup() {
  createCanvas(400, 400);
  
  for (let i = 0; i < 4; i++) {
    grid[i] = new Array(4).fill(null);
  }
  
  addTile();
}

function addTile() {
  const options = [];
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      if (grid[y][x] === null) {
        options.push(createVector(x, y));
      }
    }
  }
  
  const newTilePos = random(options);
  const tile = new Tile(newTilePos);
  grid[tile.pos.y][tile.pos.x] = tile;
  tiles.push(tile);
}

function onTileMerged(tile) {
  tiles.splice(tiles.indexOf(tile), 1);
}

function draw() {
  background(80);
  
  stroke(60);
  strokeWeight(16);
  for (let i = 0; i <= 4; i++) {
    line(width/4*i, 0, width/4*i, height);
    line(0, height/4*i, width, height/4*i);
  }
  
  if (isMoving && tiles.every(tile => !tile.isMoving)) {
    isMoving = false;
    addTile();
    
    checkGameOver();
    // TODO: Check win
    
    if (pendingMove !== null) {
      doMove(pendingMove);
      pendingMove = null;
    }
  }
    
  tiles.forEach(tile => {
    tile.update();
    tile.draw();
  });

  if (isGameOver || isYouWin) {
    noStroke();
    fill(isGameOver ? 200 : 50, isGameOver ? 50 : 200, 50);
    textAlign(CENTER, CENTER);
    textSize(width*0.25);
    textLeading(width*0.25);
    textStyle(BOLD);
    text(isGameOver ? 'GAME\nOVER' : 'YOU\nWIN', width*0.5, height*0.52);
  }
}

function checkGameOver() {
  if (grid.some(row => row.some(tile => tile !== null && tile.baseValue === 11))) {
    isYouWin = true;
    pendingMove = null;
    return;
  }
  
  if (grid.some(row => row.some(tile => tile === null))) {
    return;
  }
  
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j].baseValue === grid[i+1][j].baseValue ||
          grid[j][i].baseValue === grid[j][i+1].baseValue) {
        return;
      }
    }
  }
  
  isGameOver = true;
  pendingMove = null;
}

function keyPressed() {
  if (isGameOver || isYouWin) {
    return;
  }
  
  if ([LEFT_ARROW, RIGHT_ARROW, UP_ARROW, DOWN_ARROW].includes(keyCode)) {
    const move = keyCode;
    
    if (tiles.some(tile => tile.isMoving)) {
      pendingMove = move;
    } else {
      doMove(move);
    }
  }
}

function doMove(move) {
  if (move === RIGHT_ARROW || move === LEFT_ARROW) {
    const dir = createVector(move === RIGHT_ARROW ? 1 : -1, 0);
    for (let y = 0; y < 4; y++) {
      const start = createVector(move === RIGHT_ARROW ? 0 : 3, y);
      const tiles = [grid[y][0], grid[y][1], grid[y][2], grid[y][3]];
      if (move === LEFT_ARROW) tiles.reverse();
      collapseRow(tiles, start, dir);
    }
  } else {
    const dir = createVector(0, move === DOWN_ARROW ? 1 : -1);
    for (let x = 0; x < 4; x++) {
      const start = createVector(x, move === DOWN_ARROW ? 0 : 3);
      const tiles = [grid[0][x], grid[1][x], grid[2][x], grid[3][x]];
      if (move === UP_ARROW) tiles.reverse();
      collapseRow(tiles, start, dir);
    }
  }
  
  // If input did not result in any movement, ignore it
  isMoving = tiles.some(tile => tile.isMoving);
  
  if (isMoving) {
    tiles.forEach(tile => tile.isNew = false);
  }
}

// Takes an array of four tiles, always in order by collapse direction (i.e. 0 -> 3)
function collapseRow(tiles, start, dir) {
  const combined = [];
  
  const getPos = function(i) {
    return p5.Vector.add(start, p5.Vector.mult(dir, i));
  }
  
  const moveTile = function(tile, i, j) {
    const prevPos = getPos(i);
    const nextPos = getPos(j);
    const otherTile = tiles[j] || null;
    tile.move(nextPos, otherTile || null);
    grid[prevPos.y][prevPos.x] = null;
    grid[nextPos.y][nextPos.x] = tile;
    tiles[i] = null;
    tiles[j] = tile;
    if (otherTile !== null) {
      combined.push(tile);
    }
  }
  
  for (let i = 2; i >= 0; i--) {
    const a = tiles[i];
    if (a === null) {
      continue;
    }
    for (let j = i+1; j < 4; j++) {
      const b = tiles[j];
      if (b === null) {
        if (j === 3) {
          // Move to the end of the row
          moveTile(a, i, j);
          break;
        }
      } else {
        if (a.baseValue === b.baseValue && !combined.includes(b)) {
          // The next adjascent tile can be merged into
          moveTile(a, i, j);
        } else if (j > i+1) {
          // Move into the last open space before the next time
          moveTile(a, i, j-1);
        }
        break;
      }
    }
  }
}