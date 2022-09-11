class Sprite {
  constructor(spriteSheet, frameData, fps = 10) {
    Object.assign(this, { spriteSheet, frameData, fps });
    this.frameTime = 0;
    this.pos = createVector(0, 0);
  }
  
  draw() {
    this.frameTime += deltaTime/1000;
    this.frameTime %= this.frameData.frames.length / this.fps;
    
    const frameIndex = floor(this.frameTime * this.fps)
    const frame = this.frameData.frames[frameIndex];
    const { x, y, w, h } = frame.position;
    image(this.spriteSheet, this.pos.x - w/2, this.pos.y - h/2, w, h, x, y, w, h);
  }
}