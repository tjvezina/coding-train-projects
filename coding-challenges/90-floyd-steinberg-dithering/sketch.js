const CANVAS_WIDTH = 540;
const POSTERIZE_STEPS = 6;

let imgOriginal;
let imgPosterize;
let imgDither;

let zoomGraphics

function preload() {
  imgOriginal = loadImage('./assets/raccoon.png');
}

function setup() {
  createCanvas(CANVAS_WIDTH*2, CANVAS_WIDTH * imgOriginal.height/imgOriginal.width * 2);
  
  zoomGraphics = createGraphics(200, 200);
  zoomGraphics.noSmooth();
  
  imgOriginal.resize(width/2, height/2);
  imgOriginal.loadPixels();
  
  const posterize = function(c) {
    return round(c/255 * (POSTERIZE_STEPS-1)) / (POSTERIZE_STEPS-1) * 255;
  }
  
  imgPosterize = createImage(imgOriginal.width, imgOriginal.height);
  imgPosterize.loadPixels();
  for (let i = 0; i < imgOriginal.pixels.length; i++) {
    if (i % 4 === 3) {
      imgPosterize.pixels[i] = 255; // Skip alpha
      continue;
    }
    imgPosterize.pixels[i] = posterize(imgOriginal.pixels[i]);
  }
  imgPosterize.updatePixels();
  
  const dither = function(x, y, b, d) {
    if (x >= imgOriginal.width || y >= imgOriginal.height) return;
    const i = getIndex(x, y, b);
    imgDither.pixels[i] += d
  }
  
  imgDither = createImage(imgOriginal.width, imgOriginal.height);
  imgDither.loadPixels();
  imgOriginal.pixels.forEach((p, i) => imgDither.pixels[i] = p);
  for (let y = 0; y < imgOriginal.height; y++) {
    for (let x = 0; x < imgOriginal.width; x++) {
      for (let b = 0; b < 4; b++) {
        const i = getIndex(x, y, b);
        
        if (b === 3) {
          imgDither.pixels[i] = 255; // Skip alpha
          continue;
        }
        
        const colorA = imgDither.pixels[i];
        const colorB = posterize(colorA);
        imgDither.pixels[i] = colorB;
        const delta = colorA - colorB;
        dither(x+1, y  , b, delta * 7/16);
        dither(x-1, y+1, b, delta * 3/16);
        dither(x  , y+1, b, delta * 5/16);
        dither(x+1, y+1, b, delta * 1/16);
      }
    }
  }
  imgDither.updatePixels();
  
  createP('Mouse over to zoom in!').style('font-weight', 'bold');
  createP('Top: Original image');
  createP('Left: Posterized (reduced color count)');
  createP('Right: Dithering (same colors as left)');
}

function draw() {
  background(28);
  
  image(imgOriginal, width/4, 0, width/2, height/2);
  image(imgPosterize, 0, height/2, width/2, height/2);
  image(imgDither, width/2, height/2, width/2, height/2);

  noFill();
  stroke(255);
  strokeWeight(6);
  point(mouseX, mouseY);

  if ((mouseX >= width/4 && mouseX < width*3/4 && mouseY > 0 && mouseY < height/2) ||
      (mouseX > 0 && mouseX < width && mouseY >= height/2 && mouseY < height)) {
    zoomGraphics.push();
    {
      zoomGraphics.translate(zoomGraphics.width/2, zoomGraphics.height/2);
      zoomGraphics.scale(8);
      zoomGraphics.translate(-mouseX, -mouseY);

      zoomGraphics.clear();
      zoomGraphics.image(imgOriginal, width/4, 0, width/2, height/2);
      zoomGraphics.image(imgPosterize, 0, height/2, width/2, height/2);
      zoomGraphics.image(imgDither, width/2, height/2, width/2, height/2);
    }
    zoomGraphics.pop();
    
    zoomGraphics.noFill();
    zoomGraphics.stroke(255);
    zoomGraphics.strokeWeight(4);
    zoomGraphics.rect(0, 0, zoomGraphics.width, zoomGraphics.height);
    
    image(zoomGraphics, mouseX - zoomGraphics.width/2, mouseY - zoomGraphics.height/2, zoomGraphics.width, zoomGraphics.height);
  }
}

function getIndex(x, y, b) {
  return (x + y*imgOriginal.width) * 4 + b;
}