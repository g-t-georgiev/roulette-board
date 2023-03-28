import EventBus from '../../services/event-bus.js';
import BetManager from '../../services/bet-manager.js';

export class RouletteUndoButton extends HTMLButtonElement {
    
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
        
        const result = BetManager.undoLastBet();
        // console.log(result);

        if (!result) return;

        const hasPlacedBets = BetManager.hasPlacedBets();
        // console.log(hasPlacedBets);

        if (!hasPlacedBets) {
            EventBus.publish('roulette:clear');
        } else {
            EventBus.publish('roulette:undo', { id: result.chip.id, value: result.chip.value, slot: result.slot });
        }
    }

    connectedCallback() {

        if (!this.rendered) {
            this.rendered = true;
            // console.log('Undo button component rendered!');
            this.addEventListener('pointerdown', this._clickHandler);

        }
    
    }

    disconnectedCallback() {
        // console.log('Undo button component removed!');
        this.removeEventListener('pointerdown', this._clickHandler);
    }

}