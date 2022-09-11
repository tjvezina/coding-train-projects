let cells = [];

function setup() {
  createCanvas(400, 400);
  colorMode(HSB, 100);
  
  for (let i = 0; i < 1; ++i) {
    cells.push(new Cell());
  }
}

function draw() {
  background(0);
  
  for (let cell of cells) {
    cell.update();
    cell.draw();
  }
}

function mousePressed() {
  let mousePos = createVector(mouseX, mouseY);
  for (let i = cells.length - 1; i >= 0; --i) {
    let cell = cells[i];
    if (mousePos.dist(cells[i].pos) < cells[i].r) {
      cells.push(new Cell(cell.pos, cell.col, cell.r / 2));
      cells.push(new Cell(cell.pos, cell.col, cell.r / 2));
      cells.splice(i, 1);
    }
  }
}

//****************************************
// CELL

function Cell(pos, col, r) {
  this.pos = (pos ? pos.copy() : createVector(random(width), random(height)));
  this.r = r || 40;
  this.vel = p5.Vector.random2D();
  this.col = col || color(random(100), 80, 100);
  let h = hue(this.col) + (random() > 0.5 ? 5 : -5);
  if (h < 0) h += 100;
  if (h > 100) h -= 100;
  this.col = color(h, saturation(this.col), brightness(this.col), 80);
}

Cell.prototype.update = function() {
  this.r += 0.02;
  this.vel.rotate(10 * PI/180 * (random() > 0.5 ? 1 : -1));
  this.pos.add(this.vel);
  
  if (this.pos.x < 0) this.pos.x += width;
  if (this.pos.x > width) this.pos.x -= width;
  if (this.pos.y < 0) this.pos.y += height;
  if (this.pos.y > height) this.pos.y -= height;
}

Cell.prototype.draw = function() {
  noStroke();
  fill(this.col);
  ellipse(this.pos.x, this.pos.y, this.r * 2);
  
  if (this.pos.x < this.r) ellipse(this.pos.x + width, this.pos.y, this.r * 2);
  if (this.pos.x > width - this.r) ellipse(this.pos.x - width, this.pos.y, this.r * 2);
  if (this.pos.y < this.r) ellipse(this.pos.x, this.pos.y + height, this.r * 2);
  if (this.pos.y > height - this.r) ellipse(this.pos.x, this.pos.y - height, this.r * 2);
}
