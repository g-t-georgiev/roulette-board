import EventBus from "../../services/event-bus.js";
import BetManager from "../../services/bet-manager.js";

export class RouletteClearButton extends HTMLButtonElement {
    
    constructor() {
        super();
        this.rendered = false;
        this._clickHandler = this._clickHandler.bind(this);
    }

    /**
     * Toggles disabled state
     * @param {boolean} value 
     */
    toggleDisabledState(value) {
        this.disabled = value;
    }

    _clickHandler() {
        if (this.disabled) return;

        const success = BetManager.clearBets();

        if (!success) return;

        EventBus.publish('roulette:clear');
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

}