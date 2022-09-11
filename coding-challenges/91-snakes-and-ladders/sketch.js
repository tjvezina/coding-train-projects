const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 10;
const SQUARE_SIZE = 60;

const LADDER_HEIGHTS = [1, 2, 2, 2, 2, 2, 3, 4];
const SNAKE_HEIGHTS = [1, 2, 2, 3, 3, 4, 5, 6];

let board;

function setup() {
  createCanvas(BOARD_WIDTH * SQUARE_SIZE, BOARD_HEIGHT * SQUARE_SIZE);
  
  const openTiles = new Array(BOARD_HEIGHT);
  for (let y = 0; y < BOARD_WIDTH; y++) {
    openTiles[y] = new Array(BOARD_WIDTH);
    for (let x = 0; x < BOARD_HEIGHT; x++) {
      openTiles[y][x] = { x, y, i: x + y*BOARD_WIDTH + 1 };
    }
  }
  
  const occupiedTiles = [0, BOARD_WIDTH*BOARD_HEIGHT - 1]; // Never use the first or last squares
  
  const snakes = [];
  const ladders = [];
  
  const tryPlaceElement = function(elementHeight) {
    // Choose a starting location with enough space for the height of the element
    const maxStart = (BOARD_HEIGHT - elementHeight) * BOARD_WIDTH;
    const startOptions = []
    for (let i = 0; i < maxStart; i++) {
      if (!occupiedTiles.includes(i)) {
        startOptions.push(i);
      }
    }
    if (startOptions.length === 0) return;
    const start = random(startOptions);
    const startY = floor(start/BOARD_WIDTH);
    
    // Choose an end location above the start, i.e. not more than 'elementHeight' squares away horizontally
    const endY = startY + elementHeight;
    let endMid = start + BOARD_WIDTH*elementHeight;
    if (elementHeight % 2 === 1) {
      const xOff = endMid - endY*BOARD_WIDTH;
      endMid = (endY+1)*BOARD_WIDTH - 1 - xOff;
    }
    const endMin = max(endMid - elementHeight, endY*BOARD_WIDTH);
    const endMax = min(endMid + elementHeight, (endY+1)*BOARD_WIDTH - 1);
    const endOptions = [];
    for (let i = endMin; i <= endMax; i++) {
      if (!occupiedTiles.includes(i)) {
        endOptions.push(i);
      }
    }
    if (endOptions.length === 0) return;
    const end = random(endOptions);

    // Occupy all covered squares, to prevent "nested" elements
    const startX = start - startY*BOARD_WIDTH;
    const endX = end - endY*BOARD_WIDTH;
    for (let y = startY; y <= endY; y++) {
      const x = map(y, startY, endY, startX, endX);
      if (abs(x-floor(x)) < 0.01) {
        const i = round(x) + y*BOARD_WIDTH;
        // TODO: If a covered square is already occupied, ignore it; however, this makes it very unlikely for a board to successfully generate, a better method of choosing from remaining tiles is necessary
        // if (occupiedTiles.includes(i)) return;
        occupiedTiles.push(i);
      }
    }
    return { start, end };
  }

  
  // Try to lazily place snakes and ladders, restarting if a row runs out of space
  let i = 0;
  while ((snakes.length < SNAKE_HEIGHTS.length || ladders.length < LADDER_HEIGHTS.length) && ++i < 100) {
    snakes.splice(0);
    ladders.splice(0);    
    
    for (const snakeHeight of SNAKE_HEIGHTS) {
      const snake = tryPlaceElement(snakeHeight);
      if (snake !== undefined) {
        snakes.push(snake);
      } else {
        break;
      }
    }
    
    for (const ladderHeight of LADDER_HEIGHTS) {
      const ladder = tryPlaceElement(ladderHeight);
      if (ladder !== undefined) {
        ladders.push(ladder);
      } else {
        break;
      }
    }
  }
  
  if (i === 100) {
    throw new Error('Failed to generate a board!');
  }
  
  board = new Board(BOARD_WIDTH, BOARD_HEIGHT, snakes, ladders);
}

function draw() {
  background(0);
  
  board.draw();
}