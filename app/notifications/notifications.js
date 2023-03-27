import EventBus from '../services/event-bus.js';

const defaultTxt = 'Select a chip to start betting';

export class RouletteNotifications extends HTMLHeadingElement {

    // #timerId;

    #chipSelectSubscription;
    #betPlacedSubscription;
    #betsClearedSubscription;
    #betsDoubledSubscription;

    constructor() {
        super();
        this.rendered = false;
    }

    // #resetTxt() {
    //     this.#timerId = setTimeout(() => {
    //         this.textContent = defaultTxt;
    //         this.#timerId = null;
    //     }, 1.2e3);
    // }

    connectedCallback() {

        if (!this.rendered) {
            this.rendered = true;
            // console.log('Notifications component is rendered!');

            this.#chipSelectSubscription = EventBus.subscribe(
                'roulette:chipselect', 
                (chipId, value, selected) => {
                    // console.log(chipId, value, selected);
    
                    if (selected) {
                        this.textContent = `You've selected a chip with value of ${value}`;
                        return;
                    }

                    this.textContent = defaultTxt;
                },
                this
            );

            this.#betPlacedSubscription = EventBus.subscribe(
                'roulette:betplaced',
                (slot, chip) => {
                    // console.log(slot, chip);
                    this.textContent = `You've placed a chip with value of ${chip.value} to ${slot.textContent}`;
                    // this.#resetTxt();
                }
            );

            this.#betsClearedSubscription = EventBus.subscribe(
                'roulette:betscleared',
                () => {
                    this.textContent = 'You\'ve cleared all of your bets from the board';
                    // this.#resetTxt();
                }
            );

            this.#betsDoubledSubscription = EventBus.subscribe(
                'roulette:betsdoubled',
                () => {
                    this.textContent = 'You\'ve doubled all of your bets on the board';
                    // this.#resetTxt();
                }
            );
        }
    }

    disconnectedCallback() {
        // console.log('Notifications component is removed!');
        this.#chipSelectSubscription?.unsubscribe();
        this.#betPlacedSubscription?.unsubscribe();
        this.#betsClearedSubscription?.unsubscribe();
        this.#betsDoubledSubscription?.unsubscribe();
    }
}