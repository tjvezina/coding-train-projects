const WIN_PRIZE = "💰";
const LOSE_PRIZE = "🐐";

const ATTR_OPEN = 'open';
const ATTR_SELECTED = 'selected';
const ATTR_WIN = 'win';
const ATTR_LOSE = 'lose';

const KEY_PLAY_COUNT = 'playCount';
const KEY_SWITCH_WIN_COUNT = 'switchWinCount';

class GameState {
  static get FirstPick() { return 'first-pick'; }
  static get RevealGoat() { return 'reveal-goat'; }
  static get SwitchOrStay() { return 'switch-or-stay'; }
  static get GameOver() { return 'game-over'; }
}

let gameState;

let stage;
let doors;
let instructionText;

let resultsText;
let simulateToggle;

let iPrize;
let iChoice;
let iRevealed;

function setup() {
  noCanvas();
  
  stage = select('.stage');
  doors = selectAll('.door');
  instructionText = select('.instructions');
  
  stage.mousePressed(onStageClicked);
  doors.forEach((door, i) => door.mousePressed(() => onDoorClicked(i)));
  
  resultsText = createP().style('white-space: pre;');
  updateResultsText();
  
  simulateToggle = createCheckbox('Auto simulate');
  
  resetGame();
}

function draw() {
  if (simulateToggle.checked()) {
    onDoorClicked(floor(random(3)));
    onStageClicked();
  }
}

function resetGame() {
  gameState = GameState.GameOver;
  nextGameState();
}

function initGame() {
  iChoice = undefined;
  iRevealed = undefined;
  iPrize = floor(random(3));
  
  doors.forEach((door, i) => {
    removeAttr(door, ATTR_OPEN);
    removeAttr(door, ATTR_SELECTED);
    removeAttr(door, ATTR_WIN);
    removeAttr(door, ATTR_LOSE);
    addAttr(door, i === iPrize ? ATTR_WIN : ATTR_LOSE);
    door.prize = (i === iPrize ? WIN_PRIZE : LOSE_PRIZE);
    select('.door-contents', door).html(door.prize);
  });
}

function onDoorClicked(i) {
  if (gameState === GameState.FirstPick) {
    iChoice = i;
    addAttr(doors[i], ATTR_SELECTED);
    
    nextGameState();
  } else if (gameState === GameState.SwitchOrStay) {
    if (hasAttr(doors[i], ATTR_OPEN)) {
      return;
    }
    
    doors.forEach(door => {
      removeAttr(door, ATTR_SELECTED);
      addAttr(door, ATTR_OPEN);
    });
    
    const iFirstChoice = iChoice;
    iChoice = i;
    addAttr(doors[i], ATTR_SELECTED);
    
    storeItem(KEY_PLAY_COUNT, (getItem(KEY_PLAY_COUNT) || 0) + 1);
    if (iFirstChoice !== iPrize) {
      storeItem(KEY_SWITCH_WIN_COUNT, (getItem(KEY_SWITCH_WIN_COUNT) || 0) + 1);
    }
    updateResultsText();
    
    nextGameState();
  }
}

function onStageClicked() {
  if (gameState === GameState.RevealGoat) {
    iRevealed = random([0, 1, 2].filter(i => i !== iChoice && doors[i].prize === LOSE_PRIZE));
    addAttr(doors[iRevealed], ATTR_OPEN);
    
    nextGameState();
  } else if (gameState === GameState.GameOver) {
    nextGameState();
  }
}

function nextGameState() {
  const stateOrder = [
    GameState.FirstPick,
    GameState.RevealGoat,
    GameState.SwitchOrStay,
    GameState.GameOver,
  ];
  
  function advanceState() {
    gameState = stateOrder[(stateOrder.indexOf(gameState) + 1) % stateOrder.length];
    
    instructionText.html({
      [GameState.FirstPick]: 'Select a door!',
      [GameState.RevealGoat]: 'And now, I will reveal a losing door...\n(Click to continue)',
      [GameState.SwitchOrStay]: `Will you keep door ${iChoice+1}, or switch to ${[0, 1, 2].filter(i => ![iChoice, iRevealed].includes(i))[0]+1}?`,
      [GameState.GameOver]: (iChoice === iPrize ? 'Congrats!' : 'Oh no!') + '\n(Click to continue)',
    }[gameState])
    
    if (gameState === GameState.FirstPick) {
      initGame();
    }    
  }
  
  // Delay state change until next frame, to avoid input callback race conditions
  setTimeout(advanceState, 0);
}

function updateResultsText() {
  const playCount = getItem(KEY_PLAY_COUNT) || 0;
  const switchWins = getItem(KEY_SWITCH_WIN_COUNT) || 0;
  const stayWins = playCount - switchWins;
  
  resultsText.html(
`Total games: ${getItem(KEY_PLAY_COUNT) || 0}
Stay wins: ${stayWins} (${floor(100 * ((stayWins/playCount) || 0))}%)
Switch wins: ${switchWins} (${floor(100 * ((switchWins/playCount)) || 0)}%)`);
}

function hasAttr(element, attr) {
  return ![undefined, null].includes(element.attribute(attr));
}

function addAttr(element, attr) {
  element.attribute(attr, '');
}

function removeAttr(element, attr) {
  element.removeAttribute(attr);
}