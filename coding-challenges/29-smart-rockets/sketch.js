let population;
let target;
let targetImg;

function setup() {
  createCanvas(400, 400);
  
  target = createVector(width / 2, height / 4);
  targetImg = loadImage('apple.png');
  population = new Population(25);
}

function draw() {
  background(0);
  
  // Draw target
  push();
    strokeWeight(0);
    // fill('red');   circle(target.x, target.y, 20);
    // fill('white'); circle(target.x, target.y, 15);
    // fill('red');   circle(target.x, target.y, 10);
    // fill('white'); circle(target.x, target.y,  5);
    image(targetImg, target.x - 10, target.y - 10, 20, 20);
  pop();
  
  population.update();
  population.draw();
}
