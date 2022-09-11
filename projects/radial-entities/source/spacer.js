class Spacer extends UIElement {
  constructor() {
    super();
    createDiv().class('spacer').parent(this.row);
  }
}