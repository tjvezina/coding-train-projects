let turtle;
let interpreter;

let programInput;
let errorText;
let speedSlider;

function setup() {
  createCanvas(800, 800);
  angleMode(DEGREES);
  
  programInput = select('#programInput');
  
  speedSlider = createSlider(-5, 5, 0);
  select('body').elt.insertBefore(speedSlider.elt, programInput.elt);
  
  const buttonRow = createDiv();
  buttonRow.attribute('id', 'buttonRow');
  
  const runButton = createButton('Run');
  runButton.parent(buttonRow);
  runButton.mousePressed(onRun);
  runButton.style('background-color', '#96E49D');
  
  const resetButton = createButton('Reset');
  resetButton.parent(buttonRow);
  resetButton.mousePressed(reset);
  resetButton.style('background-color', '#E4A496');
  
  const spacer = createDiv();
  spacer.parent(buttonRow);
  spacer.style('flex', '1');
  
  const example1Button = createButton('Example 1');
  example1Button.parent(buttonRow);
  example1Button.mousePressed(() => loadExample('./assets/example1.txt'));
  
  const example2Button = createButton('Example 2');
  example2Button.parent(buttonRow);
  example2Button.mousePressed(() => loadExample('./assets/example2.txt'));
  
  errorText = createP();
  errorText.style('color', '#A11');
  
  reset();
  programInput.value(getItem('turtle_program') || '');
}

function draw() {
  background(42);
  
  if (turtle !== undefined) {
    image(turtle.graphics, 0, 0, width, height);
  }
  
  const speed = pow(2, Number(speedSlider.value()));
  if (speed >= 1 || frameCount % (1/speed) === 0) {
    for (let i = 0; i < speed; i++) {
      if (interpreter !== undefined && interpreter.isRunning) {
        try {
          interpreter.step();
        } catch (ex) {
          reset();
          errorText.html(ex);
          console.error(ex);
        }
      }
    }
  }
  
  if (turtle !== undefined) {
    fill('#92E45C');
    stroke('#587F3C');
    strokeWeight(1.5);
    push();
    {
      translate(width/2 + turtle.x, height/2 + turtle.y);
      rotate(turtle.dir);
      circle(3, 5, 4);
      circle(3, -5, 4);
      circle(-3, 5, 4);
      circle(-3, -5, 4);
      circle(0, 0, 12);
      circle(6, 0, 5);
    }
    pop();
  }
}

function reset() {
  interpreter = undefined;
  turtle = new Turtle();
  programInput.value('');
  speedSlider.value(0);
  storeItem('turtle_program', '');
}

function onRun() {
  storeItem('turtle_program', programInput.value());
  
  errorText.html('');
  turtle = new Turtle();
  
  interpreter = new Interpreter(turtle);
  interpreter.load(programInput.value());
}

function loadExample(path) {
  reset();
  loadStrings(path, result => programInput.value(result.reduce((a, b) => a + '\n' + b)));
}