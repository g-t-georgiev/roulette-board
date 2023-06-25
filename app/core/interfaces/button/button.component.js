import { Component } from '../component/component.js';
import { EventBus } from '../../services/index.js';
import Roulette from '../../../../utils/Roulette.js';



Roulette
    .fetchComponentStyles('./app/core/interfaces/button/button.component.css')
    .then(cssText => {
        const styleElem = Roulette.createElement(
            {
                name: 'style',
            }, 
            ...(Array.isArray(cssText) ? cssText : [ cssText ])
        );

        EventBus.publish('BUTTONSTYLESLOAD', styleElem);
    })
    .catch(error => {
        console.error(`Something went wrong while fetching #ButtonComponent styles. Reason: ${error}`);
    });

/**
 * Base class for inheriting shared 
 * functionality between button components.
 */
export class ButtonComponent extends Component {

    #shadowRoot = this.attachShadow({ mode: 'closed' });
    #rendered = false;
    #subscriptions = [];

    get disabled() {
        return this.hasAttribute('disabled');
    }

    set disabled(value) {
        this.toggleAttribute('disabled', value);
    }

    constructor() {
        super();

        if (this.constructor.name === 'ButtonComponent') {
            throw new Error('Button is an abstract class.');
        }

    }

    #render() {
        Roulette.createElement(
            {
                name: 'slot',
                parent: this.#shadowRoot
            }
        );
    }

    /**
     * Toggle disabled state
     * @param {boolean} value 
     */
    toggleDisabledState(value) {
        // console.log('#toggleDisabledState');
        this.disabled = value;
    }

    connectedCallback() {
        if (!this.#rendered) {
            this.#rendered = true;
            this.#render();

            this.#subscriptions.push(
                EventBus.subscribe(
                    'BUTTONSTYLESLOAD',
                    (styleEl) => {
                        // console.log(styleEl);
                        this.#shadowRoot.prepend(styleEl.cloneNode(true));
                    } 
                )
            );
        }
    }

    disconnectedCallback() {
        this.#subscriptions.forEach(_=>_.unsubscribe());
    }

}