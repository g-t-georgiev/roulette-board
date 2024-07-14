import { ButtonComponent } from '../../core/interfaces/index.js';
import { EventBus, BetManager } from '../../core/services/index.js'


export class UndoButtonComponent extends ButtonComponent {

    /**
     * @private
     * @description Manages click events on undo button.
     */
    #clickHandler;
    
    constructor() {
        super();
        this.rendered = false;

        /**
         * @this UndoButtonComponent 
         * @param {PointerEvent} [e] 
         * @returns {void}
         */
        this.#clickHandler = () => {
            if (this.disabled) return;
                
            const result = BetManager.undoLastBet();
            // console.log(result);
        
            if (!result) return;
        
            const hasPlacedBets = BetManager.hasPlacedBets();
            // console.log(hasPlacedBets);

            EventBus.publish(!hasPlacedBets ? 'roulette:chipscleared' : 'roulette:betundone', result);
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