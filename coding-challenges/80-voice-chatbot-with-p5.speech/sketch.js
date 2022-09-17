let userInput
let sendButton
let chatbox

let bot
let speech
let speechRec

function setup() {
  noCanvas()
  
  speech = new p5.Speech()
  speechRec = new p5.SpeechRec('en-US', onSpeechRec)
  speechRec.start(true, false);
  speechRec.onError = (error) => console.error(error);

  userInput = select('#user-input')
  sendButton = select('#send-button')
  chatbox = select('#chatbox')
  
  userInput.changed(sendMessage)
  sendButton.mousePressed(sendMessage)
  
  bot = new RiveScript()
  bot.loadFile("./assets/brain.rive.txt")
    .then(() => bot.sortReplies())
    .catch((error) => console.log('Chatbot failed to start!\n' + error))

  createP('Speech recognition is currently not working due to an unknown error (see console).')
    .style('color: darkred; margin-top: 1rem;');
}

function onSpeechRec() {
  console.log('onSpeechRec()')
  if (speechRec.resultValue) {
    const message = speechRec.resultString;
    userInput.value(message)
    sendMessage()
  }
}

function sendMessage() {
  const message = userInput.value()
  userInput.value('')
  
  if (message.length === 0) {
    return
  }
  
  addMessage('YOU', message)
    
  setTimeout(() => {
    bot.reply('local-user', message).then(reply => addMessage('BOT', reply))
    
    if (message.toLowerCase() === 'pick a number') {
      bot.reply('local-user', `set ${ceil(random(100000))}`)
    }
  }, 1000)
}
  
function addMessage(sender, message) {
  createDiv(`${sender}: ${message}`).parent(chatbox)
  
  if (sender === 'BOT') {
    speech.speak(message)
  }
}
