const BORDER = 3;

class Tile {
  constructor(i, j, srcImage) {
    this.iStart = i;
    this.jStart = j;
    this.i = i;
    this.j = j;
    this.x = TILE_SIZE * i;
    this.y = TILE_SIZE * j;
    this.image = createGraphics(TILE_SIZE, TILE_SIZE);
    
    const srcWidth = round(srcImage.width / GRID_SIZE);
    const srcHeight = round(srcImage.height / GRID_SIZE);
    this.image.copy(srcImage, srcWidth * i, srcHeight * j, srcWidth, srcHeight, 0, 0, TILE_SIZE, TILE_SIZE);
  }
  
  draw() {
    const { i, j, x, y } = this;
    image(this.image, x, y);
    
    noFill();
    strokeWeight(BORDER+0.5);
    stroke(60);
    rect(x + BORDER/2, y + BORDER/2, TILE_SIZE - BORDER, TILE_SIZE - BORDER);
  }
}