class Interpreter {
  constructor(turtle) {
    this.turtle = turtle;
    this.i = 0;
    this.tokens = undefined;
    
    this.repeatStack = [];
  }
  
  get isRunning() { return this.tokens !== undefined && this.i < this.tokens.length; }
  
  load(code) {
    this.i = 0;
    this.repeatStack = [];
    this.tokens = code
      .replace(/\r?\n/g, ' ')
      .replace(/\[/g, ' [ ')
      .replace(/\]/g, ' ] ')
      .split(' ')
      .filter(x => x.length > 0);
  }
  
  step() {
    if (this.tokens === undefined) {
      throw new Error('No program to step through, was load() called?');
    }
    
    const { turtle } = this;
    
    let isDone = false;
    while (!isDone && this.isRunning) {
      isDone = this._parseToken(this._readToken());
    }
    
    return this.i === this.tokens.length;
  }
  
  _parseToken(token) {
    switch (token) {
      case 'fd': turtle.move(this._readNumber(token));  return true;
      case 'bk': turtle.move(-this._readNumber(token)); return true;
      case 'rt': turtle.turn(this._readNumber(token));  return true;
      case 'lt': turtle.turn(-this._readNumber(token)); return true;
      case 'pu': turtle.isDrawing = false;              return true;
      case 'pd': turtle.isDrawing = true;               return true;
      case ']': this._onRepeatEnd();                    return false;
      case 'repeat': this._onRepeatStart();             return false;
      default:
        throw new Error(`Unknown command '${token}'`)
    }
  }
  
  _readToken() {
    if (this.i === this.tokens.length) {
      throw new Error('End of program already reached, cannot read next token');
    }
    
    return this.tokens[this.i++];
  }
  
  _readNumber(command) {
    let token;
    try {
      token = this._readToken();
    } catch (ex) {
      throw new Error(`Command '${command}' must be followed by a positive number`);
    }
    
    const number = Number(token);
    if (isNaN(number) || number <= 0) {
      throw new Error(`Command '${command}' must be followed by a positive number`);
    }
    return number;
  }
  
  _onRepeatStart() {
    const repeatCount = this._readNumber('repeat');
    const openBracket = this._readToken();
    if (openBracket !== '[') {
      throw new Error(`Command 'repeat' must be followed by a count and an open bracket`);
    }
    
    this.repeatStack.push({
      count: repeatCount,
      iStart: this.i,
    });
  }
  
  _onRepeatEnd() {
    if (this.repeatStack.length === 0) {
      throw new Error('Close bracket found with no matching open bracket');
    }

    const repeatData = this.repeatStack.slice(-1)[0];
    if (--repeatData.count > 0) {
      this.i = repeatData.iStart;
    } else {
      this.repeatStack.pop();
    }
  }
}