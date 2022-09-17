const BORDER = 40; // Minimum distance from canvas edge that nodes can spawn
const LEGEND_HEIGHT = 80; // Height of the legend box
const MIN_SPACING = 50; // Minimum distance between nodes, for visibility
const MAX_RENDERED_SORTED_LINES = 100; // Maximum sorted lines to draw, to improve performance

let nodeSlider;
let speedSlider;
let autoSolveToggle;

let connected = []; // Nodes that are already part of the final solution
let disconnected = []; // Nodes that are not get connected to any other

let newLines = []; // New connections after a new node is added
let sortedLines = []; // Potentially valid connections not yet validated
let invalidLines = []; // Connections confirmed to not be part of the solution
let validLines = []; // Connections confirmed to be part of the solution

let checkingLine; // New line currently being sorted
let sortingLine; // Next line in the list being sorted against

let interval; // Current delay interval object, if any
let nextFunc; // Function to call for the next step in the algorithm

let header;

let searchDepths = [];
let frameRates = [];

function getBreakTime() {
  return speedSlider.value * 2;
}

function getMinSpace() {
  return MIN_SPACING - (nodeSlider.value / 4);
}

function setup() {
  createCanvas(720, 600).style('padding: 1rem;');

  const headerDiv = createDiv().style('text-align: center;');
  select('body').elt.prepend(headerDiv.elt);

  createElement('h2', "Prim's Algorithm").parent(headerDiv);
  createElement('h3', "Minimum Spanning Tree - The Coding Train p5.js Tutorial 9.9").parent(headerDiv);

  createP('What is the shortest total distance required to connect a given set of points?').style('margin: 1rem 0;');

  nodeSlider = new PowerSlider('Nodes', 1, 6, 2);
  nodeSlider.changed(run);

  speedSlider = new ArraySlider('Speed', [1000, 500, 100, 0], ['1x', '2x', '10x', 'Max']);
  
  autoSolveToggle = new Toggle('Auto Solve', false);

  run();
}

function update() {
  if (nextFunc != undefined && autoSolveToggle.enabled) {
    nextFunc();
  }
}

function draw() {
  update();

  background(0);

  const colorNew = color(0, 127, 255);
  const colorSorting = color(0, 191, 255);
  const colorComparing = color(255);
  const colorValid = color(0, 255, 0);
  const colorInvalid = color(255, 0, 0);

  // INVALID - Discarded lines, confirmed to not be part of the solution
  for (let i = 0; i < invalidLines.length; ++i) {
    invalidLines[i].draw(colorInvalid, 2, true);
  }

  // SORTED - Greyscale, based on length relative to other lines
  let fadeCount = min(sortedLines.length - 1, MAX_RENDERED_SORTED_LINES);
  for (let i = sortedLines.length - 1; i >= 0; --i) {
    let c = map(pow(min(i / fadeCount, 1), 0.25), 0, 1, 1.0, 0.1);
    sortedLines[i].brightness = c;
    if (i < fadeCount) {
      sortedLines[i].draw(color(255), 2, true);
    }
  }

  // NEW - Unsorted connections made from the most recently connected node
  for (let i = 0; i < newLines.length; ++i) {
    newLines[i].draw(colorNew, 1);
  }

  // SORTING - The new line currently being sorted
  if (checkingLine != undefined) {
    checkingLine.draw(colorSorting, 3);
  }

  // COMPARING - The line currently being compared against for sorting
  if (sortingLine != undefined) {
    sortingLine.draw(colorComparing, 3);
  }

  // VALID - Connections known to be part of the final solution
  for (let i = 0; i < validLines.length; ++i) {
    validLines[i].draw(colorValid, 3);
  }

  // DISCONNECTED - Nodes not yet connected to any other
  for (let i = 0; i < disconnected.length; ++i) {
    disconnected[i].draw(false);
  }

  // CONNECTED - Nodes that have been connected to the current tree
  for (let i = 0; i < connected.length; ++i) {
    connected[i].draw(true);
  }

  // HEADER
  let inProgress = (nextFunc == undefined && disconnected.length > 0);
  push();
  textSize(24);
  fill(inProgress ? color(180, 120, 0) : color(50, 180, 80));
  text(header + (inProgress ? "..." : ""), 8, 24);
  pop();

  // MANUAL PROMPT
  if (!autoSolveToggle.enabled && nextFunc != undefined) {
    push();
    textAlign(RIGHT);
    textSize(16);
    fill(127);
    text("Click to Continue", width - 8, 24);
    pop();
  }

  // LEGEND
  fill(24);
  rect(60, height - LEGEND_HEIGHT + 10, width - 120, LEGEND_HEIGHT - 20);
  drawLegend(0, 0, colorNew, 1, "Unsorted");
  drawLegend(0, 1, color(127), 2, "Sorted");
  drawLegend(1, 0, colorSorting, 3, "Sort Operand A");
  drawLegend(1, 1, colorComparing, 3, "Sort Operand B");
  drawLegend(2, 0, colorInvalid, 2, "Discarded");
  drawLegend(2, 1, colorValid, 3, "Solution");

  // DEBUG
  // Calculate the average % of sorted lines that are checked to insert a new value
  let avgDepth = 0;
  if (searchDepths.length > 0) {
    for (let i = 0; i < searchDepths.length; ++i) {
      avgDepth += searchDepths[i];
    }
    avgDepth /= searchDepths.length;
  }

  // Calculate the average framerate
  frameRates.push(frameRate());
  if (frameRates.length > 20) {
    frameRates.splice(0, 1);
  }
  let avgFPS = 0;
  if (frameRates.length > 0) {
    for (let i = 0; i < frameRates.length; ++i) {
      avgFPS += frameRates[i];
    }
    avgFPS /= frameRates.length;
  }

  push();
  textSize(8);
  fill(150);
  text(newLines.length + " | " +
    sortedLines.length + " | " +
    validLines.length + " - " +
    (round(avgDepth * 1000) / 10) + "% - " +
    (round(avgFPS)),
    5, height - 5);
  pop();
}

function drawLegend(x, y, color, weight, name) {
  let posX = 110 + (200 * x);
  let posY = height - LEGEND_HEIGHT + 25 + (30 * y);
  push();
  stroke(color);
  strokeWeight(weight);
  line(posX - 8, posY + 10, posX + 8, posY - 10);
  fill(200);
  textSize(16);
  noStroke();
  text(name, posX + 16, posY + 7);
  pop();
}

function mousePressed() {
  if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) {
    // If the simulation is paused, continue
    if (nextFunc != undefined) {
      nextFunc();
    // If the simulation is complete, start a new one
    } else if (disconnected.length == 0) {
      run();
    }
  }
}

function run() {
  header = "Unsolved";

  nextFunc = undefined;
  clearInterval(interval);

  checkingLine = undefined;
  sortingLine = undefined;
  connected = [];
  disconnected = [];
  newLines = [];
  sortedLines = [];
  invalidLines = [];
  validLines = [];
  searchDepths = [];

  let timeout = 1000;
  while (disconnected.length < nodeSlider.value) {
    let pos = createVector(random(BORDER, width - BORDER), random(BORDER, height - BORDER - LEGEND_HEIGHT));
    let tooClose = false;
    for (let vert of disconnected) {
      if (pos.dist(vert.pos) < getMinSpace()) {
        if (--timeout == 0) {
          print("FAILED!");
          return;
        }
        tooClose = true;
        break;
      }
    }

    if (!tooClose) {
      disconnected.push(new Vert(pos, disconnected.length + 1));
    }
  }

  connectVert(random(disconnected));
  advanceStep(handleNewConnection);
}

function handleNewConnection() {
  header = "Add Node";

  newLines = [];

  let vert = connected[connected.length - 1];
  let i = 0;
  interval = setInterval(addNextLine, speedSlider.value);
  addNextLine();

  function addNextLine() {
    if (i == disconnected.length) {
      clearInterval(interval);
      advanceStep(findShortestConnection);
      return;
    }

    newLines.push(new Line(vert, disconnected[i], speedSlider.value));
    ++i;
  }
}

function findShortestConnection() {
  header = "Sort New Connections";

  let minIndex;
  let maxIndex;
  let checking = false;
  let checkCount;
  interval = setInterval(checkNextLine, speedSlider.value);
  checkNextLine();

  function checkIfDone() {
    if (newLines.length == 0) {
      checkingLine = undefined;
      sortingLine = undefined;
      clearInterval(interval);
      advanceStep(handleShortestLine);
    }
    checking = false;
  }

  function checkNextLine() {
    if (!checking) {
      checking = true;
      checkCount = 0;
      checkingLine = newLines[0];
      newLines.splice(0, 1);

      if (sortedLines.length == 0) {
        sortedLines.push(checkingLine);
        checkIfDone();
        return;
      }

      checkLength = checkingLine.getLength();
      minIndex = 0;
      maxIndex = sortedLines.length - 1;
    } else {
      if (sortingLine != undefined) {
        if (checkLength < sortingLine.getLength()) {
          maxIndex = getMidIndex(minIndex, maxIndex) - 1;
        } else {
          minIndex = getMidIndex(minIndex, maxIndex) + 1;
        }
      }

      if (maxIndex - minIndex < 0) {
        searchDepths.push(checkCount / sortedLines.length);
        sortedLines.splice(minIndex, 0, checkingLine);
        sortingLine = undefined;
        checkingLine = undefined;
        checkIfDone();
        return;
      }

      sortingLine = sortedLines[getMidIndex(minIndex, maxIndex)];
      ++checkCount;
    }
  }
}

function getMidIndex(min, max) {
  return round((max - min) / 2) + min;
}

function handleShortestLine() {
  header = "Validate Shortest";

  let shortestLine = sortedLines[0];
  validateLine(shortestLine);
  connectVert(shortestLine.b);

  if (disconnected.length > 0) {
    advanceStep(handleNewConnection);
  } else {
    interval = setInterval(function() {
      clearInterval(interval);
      header = "Solved";
    }, getBreakTime());
  }
}

function connectVert(v) {
  disconnected.splice(disconnected.indexOf(v), 1);
  connected.push(v);

  for (let i = sortedLines.length - 1; i >= 0; --i) {
    let line = sortedLines[i];
    if (line.b === v) {
      sortedLines.splice(i, 1);
      invalidLines.push(line);
      line.fade = true;
      line.t = 1000;
    }
  }
}

function validateLine(l) {
  sortedLines.splice(sortedLines.indexOf(l), 1);
  validLines.push(l);
}

function advanceStep(func) {
  if (!autoSolveToggle.enabled) {
    nextFunc = function() {
      nextFunc = undefined;
      func();
    };
  } else {
    interval = setInterval(function() {
      clearInterval(interval);
      nextFunc = function() {
        nextFunc = undefined;
        func();
      };
    }, getBreakTime());
  }
}