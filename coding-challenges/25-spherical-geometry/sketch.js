const R = 200;

let sphereVerts = [];

let layerSlider;
let stripSlider;

function getLayers() {
  return layerSlider.value();
}

function getStrips() {
  return stripSlider.value();
}

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
  
  createElement('div').style('height', '20px');
  layerSlider = createSlider(2, 64, 32).style('width', '500px');
  createElement('div').style('height', '20px');
  stripSlider = createSlider(3, 64, 32).style('width', '500px');
  
  layerSlider.input(generateSphere);
  stripSlider.input(generateSphere);

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
  let layers = getLayers();
  let strips = getStrips();
  
  sphereVerts = [];
  
  // Generate individual points for the poles
  sphereVerts[0] = new Vert(createVector(0, -R, 0), color(0, 100, 100));
  sphereVerts[layers] = new Vert(createVector(0, R, 0), color(100, 100, 100));
  
  // Generate strips for each latitude in between
  for (let i = 1; i < layers; ++i) {
    sphereVerts[i] = [];
    let lat = map(i, 0, layers, 0, PI);
    for (let j = 0; j < strips; ++j) {
      let lon = map(j, 0, strips, 0, TWO_PI);
      
      let x = R * sin(lat) * cos(lon);
      let y = R * sin(lat) * sin(lon);
      let z = R * cos(lat);
      
      sphereVerts[i][j] = new Vert(
        createVector(x, -z, y), // Convert Z-up to Y-up
        color(map(lat, 0, PI, 0, 100), 100, 100)
      );
    }
  }
}

function drawSphere() {
  let layers = getLayers();
  
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
