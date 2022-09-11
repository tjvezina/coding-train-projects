let bendy;
let train;

let graphics;

function preload() {
  bendy = loadImage('images/323.jpg');
}

function setup() {
  createCanvas(600, 500, WEBGL);
  
  graphics = createGraphics(200, 200);
}

function getMousePos() {
  let m = createVector(constrain(mouseX, 0, width), constrain(mouseY, 0, height));
  return m.sub(createVector(width/2, height/2));
}

function draw() {
  background(42);
  
  let m = getMousePos();
  
  const fov = PI / 3; // 60˚
  const camZ = (height/2) / tan(fov/2); // Makes XY plane 1:1 with pixels
  
  // CAMERAS
  // Position (x, y, z), Target (x, y, z), Up (x, y, z)
  camera(m.x/2, m.y/2, camZ, 0, 0, 0, 0, 1, 0);
  // Field of view, aspect ratio, near plane, far plane
  perspective(fov, width/height, 3, 10000);
  // Left, right, top, bottom, back, front
  // ortho(-width/2, width/2, -height/2, height/2, 0, 1000);
  
  // LIGHTS
  ambientLight(50);
  directionalLight(255, 255, 255, -1, 1, 0);
  pointLight(255, 127, 0, m.x, m.y, 100);
  
  // MATERIALS
  // normalMaterial();
  // ambientMaterial(255, 255, 255);
  // specularMaterial(255, 255, 255);
  
  graphics.background(127, 127, 255);
  graphics.fill(0, 127, 255);
  graphics.ellipse(graphics.width/2, graphics.height/2, graphics.width * 0.9, graphics.height * 0.9);
  graphics.fill(0, 255, 0);
  graphics.textAlign(CENTER);
  graphics.textSize(64);
  graphics.text("BOX", graphics.width/2, graphics.height/2+20);
  
  push();
  translate(0, -100, 0);
  rotateY(frameCount * 0.03);
  texture(graphics);
  box(100, 100, 100);
  ambientMaterial(255, 255, 255);
  pop();
  
  push();
  translate(150, -100, 0);
  rotateY(frameCount * 0.03);
  torus(50, 25);
  pop();
  
  push();
  translate(-150, -100, 0);
  rotateY(frameCount * 0.03);
  rotateX(PI * 0.9);
  cone(50, 100);
  pop();
  
  push();
  translate(0, 100, 0);
  rotateY(frameCount * 0.03);
  rotateX(PI * 0.9);
  cylinder(50, 100);
  pop();

  push();
  translate(150, 100, 0);
  rotateY(frameCount * 0.03);
  ellipsoid(75, 50, 25);
  pop();
  
  push();
  translate(-150, 100, 0);
  rotateY(frameCount * 0.03);
  texture(bendy);
  plane(100, 100);
  pop();
}