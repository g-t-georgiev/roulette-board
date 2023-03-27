import EventBus from '../services/event-bus.js';

export class RouletteNotifications extends HTMLHeadingElement {

    #subscription;

    constructor() {
        super();
        this.rendered = false;
    }

    connectedCallback() {

        if (!this.rendered) {
            this.rendered = true;
            // console.log('Notifications component is rendered!');

            this.#subscription = EventBus.subscribe(
                'roulette:chipselect', 
                (chipId, value, selected) => {
                    // console.log(chipId, value, selected);
    
                    if (selected) {
                        this.textContent = `You've selected a chip with value of ${value}`;
                        return;
                    }

                    this.textContent = 'Select a chip to start betting';
                },
                this
            );
        }
    }

    disconnectedCallback() {
        // console.log('Notifications component is removed!');
        this.#subscription.unsubscribe();
    }
}