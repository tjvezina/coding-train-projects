class TileGrid {
  constructor(tileset, size) {
    Object.assign(this, { tileset, size });

    const allOptions = new Array(tileset.tileVariants.length).fill().map((_, i) => i);
    this.grid = new Array(size*size).fill().map(_ => [...allOptions]);
  }
  
  get isComplete() {
    return this.grid.every(options => options.length <= 1);
  }
  
  get isStuck() {
    return this.grid.some(options => options.length === 0);
  }
  
  draw() {
    const { grid, size, tileset } = this;
    
    noFill();
    strokeWeight(2);
    stroke(60);
    for (let i = 0; i <= size; i++) {
      const s = map(i, 0, size, 0, VIEW_SIZE);
      line(0, s, VIEW_SIZE, s);
      line(s, 0, s, VIEW_SIZE);
    }
    
    const tileSize = VIEW_SIZE / size;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const options = grid[x + y*size];
        if (options.length === 1) {
          tileset.tileVariants[options[0]].draw(x * tileSize, y * tileSize, tileSize);
        } else {
          if (options.updated) {
            noStroke();
            fill(255, 255, 255, 63);
            rect(x*tileSize, y*tileSize, tileSize, tileSize);
          }
          textAlign(CENTER, CENTER);
          textSize(tileSize/2);
          textStyle(BOLD);
          textFont('Courier');
          noStroke();
          fill(map(options.length, 0, tileset.tileVariants.length, 255, 42));
          text(`${options.length}`, (x+0.5)*tileSize, (y+0.5)*tileSize);
        }
      }
    }
  }
  
  collapseCell() {
    const { grid, size, tileset } = this;
    
    // Select a random cell from those with the lowest entropy
    const sortedGrid = [...grid]
      .map((options, i) => ({ options, i }))
      .filter(({ options }) => options.length > 1)
      .sort((a, b) => a.options.length - b.options.length);
    
    const i = random(sortedGrid.filter(x => x.options.length === sortedGrid[0].options.length).map(({ i }) => i));
    
    // Select a random option to collapse to
    const weightedOptions = grid[i]
      .map(i => ({ i, variant: tileset.tileVariants[i] }))
      .flatMap(({ i, variant }) => new Array(variant.weight).fill({ i, variant }));
    grid[i] = [random(weightedOptions).i];
    
    this._cascadeEntropy(i);
  }
  
  _cascadeEntropy(i) {
    const { grid, size } = this;
    
    grid.forEach(options => options.updated = false);
    let toUpdate = this._getNeighbors(i);
    
    while (toUpdate.length > 0) {
      const updated = {};
      toUpdate.forEach(i => updated[i] = this._updateCell(i));
      
      // Collect a list of unique neighbors of all cells that were changed
      toUpdate = [...new Set(toUpdate
        .filter(i => updated[i].length < grid[i].length)
        .flatMap(this._getNeighbors.bind(this))
      )];
      
      Object.entries(updated).forEach(([i, options]) => { grid[i] = options; grid[i].updated = true; } );
    }
  }
  
  _updateCell(i) {
    const { grid, size, tileset } = this;
    
    if (grid[i].length <= 1) {
      return grid[i];
    }
    
    const x = i % size;
    const y = floor(i / size);
    let options = [...grid[i]];
    
    if (y > 0) {
      const upVariants = grid[x + (y-1)*size].map(i => tileset.tileVariants[i]);
      options = options.filter(i => {
        const variant = tileset.tileVariants[i];
        return upVariants.some(other => this._doEdgesMatch(variant, 0, other, 2));
      });
    }
    if (x < size-1) {
      const rightVariants = grid[(x+1) + y*size].map(i => tileset.tileVariants[i]);
      options = options.filter(i => {
        const variant = tileset.tileVariants[i];
        return rightVariants.some(other => this._doEdgesMatch(variant, 1, other, 3));
      });
    }
    if (y < size-1) {
      const downVariants = grid[x + (y+1)*size].map(i => tileset.tileVariants[i]);
      options = options.filter(i => {
        const variant = tileset.tileVariants[i];
        return downVariants.some(other => this._doEdgesMatch(variant, 2, other, 0));
      });
    }
    if (x > 0) {
      const leftVariants = grid[(x-1) + y*size].map(i => tileset.tileVariants[i]);
      options = options.filter(i => {
        const variant = tileset.tileVariants[i];
        return leftVariants.some(other => this._doEdgesMatch(variant, 3, other, 1));
      });
    }
    
    return options;
  }
  
  _getNeighbors(i) {
    const { size } = this;
    
    const x = i % size;
    const y = floor(i / size);
    
    const neighbors = [];
    if (y > 0)      neighbors.push(x + (y-1)*size);
    if (x < size-1) neighbors.push((x+1) + y*size);
    if (y < size-1) neighbors.push(x + (y+1)*size);
    if (x > 0)      neighbors.push((x-1) + y*size);
    return neighbors;
  }
  
  _doEdgesMatch(variantA, edgeA, variantB, edgeB) {
    if ([...variantA.edges[edgeA]].reverse().every((x, i) => x === variantB.edges[edgeB][i])) {
      const tileEdgeA = variantA.toTileEdge(edgeA);
      const exceptions = variantA.exceptions[tileEdgeA];
      if (exceptions !== undefined) {
        const tileEdgeB = variantB.toTileEdge(edgeB);
        return !exceptions.some(({ tile, edge }) => tile === variantB.tileIndex && edge === tileEdgeB);
      }
      return true;
    }
    return false;
  }
}