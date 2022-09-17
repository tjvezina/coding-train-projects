let lastPause = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noLoop();
  reset();
}

function reset() {
  camera(0, -1, 2, 0, 0.15, 0, 0, 1, 0);
  perspective(PI/4, width/height, 0.1, 100);

  directionalLight(color(255), 0, 1, -2);
  ambientLight(color(31));
  
  background(42);
  rotateY(PI/6);

  ambientMaterial(50, 180, 80);
  noStroke();
  drawSpongeFractal(0, 0, 0, 4);
}

async function drawSpongeFractal(posX, posY, posZ, levels, depth = 1) {
  let step = 1 / pow(3, depth);
  for (let z = -1; z <= 1; ++z) {
    for (let y = -1; y <= 1; ++y) {
      for (let x = -1; x <= 1; ++x) {
        if (abs(x) + abs(y) + abs(z) < 2) {
          continue;
        }
        
        if (depth === levels) {
          push();
          {
            translate(posX + step * x, posY + step * y, posZ + step * z);
            box(step, step, step);
          }
          pop();
        } else {
          if (depth === levels - 1) {
            await new Promise(resolve => setTimeout(resolve, 0));
          }
          drawSpongeFractal(posX + step * x, posY + step * y, posZ + step * z, levels, depth + 1);
        }
      }
    }
  }
}