class Header extends UIElement {
  constructor(text) {
    super();
    this.text = createP(text).class('header').parent(this.row);
  }
}