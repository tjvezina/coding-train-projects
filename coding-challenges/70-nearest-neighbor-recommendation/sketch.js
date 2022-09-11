const k = 5

let data
let titles
let users

let dropdown
let submitButton
let outputDivs = []

function preload() {
  data = loadJSON('data/movies.json')
}

function setup() {
  noCanvas()
  
  titles = Object.keys(data.users[0]).filter(key => key !== 'name' && key !== 'timestamp')
  users = data.users.reduce((acc, user) => {
    acc[user.name] = user
    return acc
  }, {})
  console.log(users)
  
  dropdown = createSelect()
  submitButton = createButton('Submit')
  submitButton.mousePressed(findNearestNeighbors)
  
  for (let i = 0; i < k; i++) {
    const div = createDiv()
    div.style('color', 'white')
    outputDivs.push(div)
  }
  
  data.users.map(user => user.name).sort().forEach(name => dropdown.option(name))
}

function draw() {
  background(42)
}

function euclideanDistance(nameA, nameB) {  
  const userA = users[nameA]
  const userB = users[nameB]
  
  let dist = 0
  titles.forEach(title => {
    const ratingA = userA[title] || 3
    const ratingB = userB[title] || 3
    const delta = ratingA - ratingB
    dist += (delta * delta)
  })
  dist = sqrt(dist)
  
  return dist
}

function findNearestNeighbors() {
  const name = dropdown.value()
  
  const similarityScores = []
  Object.values(users).forEach(user => {
    if (user.name !== name) {
      const dist = euclideanDistance(name, user.name)
      const similarity = 1 / pow(1 + dist, 0.25)
      similarityScores.push({ user: user.name, similarity })
    }
  })
  
  similarityScores.sort((a, b) => b.similarity - a.similarity)
  
  for (let i = 0; i < k; i++) {
    const data = similarityScores[i]
    outputDivs[i].html(`${data.user}: ${round(data.similarity * 100)}%`)
  }
}
