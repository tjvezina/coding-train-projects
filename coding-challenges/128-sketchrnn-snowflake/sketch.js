let model;
let initialized = false;
let pen;
let nextPath;

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  background(0);
  
  pen = new Pen();
  model = ml5.SketchRNN('snowflake', onModelLoaded);
}

function onModelLoaded(error) {
  if (error) throw new Error(error);
  
  initialized = true;

  generateSketch();
}

function generateSketch() {  
  background(0);
  
  pen.reset();
  model.reset();
  model.generate(onGeneratePath);
}

function onGeneratePath(error, path) {
  if (error) throw new Error(error);
  
  nextPath = path;
}

function draw() {  
  if (!initialized) {
    noStroke();
    fill(127);
    textAlign(CENTER, CENTER);
    textSize(width/40);
    text('Loading SketchRNN...', width/2, height/2);
    return;
  }
  
  translate(width/2, height/2);
  scale(min(width, height) / 800);
  
  if (nextPath !== undefined) {
    pen.move(nextPath);
    nextPath = undefined;
    
    if (pen.state !== PenState.End) {
      model.generate(onGeneratePath);
    }
  }
}

function mouseClicked() {
  generateSketch();
}
