class Board {
  constructor(width, height, snakes, ladders) {
    Object.assign(this, { width, height, snakes, ladders });
    
    this.squares = [width * height];
    
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const i = x + y*this.width;
        this.squares[i] = {
          number: i + 1,
          pos: createVector(y % 2 === 0 ? x : this.width - 1 - x, this.height - 1 - y).mult(SQUARE_SIZE)
        }
      }
    }
  }
  
  draw() {
    textAlign(CENTER, CENTER);
    textSize(SQUARE_SIZE * 0.5);
    textStyle(BOLD);
    
    const { squares, snakes, ladders } = this;
    
    squares.forEach(square => {
      const { pos, number } = square;
      
      noStroke();
      fill(number % 2 == 0 ? color(97, 77, 40) : color(125, 100, 57));
      rect(pos.x + 1, pos.y + 1, SQUARE_SIZE - 2, SQUARE_SIZE - 2);

      fill(188, 191, 80);
      text(`${number}`, pos.x + SQUARE_SIZE/2, pos.y + SQUARE_SIZE/2 + 1.5);
    })
    
    noFill();
    strokeWeight(SQUARE_SIZE * 0.2);
    stroke(200, 200, 0);
    snakes.forEach(snake => {
      const startPos = squares[snake.start].pos;
      const endPos = squares[snake.end].pos;
      line(startPos.x + SQUARE_SIZE/2, startPos.y + SQUARE_SIZE/2, endPos.x + SQUARE_SIZE/2, endPos.y + SQUARE_SIZE/2);
    })
    stroke(64, 43, 24);
    ladders.forEach(ladder => {
      const startPos = squares[ladder.start].pos;
      const endPos = squares[ladder.end].pos;
      line(startPos.x + SQUARE_SIZE/2, startPos.y + SQUARE_SIZE/2, endPos.x + SQUARE_SIZE/2, endPos.y + SQUARE_SIZE/2);
    })

  }
}