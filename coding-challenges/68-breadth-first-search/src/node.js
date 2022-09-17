class Node {
  constructor(value, position, isMovie) {
    this.value = value
    this.isMovie = isMovie || false
    this.edges = []
    this.position = position || createVector(random(1), random(1))
  }
  
  addEdge(node) {
    this.edges.push(node)
  }
  
  draw(isSelected) {
    const { value, position, isMovie } = this
    
    strokeWeight(isSelected ? 4 : (isMovie ? 2 : 1))
    stroke(isSelected ? color(0, 255, 0) : (isMovie ? color(49, 115, 214) : color(209, 121, 33)))
    fill(isMovie ? color(21, 48, 89) : color(87, 51, 15))
    circle(position.x, position.y, isMovie ? 60 : 40)
    
    noStroke()
    fill(255)
    textSize(isMovie ? 12 : 8)
    textAlign(CENTER, CENTER)
    text(String(value).replace(/ /g, '\n'), position.x, position.y)
  }
}