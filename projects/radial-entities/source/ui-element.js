let uiRoot;

class UIElement {
  constructor() {
    if (uiRoot === undefined) {
      uiRoot = createDiv().class('ui-root');
    }
    
    this.row = createDiv().class('row').parent(uiRoot);
  }
}
