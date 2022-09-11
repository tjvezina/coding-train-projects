function setup() {
	createCanvas(400, 400);
  print("Hello");
}

function draw() {
	background(20, 90, 40);
  
  // Set draw settings and draw a rect
  rectMode(CENTER);
  fill(80, 0, 50);
  stroke(mouseY/400*255, 0, 255);
  strokeWeight(mouseX/50);
  rect(200, 150, 150, 150);
}