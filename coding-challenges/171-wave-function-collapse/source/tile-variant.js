class TileVariant {
  constructor(tileIndex, variantIndex, img, rotation, edges, weight, exceptions = []) {
    Object.assign(this, { tileIndex, variantIndex, img, rotation, edges, weight, exceptions });
  }
  
  toTileEdge(edge) {
    return (edge - this.rotation + 4) % 4;
  }
  
  draw(x, y, size, opacity = 255) {
    const { img, rotation } = this;
    
    push();
    {
      imageMode(CENTER);
      translate(x + size/2, y + size/2);
      rotate(PI/2 * rotation);
      image(img, 0, 0, size, size);
    }
    pop();
  }
}