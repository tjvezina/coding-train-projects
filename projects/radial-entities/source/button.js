class Button extends UIElement {
  constructor(text, onClicked) {
    super();
    this.button = createButton(text).parent(this.row);
    this.button.mousePressed(onClicked);
  }
}