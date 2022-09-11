const S = 300; // Board size
let viewScale = 1;

let board = [[null, null, null], [null, null, null], [null, null, null]];

let nextTurn = 'X';

let gameOver = false;
let winRows = [];
let winCols = [];
let winDiag = [];

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
}

function draw() {
  background(42);
  
  viewScale = min(width, height) / (S*1.1);
  translate(width/2, height/2);
  scale(viewScale);

  noFill();
  
  strokeWeight(S*0.02);
  stroke(200);
  line(-S/6, -S/2, -S/6,  S/2);
  line( S/6, -S/2,  S/6,  S/2);
  line(-S/2, -S/6,  S/2, -S/6);
  line(-S/2,  S/6,  S/2,  S/6);
  
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      push();
      {
        translate((x-1) * S/3, (y-1) * S/3);
        const c = board[y][x];
        if (c === 'X') {
          stroke(255, 200, 150);
          line(-S/12, -S/12, S/12, S/12);
          line(-S/12, S/12, S/12, -S/12);
        }
        if (c === 'O') {
          stroke(150, 200, 255);
          circle(0, 0, S/6);
        }
      }
      pop();
    }
  }
  
  stroke(255, 100, 100);
  winRows.forEach((win, i) => {
    if (win) {
      const y = ((i-1)*S)/3;
      line(-S/2, y, S/2, y);
    }
  });
  winCols.forEach((win, i) => {
    if (win) {
      const x = ((i-1)*S)/3;
      line(x, -S/2, x, S/2);
    }
  })
  if (winDiag[0]) {
    line(-S/2, -S/2, S/2, S/2);
  }
  if (winDiag[1]) {
    line(-S/2, S/2, S/2, -S/2);
  }
}

function mouseClicked() {
  if (gameOver) {
    return;
  }
  
  const mX = (mouseX - width/2) / viewScale;
  const mY = (mouseY - height/2) / viewScale;
  
  const iX = floor((mX + S/2) / S * 3);
  const iY = floor((mY + S/2) / S * 3);
  
  if (iX >= 0 && iX <= 2 && iY >= 0 && iY <= 2) {
    place(iX, iY);
  }
}

function place(x, y) {
  if (board[y][x] === null) {
    board[y][x] = nextTurn;
    nextTurn = (nextTurn === 'X' ? 'O' : 'X');
    
    gameOver = board.flatMap(row => row).every(c => c !== null);
    checkState();
  }
}

function checkState() {
  for (let y = 0; y < 3; y++) {
    const values = [];
    for (let x = 0; x < 3; x++) {
      values.push(board[y][x]);
    }
    if (values.every(c => c !== null && c === values[0])) {
      winRows[y] = true;
      gameOver = true;
    }
  }
  
  for (let x = 0; x < 3; x++) {
    const values = [];
    for (let y = 0; y < 3; y++) {
      values.push(board[y][x]);
    }
    if (values.every(c => c !== null && c === values[0])) {
      winCols[x] = true;
      gameOver = true;
    }
  }
  
  const diag1 = [board[0][0], board[1][1], board[2][2]];
  if (diag1.every(c => c !== null && c === diag1[0])) {
    winDiag[0] = true;
    gameOver = true;
  }
  
  const diag2 = [board[2][0], board[1][1], board[0][2]];
  if (diag2.every(c => c !== null && c === diag2[0])) {
    winDiag[1] = true;
    gameOver = true;
  }
}