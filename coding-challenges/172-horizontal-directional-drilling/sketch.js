const VIEW_WIDTH = 1000;
const VIEW_HEIGHT = 600;
let viewScale = 1;
let viewExtents = { x: 0, y: 0, w: VIEW_WIDTH, h: VIEW_HEIGHT };

const GROUND_Y = 150;
const RIVER_WIDTH = VIEW_WIDTH*0.6;
const RIVER_DEPTH = RIVER_WIDTH*0.25;

let drill;
let isDead = false;

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  
  drill = new Drill();
  select('canvas').mousePressed(() => { if (!isDead) drill.flip(); });
}

function draw() {
  /*** UPDATE ***/
  
  if (!isDead) {
    drill.update();

    const { x, y } = drill.pos;
    if (x < 0 || x >= VIEW_WIDTH || y < GROUND_Y || y >= VIEW_HEIGHT ||
      collidePointEllipse(x, y, VIEW_WIDTH/2, GROUND_Y, RIVER_WIDTH, RIVER_DEPTH*2)) {
      isDead = true;
    }
  }
  
  /*** DRAW ***/
  
  background('#83BEF1');
  
  viewScale = (width/height < VIEW_WIDTH/VIEW_HEIGHT ? width/VIEW_WIDTH : height/VIEW_HEIGHT);
  viewExtents = { x: -width/2 / viewScale + VIEW_WIDTH/2, y: -height/2 / viewScale + VIEW_HEIGHT/2, w: width/viewScale, h: height/viewScale };
  translate(width/2, height/2);
  scale(viewScale);
  translate(-VIEW_WIDTH/2, -VIEW_HEIGHT/2);
  
  noStroke();
  fill('#3D2B22');
  rect(viewExtents.x, GROUND_Y, viewExtents.w, viewExtents.h - GROUND_Y);
  fill('#164B8D');
  arc(VIEW_WIDTH/2, GROUND_Y, RIVER_WIDTH, RIVER_DEPTH*2, 0, PI);
  
  // DEBUG OVERLAY
  // noFill();
  // strokeWeight(4);
  // stroke(0, 255, 0, 63);
  // rect(2, 2, VIEW_WIDTH-4, VIEW_HEIGHT-4);
  
  drill.draw();
}
