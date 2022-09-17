const R = 200;

let sphereVerts = [];

let layerSlider;
let stripSlider;
let mSlider;
let n1Slider;
let n2Slider;

function Vert(pos, col) {
  this.pos = pos;
  this.col = col;
  
  this.draw = function() {
    fill(this.col);
    vertex(this.pos.x, this.pos.y, this.pos.z);
  }
}

function setup() {
  createCanvas(600, 500, WEBGL);
  colorMode(HSB, 100);
  
  layerSlider = new PowerSlider('Layers', 2, 8, 5);
  stripSlider = new PowerSlider('Strips', 2, 8, 7);
  mSlider = new Slider('M', 0, 20, 7, 0.1);
  n1Slider = new Slider('N1', 0.1, 10, 0.2, 0.1);
  n2Slider = new Slider('N2', 0, 2, 1.7, 0.1);

  UIElement.controlList.forEach(control => control.changed(generateSphere));
  
  const FOV = PI / 3;
  const CAM_Z = (height/2) / tan(FOV/2); // Makes XY plane 1:1 with pixels
  
  // Position (x, y, z), Target (x, y, z), Up (x, y, z)
  camera(0, 0, CAM_Z, 0, 0, 0, 0, 1, 0);
  // Field of view, aspect ratio, near plane, far plane
  perspective(FOV, width/height, 3, 10000);
  
  generateSphere();
}

function draw() {
  background(25);
  
  orbitControl(1, 1, 0);
  
  // LIGHTS
  ambientLight(127);
  // directionalLight(255, 255, 255, -1, 1, 0);
  
  // MATERIALS
  // normalMaterial();
  ambientMaterial(255, 255, 255);
  // specularMaterial(255, 255, 255);
  
  drawSphere();
}

function generateSphere() {
  let layers = layerSlider.value;
  let strips = stripSlider.value;
  
  sphereVerts = [];
  
  // Generate individual points for the poles
  let r = getRadius(0, 0);
  sphereVerts[0] = new Vert(createVector(0, -r, 0), color(0, 100, 100));
  r = getRadius(PI, 0);
  sphereVerts[layers] = new Vert(createVector(0, r, 0), color(100, 100, 100));
  
  // Generate strips for each latitude in between
  for (let i = 1; i < layers; ++i) {
    sphereVerts[i] = [];
    let lat = map(i, 0, layers, -HALF_PI, HALF_PI);
    let r2 = getRadius(lat);
    for (let j = 0; j < strips; ++j) {
      let lon = map(j, 0, strips, -PI, PI);
      let r1 = getRadius(lon);
      
      let x = R * r1 * cos(lon) * r2 * cos(lat);
      let y = R * r1 * sin(lon) * r2 * cos(lat);
      let z = R * r2 * sin(lat);
      
      sphereVerts[i][j] = new Vert(
        createVector(x, -z, y), // Convert Z-up to Y-up
        color(map(lat, -HALF_PI, HALF_PI, 0, 100), 100, 100)
      );
    }
  }
}

function getRadius(t) {
  let m = mSlider.value;
  let n1 = n1Slider.value;
  let n2 = n2Slider.value;
  let n3 = n2Slider.value; // Re-use n2 for n3
  
  let a = 1;
  let b = 1;
  
  let p1 = pow(abs((1/a) * cos(m*t/4)), n2);
  let p2 = pow(abs((1/b) * sin(m*t/4)), n3);
  
  return pow(p1 + p2, -1 / n1);
}

function drawSphere() {
  let layers = layerSlider.value;
  
  noStroke();

  // Draw the "caps"
  drawTriangleFan(sphereVerts[0], sphereVerts[1]);
  drawTriangleFan(sphereVerts[layers], sphereVerts[layers-1]);
  
  for (let x = 1; x < layers - 1; ++x) {
    drawTriangleStrip(sphereVerts[x], sphereVerts[x+1]);
  }
}

function drawTriangleFan(firstVert, vertList) {
  beginShape(TRIANGLE_FAN);
  firstVert.draw();
  for (let x = 0; x < vertList.length; ++x) {
    vertList[x].draw();
  }
  vertList[0].draw();
  endShape();
}

function drawTriangleStrip(vertListA, vertListB) {
  beginShape(TRIANGLE_STRIP);
  for (let x = 0; x < vertListA.length; ++x) {
    vertListA[x].draw();
    vertListB[x].draw();
  }
  vertListA[0].draw();
  vertListB[0].draw();
  endShape();
}
