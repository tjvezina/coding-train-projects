function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);

  fill(255, 0, 0);

  var x = 0;
  while (x <= width) {
    ellipse(x, 100, 25, 25);
    x += 50;
  }

  fill(0, 255, 255);

  for (var x = 0; x <= width; x += 50) {
    ellipse(x, 300, 25, 25);
  }
}