import { ButtonComponent } from '../../core/interfaces/index.js';
import { EventBus, BetManager } from '../../core/services/index.js'


function clickHandler() {
    if (this.disabled) return;

    const result = BetManager.doubleBets();

    if (!result) return;

    EventBus.publish('roulette:chipsdoubled', result);
}

export class DoubleButtonComponent extends ButtonComponent {
    
    #clickHandler;

    constructor() {
        super();
        this.rendered = false;
        this.#clickHandler = clickHandler.bind(this);
    }

    /**
     * @param {boolean} value 
     */
    toggleDisabledState(value) {
        super.toggleDisabledState(value);
    }

    connectedCallback() {
        super.connectedCallback();
        
        if (!this.rendered) {
            this.rendered = true;
            this.addEventListener('click', this.#clickHandler);
        }
    }

    disconnectedCallback() {
        this.removeEventListener('click', this.#clickHandler);
    }

}