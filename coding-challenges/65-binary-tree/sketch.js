let tree

function setup() {
  createCanvas(800, 600);
  
  tree = new Tree()
  
  for (let i = 0; i < 20; i++) {
    tree.addValue(floor(random(100)))
  }
  
  console.log(tree)
}

function draw() {
  background(42);
  
  tree.draw()
}