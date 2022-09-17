class Vec4 {
  constructor(x = 0, y = 0, z = 0, w = 0) {
    Object.assign(this, { x, y, z, w });
  }
  
  mult(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
    this.w *= scalar;
  }
}