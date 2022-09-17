const bubbleCount = 50;
let bubbles = [];
let mouseBubble;
let mouseStart;

let birdImage;
let ghostImages = [];

function preload() {
  birdImage = loadImage("./assets/unimpressed_bird.png");
  for (let i = 0; i < 4; ++i) {
    ghostImages[i] = loadImage(`./assets/ghost${i}.png`);
  }
}

function setup() {
  createCanvas(400, 400);
  createP('Click + drag');
}

function mouseMoved() {
  let mousePos = new Pos(mouseX, mouseY);
  for (let bubble of bubbles) {
    bubble.hovered = bubble.contains(mousePos);
  }
}

function mousePressed() {
  let bubblePopped = false;
  let mousePos = new Pos(mouseX, mouseY);
  for (let i = bubbles.length - 1; i >= 0; --i) {
    if (bubbles[i].contains(mousePos)) {
      bubbles.splice(i, 1);
      bubblePopped = true;
    }
  }
  
  if (!bubblePopped) {
    mouseBubble = new Bubble(0, mousePos, random(ghostImages));
    mouseStart = mousePos;
  }
}

function mouseDragged() {
  if (mouseBubble != undefined) {
	  mouseBubble.r = mouseStart.distance(new Pos(mouseX, mouseY));
  }
}

function mouseReleased() {
  if (mouseBubble != undefined) {
    if (mouseBubble.r > 5 && mouseBubble.r < width / 2 && mouseBubble.r < height / 2) {
	    bubbles.push(mouseBubble);
    }
    mouseBubble = undefined;
  }
}

function draw() {
  noTint();
  image(birdImage, 0, 0, width, height);
  background(0, 0, 0, 230);
  
  if (mouseBubble != undefined) {
    mouseBubble.show();
  }
  
  for (let bubble of bubbles) {
    bubble.overlap = false;
  }

  for (let i = 0; i < bubbles.length; ++i) {
    let bubble = bubbles[i];
    bubble.move();
    bubble.hovered = bubble.contains(new Pos(mouseX, mouseY));
    
    for (let j = i + 1; j < bubbles.length; ++j) {
      let other = bubbles[j];
	      if (bubble.intersects(other)) {
          bubble.overlap = true;
          other.overlap = true;
        }
    }
    
    bubble.show();
  }
}

class Bubble {
  constructor(r, pos, img) {
    this.r = r;
    this.pos = pos;
    this.img = img;
    this.c = random(127, 255);
    this.s = 2;
    this.hovered = false;
    this.overlap = false;
  }

  move() {
    this.pos.x = max(this.r, min(width - this.r, this.pos.x + random(-this.s, this.s)));
    this.pos.y = max(this.r, min(height - this.r, this.pos.y + random(-this.s, this.s)));
  }

  show() {
    if (this.r == 0) {
      return;
    }
    
    strokeWeight(this.r / 10);
    let h = (this.hovered ? 127 : 255);
    if (this.overlap) {
      tint(0, h, 0);
    } else {
			tint(255, h, 255);
    }
    // ellipse(this.pos.x, this.pos.y, this.r * 2);
    image(this.img,
          this.pos.x - this.r,
          this.pos.y - this.r,
          this.r * 2,
          this.r * 2);
  }
  
  contains(pos) {
    return this.pos.distance(pos) < this.r;
  }
  
  intersects(other) {
    return this.pos.distance(other.pos) < this.r + other.r;
  }
}

class Pos {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  
  distance(pos) {
    return dist(this.x, this.y, pos.x, pos.y);
  }
}