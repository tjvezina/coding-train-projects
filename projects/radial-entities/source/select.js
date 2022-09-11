class Select extends Control {
  constructor(label, options, initial) {
    super(label);
    this.options = options;
    
    this.select = createSelect().parent(this.row);
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