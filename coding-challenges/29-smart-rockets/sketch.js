let population;
let target;
let targetImg;

const canvasScale = 1.5;

function setup() {
  createCanvas(400, 400).style('display: none;');
  setTimeout(() => select('canvas')
    .style(`width: ${width*canvasScale}px; height: ${height*canvasScale}px; display: block;`)
  );
  
  target = createVector(width / 2, height / 4);
  targetImg = loadImage('./assets/apple.png');
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
