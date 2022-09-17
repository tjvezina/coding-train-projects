const searchURL = 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search='
const contentURL = 'https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&titles='

const IGNORE_WORDS = [
  // Common words
  'the', 'and', 'of', 'to', 'is', 'was', 'in', 'for', 'on', 'with', 'it',
  // URL/web terms
  'http', 'https', 'www', 'com', 'org', 'net', 'ca', 'cite', 'url', 'ref', 'access-date', 'web',
  'title', 'publisher', 'page',
]

let userInput

let titleDiv
let wordDivs = []
let wordBox

function setup() {
  noCanvas()
  
  userInput = select("#userInput");

  generateButton = select("#generateButton");
  generateButton.mousePressed(goWiki);
  
  titleDiv = createP();
  titleDiv.style('font-size', '30px');
  titleDiv.style('margin-top', '50px');
  titleDiv.style('color', 'yellow');
  
  wordBox = createDiv();
  wordBox.style('display', 'flex');
  wordBox.style('flex-wrap', 'wrap');
  wordBox.style('align-items', 'end');
  
  goWiki();
}

function goWiki() {
  const word = userInput.value();
  const url = `${searchURL}${word}`;
  
  loadJSON(url, onSearch, 'jsonp');
}

function onSearch(data) {
  const results = data[1];
  
  const randomPage = random(results);
  const title = randomPage.replace(/\s+/g, '_');
  
  const url = `${contentURL}${title}`;
  
  loadJSON(url, onContent, 'jsonp');
}

function onContent(data) {
  const pageData = Object.values(data.query.pages)[0];
  
  showData(pageData.title, pageData.revisions[0]['*']);
}

function showData(title, content) {
  wordDivs.forEach(div => div.remove());
  wordDivs.splice();

  titleDiv.html(title);
  
  let wordMap = new Map();
  content.match(/\b[\w'_-]+\b/g).forEach(word => {
    word = (word === word.toUpperCase() ? word : word.toLowerCase());

    if (IGNORE_WORDS.includes(word) || word.length <= 1) return;

    wordMap.set(word, (wordMap.get(word) ?? 0) + 1);
  })
  
  const sortedWords = [...wordMap.entries()]
    .filter(entry => !IGNORE_WORDS.includes(entry[0]))
    .sort((a, b) => b[1] - a[1]);
  
  const maxCount = sortedWords[0][1];
  
  for (let i = 0; i < 300 && i < sortedWords.length; i++) {
    const word = sortedWords[i][0];
    const count = sortedWords[i][1];
    
    const size = count/maxCount * 90 + 10;
    const marginX = `${size/5}px`;
    const marginY = '8px';
    
    const wordDiv = createDiv(word);
    wordDiv.style('font-size', `${count/maxCount * 100 + 10}px`);
    wordDiv.style('margin-left', marginX);
    wordDiv.style('margin-right', marginX);
    wordDiv.style('margin-top', marginY);
    wordDiv.style('margin-bottom', marginY);
    wordDiv.style('color', `rgba(255, 255, 255, ${count/maxCount})`);
    wordDiv.parent(wordBox);
    wordDivs.push(wordDiv);
  }
}