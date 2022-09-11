let polygon;

let nSlider; // Number of sides (3, 4, or 6)
let rSlider; // Polygon radius
let aSlider; // Edge ray angle
let dSlider; // Edge ray distance from midpoint

let fillHueSlider;
let fillAlphaSlider;
let strokeHueSlider;
let strokeAlphaSlider;
let polygonAlphaSlider;

function setup() {
  createCanvas(400, 400);
  colorMode(HSB, 100);
  
  createDiv().style('height', '8px');
  nSlider = new ArraySlider('Sides', [3, 4, 6], 2, reset);
  rSlider = new Slider('Radius', 20, 200, 50, 1, reset);
  aSlider = new Slider('Angle', 0, 180, 120, 1, reset);
  dSlider = new Slider('Delta', 0, 0.99, 0.3, 0.01, reset);
  
  fillHueSlider = new Slider('Fill Color', 0, 100, 56);
  fillAlphaSlider = new Slider('Fill Alpha', 0, 100, 100);
  strokeHueSlider = new Slider('Line Color', 0, 100, 14);
  strokeAlphaSlider = new Slider('Line Alpha', 0, 100, 0);
  polygonAlphaSlider = new Slider('Polygon Alpha', 0, 100, 0);
  
  reset();
}

function draw() {
  background(100);
  
  translate(width/2, height/2);
  switch(polygon.sideCount) {
    case 3: drawTriangleGrid(); break;
    case 4: drawSquareGrid(); break;
    case 6: drawHexagonGrid(); break;
  }
}

function reset() {
  let n = nSlider.value();
  let r = rSlider.value();
  let a = aSlider.value() / 180 * PI; // Deg to Rad
  let d = dSlider.value();
  
  polygon = new HankinPolygon(n, r, a, d);
}

function drawTriangleGrid() {
  // TODO
  polygon.draw();
}

function drawSquareGrid() {
  let space = sqrt((polygon.radius*polygon.radius)/2) * 2;
  let xRange = ceil((width/2 + space/2) / space);
  let yRange = ceil((height/2 + space/2) / space);
  for (let x = -xRange; x <= xRange; ++x) {
    for (let y = -yRange; y <= yRange; ++y) {
      push();
      translate(x * space, y * space);
      polygon.draw();
      pop();
    }
  }
}

function drawHexagonGrid() {
  let xSpace = polygon.radius * 1.5;
  let xRange = floor((width/2 + polygon.radius) / xSpace);
  let ySpace = polygon.radius * tan(PI/3);
  let yRange = ceil((height/2) / ySpace);
  for (let x = -xRange; x <= xRange; ++x) {
    for (let y = -yRange; y <= yRange; ++y) {
      let xPos = x * xSpace;
      let yPos = y * ySpace + (x % 2 != 0 ? ySpace/2 : 0);
      
      push();
      translate(xPos, yPos);
      polygon.draw();
      pop();
    }
  }
}

// HankinPolygon

class HankinPolygon {
  constructor(sideCount, radius, rayAngle, rayDelta) {
    this.sideCount = sideCount;
    this.radius = radius;
    
    this.sideAngle = TWO_PI / this.sideCount;
    this.a = createVector(this.radius, 0).rotate(HALF_PI - (this.sideAngle/2));
    this.b = this.a.copy().rotate(this.sideAngle);
    let sideLength = p5.Vector.dist(this.a, this.b);
    
    let mid = p5.Vector.lerp(this.a, this.b, 0.5);
    this.c1 = p5.Vector.lerp(mid, this.a, rayDelta);
    this.c2 = p5.Vector.lerp(mid, this.b, rayDelta);
    
    let r1 = p5.Vector.sub(this.a, this.c1).rotate(-rayAngle);
    let r2 = p5.Vector.sub(this.b, this.c2).rotate(rayAngle);
    
    let a, aAngle;
    let halfInteriorAngle = (PI - this.sideAngle) / 2;
    if (p5.Vector.cross(r1, this.c1.copy().mult(-1)).z < 0) {
      this.crossed = false;
      a = (sideLength/2) * (1 - rayDelta);
      aAngle = PI - halfInteriorAngle - rayAngle;
    } else {
      this.crossed = true;
      a = (sideLength/2) * (1 + rayDelta);
      aAngle = PI - halfInteriorAngle - (PI - rayAngle);
    }
    
    let rayLength = (a * sin(halfInteriorAngle)) / sin(aAngle);
    this.d1 = p5.Vector.add(this.c1, r1.setMag(rayLength));
    this.d2 = p5.Vector.add(this.c2, r2.setMag(rayLength));
  }
  
  draw() {
    strokeWeight(2);
    beginShape();
    for (let i = 0; i < this.sideCount; ++i) {
      stroke(0, 0, 0, polygonAlphaSlider.value());
      line(this.a.x, this.a.y, this.b.x, this.b.y);
      
      if (!this.crossed) {
        vertex(this.d1.x, this.d1.y);
        vertex(this.c1.x, this.c1.y);
        vertex(this.c2.x, this.c2.y);
        vertex(this.d2.x, this.d2.y);
      } else {
        vertex(this.d2.x, this.d2.y);
        vertex(this.c2.x, this.c2.y);
        vertex(this.c1.x, this.c1.y);
        vertex(this.d1.x, this.d1.y);
      }
      
      this.a.rotate(this.sideAngle);
      this.b.rotate(this.sideAngle);
      this.c1.rotate(this.sideAngle);
      this.c2.rotate(this.sideAngle);
      this.d1.rotate(this.sideAngle);
      this.d2.rotate(this.sideAngle);
    }
    fill(fillHueSlider.value(), 100, 100, fillAlphaSlider.value());
    stroke(strokeHueSlider.value(), 100, 100, strokeAlphaSlider.value());
    endShape(CLOSE);
  }
}
