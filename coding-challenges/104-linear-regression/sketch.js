const points = [];

let m;
let b;

const optimizer = tf.train.sgd(0.5);

function setup() {
  createCanvas(600, 600);
  
  m = tf.variable(tf.scalar(0));
  b = tf.variable(tf.scalar(0.5));
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
  
  strokeWeight(2);
  stroke('#B78EE5');
  const yValuesTensor = tf.tidy(() => predict([0, 1]));
  const yValues = yValuesTensor.dataSync();
  line(0, yValues[0]*height, width, yValues[1]*height);
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
  // y = mx + b
  return tf.tensor1d(inputs).mul(m).add(b);
}

function loss(prediction, actual) {
  return prediction.sub(tf.tensor1d(actual)).square().mean();
}
