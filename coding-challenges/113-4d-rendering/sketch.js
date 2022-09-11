let angle = 0;
const points = [];

function setup() {
  createCanvas(600, 600, WEBGL);
  
  points[0] = new Vec4(-0.5, -0.5, -0.5, 0.5);
  points[1] = new Vec4(0.5, -0.5, -0.5, 0.5);
  points[2] = new Vec4(0.5, 0.5, -0.5, 0.5);
  points[3] = new Vec4(-0.5, 0.5, -0.5, 0.5);
  points[4] = new Vec4(-0.5, -0.5, 0.5, 0.5);
  points[5] = new Vec4(0.5, -0.5, 0.5, 0.5);
  points[6] = new Vec4(0.5, 0.5, 0.5, 0.5);
  points[7] = new Vec4(-0.5, 0.5, 0.5, 0.5);
  points[8] = new Vec4(-0.5, -0.5, -0.5, -0.5);
  points[9] = new Vec4(0.5, -0.5, -0.5, -0.5);
  points[10] = new Vec4(0.5, 0.5, -0.5, -0.5);
  points[11] = new Vec4(-0.5, 0.5, -0.5, -0.5);
  points[12] = new Vec4(-0.5, -0.5, 0.5, -0.5);
  points[13] = new Vec4(0.5, -0.5, 0.5, -0.5);
  points[14] = new Vec4(0.5, 0.5, 0.5, -0.5);
  points[15] = new Vec4(-0.5, 0.5, 0.5, -0.5);
}

function draw() {
  background(42);
  rotateX(-PI/2);
  
  const rotationXY = [
    [cos(angle), -sin(angle), 0, 0],
    [sin(angle), cos(angle), 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ];

  const rotationZW = [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, cos(angle), -sin(angle)],
    [0, 0, sin(angle), cos(angle)]
  ];
  
  const projected = [];
  
  for (let i = 0; i < points.length; i++) {
    let rotated = matmul(rotationXY, points[i]);
    rotated = matmul(rotationZW, rotated);
    
    const depth = 1 / (1.2 - rotated.w);
    const projection = [
      [depth, 0, 0, 0],
      [0, depth, 0, 0],
      [0, 0, depth, 0],
    ];
    
    const projected3D = matmul(projection, rotated);
    projected3D.mult(200);
    projected[i] = projected3D;
  }
  
  for (let i = 0; i < projected.length; i++) {
    stroke(255);
    strokeWeight(16);
    noFill();
    const p = projected[i];
    point(p.x, p.y, p.z);
  }
  
  for (let i = 0; i < 4; i++) {
    connect(i, (i+1)%4, projected);
    connect(i+4, ((i+1)%4)+4, projected);
    connect(i, i+4, projected);
    
    connect(i+8, ((i+1)%4)+8, projected);
    connect(i+12, ((i+1)%4)+12, projected);
    connect(i+8, i+12, projected);
    
    connect(i, i+8, projected);
    connect(i+4, i+12, projected);
  }
  
  angle += 1 / (frameRate() || 60);
}

function connect(i, j, points) {
  const a = points[i];
  const b = points[j];
  strokeWeight(1);
  stroke(255);
  line(a.x, a.y, a.z, b.x, b.y, b.z);
}
