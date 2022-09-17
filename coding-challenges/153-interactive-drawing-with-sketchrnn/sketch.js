const VIEW_SIZE = 800;
let viewScale = 1;

let model;
let initialized = false;
let pen;
let nextPath;

let isUserDrawing = false;
let seedPoints = [];

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.mousePressed(onMousePressed);
  canvas.mouseReleased(onMouseReleased);
  pixelDensity(1);
  background(0);
  
  pen = new Pen();
  model = ml5.sketchRNN('cat', onModelLoaded);
}

function onModelLoaded(error) {
  if (error) throw new Error(error);
  
  initialized = true;

  reset();
}

function reset() {
  clearScreen();
  
  seedPoints.length = 0;
  pen.reset();
  model.reset();
}

function clearScreen() {
  background(0);
  fill(80).noStroke().text('Begin drawing a cat, and the AI will finish it', width/2, height - 25);
  noFill().stroke(255);
}

function onCompleteSketch() {
  model.generate(onGeneratePath);
}

let i = 0;
function onGeneratePath(error, path) {
  if (error) throw new Error(error);
  
  if (i++ < 5) console.log(path);
  
  nextPath = path;
}

function draw() {  
  if (!initialized) {
    background(0);
    noStroke();
    fill(127);
    textAlign(CENTER, CENTER);
    textSize(width/40);
    text('Loading SketchRNN...', width/2, height/2);
    return;
  }
  
  
  noFill();
  
  viewScale = min(width, height) / VIEW_SIZE;
  translate(width/2, height/2);
  scale(viewScale);
  
  if (nextPath !== undefined) {
    pen.move(nextPath);
    nextPath = undefined;
    
    if (pen.state !== PenState.End) {
      model.generate(onGeneratePath);
    }
  }
}

function onMousePressed() {
  if (seedPoints.length > 0 && pen.state !== PenState.End) return;

  reset();
  
  isUserDrawing = true;

  const x = (mouseX - width/2) / viewScale;
  const y = (mouseY - height/2) / viewScale;
  
  seedPoints.push(createVector(x, y));
  pen.pos.set(x, y);
}

function mouseDragged() {
  if (!isUserDrawing) return;
  
  const dx = movedX / viewScale;
  const dy = movedY / viewScale;
  
  const lastPoint = seedPoints.slice(-1)[0];
  seedPoints.push(createVector(lastPoint.x + dx, lastPoint.y + dy));
  
  pen.move({ dx, dy, pen: PenState.Down });
}

function onMouseReleased() {
  if (!isUserDrawing) return;

  pen.move({ dx: 0, dy: 0, pen: PenState.Up });
  
  isUserDrawing = false;
  
  const simplifiedSeedPoints = rdpSimplification(seedPoints, 2);
  
  clearScreen();

  beginShape();
  simplifiedSeedPoints.forEach(p => vertex(p.x, p.y));
  endShape();
  
  // Redraw the simplified path
  const seedPath = [];
  const startPoint = simplifiedSeedPoints[0];
  pen.pos.set(startPoint.x, startPoint.y);
  for (let i = 1; i < simplifiedSeedPoints.length; i++) {
    const next = simplifiedSeedPoints[i];
    const prev = simplifiedSeedPoints[i-1];
    const path = {
      dx: next.x - prev.x,
      dy: next.y - prev.y,
      pen: (i === simplifiedSeedPoints.length - 1 ? PenState.Up : PenState.Down),
    }
    
    pen.move(path);
    seedPath.push(path);
  }
  
  model.generate(seedPath, onGeneratePath);
}

function rdpSimplification(points, epsilon) {
  const pairs = [[0, points.length - 1]];

  const simplified = [...pairs[0]];

  while (pairs.length > 0) {
    const [iStart, iEnd] = pairs.shift();
    let iFurthest = findFurthest(points, iStart, iEnd, epsilon);
    
    if (iFurthest !== null) {
      pairs.unshift([iStart, iFurthest], [iFurthest, iEnd]);
      
      simplified.push(iFurthest);
    }
  }
  
  simplified.sort((a, b) => a - b);
  
  return simplified.map(i => points[i]);
}

function findFurthest(points, iStart, iEnd, epsilon) {
  if (iStart >= iEnd - 1) {
    return null;
  }
  
  const a = points[iStart];
  const b = points[iEnd];
  const ab = p5.Vector.sub(b, a);
  
  let record = -Infinity;
  let iRecord = -1;
  for (let i = iStart + 1; i < iEnd; i++) {
    const p = points[i];
    const ap = p5.Vector.sub(p, a);
    const dist = ap.mag() * abs(sin(ab.angleBetween(ap)));
    
    if (dist > record) {
      record = dist;
      iRecord = i;
    }
  }
  
  if (record < epsilon) {
    return null;
  }
  
  return iRecord;
}

