import { ButtonComponent } from '../../core/interfaces/index.js';
import { EventBus, BetManager } from '../../core/services/index.js'

export class UndoButtonComponent extends ButtonComponent {
    
    constructor() {
        super();
        this.rendered = false;
        this._clickHandler = this._clickHandler.bind(this);
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
            this.addEventListener('pointerdown', this._clickHandler);

        }
    
    }

    disconnectedCallback() {
        this.removeEventListener('pointerdown', this._clickHandler);
    }

}