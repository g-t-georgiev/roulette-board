import BetManager from '../../services/bet-manager.js';
import EventBus from '../../services/event-bus.js';
import { customEventFactory } from '../../../utils/customEventFactory.js';

export class RouletteSlot extends HTMLElement {

    constructor() {
        super();
        this.rendered = false;
        this._clickHandler = this._clickHandler.bind(this);
    }

    _clickHandler() {
        const detail = { target: this };
        const config = { bubbles: true, composed: false, cancelable: true, detail };
        // Create and initialize slot click event
        // If event is not interrupted dispatchEvent will return true
        const event = customEventFactory('roulette:slotclick', config);
        const success = this.dispatchEvent(event);
        // console.log(success);

        if (!success) return;

        // If event was not interrupted
        // that probably means there is a 
        // selected chip at the moment
        const chip = BetManager.getPendingBet();
        // console.log(chip);

        // Call the bet initializer functionality
        BetManager.placeBet(this, chip);
        // Emit placed bet event
        EventBus.publish('roulette:betplaced', this, chip);
    }

    connectedCallback() {

        if (!this.rendered) {
            this.rendered = true;
            // console.log('Slot component was rendered!');
            BetManager.registerSlot(this);
            this.addEventListener('pointerdown', this._clickHandler);
        }

    }

    disconnectedCallback() {
        // console.log('Slot component was removed!');
        this.removeEventListener('pointerdown', this._clickHandler);
    }

}