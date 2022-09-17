function Tree() {
  this.leaves = [];
  this.branches = [];
  
  for (let i = 0; i < LEAF_COUNT; ++i) { 
    this.leaves.push(new Leaf());
  }
  
  this.init();
}

Tree.prototype.init = function() {
  let root = new Branch(createVector(0, height, 0), createVector(0, -1, 0));
  this.branches.push(root);
  
  let current = root;
  
  let limit = 0;
  while (limit++ < 100) {
    for (let leaf of this.leaves) {
      if (leaf.pos.dist(current.pos) < MAX_DIST) {
        return;
      }
    }
    
    current = current.grow();
    this.branches.push(current);
  }
  
  if (limit == 100) {
    print("FAILED TO REACH LEAVES!");
  }
}

Tree.prototype.grow = function() {
  let didGrow = false;
  for (let leaf of this.leaves) {
    if (leaf.isReached) {
      continue;
    }
    
    let closestBranch = null;
    let shortestDist = MAX_DIST;
    for (let branch of this.branches) {
      let d = p5.Vector.dist(leaf.pos, branch.pos);
      if (d < MIN_DIST) {
        leaf.isReached = true;
        break;
      } else if (d < shortestDist) {
        closestBranch = branch;
        shortestDist = d;
      }
    }
    
    if (closestBranch) {
      didGrow = true;
      closestBranch.pull(leaf);
    }
  }

  for (let i = this.branches.length - 1; i >= 0; --i) {
		let branch = this.branches[i];
    if (branch.growCount) {
      this.branches.push(branch.grow());
    }
  }
  
  return didGrow;
}

Tree.prototype.draw = function() {
  for (let i = 0; i < this.branches.length; ++i) {
    this.branches[i].draw(i / this.branches.length);
  }
  for (let leaf of this.leaves) {
    leaf.draw();
  }
}
