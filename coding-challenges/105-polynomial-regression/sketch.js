const SEGMENTS = 100;

const points = [];

let a, b, c, d;

const optimizer = tf.train.adam(0.2);

function setup() {
  createCanvas(600, 600);
  
  a = tf.variable(tf.scalar(0));
  b = tf.variable(tf.scalar(0));
  c = tf.variable(tf.scalar(1));
  d = tf.variable(tf.scalar(0));
}
 
function draw() {
  if (points.length >= 2) {
    tf.tidy(() => {
      optimizer.minimize(() => {
        return loss(predict(points.map(p => p.x)), points.map(p => p.y));
      });
    });
  }
  
  // Y-up coord space
  translate(0, height);
  scale(1, -1);
  
  background(42);
  
  const xValues = [];
  for (let i = 0; i <= SEGMENTS; i++) {
    xValues.push(i/SEGMENTS);
  }
  const yValuesTensor = tf.tidy(() => predict(xValues));
  const yValues = yValuesTensor.dataSync();
  
  noFill();
  strokeWeight(2);
  stroke('#B78EE5');
  beginShape();
  for (let i = 0; i <= SEGMENTS; i++) {
    vertex(xValues[i]*width, yValues[i]*height);
  }
  endShape();
  yValuesTensor.dispose();
  
  strokeWeight(5);
  stroke(255);
  points.forEach(p => point(p.x * width, p.y * height));
}

function mousePressed() {
  if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) {
    points.push(createVector(mouseX / width, (height - mouseY) / height));
  }
}

function predict(inputs) {
  // y = ax^3 + bx^2 + cx + d
  const inputTensor = tf.tensor1d(inputs);
  return inputTensor.pow(3).mul(a)
    .add(inputTensor.square().mul(b))
    .add(inputTensor.mul(c))
    .add(d);
}

function loss(prediction, actual) {
  return prediction.sub(tf.tensor1d(actual)).square().mean();
}
