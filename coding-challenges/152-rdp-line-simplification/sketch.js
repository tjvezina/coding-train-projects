const points = [];
let simplified = []; // Indices of original points to keep

let isRecordingLine = false;

let epsilonSlider;
let epsilon;

function setup() {
  createCanvas(600, 600);
  pixelDensity(1);
  strokeCap(ROUND);
  strokeJoin(ROUND);
  
  createP('Epsilon').style('margin-bottom', '0.5rem');
  epsilonSlider = createSlider(0, 1, 0.5, 0.001).style('width', '20rem');
}

function draw() {
  background(42);
  
  epsilon = pow(epsilonSlider.value(), 6) * width/2;
  
  noStroke();
  fill(80);
  textSize(20);
  textAlign(CENTER);
  textStyle(BOLD);
  let msg = 'Draw a line';
  if (points.length > 0) {
    if (isRecordingLine) {
      msg = `${points.length}`;
    } else {
      msg = `${simplified.length} / ${points.length} (${round(100 * simplified.length/points.length)}%)`;
    }
  }
  text(msg, width/2, height - 32);
  
  if (points.length > 0) {
    noFill();
    strokeWeight(isRecordingLine ? 4 : 1);
    stroke(isRecordingLine ? 255 : 80);
    beginShape();
    points.forEach(p => vertex(p.x, p.y));
    endShape();
    
    if (!isRecordingLine) {
      rdpSimplification();
      
      strokeWeight(4);
      stroke(255);
      beginShape();
      simplified.forEach(i => vertex(points[i].x, points[i].y));
      endShape();
    }
  }
}

function rdpSimplification() {
  const pairs = [[0, points.length - 1]];

  simplified = [...pairs[0]];

  while (pairs.length > 0) {
    const [iStart, iEnd] = pairs.shift();
    let iFurthest = findFurthest(iStart, iEnd);
    
    if (iFurthest !== null) {
      pairs.unshift([iStart, iFurthest], [iFurthest, iEnd]);
      
      simplified.push(iFurthest);
    }
  }
  
  simplified.sort((a, b) => a - b);
}

function findFurthest(iStart, iEnd) {
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

function mousePressed() {
  if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) {
    isRecordingLine = true;
    points.length = 0;
    points.push(createVector(mouseX, mouseY));
  }
}

function mouseDragged() {
  if (isRecordingLine) {
    if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) {
      points.push(createVector(mouseX, mouseY));
    } else {
      isRecordingLine = false;
    }
  }
}

function mouseReleased() {
  if (isRecordingLine) {
    points.push(createVector(mouseX, mouseY));
    isRecordingLine = false;
  }
}
