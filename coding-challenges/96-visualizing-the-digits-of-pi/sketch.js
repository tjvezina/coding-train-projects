const DIGITS_PER_SEC = 1.5;
const MAX_DIGITS = 256;

let digits = [];
let i = 0;
const arcs = [];
const digitAngles = [];

function setup() {
  createCanvas(720, 800);
  colorMode(HSB);
  
  piString = loadStrings('assets/pi-1million.txt', onDataLoaded);
  
  for (let i = 0; i < 10; i++) {
    arcs.push({ start: i/10*TWO_PI-HALF_PI+0.02, end: (i+1)/10*TWO_PI-HALF_PI-0.02 });
    digitAngles.push((i+0.5)/10*TWO_PI-HALF_PI);
  }
}

function onDataLoaded(results) {
  digits = results[0].split('').map(Number);
}

function draw() {
  if (digits.length === 0) {
    return;
  }
  
  clear();
  
  translate(width/2, height-width/2);
  noFill();
  
  const r = width*0.4;
  
  // Inner arcs for each digit
  strokeWeight(2);
  const t = pow(millis()/1000 * DIGITS_PER_SEC, 1.333);
  const start = min(digits.length - 1, floor(t));
  const end = max(0, start - MAX_DIGITS);
  for (let i = start; i >= end; i--) {
    const digit = digits[i];
    const scale = pow(map(i, t, t-MAX_DIGITS, 1, 0), 3);
    stroke(digit*36, 60, 80, scale-0.1);
    arc(0, 0, 2*r*scale, 2*r*scale, arcs[digit].start, arcs[digit].end);
  }
  
  // Outer arcs/digits
  for (let i = 0; i < 10; i++) {    
    noFill();
    if (digits[start] === i) {
      strokeWeight(12);
      stroke(0, 0, 100, 1 - (t-start));
      arc(0, 0, 2*r, 2*r, arcs[i].start, arcs[i].end)
    }
    
    strokeWeight(4);
    stroke(i*36, 100, 100);
    arc(0, 0, 2*r, 2*r, arcs[i].start, arcs[i].end);
    
    stroke(0);
    strokeWeight(6);
    fill(i*36, 50, 80);
    const digitAngle = digitAngles[i];
    textStyle(BOLD);
    textSize(width*0.05);
    textAlign(CENTER, CENTER);
    text(i, 1.1*r*cos(digitAngle), 1.1*r*sin(digitAngle));
  }
  
  // Pi
  const first = t-12;
  const last = t+12;
  
  if (first < 0) {
    const alpha = 1-abs(-1-t)/12;
    fill(0, 0, 80, alpha);
    stroke(0, 0, 0, alpha);
    text('3.', map(-1, first, last, -width*0.4, width*0.4) + width*0.00, height*0.05 - height/2);
  }
  
  for (let i = max(0, floor(first)); i <= min(digits.length-1, floor(last)); i++) {
    const alpha = 1-abs(i-t)/12;
    fill(digits[i]*36, 60, 80, alpha);
    // stroke(0, 0, floor(t) === i ? (1-(t-i))*100 : 0, alpha);
    stroke(0, 0, max(0, (1-abs(i-t)))*100, alpha);
    text(digits[i], map(i, first, last, -width*0.4, width*0.4) + width*0.00, height*0.05 - height/2);
  }
  
  noStroke();
  fill(0, 0, 28);
  textSize(width*0.025);
  text(`#${start+1}`, 0, height*0.0-height/2);
}