const GRID_SIZE = 7;
let spacing;

const grid = new Array(GRID_SIZE * GRID_SIZE).fill(false);

const path = [];
const badMoves = [];
let isDone = false;

let stepCount = 0;
let stepCountText;

function setup() {
  createCanvas(600, 600);
  pixelDensity(1);
  strokeCap(SQUARE);
  
  spacing = width/GRID_SIZE;
  
  stepCountText = createP();
  createButton('Restart').mousePressed(reset);
  
  move(0, 0);
}

function reset() {
  grid.fill(false);
  path.length = 0;
  badMoves.length = 0;
  isDone = false;
  stepCount = 0;
  
  move(0, 0);
}

function draw() {
  background(42);
  
  stepCountText.html(stepCount.toLocaleString() + ' steps');
  
  noFill();
  strokeWeight(2);
  stroke(127);
  for (let i = 0; i <= GRID_SIZE; i++) {
    const p = map(i, 0, GRID_SIZE, 0, width);
    line(0, p, width, p);
    line(p, 0, p, height);
  }
  
  const msStart = millis();
  while (!isDone && millis() - msStart < 1000/60) {
    const moves = getValidMoves();
    if (moves.length > 0) {
      const { x, y } = random(moves);
      move(x, y);
    } else if (grid.some(visited => !visited)) {
      unmove();
    } else {
      isDone = true;
    }
  }
  
  if (!isDone) {
    noFill();
    stroke(225, 120, 100);
    strokeWeight(spacing*0.1);
    badMoves.forEach((moves, i) => {
      const pos = path[i];
      moves.forEach(({ x, y }) => {
        line(
          (pos.x+0.5) * spacing, (pos.y+0.5) * spacing,
          (pos.x+(x-pos.x)/2+0.5) * spacing, (pos.y+(y-pos.y)/2+0.5) * spacing
        );
      });
    });
  }
  
  noFill();
  strokeWeight(spacing*0.4);
  stroke(200);
  beginShape();
  path.forEach(p => vertex((p.x+0.5) * spacing, (p.y+0.5) * spacing));
  endShape();
  
  const { x, y } = getPos();
  noStroke();
  fill(200);
  circle((x+0.5) * spacing, (y+0.5) * spacing, spacing*0.5);
}

function getValidMoves() {
  const pos = getPos();
  return [createVector(1, 0), createVector(-1, 0), createVector(0, 1), createVector(0, -1)]
    .map(move => move.add(pos))
    .filter(({ x, y }) => x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE && !grid[y*GRID_SIZE+x])
    .filter(({ x, y }) => badMoves.slice(-1)[0].every(badMove => x !== badMove.x && y !== badMove.y));
}

function getPos() {
  return path.slice(-1)[0];
}

function move(x, y) {
  path.push(createVector(x, y));
  badMoves.push([]);
  grid[y*GRID_SIZE + x] = true;
  
  ++stepCount;
}

function unmove() {
  const pos = getPos();
  grid[pos.y*GRID_SIZE + pos.x] = false;
  path.pop();
  badMoves.pop();
  badMoves.slice(-1)[0].push(pos);
  
  ++stepCount;
}