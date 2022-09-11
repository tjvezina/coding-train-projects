class Toggle extends Control {
  constructor(label, value) {
    super(label);
    this.toggle = createCheckbox('', value).class('toggle').parent(this.row);
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