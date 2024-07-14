import { ButtonComponent } from '../../core/interfaces/index.js';
import { EventBus, BetManager } from '../../core/services/index.js'


export class DoubleButtonComponent extends ButtonComponent {
    
    /**
     * @private
     * @description Manages click events on double bets button.
     */
    #clickHandler;

    constructor() {
        super();
        this.rendered = false;

        /**
         * @this DoubleButtonComponent 
         * @param {PointerEvent} [e] 
         * @returns {void}
         */
        this.#clickHandler = () => {
            if (this.disabled) return;

            const result = BetManager.doubleBets();
        
            if (!result) return;
        
            EventBus.publish('roulette:chipsdoubled', result);
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