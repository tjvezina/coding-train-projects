let delaunay;
let voronoi;

let x1, y1, x2, y2;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  const POINTS = 2000;
  const coords = new Float32Array(new ArrayBuffer(4 * POINTS * 2));
  for (let i = 0; i < coords.length; i++) {
    coords[i] = random((i % 2 === 0 ? width : height) - 20) + 10;
  }
  
  delaunay = new d3.Delaunay(coords);
  voronoi = delaunay.voronoi([10, 10, width-10, height-10]);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);
  
  noStroke();
  let i = 0;
  const cellIter = voronoi.cellPolygons();
  while (true) {
    const result = cellIter.next();
    if (result.done) break;
    
    fill(i++/(delaunay.points.length/2) * 255);
    beginShape();
    {
      for (const vert of result.value) {
        vertex(vert[0], vert[1]);
      }
    }
    endShape(CLOSE);
  }  
}
