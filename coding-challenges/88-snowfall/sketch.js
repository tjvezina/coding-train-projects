const snowflakes = []

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  for (let i = 0; i < width/2; i++) {
    snowflakes.push(new Snowflake(random(width), random(height)));
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(7, 10, 15);
    
  for (const snowflake of snowflakes) {    
    snowflake.update();
    snowflake.draw();    
  }
}