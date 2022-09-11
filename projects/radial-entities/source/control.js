class Control extends UIElement {  
  constructor(label) {
    super();
    this.label = createP(label).class('control-label').parent(this.row);
    
    controls.push(this);
  }
  
  changed(onChanged) {
    this.onChanged = onChanged
  }
}