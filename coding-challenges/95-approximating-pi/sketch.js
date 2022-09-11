let countText;
let approxText;
let actualText;

let totalCount = 0;
let circleCount = 0;

function setup() {
  createCanvas(400, 400);
  
  countText = select('#countText');
  approxText = select('#approxText');
  actualText = select('#actualText');
  
  countText.html('0/0');
  approxText.html('0');
  actualText.html(PI);
  
  translate(width/2, height/2);
  
  background(42);
  
}

function draw() {
  background(42, 42, 42, 10);
  
  translate(width/2, height/2);
  
  // Generate as many points as possible each frame
  const start = millis();
  while (millis() - start < 1000/30) {
    const randomPoint = createVector(random(-width/2, width/2), random(-height/2, height/2));
    const mag = randomPoint.mag();

    strokeWeight(4);
    stroke(mag < width/2 ? color(50, 200, 50, 20) : color(200, 100, 50, 20));
    point(randomPoint.x, randomPoint.y);

    totalCount++;
    if (mag < width/2) circleCount++;
  }
  
  noFill();
  stroke(160);
  strokeWeight(1);
  ellipse(0, 0, width, height);
  rectMode(CENTER);
  strokeWeight(3);
  rect(0, 0, width, height);
  
  countText.html(`${circleCount.toLocaleString()} / ${totalCount.toLocaleString()}`);
  approxText.html((4*circleCount/totalCount).toFixed(15));
}