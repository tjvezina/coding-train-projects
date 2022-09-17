const CELL_SIZE = 6

let grid

let framesPerUpdate = 6
let isPaintEnabled = false

let pauseButton
let play1xButton
let play2xButton
let play6xButton

let patternSelect
let paintToggle
let wrapToggle

let mousePos

function setup() {
  const canvas = createCanvas(800, 800)
  canvas.mouseWheel(onScroll)
  noSmooth()
  
  const controlRow = createDiv()
  controlRow.class('control-row')

  const addButton = function(name, icon, callback) { 
    const button = createButton('')
    button.class(`icon-button fas fa-${icon}`)
    button.attribute('title', name)
    button.mouseClicked(callback)
    button.parent(controlRow)
    return button
  }
  
  const addSpacer = function() {
    const spacer = createDiv()
    spacer.parent(controlRow)
    spacer.style('flex', '1')
  }
  
  pauseButton = addButton('Pause', 'pause', () => { framesPerUpdate = -1; onSpeedChange() })
  addButton('Step', 'step-forward', () => {
    framesPerUpdate = -1
    grid.update()
    grid.apply()
    onSpeedChange()
  })
  play1xButton = addButton('Play x1', 'play', () => { framesPerUpdate = 6; onSpeedChange() })
  play2xButton = addButton('Play x2', 'forward', () => { framesPerUpdate = 3; onSpeedChange() })
  play6xButton = addButton('Play x6', 'fast-forward', () => { framesPerUpdate = 1; onSpeedChange() })
  onSpeedChange()

  addSpacer()
  
  addButton('Randomize', 'random', () => {
    grid.randomize()
    grid.update()
    grid.apply()
  })
  
  addButton('Clear', 'trash-alt', () => {
    grid.clear()
    grid.apply()
  })
    
  addSpacer()
  
  patternSelect = createSelect()
  patterns.forEach(p => patternSelect.option(p.name))
  patternSelect.parent(controlRow)  
  
  addSpacer()
  
  const paintSwitch = select('#paint-switch')
  paintSwitch.parent(controlRow)
  paintToggle = select('input', paintSwitch)
  const paintLabel = createP()
  paintLabel.class('fas fa-fw fa-paint-brush')
  paintLabel.parent(controlRow)
  paintLabel.attribute('title', 'Paintbrush')
  
  const wrapSwitch = select('#wrap-switch')
  wrapSwitch.style('margin-left', '1rem')
  wrapSwitch.parent(controlRow)
  wrapToggle = select('input', wrapSwitch)
  wrapToggle.checked(true)
  const wrapLabel = createP()
  wrapLabel.class('fas fa-fw fa-exchange-alt')
  wrapLabel.parent(controlRow)
  wrapLabel.attribute('title', 'Screen wrap')
  
  mousePos = createVector(-1, -1)
  
  grid = new Grid(round(width/CELL_SIZE), round(height/CELL_SIZE))
  grid.randomize()
  grid.update()
  grid.apply()
}

function onSpeedChange() {
  pauseButton.removeClass('selected')
  play1xButton.removeClass('selected')
  play2xButton.removeClass('selected')
  play6xButton.removeClass('selected')
  
  pauseButton.addClass(framesPerUpdate === -1 ? 'selected' : '')
  play1xButton.addClass(framesPerUpdate === 6 ? 'selected' : '')
  play2xButton.addClass(framesPerUpdate === 3 ? 'selected' : '')
  play6xButton.addClass(framesPerUpdate === 1 ? 'selected' : '')
}

function onScroll(event) {
  let index = patternNames.indexOf(patternSelect.value())
  index += (event.deltaY < 0 ? -1 : 1)
  if (index === -1) index = patternNames.length - 1
  if (index === patternNames.length) index = 0
  
  patternSelect.selected(patternNames[index])
}

function mousePressed() {
  if (!paintToggle.checked() && mouseButton === LEFT) {
    insertPattern()
  }
}

function draw() {
  mousePos.set(floor(mouseX/width*grid.width), floor(mouseY/height*grid.height))
  
  if (paintToggle.checked() && mouseIsPressed && mouseButton === LEFT) {
    insertPattern()
  }
  
  if (framesPerUpdate > 0 && frameCount % framesPerUpdate === 0) {
    grid.update()
    grid.apply()
  }
  
  grid.draw()

  drawCursor()
}

function drawCursor() {
  noStroke()
  fill(255, 0, 0, 255*0.75)
  
  const pattern = patterns[patternNames.indexOf(patternSelect.value())].pattern
  
  const pWidth = pattern[0].length
  const pHeight = pattern.length
  
  const xStart = mousePos.x - floor((pWidth-1)/2)
  const yStart = mousePos.y - floor((pHeight-1)/2)
  
  for (let y = 0; y < pHeight; y++) {
    const yGrid = y + yStart
    if (yGrid < 0 || yGrid >= grid.height) continue
    
    const row = pattern[y]
    for (let x = 0; x < pWidth; x++) {
      const xGrid = x + xStart
      if (xGrid < 0 || xGrid >= grid.width) continue
      
      if (row.charAt(x) !== ' ') {
        rect(xGrid*(width/grid.width), yGrid*(height/grid.height), width/grid.width, height/grid.height)
      }
    }
  }
}

function insertPattern() {
  if (mousePos.x < 0 || mousePos.x >= grid.width || mousePos.y < 0 || mousePos.y >= grid.height) {
    return;
  }
  
  const pattern = patterns[patternNames.indexOf(patternSelect.value())].pattern
  
  const pWidth = pattern[0].length
  const pHeight = pattern.length
  
  const xStart = mousePos.x - floor((pWidth-1)/2)
  const yStart = mousePos.y - floor((pHeight-1)/2)
  
  for (let y = 0; y < pHeight; y++) {
    const yGrid = y + yStart
    if (yGrid < 0 || yGrid >= grid.height) continue
    
    const row = pattern[y]
    for (let x = 0; x < pWidth; x++) {
      const xGrid = x + xStart
      if (xGrid < 0 || xGrid >= grid.width) continue
      
      if (row.charAt(x) !== ' ') {
        grid.setCell(xGrid, yGrid, true)
      }
    }
  }

  grid.apply()
}