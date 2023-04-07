import { ButtonComponent } from '../../core/interfaces/index.js';
import { EventBus, BetManager } from '../../core/services/index.js'

export class DoubleButtonComponent extends ButtonComponent {
    
    constructor() {
        super();
        this.rendered = false;
        this.__clickHandler = this.#clickHandler.bind(this);
    }

    #clickHandler() {
        if (this.disabled) return;

        // TODO: Get action result
        const success = BetManager.doubleBets();

        if (!success) return;

        // TODO: Publish payload with the 
           added chips summed value.

        EventBus.publish('roulette:double');
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