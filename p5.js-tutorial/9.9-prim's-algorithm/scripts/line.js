class Line {
  constructor(a, b, t) {
    this.a = a;
    this.b = b;
    this.t = t;
    this.l = 0;
    this.brightness = 1;
    this.fade = false;
  }

  getLength() {
    return this.a.pos.dist(this.b.pos);
  }

  draw(col, weight, useBrightness = false) {
    let endX;
    let endY;
    let delta = 1 / max(frameRate(), 1 / 60);
    if (!this.fade) {
      this.l = min(this.l + delta / (this.t / 1000), 1);
      endX = this.a.pos.x + ((this.b.pos.x - this.a.pos.x) * this.l);
      endY = this.a.pos.y + ((this.b.pos.y - this.a.pos.y) * this.l);
    } else {
      this.l = max(this.l - delta / (this.t / 1000), 0);
      col = lerpColor(color(0, 0, 0), col, this.l);
      endX = this.b.pos.x;
      endY = this.b.pos.y;
    }

    push();
    strokeWeight(weight);
    stroke(lerpColor(color(0, 0, 0), col, useBrightness ? this.brightness : 1));
    line(this.a.pos.x, this.a.pos.y, endX, endY);
    pop();
  }
}
