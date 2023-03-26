export class RouletteClearButton extends HTMLButtonElement {
    
    constructor() {
        super();
        this.rendered = false;
        this._clickHandler = this._clickHandler.bind(this);
    }

    _clickHandler(e) {
        if (this.disabled) {
            console.log('Clear button is disabled!');
            return;
        }

        console.log('Clear button clicked!');
    }

    connectedCallback() {

        if (!this.rendered) {
            this.rendered = true;
            // console.log('Clear button component rendered!');
            this.addEventListener('pointerdown', this._clickHandler);
        }

    }

    disconnectedCallback() {
        // console.log('Clear button component removed!');
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