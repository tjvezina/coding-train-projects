let sequence = [0];
let counter = 1;
let maxValue = 0;

let env;
let osc;

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  background(28);
  fill(200).noStroke();
  textSize(height/25);
  textAlign(CENTER, CENTER);
  text('Audio Warning!\nHigh pitched tones ahead, click when ready.', width/2, height/2);
}

function mouseClicked() {
  if (env === undefined && millis() > 1000 && mouseButton === LEFT) {
    start();
  }
}

function start() {
  env = new p5.Env();
  env.setADSR(0.001, 0.2, 0.2, 0.5);
  env.setRange(0.2, 0);
  
  osc = new p5.Oscillator();
  osc.setType('sine');
  osc.amp(env);
  osc.start();
}

function draw() {
  if (env === undefined) return;

  background(28);
  translate(0, height/2);
  scale(width/maxValue, width/maxValue);
  
  if (frameCount % 20 === 0) {
    step();
  }
  
  colorMode(HSB);
  noFill();
  strokeWeight(0.5);
  for (let i = 0; i < sequence.length-1; i++) {
    stroke(i%360, 60, 90);
    const [a, b] = sequence.slice(i, i+2);
    const r = abs(a-b);
    arc((a+b)/2, 0, r, r, i%2===0 ? PI : 0, i%2===0 ? TWO_PI : PI);
  }
  colorMode(RGB);
}

function step() {
  const last = sequence[sequence.length-1];
  const next = ((last >= counter && !sequence.includes(last - counter)) ? last - counter : last + counter);
  sequence.push(next);
  counter++;
  
  maxValue = max(maxValue, next);
  
  const key = next % 88;
  osc.freq(440 * pow(2, ((key-49)/12)));
  env.play();
}