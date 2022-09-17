const trainingInputs = tf.tensor2d([
  [0, 0],
  [1, 0],
  [0, 1],
  [1, 1]
]);

const trainingOutputs = tf.tensor2d([
  [0],
  [1],
  [1],
  [0]
]);

let model;

let img;
let inputs;

function setup() {
  createCanvas(400, 400);

  createP('A Tensorflow neural network is trained with an XOR algorithm.');
  createP('We then ask it to predict the output for continuous values from [0, 0] to [1, 1] - results may vary each run!');

  img = createImage(64, 64);
  
  model = tf.sequential();
  const hidden = tf.layers.dense({
    inputShape: [2],
    units: 3,
    activation: 'sigmoid'
  });
  const output = tf.layers.dense({
    units: 1,
    activation: 'sigmoid'
  });
  model.add(hidden);
  model.add(output);
  
  const optimizer = tf.train.adam(0.2);
  model.compile({
    optimizer,
    loss: 'meanSquaredError'
  });
  
  const inputValues = [];
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      inputValues.push([x/(img.width-1), y/(img.height-1)]);
    }
  }
  inputs = tf.tensor2d(inputValues);
  
  setTimeout(trainLoop, 10);
}

function draw() {
  background(40);
  
  const predictionsTensor = tf.tidy(() => model.predict(inputs));
  const predictions = predictionsTensor.dataSync();
  predictionsTensor.dispose();
  
  img.loadPixels();
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      const i = (x + y*img.width);
      const value = predictions[i];
      img.pixels[i*4+0] = value*255;
      img.pixels[i*4+1] = value*255;
      img.pixels[i*4+2] = value*255;
      img.pixels[i*4+3] = 255;
    }
  }
  img.updatePixels();
  
  image(img, 0, 0, width, height);
}

function trainLoop() {
  trainModel().then(result => setTimeout(trainLoop, 10));
}

function trainModel() {
  return model.fit(trainingInputs, trainingOutputs, { shuffle: true, epochs: 100 });
}