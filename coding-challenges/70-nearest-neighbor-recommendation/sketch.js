const k = 5;

let data;
let titles;
let users;

let dropdown;
let submitButton;
let outputElts = [];

function preload() {
  data = loadJSON('./assets/movies.json');
}

function setup() {
  noCanvas();
  
  titles = Object.keys(data.users[0]).filter(key => key !== 'name' && key !== 'timestamp');
  users = data.users.reduce((acc, user) => {
    acc[user.name] = user;
    return acc;
  }, {})

  createElement('h2', 'Nearest Neighbor Recommendation');
  createP('Each user in this list has rated every Star Wars movie.');
  createP('Select a user, and we\'ll put together a list of their most like-minded peers!');
  
  dropdown = createSelect();
  submitButton = createButton('Find Friends');
  submitButton.mousePressed(findNearestNeighbors);  
  
  data.users.map(user => user.name).sort().forEach(name => dropdown.option(name));
}

function euclideanDistance(nameA, nameB) {  
  const userA = users[nameA];
  const userB = users[nameB];
  
  let dist = 0;
  titles.forEach(title => {
    const ratingA = userA[title] || 3;
    const ratingB = userB[title] || 3;
    const delta = ratingA - ratingB;
    dist += (delta * delta);
  })
  dist = sqrt(dist);
  
  return dist;
}

function findNearestNeighbors() {
  outputElts.forEach(elt => elt.remove());

  const name = dropdown.value();
  
  const similarityScores = [];
  Object.values(users).forEach(user => {
    if (user.name !== name) {
      const dist = euclideanDistance(name, user.name);
      const similarity = 1 / pow(1 + dist, 0.25);
      similarityScores.push({ user: user.name, similarity });
    }
  })
  
  similarityScores.sort((a, b) => b.similarity - a.similarity);
  
  for (let i = 0; i < k; i++) {
    const data = similarityScores[i];
    outputElts.push(createP(`#${i+1}: ${data.user} (${nf(round(data.similarity * 1000)/10, 0, 1)}%)`));
  }
}
