const toothpicks = [];
let potentialToothpicks = [];
let stepCounter = 0;

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  strokeCap(SQUARE);
  
  toothpicks.push(new Toothpick(createVector(0, 0), Direction.Vertical));
  potentialToothpicks = toothpicks[0].getChildren();
}

function draw() {
  background(42);
  
  translate(width/2, height/2);
  scale(min(width, height) / (max(10, stepCounter+1) * 1.1));
  
  toothpicks.forEach(x => x.draw());
}

function step() {
  // Generate next generation of toothpicks
  const newToothpicks = [...potentialToothpicks];
  potentialToothpicks = newToothpicks.flatMap(x => x.getChildren());
  
  // Add previous generation to the set
  toothpicks.push(...newToothpicks);
  
  // Cancel duplicate entries
  for (let i = 0; i < potentialToothpicks.length - 1; i++) {
    const a = potentialToothpicks[i];
    for (let j = i + 1; j < potentialToothpicks.length; j++) {
      const b = potentialToothpicks[j];
      if (a.pos.x === b.pos.x && a.pos.y === b.pos.y) {
        potentialToothpicks.splice(j, 1);
        potentialToothpicks.splice(i, 1);
        i--;
        break;
      }
    }
  }
  
  // Cancel collisions with older toothpicks
  for (let i = 0; i < potentialToothpicks.length; i++) {
    const a = potentialToothpicks[i];
    for (let j = 0; j < toothpicks.length; j++) {
      const b = toothpicks[j];
      if (a.pos.x === b.pos.x && a.pos.y === b.pos.y) {
        potentialToothpicks.splice(i--, 1);
        break;
      }
    }
  }
  
  toothpicks.forEach(x => x.isNew = (newToothpicks.includes(x)));
  
  stepCounter++;
}

function keyPressed() {
  if (key === ' ') {
    step();
  }
}

function mouseClicked() {
  if (mouseButton === LEFT) {
    step();
  }
}
