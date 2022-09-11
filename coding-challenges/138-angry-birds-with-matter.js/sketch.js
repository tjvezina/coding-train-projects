const { Engine, World, Bodies, Constraint, Mouse, MouseConstraint } = Matter;

let ground;
let boxes = [];
let bird;
let slingshot;

let world;
let engine;
let mouse;
let mouseConstraint;

function setup() {
  const canvas = createCanvas(600, 400);
  pixelDensity(1);
  rectMode(CENTER);
  
  engine = Engine.create();
  world = engine.world;
  mouse = Mouse.create(canvas.elt);
  mouseConstraint = MouseConstraint.create(engine, {
    mouse,
    element: canvas.elt,
  });
  World.add(world, mouseConstraint);
  
  ground = new Box(width/2, height-10, width, 20, { isStatic: true });
  for (let i = 0; i < 3; i++) {
    boxes[i] = new Box(450, 300-i*80, 50, 75);
  }
  bird = new Bird(150, 300, 16);
  slingshot = new Slingshot(bird.body);
}

function draw() {
  background(42);
  
  Engine.update(engine);
  
  ground.draw();
  boxes.forEach(box => box.draw());
  bird.draw();
  slingshot.draw();
}

function mouseReleased() {
  setTimeout(() => slingshot.break(), 100);
}

function keyPressed() {
  if (key === ' ') {
    World.remove(world, bird.body);
    bird = new Bird(150, 300, 16);
    slingshot.attach(bird.body);
  } 
}