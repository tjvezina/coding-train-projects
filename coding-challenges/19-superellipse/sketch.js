let nSlider;

function setup() {
  createCanvas(400, 400);
  
  createElement("div");
  nSlider = createSlider(0.25, 10, 2, 0.25).style("width", "400px");
}

function draw() {
  background(42);
  
  translate(width/2, height/2);
  
  stroke(63);
  line(-width/2, 0, width/2, 0);
  line(0, -height/2, 0, height/2);
  
  fill(127);
  text("n = " + nSlider.value(), -width/2, height/2);
  
  // let r = 150;
  
  let a = 150;
  let b = 150;
  let n = nSlider.value();
  
  stroke(255);
  noFill();
  beginShape();
  for (let t = 0; t < PI * 2; t += 0.1) {
    // Circle
    // let x = r * cos(t);
    // let y = r * sin(t);
    
    // Superellipse
    let x = pow(abs(cos(t)), 2/n) * a * sign(cos(t));
    let y = pow(abs(sin(t)), 2/n) * b * sign(sin(t));
    vertex(x, y);
  }
  endShape(CLOSE);
}

function sign(x) {
  return (x > 0 ? 1 : (x < 0 ? -1 : 0));
}
