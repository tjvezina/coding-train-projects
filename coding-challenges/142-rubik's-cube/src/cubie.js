const INNER_COLOR = 60;

class Cubie {
  constructor({ x, y, z }) {
    Object.assign(this, arguments[0]);
    
    const offset = 1/2/SIZE - 0.5;
    this.pos = createVector(
      x/SIZE + offset,
      y/SIZE + offset,
      z/SIZE + offset
    );
  }
  
  draw() {
    const { x, y, z, pos } = this;
    
    push();
    {
      strokeWeight(4);
      translate(pos.x, pos.y, pos.z);
      scale(1/SIZE / 2 * 0.975);

      // RIGHT
      fill(x === SIZE-1 ? SIDE_COLORS[0] : INNER_COLOR);
      beginShape();
      vertex( 1,  1,  1);
      vertex( 1, -1,  1);
      vertex( 1, -1, -1);
      vertex( 1,  1, -1);
      endShape(CLOSE);
      
      // LEFT
      fill(x === 0 ? SIDE_COLORS[1] : INNER_COLOR);
      beginShape();
      vertex(-1,  1,  1);
      vertex(-1, -1,  1);
      vertex(-1, -1, -1);
      vertex(-1,  1, -1);
      endShape(CLOSE);

      // UP
      fill(y === SIZE-1 ? SIDE_COLORS[2] : INNER_COLOR);
      beginShape();
      vertex( 1,  1,  1);
      vertex(-1,  1,  1);
      vertex(-1,  1, -1);
      vertex( 1,  1, -1);
      endShape(CLOSE);
      
      // DOWN
      fill(y === 0 ? SIDE_COLORS[3] : INNER_COLOR);
      beginShape();
      vertex( 1, -1,  1);
      vertex(-1, -1,  1);
      vertex(-1, -1, -1);
      vertex( 1, -1, -1);
      endShape(CLOSE);
      
      // FRONT
      fill(z === SIZE-1 ? SIDE_COLORS[4] : INNER_COLOR);
      beginShape();
      vertex( 1,  1,  1);
      vertex(-1,  1,  1);
      vertex(-1, -1,  1);
      vertex( 1, -1,  1);
      endShape(CLOSE);
      
      // BACK
      fill(z === 0 ? SIDE_COLORS[5] : INNER_COLOR);
      beginShape();
      vertex( 1,  1, -1);
      vertex(-1,  1, -1);
      vertex(-1, -1, -1);
      vertex( 1, -1, -1);
      endShape(CLOSE);
    }
    pop();
  }
}