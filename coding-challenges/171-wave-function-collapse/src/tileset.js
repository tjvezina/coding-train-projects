class Tileset {
  constructor(name, onLoadComplete) {
    this.onLoadComplete = onLoadComplete || (() => {});
    this.tiles = [];
    this.tileVariants = [];
  
    loadStrings(`assets/tilesets/${name}/${name}.json`, result => {
      this.data = JSON.parse(result.reduce((a, b) => a + b));
      for (let i = 0; i < this.data.tiles.length; i++) {
        const index = i;
        loadImage(`assets/tilesets/${name}/${nf(index, 2, 0)}.png`, result => {
          this.tiles[index] = result;
          if (this.tiles.length === this.data.tiles.length && !this.tiles.includes(undefined)) {
            this._processTiles();
            this.onLoadComplete();
          }
        });
      }
    });
  }
  
  _processTiles() {
    const exceptionMap = {};
    for (let [a, b] of this.data.exceptions || []) {
      if (exceptionMap[a.tile] === undefined) exceptionMap[a.tile] = [];
      if (exceptionMap[a.tile][a.edge] === undefined) exceptionMap[a.tile][a.edge] = [];
      
      if (b === undefined) {
        exceptionMap[a.tile][a.edge].push(a);
      } else {
        exceptionMap[a.tile][a.edge].push(b);
        
        if (exceptionMap[b.tile] === undefined) exceptionMap[b.tile] = [];
        if (exceptionMap[b.tile][b.edge] === undefined) exceptionMap[b.tile][b.edge] = [];
        exceptionMap[b.tile][b.edge].push(a);
      }
    }
    
    let weightVariantsEqually = this.data.weightVariantsEqually;
    if (weightVariantsEqually === undefined) {
      weightVariantsEqually = true;
    }
    
    for (let i = 0; i < this.tiles.length; i++) {
      const tile = this.tiles[i];
      const { edges, forceRotations } = this.data.tiles[i];
      let { weight } = this.data.tiles[i];
      
      while (edges.length < 4) edges.push(...edges);
      for (let edge = 0; edge < edges.length; edge++) {
        if (!Array.isArray(edges[edge])) {
          edges[edge] = new Array(3).fill(edges[edge]);
        }
      }
      
      let rotations;
      if (forceRotations !== undefined) {
        rotations = forceRotations;
      } else {
        const sameV = (edges[0].every((x, i) => x === edges[2][i]));
        const sameH = (edges[1].every((x, i) => x === edges[3][i]));
        const sameAll = sameV && sameH && (edges[0].every((x, i) => x === edges[1][i]));
        
        rotations = (sameAll ? 1 : (sameV && sameH ? 2 : 4));
      }
      
      weight = round((weight || 1) * (weightVariantsEqually ? 1 : 4/rotations));
      
      for (let rotation = 0; rotation < rotations; rotation++) {
        this.tileVariants.push(
          new TileVariant(
            i,
            this.tileVariants.length,
            tile,
            rotation,
            [...edges],
            weight,
            exceptionMap[i]
          )
        );
        
        edges.unshift(edges.pop());
      }
    }
  }  
}