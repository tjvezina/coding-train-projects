let spriteSheet;
let spriteData;

const horses = [];

function preload() {
  spriteSheet = loadImage('assets/horse.png');
  spriteData = loadJSON('assets/horse.json');
}

function setup() {
  createCanvas(600, 600);
  
  for (let i = 0; i < 5; i++) {
    const speed = random(0.5, 1.5);
    const horse = new Sprite(spriteSheet, spriteData, 10*speed);
    horse.pos.set(80, map(i, 0, 4, height*0.15, height*0.85));
    horse.speed = speed;
    horses.push(horse);
  }
}

function draw() {
  background(42);
  
  horses.forEach(horse => {
    horse.pos.x += horse.speed * 200 / (frameRate() || 60);
    if (horse.pos.x > width + 80) {
      horse.pos.x = -80;
    }
    horse.draw();
  });
}