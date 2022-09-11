var dim = 400;

var rad = 50;
var x = rad;
var speed = 3;

var rec = {
  x: dim * 0.5,
  y: dim * 0.75,
  w: 100,
  h: 100
}

function setup() {
  createCanvas(dim, dim);
}

function draw() {
  background(63);
  
  if (x < rad || x > width - rad)
  {
    speed *= -1;
  }
  
  x += speed;
  
  fill(255, 255, 0);
  ellipse(x, height * 0.25, rad * 2, rad * 2);
  
  if (mouseX > rec.x - rec.w / 2 && mouseX < rec.x + rec.w / 2 &&
      mouseY > rec.y - rec.h / 2 && mouseY < rec.y + rec.h / 2)
  {
    fill(0, 255, 0, mouseIsPressed ? 63 : 255);
  }
  else
  {
    fill(255, 0, 0);
  }
  
  rectMode(CENTER);
  rect(rec.x, rec.y, rec.w, rec.h);
}