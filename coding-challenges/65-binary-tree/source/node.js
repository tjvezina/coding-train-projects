const ROW_SPACE = 60

class Node {  
  constructor(value) {
    this.value = value
    this.left = null
    this.right = null
  }
  
  addNode(node) {
    if (node.value < this.value) {
      if (this.left === null) {
        this.left = node
      } else {
        this.left.addNode(node)
      }
    } else {
      if (this.right === null) {
        this.right = node
      } else {
        this.right.addNode(node)
      }
    }
  }
  
  search(value) {
    if (this.value === value) {
      return this
    }
    
    if (this.value < value && this.left !== null) {
      return this.left.search(value)
    }
    
    if (this.value > value && this.right !== null) {
      return this.right.search(value)
    }
    
    return null
  }
  
  draw(x, y, depth) {
    if (this.left !== null) {
      const leftX = x - (width / pow(2, depth + 2))
      const leftY = y + ROW_SPACE
      line(x, y, leftX, leftY)
      this.left.draw(leftX, leftY, depth + 1)
    }
    
    if (this.right !== null) {
      const rightX = x + (width / pow(2, depth + 2))
      const rightY = y + ROW_SPACE
      line(x, y, rightX, rightY)
      this.right.draw(rightX, rightY, depth + 1)
    }
    
    circle(x, y, 20)
    textAlign(CENTER)
    text(this.value, x, y + 4)
  }
}