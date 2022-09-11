let source;
let counts = {};
let keys = [];

function preload() {
  source = loadStrings('source.txt');
}

function setup() {
  source = join(source, '\n');
  let words = source.split(/[^A-Za-z]+/);
  words.forEach(w => {
    w = w.toLowerCase();
    if (!counts[w]) {
      counts[w] = 1;
      keys.push(w);
    } else {
      ++counts[w];
    }
  });
  
  keys.sort((a, b) => {
    return counts[b] - counts[a];
  });
  
  for (let i = 0; i < keys.length; ++i) {
    createDiv(keys[i] + ": " + counts[keys[i]]);
  }
}
