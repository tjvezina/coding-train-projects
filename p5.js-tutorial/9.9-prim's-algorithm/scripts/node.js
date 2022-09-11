const MAX_NODE_SIZE = 30;

function getNodeSize() {
  return MAX_NODE_SIZE - (nodeCount / 10);
}

class Vert {
  constructor(pos, i) {
    this.pos = pos;
    this.i = i;
  }

  draw(connected) {
    let nodeSize = getNodeSize();
    push();
    strokeWeight(2);
    stroke(255);
    fill(connected ? 255 : 0);
    ellipse(this.pos.x, this.pos.y, nodeSize);
    fill(connected ? 0 : 255);
    textAlign(CENTER);
    strokeWeight(0);
    textSize(nodeSize * 0.6);
    text(this.i, this.pos.x, this.pos.y + nodeSize / 4.8);
    pop();
  }
}
