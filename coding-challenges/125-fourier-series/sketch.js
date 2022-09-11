const SERIES_DATA = {
  'Square Wave': {
    speed: i => i*2 - 1,
    radius: i => PI/4 * (i*2 - 1),
  },
  'Sawtooth': {
    speed: i => i,
    radius: i => PI/2 * (i * pow(-1, i)),
  },
};

const FPS = 60;
const WAVE_SCALE = 0.01;
let renderScale;

let seriesSelect;
let depthSlider;
let depthLabel;

let time = 0;
let wave = [0];
let prevDepth;

function windowResized() {
  resizeCanvas(windowWidth, height);
}

function setup() {
  createCanvas(windowWidth, 400);
  frameRate(FPS);
  renderScale = height*0.3;
  
  seriesSelect = createSelect();
  Object.keys(SERIES_DATA).forEach(key => seriesSelect.option(key));
  seriesSelect.changed(resetSeries);
  
  depthSlider = createSlider(0, 9, 0);
  depthSlider.style('margin-top', '1rem');
  depthSlider.style('width', '10rem');
  
  depthLabel = createP();
  
  resetSeries();
}

function resetSeries() {
  time = 0;
  wave.length = 0;
  depthSlider.value(2);
  prevDepth = depthSlider.value();
  depthLabel.html('Depth: ' + prevDepth);
}

function draw() {
  time += 1/FPS;
  
  clear();
  colorMode(HSB);
  
  translate(height/2, height/2);
  scale(renderScale);
  scale(1, -1);

  let series = SERIES_DATA[seriesSelect.value()];
  let depth = pow(2, depthSlider.value());
  let lastPos = createVector();
  for (let i = 1; i <= depth; i++) {
    const speed = series.speed(i);
    const radius = (1 / series.radius(i));
    const hue = (i-1)/depth * 360;
    
    noFill();
    strokeWeight(0.01);
    stroke(hue, 80, 100, 0.2);
    circle(lastPos.x, lastPos.y, radius*2);

    const p = createVector(radius * cos(time * speed), radius * sin(time * speed));

    stroke(hue, 80, 100);
    line(lastPos.x, lastPos.y, lastPos.x + p.x, lastPos.y + p.y);

    lastPos.add(p);
  }
  if (depth === prevDepth) {
    wave.unshift(lastPos.y);
  } else {
    wave.unshift(undefined);
    prevDepth = depth;
    depthLabel.html('Depth: ' + depth);
  }
  wave.splice(floor((width - 1.2*height)/renderScale / WAVE_SCALE) + 1);
  
  noFill();
  strokeWeight(0.01);
  stroke(0, 0, 50);
  line(lastPos.x, lastPos.y, height*0.6/renderScale, lastPos.y);
  
  stroke(0, 0, 20);
  line(height*0.6/renderScale, -1, height*0.6/renderScale, 1);
  line(height*0.6/renderScale, 0, (width-height*0.6)/renderScale, 0);
  
  stroke(0, 0, 80);
  beginShape();
  for (let i = 0; i < wave.length; i++) {
    const y = wave[i];
    if (y !== undefined) {
      vertex(height*0.6/renderScale + i*WAVE_SCALE, wave[i]);
    } else {
      endShape();
      beginShape();
    }
  }
  endShape();
}
