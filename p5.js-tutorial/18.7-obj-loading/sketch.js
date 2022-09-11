let tiger;

function preload() {
  tiger = loadModel('meshes/tiger.obj');
}

function setup() {
  createCanvas(600, 500, WEBGL);
}

function draw() {
  background(42);
  
  const lightDir = createVector(map(mouseX, 0, width, 2, -2), map(mouseY, 0, height, 2, -2), -1);
  lightDir.normalize();
    
  ambientLight(100);
  directionalLight(255, 191, 127, lightDir);
  stroke(255, 0, 0);
  strokeWeight(3);
  let l = 1000;
  line(-lightDir.x * l, -lightDir.y * l, -lightDir.z * l, lightDir.x * l, lightDir.y * l, lightDir.z * l);
  
  stroke(100);
  strokeWeight(1);
  ambientMaterial(255, 255, 255);
  // normalMaterial();
  
  // Pseudo-normal material
	// noStroke();
	// directionalLight(255, 0, 0, -1, 0, 0);
	// directionalLight(0, 255, 0, 0, -1, 0);
	// directionalLight(0, 0, 255, 0, 0, -1);

  
  scale(300);
  rotateZ(PI);
  rotateY(sin(frameCount * 0.01) / 2 + PI/4);
  model(tiger);
}