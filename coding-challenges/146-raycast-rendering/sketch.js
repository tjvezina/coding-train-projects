const FOV = 3.14159265 / 3;
let rayCount = 256;
const VIEW_DIST = 0.75; // Percent of width

let boundaries = [];
let rays = [];
let player;

function windowResized() {
  resizeCanvas(windowHeight*2/3, windowHeight);
}

function setup() {
  createCanvas(windowHeight*2/3, windowHeight);
  pixelDensity(1);
  rectMode(CENTER);
  
  player = new Player(50, 50);
  
  boundaries = [
    new Boundary(0, 0, width, 0),
    new Boundary(width, 0, width, height/2),
    new Boundary(width, height/2, 0, height/2),
    new Boundary(0, height/2, 0, 0),
  ];
  
  for (let i = 0; i < 8; i++) {
    boundaries.push(new Boundary(random(width), random(height/2), random(width), random(height/2)));
  }
  
  for (let i = 0; i < rayCount; i++) {
    const a = map(i, 0, rayCount-1, -FOV/2, FOV/2);
    rays.push(new Ray(0, 0, cos(a), sin(a)));
  }
}

function draw() {
  /* UPDATE */
  
  if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
    player.move(1);
  }
  if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
    player.move(-1);
  }
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
    player.turn(1);
  }
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
    player.turn(-1);
  }
  
  /* DRAW */
  
  background(0);
  
  player.draw();
  
  rays.forEach((ray, i) => {
    ray.p = { x: player.pos.x, y: player.pos.y };
    const a = map(i, 0, rays.length-1, -FOV/2, FOV/2) + atan2(player.dir.y, player.dir.x);
    ray.d = { x: cos(a), y: sin(a) };
    ray.calculateLength(boundaries);
  });
  
  boundaries.forEach(boundary => boundary.draw());
  rays.forEach(ray => ray.draw());
  
  const columnWidth = width/rayCount;
  rays.forEach((ray, i) => {
    const a = map(i, 0, rays.length-1, -FOV/2, FOV/2);
    const normalizedDist = constrain((ray.length * cos(a)) / (width*VIEW_DIST), 0, 1);
    const b = 255 * pow(1 - normalizedDist, 2);
    
    const s = constrain(atan(0.1/normalizedDist)/atan(1), 0, 1);
    
    noStroke();
    fill(b);
    rect((i+0.5) * columnWidth, height*3/4, columnWidth+1, height/2 * s);
  });
  
  noStroke();
  fill(60);
  textSize(16);
  textStyle(BOLD);
  text('WASD/Arrows = move and turn', 12, height/2 - 40);
  text('Spacebar = change resolution', 12, height/2 - 20);
}

function keyPressed() {
  if (key === ' ') {
    const resolutions = [64, 128, 256, 512];
    let i = resolutions.indexOf(rayCount);
    if (++i === resolutions.length) i = 0;
    rayCount = resolutions[i];
    
    rays.length = 0;
    for (let i = 0; i < rayCount; i++) {
      const a = map(i, 0, rayCount-1, -FOV/2, FOV/2);
      rays.push(new Ray(0, 0, cos(a), sin(a)));
    }
  }
}
