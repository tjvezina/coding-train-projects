const SCALE = 1.0;
const SORT_RATE = 100;

let sourceImage;
let sortedImage;

let sortRow = 0;
let sortData = [];

function preload() {
  sourceImage = loadImage('./assets/image.png');
}

function setup() {
  createCanvas(sourceImage.width * SCALE, sourceImage.height * SCALE * 2);
  sortedImage = createImage(sourceImage.width, sourceImage.height);
  
  initSort();
}

function draw() {
  background(0);
  
  sortPixels();
  
  image(sourceImage, 0, 0, width, height / 2);
  image(sortedImage, 0, height / 2, width, height / 2);
}

function initSort() {
  sourceImage.loadPixels();
  sortedImage.loadPixels();
  
  for (let i = 0; i < sourceImage.pixels.length / 4; ++i) {
    let col = getColor(sourceImage, i);
    setColor(sortedImage, i, col);
    sortData[i] = hue(col) * 255 + brightness(col);
  }
  
  sortedImage.updatePixels();
}

function sortPixels() {
  if (sortRow == sortedImage.height) {
    return;
  }
  
  sortedImage.loadPixels();
  
  let start = sortRow++ * sortedImage.width;
  let end = start + sortedImage.width;

  for (let i = start; i < end; ++i) {
    let lowest = sortData[i];
    let selected = i;
    for (let j = i + 1; j < sortData.length; ++j) {
      if (sortData[j] < lowest) {
        lowest = sortData[j];
        selected = j;
      }
    }
    
    if (selected != i) {
      let temp = sortData[i];
      sortData[i] = sortData[selected];
      sortData[selected] = temp;
      
      temp = getColor(sortedImage, i);
      setColor(sortedImage, i, getColor(sortedImage, selected));
      setColor(sortedImage, selected, temp);
    }
  }
  
  sortedImage.updatePixels();
}

function getColor(img, i) {
  return color(img.pixels[i*4+0], img.pixels[i*4+1], img.pixels[i*4+2], img.pixels[i*4+3]);
}

function setColor(img, i, col) {
  img.pixels[i*4+0] = red(col);
  img.pixels[i*4+1] = green(col);
  img.pixels[i*4+2] = blue(col);
  img.pixels[i*4+3] = alpha(col);
}
