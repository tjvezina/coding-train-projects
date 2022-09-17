let source;
let words;

function preload() {
  source = loadStrings('./assets/source.txt');
}

function setup() {
  noCanvas();
  
  source = join(source, ' ');
  // words = splitTokens(source, ' .,!?-');
  words = source.split(/\W+/);
  
  let seed = select("#seed");
  let submit = select("#submit");
  submit.mousePressed(() => {
    createP(diastic(seed.value()));
  });
}

function diastic(seed) {
  let phrase = [];
  let index = 0;
  for (let i = 0; i < seed.length; ++i) {
    let c = seed.charAt(i);
    for (; index < words.length; ++index) {
      if (words[index].charAt(i) == c) {
        phrase.push(words[index]);
        break;
      }
    }
  }
  return join(phrase, ' ');
}
