const RESOLUTION = 48;

let points = [];

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  pixelDensity(1);
  
  createEasyCam();
  
  for (let k = 0; k < RESOLUTION; k++) {
    for (let j = 0; j < RESOLUTION; j++) {
      let isInside = false;
      for (let i = 0; i < RESOLUTION; i++) {
        const c = {
          x: map(i, 0, RESOLUTION-1, -1, 1),
          y: map(j, 0, RESOLUTION-1, -1, 1),
          z: map(k, 0, RESOLUTION-1, -1, 1),
        };
        
        let m = { x: 0, y: 0, z: 0 };
        let step;
        for (step = 0; step < 20; step++) {
          m = mandelbulbStep(m, c);
          if (m.x*m.x + m.y*m.y + m.z*m.z > 4) {
            break;
          }
        }
        
        // Only keep points on the boundary
        if (step === 20) {
          if (!isInside) {
            isInside = true;
            points.push(c);
          }
        } else if (isInside) {
          c.z = map(k-1, 0, RESOLUTION-1, -1, 1);
          points.push(c);
          isInside = false;
        }
      }
    }
  }
}

function draw() {
  background(42);
  
  scale(min(width, height) / 6);
  
  noFill();
  strokeWeight(2);
  stroke(255, 255, 255, 127);
  points.forEach(p => point(p.x, p.y, p.z));
}

function mandelbulbStep(m, c) {
  const n = 8; // Configurable
  const { x, y, z } = m;
  
  // 3D cartesian to spherical
  const r = sqrt(x*x + y*y + z*z);
  const t = atan2(sqrt(x*x + y*y), z);
  const p = atan2(y, x);
  
  // {x, y, z}^n
  const rn = pow(r, n);
  m.x = rn * sin(t*n) * cos(p*n) + c.x;
  m.y = rn * sin(t*n) * sin(p*n) + c.y;
  m.z = rn * cos(t*n) + c.z;
  
  return m;
}