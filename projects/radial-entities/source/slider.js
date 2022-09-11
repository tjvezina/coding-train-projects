class Slider extends Control {
  constructor(label, min, max, value, steps) {
    super(label);
    
    Object.assign(this, { min, max });
    
    steps = (steps !== undefined ? steps : 1);
    this.valueDecimalPoints = 0;
    const decimalIndex = `${steps}`.search(/\./);
    if (decimalIndex > -1) {
      this.valueDecimalPoints = `${steps}`.length - decimalIndex - 1;
    }
    
    this.slider = createSlider(min, max, value || min, steps).parent(this.row);
    this.sliderLabel = createP().class('slider-label').parent(this.row);
    
    this.slider.input(this.onValueChanged.bind(this));
    
    // Handle slider bug
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
    this.sliderLabel.html(Number(this.slider.value()).toFixed(this.valueDecimalPoints));
    if (this.onChanged !== undefined) this.onChanged();
  }
}