// Slider

function Slider(name, min, max, init, step, inputCallback, changedCallback) {
  this.name = name;
  this.label = createP(name)
    .style('color', '#BBB')
    .style('margin-bottom', '-2px')
    .style('margin-top', '0px');
  this.slider = createSlider(min, max, init, step || 1)
    .style('width', width + 'px');
  
  this.inputCallback = null;
  this.changedCallback = null;
  
  // Initial execution without callbacks
  this.onInput();
  
  this.inputCallback = inputCallback;
  this.changedCallback = changedCallback;
  
  this.slider.input(() => this.onInput());
  this.slider.changed(() => this.onChanged());
}

Slider.prototype.onInput = function() {
  this.label.html(this.name + ": " + this.value());
  
  if (this.inputCallback != null) {
    this.inputCallback();
  }
}

Slider.prototype.onChanged = function() {
  if (this.changedCallback != null) {
    this.changedCallback();
  }
}

Slider.prototype.value = function() {
  return this.slider.value();
}

// PowerSlider

PowerSlider.prototype = Object.create(Slider.prototype);
PowerSlider.prototype.constructor = PowerSlider;
function PowerSlider(name, min, max, init, power, inputCallback, changedCallback) {
  this.power = power;
  Slider.call(this, name, min, max, init, 1, inputCallback, changedCallback);
}

PowerSlider.prototype.value = function() {
  return pow(this.power, this.slider.value());
}

// ArraySlider

ArraySlider.prototype = Object.create(Slider.prototype);
ArraySlider.prototype.constructor = ArraySlider;
function ArraySlider(name, values, initialIndex, inputCallback, changedCallback) {
  this.values = values;
  Slider.call(this, name, 0, values.length - 1, initialIndex, 1, inputCallback, changedCallback);
}

ArraySlider.prototype.value = function() {
  return this.values[this.slider.value()];
}
