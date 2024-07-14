import { Component } from '../../core/interfaces/index.js';
import { Roulette } from '../../../utils/Roulette.js';
import { EventBus } from '../../core/services/index.js';


Roulette.fetchComponentStyles(
    './app/chips/chip/chip.component.css',
    './app/chips/chip/responsive.part.css'
)
    .then(cssTextStyles => {
        const styleElem = Roulette.createElement({ name: 'style' }, ...(Array.isArray(cssTextStyles) ? cssTextStyles : [ cssTextStyles ]));
        EventBus.publish('CHIPSTYLESLOAD', styleElem);
    })
    .catch(error => {
        console.error(`Styles load error: ${error}`);
    });

export class ChipComponent extends Component {

    /**
     * @private
     * @description Click event handler managing chip selection toggling,
     * sending custom select events with details about chip id, value 
     * and a boolean select flag reflecting if the same chip instance 
     * was first selected and then deselected.
     */
    #clickHandler;
    #shadowRoot = this.attachShadow({ mode: 'open' });
    #subscriptions = [];

    get selected() {
        return this.hasAttribute('selected');
    }

    set selected(v) {
        this.toggleAttribute('selected', v);
    }
    
    constructor() {
        super();
        this.rendered = false;

        /**
         * @this ChipComponent 
         * @param {PointerEvent} [e] 
         * @returns {void} 
         */
        this.#clickHandler = () => {
            this.selected = !this.selected;
            this.#notify();
        };
    }

    async #render() {
        try {
            Roulette.createElement(
                {
                    name: 'div', 
                    attributes: {
                        classList: 'chip'
                    },
                    parent: this.#shadowRoot
                },
                Roulette.createElement({
                    name: 'img',
                    attributes: {
                        classList: 'chip-img',
                        src: `./assets/images/chip-background-${this.dataset.id}.png`,
                        alt: `chip-background-${this.dataset.id}`
                    }
                }),
                Roulette.createElement({
                    name: 'span',
                    attributes: {
                        classList: 'chip-txt'
                    }
                }, this.dataset.value)
            );
    
            this.addEventListener('click', this.#clickHandler);
        } catch (error) {
            console.error(error);
        }
    }

    #notify() {
        const config = { 
            bubbles: true, 
            composed: true, 
            cancelable: true,
            detail: { 
                id: this.dataset.id, 
                value: this.dataset.value, 
                selected: this.selected 
            } 
        };

        const event = Roulette.customEvent('roulette:chipselected', config);

        Promise.all([
            this.dispatchEvent(event),
            EventBus.publish(
                'roulette:chipselected', 
                { 
                    ...config.detail 
                }
            )
        ]);
    }

    connectedCallback() {
        
        if (!this.rendered) {
            this.rendered = true;
            this.#render();
            
            this.#subscriptions.push(
                EventBus.subscribe(
                    'CHIPSTYLESLOAD',
                    (styleEl) => {
                        // console.log(styleEl);
                        this.#shadowRoot.prepend(styleEl?.cloneNode(true));
                    }
                )
            );

            if (this.selected) {
                this.#notify();
            }
        }
    }

    disconnectedCallback() {
        this.removeEventListener('click', this.#clickHandler);
        this.#subscriptions.forEach(_=>_?.unsubscribe());
    }

}

// Proxying custom elements tests

// customElements.define('roulette-chip', RouletteChip);
// const elem = document.createElement('roulette-chip');
// elem.setAttribute('chip-id', '1');
// elem.setAttribute('value', '1');

// const handlers = {
//     get(target, prop, receiver) {
//         if (prop === 'setAttribute' || prop === 'removeAttribute') {
//             console.log(prop);
//         }
//         return Reflect.get(target, prop, receiver);
//     }
// };
// const proxy = new Proxy(elem, handlers);
// console.log(proxy.setAttribute);