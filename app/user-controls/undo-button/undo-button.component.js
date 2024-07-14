import { ButtonComponent } from '../../core/interfaces/index.js';
import { EventBus, BetManager } from '../../core/services/index.js'


function clickHandler() {
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

export class UndoButtonComponent extends ButtonComponent {

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