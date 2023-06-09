import { ButtonComponent } from '../../core/interfaces/index.js';
import { EventBus, BetManager } from '../../core/services/index.js'

export class UndoButtonComponent extends ButtonComponent {
    
    constructor() {
        super();
        this.rendered = false;
        this.__clickHandler = this.#clickHandler.bind(this);
    }

    #clickHandler() {
        if (this.disabled) return;
        
        const result = BetManager.undoLastBet();
        // console.log(result);

        if (!result) return;

        const hasPlacedBets = BetManager.hasPlacedBets();
        // console.log(hasPlacedBets);

        if (!hasPlacedBets) {

            EventBus.publish(
                'roulette:chipscleared',
                result
            );

        } else {

            EventBus.publish(
                'roulette:betundone', 
                result
            );

        }
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
            this.addEventListener('pointerdown', this.__clickHandler);

        }
    
    }

    disconnectedCallback() {
        this.removeEventListener('pointerdown', this.__clickHandler);
    }

}