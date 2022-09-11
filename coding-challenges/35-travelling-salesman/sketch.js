const NODE_COUNT_MIN = 3;
const NODE_COUNT_MAX = 20;

let g; // Grid for displaying our nodes

let div;
let nodeSlider;
let nodeLabel;

function windowResized() {
  handleResize();
}

function setup() {
  let canvas = createCanvas(0, 0);
  canvas.style("z-index", "-1");
  g = createGraphics(400, 400);

  div = createElement("div");

  let title = createElement("h2", "Travelling Salesman Problem");
  title.parent(div);
  title.position(0, 0);
  title.style("color", "#CCC");

  nodeSlider = createSlider(NODE_COUNT_MIN, NODE_COUNT_MAX, 10);
  nodeSlider.parent(div);
  nodeSlider.size(g.width, AUTO);
  nodeSlider.position(0, 475);

  nodeLabel = createP(nodeSlider.value());
  nodeLabel.parent(div);
  nodeLabel.size(20, AUTO);
  nodeLabel.style("font-size", "16px").style("color", "#CCC").style("text-align", "center");

  let nodeSliderInput = function() {
    let value = nodeSlider.value();
    nodeLabel.html(value);
    nodeLabel.position((g.width - 12) * ((value - NODE_COUNT_MIN) / (NODE_COUNT_MAX - NODE_COUNT_MIN)) - 2, 460);
  };

  nodeSlider.changed(run);
  nodeSlider.input(nodeSliderInput);
  nodeSliderInput();

  handleResize();

  run();
}

function handleResize() {
  resizeCanvas(windowWidth, windowHeight - 4);

  div.size(g.width, windowHeight);
  div.position((width - g.width) / 2, 0);
}

function mousePressed() {
  if (!isRunning &&
    mouseX > (width - g.width) / 2 &&
    mouseX < (width + g.width) / 2 &&
    mouseY > 60 &&
    mouseY < 60 + g.height) {
    run();
  }
}

// ****************************************
// DRAWING

function draw() {
  update();

  background(42);
  drawHeader();
  drawGrid();
  drawDetails();
}

function drawHeader() {
  // TODO
}

function drawGrid() {
  const GRID_COUNT = 10;

  g.background(0);

  g.push();
  g.strokeWeight(1);
  g.stroke(42);
  for (let i = 1; i < GRID_COUNT; ++i) {
    let x = g.width / GRID_COUNT * i;
    g.line(x, 0, x, g.height);
    let y = g.height / GRID_COUNT * i;
    g.line(0, y, g.width, y);
  }
  g.pop();

  if (nodes.length) {
    drawPath(iBest, color(20, 180, 50), 4);
    drawPath(iList, color(63), 2);

    for (let i = 0; i < nodes.length; ++i) {
      nodes[i].draw();
    }
  }

  image(g, (width - g.width) / 2, 60);
}

function drawPath(iArray, color, weight) {
  g.stroke(color);
  g.strokeWeight(weight);

  let prevNode = nodes[iArray[0]];
  for (let i = 1; i < iArray.length; ++i) {
    let nextNode = nodes[iArray[i]];
    g.line(prevNode.x, prevNode.y, nextNode.x, nextNode.y);
    prevNode = nextNode;
  }
}

function drawDetails() {
  push();
  strokeWeight(1.5);
  stroke(255);
  for (let i = NODE_COUNT_MIN; i <= NODE_COUNT_MAX; ++i) {
    let x = (g.width - 12) * ((i - NODE_COUNT_MIN) / (NODE_COUNT_MAX - NODE_COUNT_MIN)) + 8;
    x += (width - g.width) / 2;
    line(x, nodeSlider.position().y + 24, x, nodeSlider.position().y + 40);
  }
  pop();

  if (permutationCounter == undefined) {
    return;
  }

  let percent = permutationCounter.multiply(100000).divide(permutationTotal).toJSNumber() / 1000;
  percent = formatPercent(percent);
  let counter = formatBigInt(permutationCounter);
  let total = formatBigInt(permutationTotal);

  push();
  textSize(20);
  textAlign(LEFT);
  fill(255);
  text(formatBigInt(checksPerFrame) + " / frame", (width - g.width) / 2, 570);
  fill(191);
  text(calculateTimeRemaining(), (width - g.width) / 2, 600);
  textAlign(RIGHT);
  fill(255);
  text(percent + "%", (width + g.width) / 2, 570);
  fill(127);
  text(counter, (width + g.width) / 2, 600);
  text("/ " + total, (width + g.width) / 2, 620);
  pop();
}

function calculateTimeRemaining() {
  if (!isRunning || !frameRate()) {
    return;
  }

  if (++avgCounter >= 60) {
    avgCounter = 0;

    let frames = permutationTotal.subtract(permutationCounter).divide(checksPerFrame);
    let totalSec = round(frames / frameRate());

    avgTimeLeft.push(totalSec);
  }

  let avg;
  let divisor = 1;

  if (avgTimeLeft.length > 10) {
    avgReady = true;
    avgTimeLeft.splice(0, avgTimeLeft.length - 10);
  }
  
  if (!avgReady) {
    return "Calculating...";
  }

  avg = avgTimeLeft[0];
  for (let i = 1; i < avgTimeLeft.length; ++i) {
    avg += avgTimeLeft[i];
  }
  avg = avg / avgTimeLeft.length;

  let seconds = nextTimeInc(60);
  let minutes = nextTimeInc(60);

  let str = formatTimeValue(minutes) + ":" + formatTimeValue(seconds);

  if (avg >= divisor) {
    let hours = nextTimeInc(24);
    str = formatTimeValue(hours) + ":" + str;

    if (avg >= divisor) {
      let days = nextTimeInc(30);
      str = formatTimeValue(days) + "d " + str;

      if (avg >= divisor) {
        let months = nextTimeInc(12);
        str = formatTimeValue(months) + "m " + str;

        if (avg >= divisor) {
          let years = floor(avg / divisor);
          str = formatBigInt(years) + "y " + str;
        }
      }
    }
  }

  return str;

  function nextTimeInc(inc) {
    let result = floor(avg / divisor) % inc;
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
  this.x = pos.x * g.width;
  this.y = pos.y * g.height;
}

Node.prototype.draw = function() {
  g.fill(color(63, 0, 127));
  g.stroke(color(127, 31, 127));
  g.ellipse(this.x, this.y, 20);
  g.textAlign(CENTER);
  g.textSize(14);
  g.fill(200);
  g.text(this.id, this.x, this.y + 5);
}

// ****************************************
// ALGORITHM

const FAIL_LIMIT = 10000;
const MIN_DIST = 0.1;

let checksPerFrame;
let checkVelocity;
let checkAccel;

let nodes = [];
let iList = [];
let iBest = [];

let bestDist;

let permutationTotal;
let permutationCounter;
let isRunning = false;

let avgTimeLeft = [];
let avgCounter;
let avgReady;

function run() {
  nodes = [];
  iList = [];
  iBest = [];
  bestDist = 1e9;
  isRunning = true;
  checksPerFrame = 100;
  checkVelocity = 0;
  checkAccel = 0;
  avgTimeLeft = [];
  avgCounter = 1e9;
  avgReady = false;

  let failCount = 0;
  while (nodes.length < nodeSlider.value()) {
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
  permutationCounter = bigInt.zero;
  permutationTotal = bigInt.one;
  for (let i = 2; i <= nodes.length; ++i) {
    permutationTotal = permutationTotal.multiply(i);
  }
}

function update() {
  if (!isRunning || !frameRate()) {
    return;
  }

  if (frameRate() > 55) {
    ++checkAccel;
    if (checkAccel < 0) {
      checkAccel = 0;
      checkVelocity = 0;
    }
  } else {
    --checkAccel;
    if (checkAccel > 0) {
      checkAccel = 0;
      checkVelocity = 0;
    }
  }

  checkVelocity += checkAccel;
  checksPerFrame += checkVelocity;

  for (let i = 0; i < checksPerFrame; ++i) {
    let dist = calculateDistance();
    if (dist < bestDist) {
      bestDist = dist;
      iBest = iList.slice();
    }

    if (nextPermutation()) {} else {
      isRunning = false;
      iList = [];
      break;
    }
  }
}

function nextPermutation() {
  permutationCounter = permutationCounter.next();

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