import { ButtonComponent } from '../../core/interfaces/index.js';
import { EventBus, BetManager } from '../../core/services/index.js'


export class ClearButtonComponent extends ButtonComponent {
    
    /**
     * @private 
     * @description Manages click events on clear bets button.
     */
    #clickHandler;

    constructor() {
        super();
        this.rendered = false;

        /**
         * @this ClearButtonComponent 
         * @param {PointerEvent} [e] 
         * @returns {void}
         */
        this.#clickHandler = () => {
            if (this.disabled) return;

            const result = BetManager.clearBets();
            
            if (!result) return;
        
            EventBus.publish('roulette:chipscleared', result);
        };
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