export class RouletteUndoButton extends HTMLButtonElement {
    
    constructor() {
        super();
        this.rendered = false;
        this._clickHandler = this._clickHandler.bind(this);
    }

    _clickHandler(e) {
        if (this.disabled) {
            console.log('Undo button is disabled!');
            return;
        }

        console.log('Undo button clicked!');
    }

    connectedCallback() {

        if (!this.rendered) {
            this.rendered = true;
            // console.log('Undo button component rendered!');
            this.addEventListener('pointerdown', this._clickHandler);
        }
    
    }

    disconnectedCallback() {
        // console.log('Undo button component removed!');
        this.removeEventListener('pointerdown', this._clickHandler);
    }

    static get observedAttributes() {
        return [ 'disabled' ];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        // console.log(`Attribute "${name}" changed from "${oldValue}" to "${newValue}"`);

        if (oldValue === newValue) {
            return;
        }

        if (name === 'disabled') {
            this.classList.toggle('disabled', this.disabled);
        }

    }

}