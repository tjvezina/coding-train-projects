/**
  A neural network, with 2 inputs, 4 hidden nodes, and one output, is trained with an XOR algorithm.
  We then ask it to predict the output for continuous values from [0, 0] to [1, 1] - results may vary each run!
**/

const trainingData = [
  {
    inputs: [0, 0],
    outputs: [0],
  },
  {
    inputs: [0, 1],
    outputs: [1],
  },
  {
    inputs: [1, 0],
    outputs: [1],
  },
  {
    inputs: [1, 1],
    outputs: [0],
  },
];

const gridSize = 64;

let nn;

function setup() {
  createCanvas(400, 400);
  
  nn = new NeuralNetwork(2, 4, 1);
}

function draw() {
  background(40);
  
  for (let i = 0; i < 100; i++) {
    const data = random(trainingData);
    nn.train(data.inputs, data.outputs);
  }
  
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const prediction = nn.predict([x/(gridSize-1), y/(gridSize-1)]);
      noStroke();
      fill(prediction * 255);
      rect(x * width/gridSize, y * height/gridSize, width/gridSize + 1, height/gridSize + 1);
    }
  }
}