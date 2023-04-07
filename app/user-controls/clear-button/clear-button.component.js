import { ButtonComponent } from '../../core/interfaces/index.js';
import { EventBus, BetManager } from '../../core/services/index.js'

export class ClearButtonComponent extends ButtonComponent {
    
    constructor() {
        super();
        this.rendered = false;
        this.__clickHandler = this.#clickHandler.bind(this);
    }

    #clickHandler() {
        if (this.disabled) return;

        const result = BetManager.clearBets();
        
        if (!result) return;

        // TODO: Pass action result regarding cleared chips total value as event payload.
        EventBus.publish('roulette:clear');
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