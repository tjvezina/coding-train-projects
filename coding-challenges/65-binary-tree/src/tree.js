class Tree {
  constructor() {
    this.root = null
  }
  
  addValue(value) {
    const node = new Node(value)
    
    if (this.root === null) {
      this.root = node
    } else {
      this.root.addNode(node)
    }
  }
  
  search(value) {
    return (this.root !== null ? this.root.search(value) : null)
  }
  
  draw() {
    if (this.root !== null) {
      this.root.draw(width/2, 40, 0)
    }
  }
}