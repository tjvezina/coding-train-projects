class UIElement {
  static #uiRoot;
  static controlList = [];

  static get uiRoot() {
    if (this.#uiRoot === undefined) {
      this.#uiRoot = createDiv().class('UIControls');
      this.#uiRoot.elt.controlList = [];
    }
    return this.#uiRoot;
  }

  static setRowWidth(width) {
    this.uiRoot.elt.style.setProperty('--row-width', width);
  }

  static setLabelWidth(width) {
    this.uiRoot.elt.style.setProperty('--label-width', width);
  }

  constructor() {
    this.row = createDiv().class('UIControls__row').parent(UIElement.uiRoot);
  }
}

class Header extends UIElement {
  constructor(text) {
    super();
    this.text = createP(text).class('UIControls__header').parent(this.row);
  }
}

class Spacer extends UIElement {
  constructor() {
    super();
    createDiv().class('UIControls__spacer').parent(this.row);
  }
}

class Button extends UIElement {
  constructor(text, onClicked) {
    super();
    this.button = createButton(text).class('UIControls__button').parent(this.row);
    this.button.mousePressed(onClicked);
  }
}

class Control extends UIElement {
  constructor(label) {
    super();
    this.label = createP(label).class('UIControls__label').parent(this.row);
    
    UIElement.controlList.push(this);
  }
  
  changed(onChanged) {
    this.onChanged = onChanged
  }
}

class Toggle extends Control {
  constructor(label, value) {
    super(label);
    this.toggle = createCheckbox('', value).class('UIControls__toggle').parent(this.row);
    this.toggle.changed(this.onValueChanged.bind(this));
  }
  
  get enabled() { return this.toggle.checked() }
  
  set enabled(value) {
    this.toggle.checked(value);
    this.onValueChanged();
  }
  
  randomize() {
    this.enabled = random(1) >= 0.5;
  }
  
  onValueChanged() {
    if (this.onChanged !== undefined) this.onChanged();
  }
}

class Select extends Control {
  constructor(label, options, initial = undefined) {
    super(label);
    this.options = options;
    
    this.select = createSelect().class('UIControls__select').parent(this.row);
    for (let option of options) {
      this.select.option(option);
    }
    if (initial !== undefined) {
      this.select.selected(initial);
    }
    this.select.changed(this.onValueChanged.bind(this));
  }
  
  get value() { return this.select.value(); }
  
  set value(value) {
    this.select.value(value);
    this.onValueChanged();
  }
  
  randomize() {
    this.value = random(this.options);
  }
  
  onValueChanged() {
    if (this.onChanged !== undefined) this.onChanged();
  }
}

class Slider extends Control {
  constructor(label, min, max, value = undefined, step = 1) {
    super(label);
    
    Object.assign(this, { min, max });
    
    this.valueDecimalPoints = 0;
    const decimalIndex = `${step}`.search(/\./);
    if (decimalIndex > -1) {
      this.valueDecimalPoints = `${step}`.length - decimalIndex - 1;
    }
    
    this.slider = createSlider(min, max, value ?? min, step).class('UIControls__slider').parent(this.row);
    this.sliderLabel = createP().class('UIControls__slider-label').parent(this.row);
    
    this.slider.input(this.onValueChanged.bind(this));
    
    // Handle a bug when assigning an initial value to sliders that include negative numbers
    if (min < 0 && value !== undefined) {
      this.value = value;
    }
    this.onValueChanged();
  }
  
  get value() { return this.slider.value() }
  
  set value(value) {
    this.slider.value(value);
    this.onValueChanged();
  }
  
  randomize() {
    this.value = random(this.min, this.max);
  }
  
  onValueChanged() {
    this.sliderLabel.html(Number(this.value).toFixed(this.valueDecimalPoints));
    this.onChanged?.();
  }
}

class PowerSlider extends Slider {
  constructor(label, minExp, maxExp, initExp = undefined, base = 2) {
    super(label, minExp, maxExp, initExp);
    this.base = base;
    this.onValueChanged();
  }

  get value() { return pow(this.base ?? 0, super.value); }
  set value(value) { super.value = log(value) / log(this.base); }

  randomize() {
    this.value = pow(this.base, random(this.min, this.max));
  }
}

class ArraySlider extends Slider {
  constructor(label, values, labels = undefined, initIndex = undefined) {
    super(label, 0, values.length - 1, initIndex);
    this.values = values;
    this.labels = labels;
    this.onValueChanged();
  }

  get value() { return this.values?.[super.value] ?? undefined; }
  set value(value) {
    if (!this.values.includes(value)) {
      throw new Error('Failed to set array slider value, invalid option: ' + value);
    }
    super.value = this.values.indexOf(value);
  }

  get valueIndex() { return super.value; }
  set valueIndex(index) { super.value = index; }

  randomize() {
    this.value = random(this.options);
  }

  onValueChanged() {
    this.sliderLabel.html(this.labels?.[super.value] ?? this.values?.[super.value]);
    this.onChanged?.();
  }
}
