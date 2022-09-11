const ROWS = 15;
let SPACE;
let DIAM;
const SPEED = 1/ROWS; // Loops per second

let startTime = 0;
let loopTime = 0;

const curves = [];

let selected = { x: 0, y: 0, gcd: 0 };

function windowResized() {
  const size = min(windowWidth, windowHeight);
  resizeCanvas(size, size);
  SPACE = size/(ROWS+1);
  DIAM = SPACE*0.8;
}

function setup() {
  const size = min(windowWidth, windowHeight);
  createCanvas(size, size);
  SPACE = size/(ROWS+1);
  DIAM = SPACE*0.8;
  
  for (let y = 1; y <= ROWS; y++) {
    curves.push([]);
    for (let x = 1; x <= ROWS; x++) {
      const gcd = getGCD(x, y);
      if (gcd === 1) {
        curves[y-1].push({ gcd, curve: new Curve(x, y) });
      } else {
        curves[y-1].push({ gcd, curve: curves[y/gcd-1][x/gcd-1].curve });
      }
    }
  }
  
  startTime = millis();
}

function draw() {
  loopTime = (millis() - startTime)/1000 * SPEED;
  
  const cellX = floor(constrain(mouseX, 0, width)/SPACE);
  const cellY = floor(constrain(mouseY, 0, height)/SPACE);
  if (cellX > 0 && cellY > 0) {
    const gcd = getGCD(cellX, cellY);
    selected = { x: cellX/gcd, y: cellY/gcd, gcd };
  } else {
    selected = { x: 0, y: 0, gcd: 0 };
  }
  
  clear();
  
  for (let i = 1; i < ROWS+1; i++) {
    drawHeaderCircle(i, 0);
    drawHeaderCircle(0, i);
  }
  
  for (let y = 1; y < ROWS+1; y++) {
    for (let x = 1; x < ROWS+1; x++) {
      const posX = (x+0.5)*SPACE;
      const posY = (y+0.5)*SPACE;
      const curveData = curves[y-1][x-1];
      curveData.curve.draw(posX, posY, curveData.gcd);
    }
  }
}

function drawHeaderCircle(x, y) {
  const posX = (x+0.5)*SPACE;
  const posY = (y+0.5)*SPACE;

  const p = getPoint(max(x, y), max(x, y), loopTime%1);

  strokeWeight(DIAM*0.02);
  if (selected.gcd > 0 && (selected.x*selected.gcd === x || selected.y*selected.gcd === y)) {
    stroke(255);  
  } else {
    stroke(255, 255, 255, 31);
  }
  if (x === 0) {
    line(0, posY + p.y, width, posY + p.y);
  } else {
    line(posX + p.x, 0, posX + p.x, height);
  }
  
  noFill();
  strokeWeight(DIAM*0.02);
  stroke('#247EE2');
  circle(posX, posY, DIAM);

  stroke(255, 255, 255, 63);
  line(posX, posY, posX + p.x, posY + p.y);
  stroke(255);
  strokeWeight(DIAM*0.06);
  point(posX + p.x, posY + p.y);
  
  noStroke();
  if (selected.gcd > 0 && (selected.x*selected.gcd === x || selected.y*selected.gcd === y)) {
    fill(255);
  } else {
    fill(255, 255, 255, 63);
  }
  textAlign(CENTER, CENTER);
  textSize(DIAM/3);
  text(x + y, posX, posY);
}

function getPoint(x, y, t) {
  return { x: sin(t*TWO_PI*x)*DIAM/2, y: -cos(t*TWO_PI*y)*DIAM/2 };
}

function getGCD(a, b) {
  while(b > 0) {
    var hold = b;
    b = a % b;
    a = hold;
  }
  return a;
}

function getLCM(a, b) {
  return (a === 0 || b === 0 ? 0 : (a*b)/getGCD(a, b));
}