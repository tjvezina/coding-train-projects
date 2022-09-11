let countdown

function preload() {
  countdown = new Countdown(select('#timer'))
}

function setup() {
  noCanvas()
  
  let duration = 3 * 60
  const params = getURLParams()
  if (params.minutes !== undefined) {
    duration = params.minutes * 60
  }
  
  countdown.start(duration)
}

function draw() {
  if (countdown.isRunning  && !countdown.update()) {
    countdown.stop()
    console.log('DONE')
  }
}
