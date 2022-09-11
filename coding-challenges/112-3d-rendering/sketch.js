let angle = 0;
const points = [];

function setup() {
  createCanvas(600, 600);
  
  points[0] = createVector(-0.5, -0.5, -0.5);
  points[1] = createVector(0.5, -0.5, -0.5);
  points[2] = createVector(0.5, 0.5, -0.5);
  points[3] = createVector(-0.5, 0.5, -0.5);
  points[4] = createVector(-0.5, -0.5, 0.5);
  points[5] = createVector(0.5, -0.5, 0.5);
  points[6] = createVector(0.5, 0.5, 0.5);
  points[7] = createVector(-0.5, 0.5, 0.5);
}

function draw() {
  background(42);
  translate(width/2, height/2);
  
  const rotZMat = [
    [cos(angle), -sin(angle), 0],
    [sin(angle), cos(angle), 0],
    [0, 0, 1],
  ];
  
  const rotYMat = [
    [cos(angle), 0, sin(angle)],
    [0, 1, 0],
    [-sin(angle), 0, cos(angle)],
  ];
  
  const rotXMat = [
    [1, 0, 0],
    [0, cos(angle), -sin(angle)],
    [0, sin(angle), cos(angle)],
  ];
  
  const projected = [];
  
  for (let i = 0; i < points.length; i++) {
    let rotated = matmul(rotYMat, points[i]);
    rotated = matmul(rotXMat, rotated);
    rotated = matmul(rotZMat, rotated);

    const depth = 1 / (1.5 - rotated.z);
    const projection = [
      [depth, 0, 0],
      [0, depth, 0],
    ];
    
    const projected2D = matmul(projection, rotated);
    projected2D.mult(200);
    projected[i] = projected2D;
  }
  
  for (let i = 0; i < projected.length; i++) {
    stroke(255);
    strokeWeight(16);
    noFill();
    const p = projected[i];
    point(p.x, p.y);
  }
  
  for (let i = 0; i < 4; i++) {
    connect(i, (i+1)%4, projected);
    connect(i+4, ((i+1)%4)+4, projected);
    connect(i, i+4, projected);
  }
  
  angle += 1 / (frameRate() || 60);
}

function connect(i, j, points) {
  const a = points[i];
  const b = points[j];
  strokeWeight(1);
  stroke(255);
  line(a.x, a.y, b.x, b.y);
}
