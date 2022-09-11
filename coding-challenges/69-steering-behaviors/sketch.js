let vehicles = []
let berries = []

let graph

function setup() {
  createCanvas(800, 600)
  graph = createGraphics(120, 120)
  
  for (let i = 0; i < 10; i++) {
    vehicles.push(new Vehicle(random(width), random(height)))
  }
  
  for (let i = 0; i < 100; i++) {
    berries.push(new Berry(BerryType.JUICY))
  }
  
  for (let i = 0; i < 50; i++) {
    berries.push(new Berry(BerryType.POISON))
  }
}

function draw() {
  background(42)
  update()
  
  berries.forEach(berry => berry.draw())
  
  vehicles.forEach(vehicle => vehicle.draw())
  
  drawGraph()
}

function drawGraph() {
  graph.clear()
  graph.background(8, 8, 8, 190)
  
  graph.strokeWeight(1)
  graph.stroke(new Berry(BerryType.JUICY).color)
  graph.line(0, graph.height/2, graph.width, graph.height/2)
  graph.line(graph.width-5, graph.height/2-5, graph.width, graph.height/2)
  graph.line(graph.width-5, graph.height/2+5, graph.width, graph.height/2)
  graph.stroke(new Berry(BerryType.POISON).color)
  graph.line(graph.width/2, 0, graph.width/2, graph.height)
  graph.line(graph.width/2-5, 5, graph.width/2, 0)
  graph.line(graph.width/2+5, 5, graph.width/2, 0)
  
  graph.noStroke()
  vehicles.forEach(vehicle => {
    graph.fill(vehicle.color)
    graph.circle(
      map(vehicle.dna[BerryType.JUICY], -1, 1, 0, graph.width),
      map(vehicle.dna[BerryType.POISON], -1, 1, graph.height, 0),
      6
    )
  })
  
  image(graph, 16, height-16-graph.height, graph.width, graph.height)
}

function update() {
  vehicles.forEach(vehicle => vehicle.update())
  
  vehicles.filter(vehicle => vehicle.health >= 1).forEach(vehicle => vehicles.push(new Vehicle(0, 0, vehicle)))
}