const WIDTH = 640

const VERTEX_COUNT = 120

const XFORM_TIME = 2
const FADE_TIME = 0.15
const DURATION = XFORM_TIME + 2*FADE_TIME

const PENCIL_COLOR = 90
const BACKGROUND_COLOR = 42

let pencilFont

let transformButton
let typeSelect
let loopToggle
let shuffleToggle

let transforms
let activeTransform
let pendingTransform

const circleVerts = []
const triangleVerts = []
const triangleCorners = []

let t = 0 // linear
let ts = 0 // smooth
let tf = 0 // fade
let startTime
let isReverse = true

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// -- INIT -- //

function preload() {
  pencilFont = loadFont('./assets/Handwritten.ttf')
}

function setup() {
  createCanvas(WIDTH, WIDTH/8.5*11);
    
  initData()
  initInterface()
}

function initData() {
  transforms = [
    new TransformCornerGrow(),
    new TransformRadiusGrow(),
    new TransformSpin(),
    new TransformSweep(),
    new TransformNgon(),
    new TransformSubdivide(),
    new TransformPush(),
    new TransformLerp(),
    // new TransformBend(),
  ].reduce((acc, t) => {
    acc[t.displayName] = t
    return acc
  }, {})
  
  for (let i = 0; i < VERTEX_COUNT; i++) {
    circleVerts.push(angleToVector(i * TWO_PI/VERTEX_COUNT))
  }
  
  for (let i = 0; i < 3; i++) {
    triangleCorners.push(angleToVector(i * PI*2/3))
  }
  
  for (let i = 0; i < 3; i++) {
    const start = triangleCorners[i]
    const end = triangleCorners[i < 2 ? i + 1 : 0]
    for (let j = 0; j < VERTEX_COUNT/3; j++) {
      triangleVerts.push(p5.Vector.lerp(start, end, j / (VERTEX_COUNT/3)))
    }
  }
}

function initInterface() {
  select('body').style('background-color', `rgb(${BACKGROUND_COLOR}, ${BACKGROUND_COLOR}, ${BACKGROUND_COLOR})`)
  
  transformButton = createButton('TRANSFORM')
  transformButton.mousePressed(onTransform)
  
  typeSelect = createSelect()
  Object.keys(transforms).forEach(key => typeSelect.option(key))
  typeSelect.changed(onTransformChanged)
  onTransformChanged()
  
  loopToggle = createCheckbox('Loop', false)
  loopToggle.class('toggle')
  loopToggle.changed(onLoopToggled)
  
  shuffleToggle = createCheckbox('Shuffle', true)
  shuffleToggle.class('toggle')
  
  onLoopToggled()
}

// -- USER INTERFACE -- //

function onLoopToggled() {
  if (loopToggle.checked() && !isPlaying()) {
    if (shuffleToggle.checked()) {
      shuffleTransform()
    }

    onTransform()
  }
}

function onTransformChanged() {
  if (!isPlaying()) {
    activeTransform = transforms[typeSelect.value()]
  } else {
    pendingTransform = transforms[typeSelect.value()]
  }
}

function onTransform() {
  startTime = millis()
  isReverse = !isReverse
  
  transformButton.attribute('disabled', true)
}

// -- UPDATE/DRAW -- //

function isPlaying() {
  return (startTime !== undefined)
}

function draw() {
  update()
  
  drawPaper()
  drawSlider()
  activeTransform.draw()
}

function update() {
  if (!isPlaying()) {
    return
  }
  
  const time = (millis() - startTime) / 1000

  if (time < DURATION) {
    tf = smoothValue(1-max(0, (abs(time - DURATION/2) - XFORM_TIME/2) / FADE_TIME))
    t = max(0, min(1, (time - FADE_TIME) / XFORM_TIME))
    if (isReverse) {
      t = 1 - t
    }
    ts = smoothValue(t)
  } else {
    t = ts = (isReverse ? 0 : 1)
    tf = 0
    startTime = undefined

    if (pendingTransform !== undefined) {
      activeTransform = pendingTransform
      pendingTransform = undefined
    }

    if (!loopToggle.checked()) {
      transformButton.removeAttribute('disabled')
    } else {
      if (shuffleToggle.checked()) {
        shuffleTransform()
      }      

      onTransform()
    }
  }
}
  
function shuffleTransform() {
  typeSelect.selected(random(Object.keys(transforms).filter(k => transforms[k] !== activeTransform)))
  onTransformChanged()
}

function drawPaper() {
  // Paper color
  background(217, 216, 215)
  
  // Blue horizontal rules
  strokeWeight(2)
  stroke(55, 88, 138, 40)
  for (let y = width/6; y < height; y += width*0.045) {
    line(0, y, width, y)
  }
  
  // Red vertical rule
  stroke(138, 69, 55, 40)
  line(width/7, 0, width/7, height)
  
  // Binder holes
  noStroke()
  fill(BACKGROUND_COLOR)
  for (let i = -1; i <= 1; i++) {
    circle(width*0.05, height/2 + height*0.4*i, width*0.04)
  }
  
  // Title and date
  const now = new Date(Date.now())
  
  strokeWeight(0.5)
  stroke(90)
  fill(90)
  textFont(pencilFont)
  textSize(width*0.0375)
  
  text('Geometry Homework', width/7, width/6)
  text(`${now.getDate()} ${monthNames[now.getMonth()]} ${now.getFullYear()}`, width*0.83, width/6)
}
  
function drawSlider() {
  push()
  {
    strokeJoin(ROUND)
    translate(width/2, height*0.912)

    const w = width*0.2
    const s = w + width*0.075
    const r = width*0.025

    // Slider
    stroke(PENCIL_COLOR)
    strokeWeight(2)
    line(-w, 0, w, 0)
    strokeWeight(8)
    fill(217, 216, 215)
    circle(map(t, 0, 1, -w, w), 0, 8)

    // Circle
    strokeWeight(3)
    circle(-s, 0, r*2)

    // Triangle
    translate(s, r*0.25)
    beginShape()
    for (let i = 0; i < 3; i++) {
      const a = (i * PI*2/3) - PI/2
      vertex(r * cos(a), r * sin(a))
    }
    endShape(CLOSE)
  }
  pop()
}
  
// -- HELPERS -- //
  
function smoothValue(t) {
  return -cos(t * PI) * 0.5 + 0.5
}
  
function angleToVector(a) {
  return createVector(cos(a), sin(a))
}