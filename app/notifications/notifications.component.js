import { EventBus } from '../core/services/index.js';

const defaultTxt = 'Select a chip to start betting';

export class NotificationsComponent extends HTMLHeadingElement {

    #subscriptions = [];

    constructor() {
        super();
        this.rendered = false;
    }

    connectedCallback() {

        if (!this.rendered) {
            this.rendered = true;

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
                    (...revokedBets) => {
                        // console.log(revokedBets);

                        let formattedData;

                        if (revokedBets.length > 1) {
                            formattedData = 'all chips from your last double bet.'
                        } else {
                            formattedData = revokedBets.map(
                                ({ id, value, slot }) => `a chip with value of ${value} from slot ${slot.getTextContent()}`
                            ).join(', ');
                        }

                        // console.log(formattedDAta);

                        this.textContent = `You've withdrawed ${formattedData}`;
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
        this.#subscriptions.forEach(_ => _?.unsubscribe());
    }
}