const PIE_INTERVAL = 0.5; // Seconds
let pieTimer = 0;

const DIGIT_SIZE = 120;
const DIGIT_RANGE = 5; // Visible digits on either side of the active digit

const HEART_SIZE = 32;

let showNextDigits = false;

let plateImg;
let pieImg;
let pieTinImg;
let heartImg;

let plate;
let pies = [];

let digits;
let iDigit = 0;

let isMainMenu = true;
let lives = 3;
let tError = 0;
let gameIsOver = false;

let font;

function preload() {
  loadImage('assets/plate.png', result => plateImg = result);
  loadImage('assets/pie.png', result => pieImg = result);
  loadImage('assets/pie_tin.png', result => pieTinImg = result);
  loadImage('assets/heart.png', result => heartImg = result);
  
  loadStrings('assets/one-million.txt', result => digits = result[0]);
  
  loadFont('assets/LEMONMILK-Medium.otf', result => font = result);
}

function setup() {
  const canvas = createCanvas(800, 600);
  pixelDensity(1);
  ellipseMode(CENTER);
  imageMode(CENTER);
  rectMode(CENTER);
  textFont(font);
  
  canvas.mouseClicked(() => {
    if (isMainMenu) {
      startGame(mouseX < width/2 ? 'easy' : 'hard');
    }
    if (gameIsOver) {
      reset();
    }
  });  
  
  reset();
}

function reset() {
  pieTimer = 0;
  plate = undefined;
  pies.length = 0;
  iDigit = 0;
  lives = 3;
  gameIsOver = false;
  isMainMenu = true;
}

function startGame(mode) {
  switch (mode) {
    case 'easy':
      showNextDigits = true;
      break;
    case 'hard':
      showNextDigits = false;
      break;
    default:
      console.error(`Unknown game mode: ${mode}`);
  }
  
  plate = new Plate();
  isMainMenu = false;
}

function gameOver() {
  gameIsOver = true;
  pies.length = 0;
}

function updateGame() {
  if (!gameIsOver) {
    pieTimer += deltaTime/1000;
    if (pieTimer >= PIE_INTERVAL) {
      pieTimer = 0;
      pies.push(new Pie());
    }
  }

  tError = max(0, tError - deltaTime/1000/0.5);

  pies.forEach(pie => pie.update());

  pies = pies.filter(pie => pie.pos.y < height + PIE_DIAM/2);

  plate.update();

}

function draw() {
  if (!isMainMenu) {
    updateGame();
  }
  
  background(lerpColor(color('#6DB9E7'), color('#DB5959'), tError));
  
  if (isMainMenu) {
    fill(200, 200, 200, 127);
    rect(width/4, height*3/5, width*3/7, height/3);
    rect(width*3/4, height*3/5, width*3/7, height/3);
    
    strokeWeight(2);
    stroke('#1C50209E');
    fill('#1177179E');
    textAlign(CENTER, CENTER);
    textSize(80);
    text('Pi in the Sky', width/2, height/5);
    
    textSize(50);
    text('Play Easy', width/4, height/2);
    textSize(25);
    text('Catch the right pies\nto rebuild pi!', width/4, height*2/3);
    
    textSize(50);
    text('Play Hard', width*3/4, height/2);
    textSize(25);
    text('How many digits of pi\ncan you remember?', width*3/4, height*2/3);
    
    
    
    return;
  }

  const iCurrent = (showNextDigits ? iDigit + 1 : iDigit)

  noStroke();
  textAlign(CENTER, CENTER);
  textSize(DIGIT_SIZE);
  for (let i = max(-2, iCurrent - DIGIT_RANGE - 1); i <= iCurrent + DIGIT_RANGE - 1; i++) {
    if (i >= iCurrent && (!showNextDigits && !gameIsOver)) {
      break;
    }
    
    const x = map(i, iCurrent-DIGIT_RANGE-1, iCurrent+DIGIT_RANGE-1, 0, width);
    const char = (i === -2 ? '3' : (i === -1 ? '.' : digits[i]));
    fill(i === iCurrent-1 || (iCurrent === 0 && i < 0) ? '#1177179E' : (i < iCurrent ? '#11771735' : '#5D647F3F'));
    text(char, x, height/2);
  }
  
  plate.draw();
  
  pies.forEach(pie => pie.draw());
  
  strokeWeight(2);
  stroke('#1C50209E');
  fill('#1177179E');
  if (!gameIsOver) {
    textAlign(LEFT, TOP);
    textSize(32);
    text(`Score: ${iDigit}`, 16, 10);
  } else {
    textAlign(CENTER, CENTER);
    textSize(60);
    text(`Final score\n${iDigit}`, width/2, height/5);
  }
  
  for (let i = 0; i < lives; i++) {
    const x = width - (HEART_SIZE*1.25 * (i+1));
    image(heartImg, x, HEART_SIZE*1.25, HEART_SIZE, HEART_SIZE);
  }
}

function onPieCaught(pie) {
  if (pie.sliceCount === Number(digits[iDigit])) {
    ++iDigit;
  } else {
    --lives;
    tError = 1;
    
    if (lives === 0) {
      gameOver();
    }
  }
}
