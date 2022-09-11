const TILESET_NAMES = ['roads', 'clouds', 'pipes', 'polka', 'twin-tracks', 'tracks', 'circuit'];
const tilesets = {};
let activeTileset = TILESET_NAMES[6];

const VIEW_SIZE = 800;
let viewScale = 1;

let tileGrid;

let tilesetSelect;

function preload() {
  for (let name of TILESET_NAMES) {
    tilesets[name] = new Tileset(name);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  
  tilesetSelect = createSelect();
  TILESET_NAMES.forEach(tilesetName => tilesetSelect.option(tilesetName));
  tilesetSelect.selected(activeTileset);
  tilesetSelect.changed(() => {
    activeTileset = tilesetSelect.value();
    resetGrid();
  });
  
  resetGrid();
}

function resetGrid() {
  tileGrid = new TileGrid(tilesets[activeTileset], 32);
}

function draw() {
  /*** UPDATE ***/
  
  if (!tileGrid.isComplete) {
    tileGrid.collapseCell();
  }
  // Generation occasionally gets stuck; the only reasonable solution is to try again!
  if (tileGrid.isStuck) {
    resetGrid();
  }
  
  /*** DRAW ***/
  
  background(0);
  
  viewScale = min(width, height) / VIEW_SIZE;
  translate(width/2, height/2);
  scale(viewScale);
  translate(-VIEW_SIZE/2, -VIEW_SIZE/2);
  
  tileGrid.draw();
}
