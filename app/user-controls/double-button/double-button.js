import EventBus from "../../services/event-bus.js";
import BetManager from "../../services/bet-manager.js";

export class RouletteDoubleButton extends HTMLButtonElement {

    #betPlacedSubscription;
    #betsClearedSubscription;
    
    constructor() {
        super();
        this.rendered = false;
        this._clickHandler = this._clickHandler.bind(this);
    }

    _clickHandler(e) {
        if (this.disabled) {
            console.log('Double bets button is disabled!');
            return;
        }
        
        // console.log('Double bets button clicked!');
        BetManager.doubleBets();
        EventBus.publish('roulette:betsdoubled');
    }

    connectedCallback() {

        if (!this.rendered) {
            this.rendered = true;
            // console.log('Double button component rendered!');

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
        // console.log('Double button component removed!');
        this.removeEventListener('pointerdown', this._clickHandler);
        this.#betPlacedSubscription?.unsubscribe();
        this.#betsClearedSubscription?.unsubscribe();
    }

}