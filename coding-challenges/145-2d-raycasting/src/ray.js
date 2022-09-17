// Returns the magnitude of the cross product, instead of the whole vector
function cross2D(a, b) {
  return a.x*b.y - b.x*a.y;
}

function dot(a, b) {
  return a.x*b.x + a.y*b.y;
}

class Ray {
  constructor(x, y, dx, dy) {
    this.p = { x, y };
    this.d = { x: dx, y: dy };
    this.length = 0;
    
    // Normalize direction length
    const s = 1 / sqrt(dot(this.d, this.d));
    this.d.x *= s;
    this.d.y *= s;
  }
  
  draw() {
    const { p, d, length } = this;
    
    if (length === 0) {
      return;
    }
    
    const q = { x: p.x + d.x*length, y: p.y + d.y*length };
    
    strokeWeight(1);
    stroke('#FFDD723F');
    line(p.x, p.y, q.x, q.y);
  }
  
  calculateLength(boundaries) {
    const nearestHitDistance = boundaries
      .map(boundary => this._calculateHitDistance(boundary))
      .sort((a, b) => a - b)[0];
    
    if (nearestHitDistance === Infinity) {
      this.length = width + height; // Extend beyond the screen
    } else {
      this.length = nearestHitDistance;
    }
  }
  
  _calculateHitDistance(boundary) {
    const { a, b } = boundary;
    const c = { x: b.x - a.x, y: b.y - a.y };
    const { p, d } = this;
    
    const dXc = cross2D(d, c);
    const pa = { x: a.x - p.x, y: a.y - p.y };
    const paXd = cross2D(pa, d);
    
    if (dXc !== 0) {
      // Different slopes
      const t = cross2D(pa, c) / dXc;
      const u = paXd / dXc;
      
      if (u < 0 || u > 1) {
        // Ray does not intersect boundary
        return Infinity;
      }
      if (t < 0) {
        // Boundary is behind ray
        return Infinity;
      }
      // Intersection!
      return t;
    } else {
      // Same slopes
      if (paXd !== 0) {
        // Parallel
        return Infinity;
      } else {
        // Colinear
        const dDotd = dot(d, d);
        const t0 = dot(pa, d) / dDotd;
        const t1 = t0 + dot(c, d) / dDotd;
        
        if (t0 < 0 && t1 < 0) {
          // Boundary is behind ray
          return Infinity;
        }
        if (t0 < 0 || t1 < 0) {
          // Boundary intersects ray origin
          return 0;
        }
        // Boundary is ahead of ray
        return (t0 < t1 ? t0 : t1);
      }      
    }
  }
}