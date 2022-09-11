const SIZE = 50;
const THICK = 4;
const SPACE = 1;

function SevenSegmentDisplay(x, y) {
  this.pos = createVector(x, y);
  this.hex = 0x0;
}

SevenSegmentDisplay.prototype.draw = function() {
  push();
  translate(this.pos.x, this.pos.y);
  drawSegment(0, 0, true,  this.hex >> 0 & 1); // A (Top)
  drawSegment(1, 0, false, this.hex >> 1 & 1); // B (Top-Right)
  drawSegment(1, 1, false, this.hex >> 2 & 1); // C (Bot-Right)
  drawSegment(0, 2, true,  this.hex >> 3 & 1); // D (Bot)
  drawSegment(0, 1, false, this.hex >> 4 & 1); // E (Bot-Left)
  drawSegment(0, 0, false, this.hex >> 5 & 1); // F (Top-Left)
  drawSegment(0, 1, true,  this.hex >> 6 & 1); // G (Mid)
  pop();
}

function drawSegment(iX, iY, isHorizontal, isEnabled) {
  push();
  translate(SIZE * iX, SIZE * iY);
  rotate(isHorizontal ? 0 : PI/2);
  noStroke();
  fill(isEnabled ? color(20, 150, 0) : color(60));
  beginShape();
  vertex(SPACE, 0);
  vertex(SPACE + THICK, THICK);
  vertex(SIZE - (SPACE + THICK), THICK);
  vertex(SIZE - SPACE, 0);
  vertex(SIZE - (SPACE + THICK), -THICK);
  vertex(SPACE + THICK, -THICK);
  endShape(CLOSE);
  pop();
}