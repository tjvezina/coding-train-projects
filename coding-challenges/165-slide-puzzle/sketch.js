const VIEW_SIZE = 800;
let viewScale = 1;

const GRID_SIZE = 4;
const TILE_SIZE = VIEW_SIZE / GRID_SIZE;

const SLIDE_TIME = 0.05;

const tiles = [];
let blank = { i: 3, j: 0 };
let moveableTiles = [];
let pendingTile = null;

let isAnimating = false;
let animatingTile = null;
let t = 0;

let isSolved = false;

let photo;

function preload() {
  photo = loadImage('assets/marcy.png');
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  
  for (let j = 0; j < GRID_SIZE; j++) {
    for (let i = 0; i < GRID_SIZE; i++) {
      tiles.push(i === blank.i && j === blank.j ? null : new Tile(i, j, photo));
    }
  }
  
  shuffleTiles();
  
  updateMoveableTiles();
}

function shuffleTiles() {
  updateMoveableTiles();
  for (let i = 0; i < 1000; i++) {
    move(random(moveableTiles), { animate: false });
    updateMoveableTiles();
  }
}

function draw() {
  if (isAnimating) {
    t = min(1, t + deltaTime/1000 / SLIDE_TIME);
    
    animatingTile.x = lerp(blank.i, animatingTile.i, t) * TILE_SIZE;
    animatingTile.y = lerp(blank.j, animatingTile.j, t) * TILE_SIZE;
    
    if (t === 1) {
      isAnimating = false;
      animatingTile = null;
      
      if (pendingTile !== null) {
        move(pendingTile);
        pendingTile = null;
      }
    }
  }
  
  background(42);
  
  viewScale = min(width, height) / VIEW_SIZE;
  translate(width/2, height/2);
  scale(viewScale);
  translate(-VIEW_SIZE/2, -VIEW_SIZE/2);
  
  if (isSolved) {
    textSize(TILE_SIZE * 0.2);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    noStroke();
    fill('#57E45B');
    text('SOLVED!', (blank.i+0.5)*TILE_SIZE, (blank.j+0.5)*TILE_SIZE);
  }
  
  tiles.forEach(tile => {
    if (tile !== null) {
      tile.draw()
    }
  });
}

function getTile(i, j) {
  if (i >= 0 && i < GRID_SIZE && j >= 0 && j < GRID_SIZE) {
    return tiles[j*GRID_SIZE + i] || undefined;
  }
  return undefined;
}

function updateMoveableTiles() {
  const { i, j } = blank;
  moveableTiles = [{ i: i+1, j }, { i: i-1, j }, { i, j: j+1 }, { i, j: j-1 }]
    .map(({ i, j }) => getTile(i, j))
    .filter(tile => tile !== undefined);
}

function move(tile, { animate = true } = {}) {
  if (isSolved) {
    return;
  }
  
  const iTile = tile.j*GRID_SIZE + tile.i;
  const iBlank = blank.j*GRID_SIZE + blank.i;
  [tiles[iTile], tiles[iBlank]] = [tiles[iBlank], tiles[iTile]];  
  [tile.i, blank.i] = [blank.i, tile.i];
  [tile.j, blank.j] = [blank.j, tile.j];
  
  if (animate) {
    isAnimating = true;
    animatingTile = tile;
    t = 0;
  } else {
    tile.x = tile.i * TILE_SIZE;
    tile.y = tile.j * TILE_SIZE;
  }
  
  updateMoveableTiles();
  
  isSolved = animate && tiles.every(tile => tile === null || (tile.i === tile.iStart && tile.j === tile.jStart));
}

function mouseClicked() {
  const mx = (mouseX - width/2) / viewScale + VIEW_SIZE/2;
  const my = (mouseY - height/2) / viewScale + VIEW_SIZE/2;
  
  const i = floor(mx / TILE_SIZE);
  const j = floor(my / TILE_SIZE);
  
  const tile = getTile(i, j);
  
  if (moveableTiles.includes(tile)) {
    if (isAnimating) {
      pendingTile = tile;
    } else {
      move(tile);
    }
  }
}

function keyPressed() {
  let tile;
  if (keyCode === LEFT_ARROW || key === 'a') {
    tile = getTile(blank.i+1, blank.j);
  }
  if (keyCode === RIGHT_ARROW || key === 'd') {
    tile = getTile(blank.i-1, blank.j);
  }
  if (keyCode === UP_ARROW || key === 'w') {
    tile = getTile(blank.i, blank.j+1);
  }
  if (keyCode === DOWN_ARROW || key === 's') {
    tile = getTile(blank.i, blank.j-1);
  }
  
  if (tile !== undefined) {
    if (isAnimating) {
      pendingTIle = tile;
    } else {
      move(tile);
    }
  }
}
