let source;
let counts = {};
let keys = [];

function preload() {
  source = loadStrings('./assets/source.txt');
}

function setup() {
  noCanvas();

  source = join(source, '\n');
  let words = source.split(/[^A-Za-z]+/);
  words.forEach(w => {
    w = (w === w.toUpperCase() ? w : w.toLowerCase());
    if (w === '' || w === 's') return;
    if (!counts[w]) {
      counts[w] = 1;
      keys.push(w);
    } else {
      ++counts[w];
    }
  });
  
  keys.sort((a, b) => counts[b] - counts[a]);
  
  for (let i = 0; i < keys.length; ++i) {
    let group = [keys[i]];
    while (i < keys.length - 1 && counts[keys[i]] === counts[keys[i+1]]) {
      group.push(keys[i+1]);
      ++i;
    }

    createP(`[${counts[keys[i]]}] - ${group.join(', ')}`);
  }
}
