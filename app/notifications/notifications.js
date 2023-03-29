import EventBus from '../services/event-bus.js';

const defaultTxt = 'Select a chip to start betting';

export class RouletteNotifications extends HTMLHeadingElement {

    #subscriptions = [];

    constructor() {
        super();
        this.rendered = false;
    }

    connectedCallback() {

        if (!this.rendered) {
            this.rendered = true;
            // console.log('Notifications component is rendered!');

            this.#subscriptions.push(
                EventBus.subscribe(
                    'roulette:chip', 
                    (chip) => {
        
                        if (chip.selected) {
                            this.textContent = `You've selected a chip with value of ${chip.value}`;
                            return;
                        }

                        this.textContent = defaultTxt;
                    },
                    this
                ),
                EventBus.subscribe(
                    'roulette:bet',
                    (slot, chip) => {
                        this.textContent = `You've placed a chip with value of ${chip.value} to  slot ${slot.getTextContent() ?? 'N/A'}`;
                    },
                    this
                ),
                EventBus.subscribe(
                    'roulette:clear',
                    () => {
                        this.textContent = 'You\'ve cleared all of your bets from the board';
                    },
                    this
                ),
                EventBus.subscribe(
                    'roulette:undo', 
                    ({ id, value, slot}) => {
                        this.textContent = `You've withdrawed a chip with value of ${value} from slot ${slot.getTextContent()}`;
                    },
                    this
                ),
                EventBus.subscribe(
                    'roulette:double',
                    () => {
                        this.textContent = 'You\'ve doubled all of your bets on the board';
                    },
                    this
                )
            );
        }
    }

    disconnectedCallback() {
        // console.log('Notifications component is removed!');
        this.#subscriptions.forEach(_ => _?.unsubscribe());
    }
}