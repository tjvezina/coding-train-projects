let words = ["first", "second", "third"];
let sizes = [17, 42, 28];

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(0);
  
  fill(255, 127, 0);
  textSize(32);
  
  for (let i = 0; i < words.length; ++i) {
    text(words[i], 50, 100 * (i + 1));
  }
  
  fill(20, 90, 40);
  
  for (let i = 0; i < sizes.length; ++i) {
    ellipse(width - 100, 100 * (i + 1), sizes[i]);
  }
}