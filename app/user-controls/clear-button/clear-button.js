import EventBus from "../../services/event-bus.js";
import BetManager from "../../services/bet-manager.js";

export class RouletteClearButton extends HTMLButtonElement {

    #subscription;
    
    constructor() {
        super();
        this.rendered = false;
        this._clickHandler = this._clickHandler.bind(this);
    }

    _clickHandler(e) {
        if (this.disabled) {
            console.log('Clear button is disabled!');
            return;
        }

        // console.log('Clear button clicked!');
        const success = BetManager.clearBets();
        // console.log(success);

        if (success) {
            this.disabled = success;
            EventBus.publish('roulette:betscleared');
        }
    }

    connectedCallback() {

        if (!this.rendered) {
            this.rendered = true;
            // console.log('Clear button component rendered!');
            this.addEventListener('pointerdown', this._clickHandler);
            this.#subscription = EventBus.subscribe('roulette:betplaced', (slot, chip) => {
                // console.log(slot, chip);
                if (!this.disabled) return;

                this.disabled = false;
            });
        }

    }

    disconnectedCallback() {
        // console.log('Clear button component removed!');
        this.removeEventListener('pointerdown', this._clickHandler);
        this.#subscription?.unsubscribe();
    }

}