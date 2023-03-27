import EventBus from '../../services/event-bus.js';
import BetManager from '../../services/bet-manager.js';

export class RouletteUndoButton extends HTMLButtonElement {

    #betPlacedSubscription;
    #betsClearedSubscription;
    
    constructor() {
        super();
        this.rendered = false;
        this._clickHandler = this._clickHandler.bind(this);
    }

    _clickHandler(e) {
        if (this.disabled) {
            console.log('Undo button is disabled!');
            return;
        }

        console.log('Undo button clicked!');
        // BetManager.undoLastBet();
    }

    connectedCallback() {

        if (!this.rendered) {
            this.rendered = true;
            // console.log('Undo button component rendered!');

            this.addEventListener('pointerdown', this._clickHandler);

            this.#betPlacedSubscription = EventBus.subscribe(
                'roulette:betplaced',
                (slot, chip) => {
                    // console.log(slot, chip);
                    if (!this.disabled) return;

                    this.disabled = false;
                }
            );

            this.#betsClearedSubscription = EventBus.subscribe(
                'roulette:betscleared',
                () => {
                    this.disabled = true;
                }
            );

        }
    
    }

    disconnectedCallback() {
        // console.log('Undo button component removed!');
        this.removeEventListener('pointerdown', this._clickHandler);
        this.#betPlacedSubscription?.unsubscribe();
        this.#betsClearedSubscription?.unsubscribe();
    }

}