const SZ_RADIUS = 100;
const GRAVITY = 0.011;

const photons = [];

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  ellipseMode(RADIUS);
  
  for (let y = 0; y > -height/2; y -= 0.1*SZ_RADIUS) {
    photons.push({ vel: createVector(-1, 0), points: [createVector(width/2, y)] });
    photons.push({ vel: createVector(-1, 0), points: [createVector(width/2, -y)] });
  }
}

function draw() {
  background(30);
  
  photons.forEach(photon => {
    const lastPos = photon.points.slice(-1)[0];
    if (lastPos.mag() < SZ_RADIUS) {
      photon.consumed = true;
    }
    if (lastPos.mag() < 1) {
      return;
    }
    const dist = lastPos.mag();
    const gravity = GRAVITY / pow(dist/SZ_RADIUS, 2);
    const toBlackHole = p5.Vector.mult(lastPos, -1);
    toBlackHole.setMag(gravity);
    photon.vel.add(toBlackHole);
    photon.vel.setMag(1);
    photon.points.push(p5.Vector.add(lastPos, photon.vel));
  });
  
  translate(width/2, height/2);
  
  noStroke();
  fill('#3F3E39');
  circle(0, 0, 3*SZ_RADIUS);
  fill(30);
  circle(0, 0, 1.5*SZ_RADIUS);
  fill(0);
  circle(0, 0, SZ_RADIUS);
  
  noFill();
  strokeWeight(0.5);
  photons.forEach(photon => {
    stroke(photon.consumed ? '#DD6A4B' : '#E2CB70');
    beginShape();
    photon.points.forEach(p => vertex(p.x, p.y));
    endShape();
  });
  
  noStroke();
  fill(0, 0, 0, 200);
  circle(0, 0, SZ_RADIUS);
}
