// L-SYSTEMS
// - Alphabet (ex. A, B)
// - Axiom (AKA starting point, ex. "A")
// - Rules (ex. "A" -> "AB", "B" -> "A")

const LENGTH = 100;
const ANGLE = 25 * (3.1415926535/180);

let lSystem;

function setup() {
  createCanvas(400, 400);
  
  lSystem = new LSystem("F",
  [
    { a: "F", b: "FF+[+F-F-F]-[-F+F+F]" }
  ]);
}

function draw() {
  background(220);
  translate(width/2, height);
  
  turtle();
}

function mousePressed() {
  lSystem.iterate();
}

function turtle() {
  let len = LENGTH / pow(2, lSystem.depth);
  stroke(76, 51, 30, 127);
  strokeWeight(2);
  for (let i = 0; i < lSystem.current.length; ++i) {
    switch (lSystem.current.charAt(i)) {
      case 'F': line(0, 0, 0, -len); translate(0, -len); break;
      case '+': rotate(ANGLE); break;
      case '-': rotate(-ANGLE); break;
      case '[': push(); break;
      case ']': pop(); break;
    }
  }
}

//****************************************
// L-SYSTEM

function LSystem(axiom, rules) {
  this.axiom = axiom;
  this.rules = rules;
  this.current = axiom;
  this.depth = 0;
  
  this.iterate = function() {
    let next = "";
    for (let i = 0; i < this.current.length; ++i) {
      let char = this.current.charAt(i);
      let ruleFound = false;
      for (let rule of rules) {
        if (rule.a == char) {
          ruleFound = true;
          next += rule.b;
          break;
        }
      }
      if (!ruleFound) {
        next += char;
      }
    }
    this.current = next;
    this.depth++;
  }
}