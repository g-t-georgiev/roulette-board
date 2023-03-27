import BetManager from '../../services/bet-manager.js';

export class RouletteSlot extends HTMLElement {

    constructor() {
        super();
        this.rendered = false;
    }

    connectedCallback() {

        if (!this.rendered) {
            this.rendered = true;
            console.log('Slot component was rendered!');
            BetManager.registerSlot(this);
        }

    }

    disconnectedCallback() {
        console.log('Slot component was removed!');
    }

}