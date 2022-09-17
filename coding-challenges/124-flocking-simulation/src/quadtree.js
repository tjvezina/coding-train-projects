class Point {
  constructor(x, y, userData) {
    Object.assign(this, { x, y, userData });
  }
}

class Rect {
  constructor(x, y, w, h) {
    Object.assign(this, { x, y, w, h });
  }
  
  get left() { return this.x - this.w/2; }
  get right() { return this.x + this.w/2; }
  get top() { return this.y - this.h/2; }
  get bottom() { return this.y + this.h/2; }
  
  contains(point) {
    return this.left <= point.x && point.x < this.right &&
      this.top <= point.y && point.y < this.bottom;
  }
  
  intersects(rect) {
    return !(
      this.left > rect.right ||
      this.right < rect.left ||
      this.top > rect.bottom ||
      this.bottom < rect.top
    );
  }
}

class Circle {
  constructor(x, y, r) {
    Object.assign(this, { x, y, r });
  }
  
  contains(point) {
    const distX = abs(this.x - point.x);
    const distY = abs(this.y - point.y);
    return distX*distX + distY*distY <= this.r*this.r;
  }
  
  intersects(rect) {
    const distX = abs(this.x - rect.x);
    const distY = abs(this.y - rect.y);
    
    if (distX > rect.w/2 + this.r || distY > rect.h/2 + this.r) return false;
    if (distX <= rect.w/2 || distY <= rect.h/2) return true;
    
    return (distX-rect.w/2)*(distX-rect.w/2) + (distY-rect.h/2)*(distY-rect.h/2) <= this.r*this.r;
  }
}

class QuadTree {
  constructor(boundary, capacity) {
    Object.assign(this, { boundary, capacity });
    this.points = [];
    this.subTrees = null;
  }
  
  insert(point) {
    if (!this.boundary.contains(point)) {
      return false;
    }
    
    if (this.points.length < this.capacity) {
      this.points.push(point);
      return true;
    }
    
    if (this.subTrees === null) {
      this.subdivide();
    }
    
    for (let subTree of this.subTrees) {
      if (subTree.insert(point)) {
        return true;
      }
    }
    
    return false;
  }
  
  subdivide() {
    if (this.subTrees !== null) {
      throw new Error('Quad tree already divided!')
    }
    
    this.subTrees = [];
    const { x, y, w, h } = this.boundary;
    this.subTrees.push(new QuadTree(new Rect(x-w/4, y-h/4, w/2, h/2), this.capacity));
    this.subTrees.push(new QuadTree(new Rect(x+w/4, y-h/4, w/2, h/2), this.capacity));
    this.subTrees.push(new QuadTree(new Rect(x-w/4, y+h/4, w/2, h/2), this.capacity));
    this.subTrees.push(new QuadTree(new Rect(x+w/4, y+h/4, w/2, h/2), this.capacity));
  }
  
  query(range) {
    let pointsInRange = [];
    
    if (this.boundary.intersects(range)) {
      pointsInRange.push(...this.points.filter(p => range.contains(p)));

      if (this.subTrees !== null) {
        this.subTrees.forEach(subTree => pointsInRange.push(...subTree.query(range)));
      }
    }
    
    return pointsInRange;
  }
  
  draw() {
    noFill();
    strokeWeight(1);
    stroke(200, 200, 200, 50);
    rectMode(CENTER);
    rect(this.boundary.x, this.boundary.y, this.boundary.w, this.boundary.h);
    
    if (this.subTrees !== null) {
      this.subTrees.forEach(subTree => subTree.draw());
    }
  }
}