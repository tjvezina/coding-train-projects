class Graph {
  constructor() {
    this.graph = {}
  }
  
  add(node) {
    this.graph[node.value] = node
  }
  
  find(name) {
    return this.graph[name]
  }
  
  draw(solution) {
    const nodes = Object.values(this.graph)
    
    nodes.forEach(nodeA => {
      nodeA.edges.forEach(nodeB => {
        const isSelected = solution.includes(nodeA) && solution.includes(nodeB)
        strokeWeight(isSelected ? 2 : 1)
        stroke(isSelected ? color(0, 255, 0) : color(107, 132, 191))
        line(nodeA.position.x, nodeA.position.y, nodeB.position.x, nodeB.position.y)
      })
    })
    
    nodes.forEach(node => node.draw(solution.includes(node)))
  }
}