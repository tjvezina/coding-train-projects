class Snake {
  constructor() {
    this.head = createVector(0, 0);
    this.body = [createVector(this.head.x, this.head.y)];
    this.dir = 'R';
    this.len = 1;
    this.pendingMoves = [];
  }
  
  move(dir) {
    const { pendingMoves } = this;
    
    const dirs = ['U', 'L', 'D', 'R'];
    const prevDir = pendingMoves[0] || this.dir;
    if (dir === prevDir || prevDir === dirs[(dirs.indexOf(dir) + 2) % 4]) {
      return;
    }
    
    if (pendingMoves.length === 0) {
      pendingMoves.push(dir);
    } else {
      pendingMoves[1] = dir;
    }
  }

  update() {
    if (this.pendingMoves.length > 0) {
      this.dir = this.pendingMoves.splice(0, 1)[0];
    }
    
    switch (this.dir) {
      case 'U': --this.head.y; break;
      case 'D': ++this.head.y; break;
      case 'L': --this.head.x; break;
      case 'R': ++this.head.x; break;
    }
    this.head.x = constrain(this.head.x, 0, GRID_SIZE - 1);
    this.head.y = constrain(this.head.y, 0, GRID_SIZE - 1);

    for (let i = 1; i < this.body.length; i++) {
      const part = this.body[i];
      if (this.head.x == part.x && this.head.y == part.y) {
        lose = true;
        return;
      }
    }

    this.body.push(createVector(this.head.x, this.head.y));

    if (this.head.x == food.x && this.head.y == food.y) {
      ++this.len;
      return true;
    }

    while (this.body.length > this.len) {
      this.body.splice(0, 1);
    }

    return false;
  }

  draw() {
    fill(50, 140, 80);
    noStroke();
    let prevPart = this.body[this.body.length - 1];
    ellipse((prevPart.x + 0.5) * cellSize, (prevPart.y + 0.5) * cellSize, cellSize, cellSize);

    push();
    stroke(50, 140, 80);
    for (let i = this.body.length - 2; i >= 0; --i) {
      let nextPart = this.body[i];
      strokeWeight(map(i, this.body.length - 1, 0, cellSize, cellSize / 2));
      line((prevPart.x + 0.5) * cellSize, (prevPart.y + 0.5) * cellSize,
           (nextPart.x + 0.5) * cellSize, (nextPart.y + 0.5) * cellSize);
      prevPart = nextPart;
    }
    pop();
  }
}