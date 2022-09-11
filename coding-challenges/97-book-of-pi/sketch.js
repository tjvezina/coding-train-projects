/*
* NOTE: This project differs from the coding challenge in function; the original uses a PDF library in Processing to generate an actual digital book containing pi (first as gray pixels, then colored pixels, then the numbers themselves). This project forgoes the PDF aspect and visualizes a book's pages instead, with a bonus feature to play with!
*/

// Margins in percentage of canvas size
const MARGIN_HORIZ = 0.06;
const MARGIN_TOP = 0.12;
const MARGIN_BOT = 0.08;
// Digits per page
const ROWS = 25;
const COLS = 40;

const LEFT_PAGE = 0;
const RIGHT_PAGE = 1;

let pi;

let firstPageButton;
let back100xButton;
let back10xButton;
let backButton;
let nextButton;
let next10xButton;
let next100xButton;
let lastPageButton;
let searchInput;
let searchButton;
let searchResultText;

let pageCount;
let currentPagePair = 0;
let searchResult;

function setup() {
  createCanvas(800, 600);
  
  loadStrings('assets/pi-1million.txt', (result) => {
    pi = Array.from(result[0]).map(Number);
    pageCount = ceil(pi.length / (ROWS*COLS));
  });
  
  firstPageButton = select('#firstPageButton')
  firstPageButton.mousePressed(() => changePage(-Number.MAX_SAFE_INTEGER));
  back100xButton = select('#back100xButton')
  back100xButton.mousePressed(() => changePage(-50));
  back10xButton = select('#back10xButton')
  back10xButton.mousePressed(() => changePage(-5));
  backButton = select('#backButton')
  backButton.mousePressed(() => changePage(-1));
  nextButton = select('#nextButton')
  nextButton.mousePressed(() => changePage(1));
  next10xButton = select('#next10xButton')
  next10xButton.mousePressed(() => changePage(5));
  next100xButton = select('#next100xButton')
  next100xButton.mousePressed(() => changePage(50));
  lastPageButton = select('#lastPageButton')
  lastPageButton.mousePressed(() => changePage(Number.MAX_SAFE_INTEGER));
  
  searchInput = createInput('');
  
  searchButton = createButton('Search');
  searchButton.mousePressed(onSearch);
  
  searchResultText = createP('Enter a number to search for');
}

function changePage(offset) {
  console.log(ceil(pageCount/2));
  currentPagePair = max(0, min(ceil(pageCount/2)-1, currentPagePair + offset));
}

function onSearch() {
  const searchValue = searchInput.value();
  
  const searchDigits = Array.from(searchValue).map(Number);
  if (searchDigits.length === 0 || searchDigits.some(digit => isNaN(digit))) {
    searchInput.value('Invalid!');
    return;
  }
  
  for (let i = 0; i < pi.length - searchDigits.length + 1; i++) {
    if (searchDigits.every((digit, j) => pi[i+j] === digit)) {
      searchResult = { start: i, end: i + searchValue.length - 1 };
      currentPagePair = floor(i / (ROWS*COLS) / 2);
      searchResultText.html(`First occurance at digit ${i+1}`);
      return;
    }
  }
  
  searchResult = undefined;
  searchResultText.html(`No occurance of ${searchValue} in the first ${pi.length} digits of pi`);
}

function draw() {
  background(42);
  
  // Page background
  noStroke();
  fill(240, 240, 220);
  rect(0, 0, width, height);
  // Center line
  strokeWeight(12);
  stroke(0, 0, 0, 20);
  line(width/2, 0, width/2, height);
  strokeWeight(4);
  stroke(0, 0, 0, 40);
  line(width/2, 0, width/2, height);
  strokeWeight(2);
  stroke(0, 0, 0, 80);
  line(width/2, 0, width/2, height);  
  
  if (!pi) {
    noStroke();
    fill(0, 0, 0, 50);
    textSize(width*0.1);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    text('Loading...', width/2, height/2);
    return;
  }
  
  drawPage(LEFT_PAGE);
  drawPage(RIGHT_PAGE);
}

function drawPage(page) {
  const pageIndex = currentPagePair*2 + (page === LEFT_PAGE ? 0 : 1);
  const startIndex = (ROWS*COLS) * pageIndex;
  
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(width*0.016);
  textStyle(BOLD);
  
  fill(42);
  text(`${pageIndex+1}/${pageCount}`, (page === LEFT_PAGE ? width*0.25 : width*0.75), height*MARGIN_TOP*0.5);
  
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const i = y*COLS + x + startIndex;
      if (i >= pi.length) return;
      
      fill(searchResult !== undefined && searchResult.start <= i && i <= searchResult.end ? color(220, 60, 30) : 42);
      
      const xPos = map(x, 0, COLS-1, width*MARGIN_HORIZ, width*(0.5-MARGIN_HORIZ)) + (page === LEFT_PAGE ? 0 : width/2);
      const yPos = map(y, 0, ROWS-1, height*MARGIN_TOP, height*(1-MARGIN_BOT));
      text(pi[i], xPos, yPos);
    }
  }
}