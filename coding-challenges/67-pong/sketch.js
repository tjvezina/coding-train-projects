let ball
let leftPaddle
let rightPaddle

let leftScore = 0
let rightScore = 0

function setup() {
  createCanvas(800, 600);
  
  ball = new Ball()
  leftPaddle = new Paddle(50, color(245, 155, 66), 87, 83)
  rightPaddle = new Paddle(width - 50, color(66, 135, 245), 38, 40)
}

function draw() {
  background(42, 42, 42, 100);
  
  let score = ball.update()
  leftPaddle.update()
  rightPaddle.update()
  
  if (score < 0) {
    rightScore++
  }
  if (score > 0) {
    leftScore++
  }
  
  noFill()
  stroke(0)
  line(width/2, 0, width/2, height)
  circle(width/2, height/2, 200)
  
  ball.draw()
  leftPaddle.draw()
  rightPaddle.draw()
  
  ball.checkCollision(leftPaddle)
  ball.checkCollision(rightPaddle)
  
  textSize(40)
  fill(leftPaddle.color)
  textAlign(LEFT, TOP)
  text(leftScore, 30, 20)
  fill(rightPaddle.color)
  textAlign(RIGHT, TOP)
  text(rightScore, width-30, 20)
}
