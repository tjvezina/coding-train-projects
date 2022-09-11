const CELL_SIZE = 3

const PLAY_SPEEDS = [6, 0.1, 0.005]
const PLAY_ICONS = ['play', 'forward', 'fast-forward']

let grid

let framesPerUpdate = PLAY_SPEEDS[0]
let isPaintEnabled = false

let pauseButton
const playButtons = []

function setup() {
  const canvas = createCanvas(800, 700)
  noSmooth()
  
  const controlRow = createDiv()
  controlRow.class('control-row')

  const addButton = function(name, icon, callback) {
    const button = createButton('')
    button.class(`icon-button fas fa-fw fa-${icon}`)
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
  
  pauseButton = addButton('Pause', 'pause', () => {
    framesPerUpdate = -1
    onSpeedChange()
  })
  
  addButton('Step', 'step-forward', () => {
    framesPerUpdate = -1
    grid.update()
    grid.apply()
    onSpeedChange()
  })
  
  PLAY_SPEEDS.forEach((speed, i) => {
    playButtons.push(addButton(`Play x${i+1}`, PLAY_ICONS[i], () => {
      framesPerUpdate = PLAY_SPEEDS[i]
      onSpeedChange()
    }))
  })
  
  onSpeedChange()

  addSpacer()
  
  addButton('Reset', 'trash-alt', () => {
    grid.reset()
    grid.apply()
  })
    
  grid = new Grid(round(width/CELL_SIZE), round(height/CELL_SIZE))
  grid.reset()
}

function onSpeedChange() {
  pauseButton.removeClass('selected')
  pauseButton.addClass(framesPerUpdate === -1 ? 'selected' : '')
  
  playButtons.forEach((b, i) => {
    b.removeClass('selected')
    b.addClass(framesPerUpdate === PLAY_SPEEDS[i] ? 'selected' : '')
  })
}

function draw() {
  if (framesPerUpdate > 0) {
    const iterations = (framesPerUpdate < 1 ? round(1/framesPerUpdate) : (frameCount % framesPerUpdate === 0 ? 1 : 0))
    
    for (let i = 0; i < iterations; i++) {
      grid.update()
      grid.apply()
    }
  }
  
  grid.draw()
}
