/*jshint esversion: 9 */

const RowType = {
  RIVER: 'river',
  ROAD: 'road',
  GRASS: 'grass',
}
Object.freeze(RowType)

const UnitType = {
  CAR_A: 'car-a',
  CAR_B: 'car-b',
  CAR_C: 'car-c',
  CAR_D: 'car-d',
  TRUCK: 'truck',
  LOG_SMALL: 'log-small',
  LOG_MEDIUM: 'log-medium',
  LOG_LARGE: 'log-large',
  TURTLE_DOUBLE: 'turtle-double',
  TURTLE_TRIPLE: 'turtle-triple',
}
Object.freeze(UnitType)

class Row {
  static getY(index) {
    return HEADER + ROW_HEIGHT * index
  }
  
  static getColor(type) {
    switch (type) {
      case RowType.RIVER: return color(22, 38, 125)
      case RowType.ROAD: return color(31, 32, 41)
      case RowType.GRASS: return color(78, 163, 44)
      default:
        throw Error('Unknown row type: ' + type)
    }
  }
  
  static getUnitSize(type) {
    switch (type) {
      case UnitType.CAR_A:         return ROW_HEIGHT * 1
      case UnitType.CAR_B:         return ROW_HEIGHT * 1
      case UnitType.CAR_C:         return ROW_HEIGHT * 1
      case UnitType.CAR_D:         return ROW_HEIGHT * 1
      case UnitType.TRUCK:         return ROW_HEIGHT * 2
      case UnitType.LOG_SMALL:     return ROW_HEIGHT * 2
      case UnitType.LOG_MEDIUM:    return ROW_HEIGHT * 3
      case UnitType.LOG_LARGE:     return ROW_HEIGHT * 4
      case UnitType.TURTLE_DOUBLE: return ROW_HEIGHT * 2
      case UnitType.TURTLE_TRIPLE: return ROW_HEIGHT * 3
      default:
        throw Error('Unknown unit type: ' + type)
    }
  }
  
  static getUnitColor(type) {
    switch (type) {
      case UnitType.CAR_A:         return color(176, 163, 18)
      case UnitType.CAR_B:         return color(69, 219, 61)
      case UnitType.CAR_C:         return color(194, 58, 222)
      case UnitType.CAR_D:         return color(217, 51, 39)
      case UnitType.TRUCK:         return color(232, 221, 220)
      case UnitType.LOG_SMALL:
      case UnitType.LOG_MEDIUM:
      case UnitType.LOG_LARGE:
        return color(94, 63, 30)
      case UnitType.TURTLE_DOUBLE:
      case UnitType.TURTLE_TRIPLE:
        return color(69, 112, 53)
      default:
        throw Error('Unknown unit type: ' + type)
    }
  }
  
  constructor(data, index) {
    Object.assign(this, { ...data, index })
    this.speed *= 1.25 // Lazy way to scale all speeds, instead of changing all values in the level JSON
    
    this.wasLastUnitSkipped = false
    
    this.units = []
    if (this.unitType !== undefined) {
      this.initialize()
    }
  }
  
  draw() {
    const y = Row.getY(this.index)
    
    noStroke()
    fill(Row.getColor(this.type))
    rect(0, y, width, ROW_HEIGHT)
    
    if (this.units.length > 0) {      
      fill(Row.getUnitColor(this.unitType))
      stroke(60)
      strokeWeight(1)
      this.units.forEach(unit => {
        unit.x += this.speed * (deltaTime / 1000)
        unit.draw()
      })
      
      this.units = this.units.filter(unit => unit.max.x + 4 >= 0 && unit.min.x - 4 < width)
    }
  }
  
  initialize() {
    const { unitType, speed, interval } = this
    
    const offset = random(interval)
    const start = (offset / 1000) * abs(speed)
    const step = abs(speed) * (interval / 1000)
    
    for (let x = start; x < width + step; x += step) {
      this.createUnit(x)
    }
    
    setTimeout(this.spawnNext.bind(this), interval - offset)
  }
  
  createUnit(posX) {
    if (this.type === RowType.ROAD && !this.wasLastUnitSkipped && random(1) > 0.8) {
      this.wasLastUnitSkipped = true
      return
    }
      
    this.wasLastUnitSkipped = false
    
    const right = this.speed > 0
    const size = Row.getUnitSize(this.unitType)
    
    this.units.push(new Rect((right ? posX - size : width - posX) + 4, Row.getY(this.index) + 4, size - 8, ROW_HEIGHT - 8))
  }
  
  spawnNext() {
    this.createUnit(0)
    
    setTimeout(this.spawnNext.bind(this), this.interval)
  }
}