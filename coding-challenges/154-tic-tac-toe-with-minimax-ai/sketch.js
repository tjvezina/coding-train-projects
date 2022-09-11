const S = 300; // Board size
let viewScale = 1;

let board = [[null, null, null], [null, null, null], [null, null, null]];

const PLAYER = 'O';
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
  
  if (PLAYER !== nextTurn) {
    aiTurn();
  }
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
  if (gameOver || nextTurn !== PLAYER) {
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
    
    gameOver = board.flatMap(row => row).every(c => c !== null) || checkState(board, { saveState: true });
    
    if (!gameOver && nextTurn !== PLAYER) {
      setTimeout(aiTurn, 1000);
    }
  }
}

function checkState(board, options) {
  let gameOver = false;
  
  for (let y = 0; y < 3; y++) {
    const values = [];
    for (let x = 0; x < 3; x++) {
      values.push(board[y][x]);
    }
    if (values.every(c => c !== null && c === values[0])) {
      gameOver = true;
      if (options.saveState) {
        winRows[y] = true;
      }
    }
  }
  
  for (let x = 0; x < 3; x++) {
    const values = [];
    for (let y = 0; y < 3; y++) {
      values.push(board[y][x]);
    }
    if (values.every(c => c !== null && c === values[0])) {
      gameOver = true;
      if (options.saveState) {
        winCols[x] = true;
      }
    }
  }
  
  const diag1 = [board[0][0], board[1][1], board[2][2]];
  if (diag1.every(c => c !== null && c === diag1[0])) {
    gameOver = true;
    if (options.saveState) {
      winDiag[0] = true;
    }
  }
  
  const diag2 = [board[2][0], board[1][1], board[0][2]];
  if (diag2.every(c => c !== null && c === diag2[0])) {
    gameOver = true;
    if (options.saveState) {
      winDiag[1] = true;
    }
  }
  
  return gameOver;
}

function aiTurn() {
  const moveScores = getMoves(board).map(move => ({ move, score: minimax(board, move, nextTurn) }))
  moveScores.sort((a, b) => b.score - a.score);
  const bestMoves = moveScores.filter(moveData => moveData.score === moveScores[0].score).map(moveData => moveData.move);
  const move = random(bestMoves);
  
  place(move.x, move.y);
}

function getMoves(board) {
  const moves = [];
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      if (board[y][x] === null) {
        moves.push({ x, y });
      }
    }
  }
  return moves;
}

function minimax(board, move, turn) {
  const nextBoard = [];
  for (let y = 0; y < 3; y++) {
    nextBoard[y] = [];
    for (let x = 0; x < 3; x++) {
      nextBoard[y][x] = board[y][x];
    }
  }
  
  nextBoard[move.y][move.x] = turn;
  
  // This move results in game over
  if (checkState(nextBoard, {})) {
    return (turn === PLAYER ? -1 : 1);
  }
  
  // This move results in a tie
  if (nextBoard.flatMap(row => row).every(c => c !== null)) {
    return 0;
  }

  // Check subsequent moves, min/max-ing to find best option
  const nextTurn = (turn === 'X' ? 'O' : 'X');
  const nextMoves = getMoves(nextBoard);
  const scores = nextMoves.map(nextMove => minimax(nextBoard, nextMove, nextTurn));
  scores.sort((a, b) => a - b);
  
  // On AI turns, score is maximized - on player turns, it is minimized
  return (nextTurn === PLAYER ? scores[0] : scores.slice(-1)[0]);
}