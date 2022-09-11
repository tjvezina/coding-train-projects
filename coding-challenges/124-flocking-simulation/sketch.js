const BOID_COUNT = 1000;
const QUADTREE_CAPACITY = 16;

let boids = [];
let fps = 0;

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  for (let i = 0; i < BOID_COUNT; i++) {
    boids.push(new Boid());
  }
}

function draw() {
  clear();
  
  const quadTree = new QuadTree(new Rect(width/2, height/2, width, height), QUADTREE_CAPACITY);
  boids.forEach(boid => quadTree.insert(new Point(boid.pos.x, boid.pos.y, boid)));

  boids.forEach(boid => {
    // const localBoids = quadTree.query(new Circle(boid.pos.x, boid.pos.y, BOID_RANGE)).map(x => x.userData);
    const localBoids = quadTree.query(new Rect(boid.pos.x, boid.pos.y, BOID_RANGE*1.5, BOID_RANGE*1.5)).map(x => x.userData);
    boid.flock(localBoids);
  });
  
  boids.forEach(boid => {
    boid.update();
    boid.draw();
  });

  if (frameCount % 10 === 0) {
    fps = round(frameRate());
  }
  strokeWeight(2);
  stroke(0);
  fill(255);
  textSize(16);
  textStyle(BOLD);
  text(fps, 10, height-10);
}
