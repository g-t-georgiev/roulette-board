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
           // TODO: Pass action results as payload to the clear event publish method.

 EventBus.publish('roulette:clear');
        } else {

            if (Array.isArray(result)) {
                let revokedBetsDTO = result.map((bet) => ({ id: bet.chip.id, value: bet.chip.value, slot: bet.slot }));

                EventBus.publish(
                    'roulette:undo', 
                    ...revokedBetsDTO
                );
            } else {
                EventBus.publish(
                    'roulette:undo', 
                    { id: result.chip.id, value: result.chip.value, slot: result.slot }
                );
            }

        }
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