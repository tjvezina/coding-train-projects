const FPS = 45;

let nodeSlider;

let frameRateText;
let remainingTimeText;
let progressText;
let pathCountText;

function setup() {
  createCanvas(400, 400);
  frameRate(FPS);

  const headerDiv = createDiv();
  select('body').elt.prepend(headerDiv.elt);

  createElement('h2', "Travelling Salesman Problem").parent(headerDiv);
  createElement('h3', "Brute-forcing the shortest path between nodes").parent(headerDiv);

  UIElement.setRowWidth(`${width}px`);
  UIElement.setLabelWidth('5rem');

  nodeSlider = new Slider('Nodes', 3, 20, 10);
  nodeSlider.changed(run);

  const container = createDiv().class('container').style(`width: ${width}px;`);

  remainingTimeText = createLabelRow('Time remaining:');
  progressText = createLabelRow('Progress:');
  frameRateText = createLabelRow('Paths/frame:');
  pathCountText = createLabelRow('Paths checked:');

  run();

  function createLabelRow(labelText) {
    const row = createDiv().class('row').parent(container);
    createP(labelText).class('left bright').parent(row);
    return createP('').class('right').parent(row);
  }
}

function mousePressed() {
  if (!isRunning && mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    run();
  }
}

// ****************************************
// DRAWING

function draw() {
  update();
  updateSecondsRemaining();

  clear();
  drawGrid();
  drawDetails();
}

function drawGrid() {
  const GRID_COUNT = 10;

  background(0);

  push();
  strokeWeight(1);
  stroke(42);
  for (let i = 1; i < GRID_COUNT; ++i) {
    let x = width / GRID_COUNT * i;
    line(x, 0, x, height);
    let y = height / GRID_COUNT * i;
    line(0, y, width, y);
  }
  pop();

  if (nodes.length) {
    drawPath(iBest, color(20, 180, 50), 4);
    drawPath(iList, color(63), 2);

    for (let i = 0; i < nodes.length; ++i) {
      nodes[i].draw();
    }
  }
}

function drawPath(iArray, color, weight) {
  stroke(color);
  strokeWeight(weight);

  let prevNode = nodes[iArray[0]];
  for (let i = 1; i < iArray.length; ++i) {
    let nextNode = nodes[iArray[i]];
    line(prevNode.x, prevNode.y, nextNode.x, nextNode.y);
    prevNode = nextNode;
  }
}

function drawDetails() {
  if (permutationCounter == undefined) {
    return;
  }

  let percent = Number(permutationCounter * 100000n / permutationTotal) / 1000;
  percent = formatPercent(percent);
  let counter = formatBigInt(permutationCounter);
  let total = formatBigInt(permutationTotal);

  frameRateText.html(formatBigInt(pathsPerFrame));
  progressText.html(percent + '%');
  remainingTimeText.html(secondsRemaining);
  pathCountText.html(`${counter}\n/ ${total}`);
}

function updateSecondsRemaining() {
  if (!isRunning || !frameRate()) {
    secondsRemaining = '00:00';
    return;
  }

  pathsPerFrameHistory.push(pathsPerFrame);

  if (pathsPerFrameHistory.length < FPS) {
    secondsRemaining = "Calculating...";
    return;
  }

  const now = millis();
  if (now - lastTimeUpdate > 200) {
    lastTimeUpdate = now;
  } else {
    return;
  }

  const avgPathsPerFrame = pathsPerFrameHistory.reduce((a, b) => a + b) / pathsPerFrameHistory.length;
  const framesLeft = Number(permutationTotal - permutationCounter) / avgPathsPerFrame;
  const totalSec = round(framesLeft / FPS);

  let divisor = 1;

  let seconds = nextTimeInc(60);
  let minutes = nextTimeInc(60);

  let str = formatTimeValue(minutes) + ":" + formatTimeValue(seconds);

  if (totalSec >= divisor) {
    let hours = nextTimeInc(24);
    str = formatTimeValue(hours) + ":" + str;

    if (totalSec >= divisor) {
      let days = nextTimeInc(30);
      str = formatTimeValue(days) + "d " + str;

      if (totalSec >= divisor) {
        let months = nextTimeInc(12);
        str = formatTimeValue(months) + "m " + str;

        if (totalSec >= divisor) {
          let years = floor(totalSec / divisor);
          str = formatBigInt(years) + "y " + str;
        }
      }
    }
  }

  pathsPerFrameHistory.shift();

  secondsRemaining = str;

  function nextTimeInc(inc) {
    let result = floor(totalSec / divisor) % inc;
    divisor *= inc;
    return result;
  }

  function formatTimeValue(value, minDigits = 2) {
    let digits = max(1, floor(log(value) / log(10)) + 1);
    let valueStr = value.toString();
    while (valueStr.length < minDigits) {
      valueStr = "0" + valueStr;
    }
    return valueStr;
  }
}

function formatBigInt(int) {
  let str = int.toString();
  for (let i = str.length - 3; i > 0; i -= 3) {
    let start = str.substring(0, i);
    let end = str.substring(i, str.length);
    str = start + "," + end;
  }
  return str;
}

function formatPercent(percent, decimals = 3) {
  let digits = max(1, floor(log(percent) / log(10)) + 1);
  let str = percent.toString();

  if (str.length == digits) {
    str += ".";
  }

  while (str.length < digits + 1 + decimals) {
    str += "0";
  }

  return str;
}

// ****************************************
// NODE

function Node(id, pos) {
  this.id = id;
  this.pos = pos;
  this.x = pos.x * width;
  this.y = pos.y * height;
}

Node.prototype.draw = function() {
  fill(color(63, 0, 127));
  stroke(color(127, 31, 127));
  ellipse(this.x, this.y, 20);
  textAlign(CENTER);
  textSize(14);
  fill(200);
  text(this.id, this.x, this.y + 5);
}

// ****************************************
// ALGORITHM

const FAIL_LIMIT = 10000;
const MIN_DIST = 0.1;

let pathsPerFrame;

let nodes = [];
let iList = [];
let iBest = [];

let bestDist;

let permutationTotal;
let permutationCounter;
let isRunning = false;

let pathsPerFrameHistory;
let secondsRemaining;
let lastTimeUpdate;

function run() {
  nodes = [];
  iList = [];
  iBest = [];
  bestDist = 1e9;
  isRunning = true;
  pathsPerFrame = 1;
  pathsPerFrameHistory = [];
  secondsRemaining = null;
  lastTimeUpdate = 0;

  let failCount = 0;
  while (nodes.length < nodeSlider.value) {
    let pos = createVector(random(0.1, 0.9), random(0.1, 0.9));
    let tooClose = false;
    for (let i = 0; i < nodes.length; ++i) {
      if (nodes[i].pos.dist(pos) < MIN_DIST) {
        tooClose = true;
        ++failCount;
        break;
      }
    }

    if (failCount > FAIL_LIMIT) {
      isRunning = false;
      print("Failed to generate nodes, make MIN_DIST smaller!");
      break;
    }

    if (!tooClose) {
      nodes.push(new Node("" + (nodes.length + 1), pos));
      failCount = 0;
    }
  }

  for (let i = 0; i < nodes.length; ++i) {
    iList.push(i);
  }

  // Use bigInt to calculate the total number of permutations
  permutationCounter = 0n;
  permutationTotal = 1n;
  for (let i = 2; i <= nodes.length; ++i) {
    permutationTotal *= BigInt(i);
  }
}

function update() {
  if (!isRunning || !frameRate()) {
    return;
  }

  pathsPerFrame = 0;

  const start = millis();
  while (millis() - start < 1000 / FPS) {
    ++pathsPerFrame;

    let dist = calculateDistance();
    if (dist < bestDist) {
      bestDist = dist;
      iBest = [...iList];
    }

    if (!nextPermutation()) {
      isRunning = false;
      iList = [];
      break;
    }
  }
}

function nextPermutation() {
  ++permutationCounter;

  // STEP 1: Find the greatest x such that p[x] < p[x+1]
  let x;
  for (let i = iList.length - 2; i >= 0; --i) {
    if (iList[i] < iList[i + 1]) {
      x = i;
      break;
    }
  }

  // If there is no pair of ascending values, this is the final permutation
  if (x == undefined) {
    return false;
  }

  // STEP 2: Find the greatest y such that p[x] < p[y]
  let y;
  for (let i = iList.length - 1; i >= x + 1; --i) {
    if (iList[x] < iList[i]) {
      y = i;
      break;
    }
  }

  // STEP 3: Swap p[x] and p[y]
  let hold = iList[y];
  iList[y] = iList[x];
  iList[x] = hold;

  // STEP 4: Reverse the elements from p[x+1]...p[n]
  iList = iList.concat(iList.splice(x + 1).reverse());

  return true;
}

function calculateDistance() {
  let dist = 0;
  let prevNode = nodes[iList[0]];
  for (let i = 1; i < iList.length; ++i) {
    let nextNode = nodes[iList[i]];
    dist += prevNode.pos.dist(nextNode.pos);
    prevNode = nextNode;
  }
  return dist;
}