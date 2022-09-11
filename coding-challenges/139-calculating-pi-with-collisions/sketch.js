const STEPS_PER_FRAME = 10000000;
const DIGITS = 7;

let blockA;
let blockB;
let clackSound;

let collisionCount = 0;
let didCollideThisFrame = false;

function preload() {
  clackSound = loadSound('assets/clack.wav');
}

function setup() {
  createCanvas(600, 400);
  pixelDensity(1);
  
  // Width and mass don't correspond, so the blocks stay visible while the mass ratio skyrockets
  blockA = new Block({ x: 200, w: 40, m: 1, vel: 0, col: color('#D48B31') });
  blockB = new Block({ x: 400, w: 200, m: pow(100, DIGITS), vel: -2/STEPS_PER_FRAME, col: color('#2C72C9') });
}

function draw() {
  background(42);
  
  didCollideThisFrame = false;
  for (let i = 0; i < STEPS_PER_FRAME; i++) {
    blockA.update();
    blockB.update();

    if (blockA.checkCollision(blockB)) {
      const { vel: v1, m: m1 } = blockA;
      const { vel: v2, m: m2 } = blockB;

      blockA.vel = ((m1-m2)/(m1+m2))*v1 + ((2*m2)/(m1+m2))*v2;
      blockB.vel = ((2*m1)/(m1+m2))*v1 + ((m2-m1)/(m1+m2))*v2;

      onCollision();
    }
  }
  
  if (didCollideThisFrame) {
    clackSound.play();
  }
  
  blockA.draw();
  blockB.draw();
  
  if (blockA.vel > 0 && blockB.vel > 0 && blockA.vel < blockB.vel) {
    colorMode(HSB);
    fill(360 * noise(floor(millis()/200)), 75, 90);
    colorMode(RGB);
  } else {
    fill(80);
  }
  noStroke();
  textSize(20);
  textStyle(BOLD);
  textAlign(RIGHT);
  text(collisionCount, width-50, 50);
}

function onCollision() {
   didCollideThisFrame = true;
  ++collisionCount;
}
