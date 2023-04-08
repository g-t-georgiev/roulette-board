import { ButtonComponent } from '../../core/interfaces/index.js';
import { EventBus, BetManager } from '../../core/services/index.js'

export class DoubleButtonComponent extends ButtonComponent {
    
    constructor() {
        super();
        this.rendered = false;
    }

    __clickHandler(...args) {
        this.#clickHandler.call(this, ...args);
    }

    #clickHandler() {
        if (this.disabled) return;

        const result = BetManager.doubleBets();

        if (!result) return;

        EventBus.publish('roulette:chipsdoubled', result);
    }

    connectedCallback() {
        if (!this.rendered) {
            this.rendered = true;
            this.addEventListener('pointerdown', this.__clickHandler);
        }
    }

    disconnectedCallback() {
        this.removeEventListener('pointerdown', this.__clickHandler);
    }

}