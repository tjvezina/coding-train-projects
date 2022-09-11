class TransformBend extends Transform {
  get displayName() { return 'Bend' }
  
  _draw() {    
    const t1 = smoothValue(max(0, 1 - t*2))
    const t2 = smoothValue(t * 2 - 1)
    const angle1 = PI*2/3 * t1
    const angle2 = -PI/3 * t2
    const length = map(t2, 0, 1, PI*2/3, 2*sin(PI/3))

    for (let i = 0; i < 3; i++) {
      if (t <= 0.5) {    
        this.strokeDetail()
        line(0, 0, cos(-angle1), sin(-angle1))
        arc(0, 0, 1/3, 1/3, -angle1, 0.0001)
        
        this.strokeMain()
        arc(0, 0, 2, 2, -angle1, 0.0001)
        push()
        {
          rotate(-angle1)
          line(1, 0, 1, -(PI*2/3 - angle1))
        }
        pop()
      } else {
        push()
        {
          this.strokeDetail()
          line(1, 0, cos(-PI*2/3), sin(-PI*2/3))
          arc(1, 0, 1/3, 1/3, -PI*5/6 - 0.0001, -PI/2 + angle2)
          
          translate(1, 0)
          rotate(angle2)
          
          this.strokeMain()
          line(0, 0, 0, -length)
        }
        pop()
      }
      
      rotate(PI*2/3)
    }
  }
}