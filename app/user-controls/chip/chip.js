import EventBus from '../../services/eventBus.js';
import { customEventFactory } from '../../../utils/customEventFactory.js';

export class RouletteChip extends HTMLElement {

    #template = document.createElement('template');
    #shadowRoot = this.attachShadow({ mode: 'open' });

    #chipId = this.getAttribute('chip-id');
    #value = this.getAttribute('value');
    #selected = this.hasAttribute('selected');

    #subscription;
    
    constructor() {
        super();
        this.rendered = false;
        this._clickHandler = this._clickHandler.bind(this);
    }

    #render() {
        this.#template
            .innerHTML = `
                <link rel="stylesheet" href="/app/user-controls/chip/chip.css" />

                <article class="chip">
                    <img class="chip-img" src="/assets/images/chip-background-${this.#chipId}.png" alt="chip-background-${this.#chipId}" />
                    <span class="chip-txt">${this.#value}</span>
                </article>`
            .trim();
    }

    /**
     * Toggle selected state property and update selected attribute on component accordingly.
     * A boolean flag, which by default is undefined, can be passed to force a certain value.
     * @param {boolean | undefined} flag 
     */
    #toggleSelectedState(flag) {
        if (flag != null) {
            this.#selected = flag;
        } else {
            this.#selected = !this.#selected;
        }

        if (this.#selected) {
            this.setAttribute('selected', this.#selected);
        } else {
            this.removeAttribute('selected');
        }
    }

    /**
     * Pointer click event handler managing chip selection toggling,
     * sending custom select events with details about chip id, value 
     * and a boolean select flag reflecting if the same chip instance 
     * was first selected and then deselected.
     * @param {PointerEvent} e 
     */
    _clickHandler(e) {
        this.#toggleSelectedState();

        const detail = { chipId: this.#chipId, value: this.#value, selected: this.#selected };
        const config = { bubbles: true, composed: true, detail };
        const event = customEventFactory('roulette:chipselect', config);

        Promise.all([
            this.dispatchEvent(event),
            EventBus.publish('roulette:chipselect', this.#chipId, this.#value, this.#selected)
        ]);
    }

    connectedCallback() {
        
        if (!this.rendered) {
            this.rendered = true;
            this.#render();
            // console.log('Chip component rendered!');
            this.addEventListener('pointerdown', this._clickHandler);
            this.#shadowRoot.append(this.#template.content.cloneNode(true));

            this.#subscription = EventBus.subscribe('roulette:chipselect', (chipId, value, selected) => {
                // console.log(chipId, value, selected);

                if (chipId !== this.#chipId && this.#selected) {
                    this.#toggleSelectedState();
                }
            });

            if (this.#selected) {
                const detail = { chipId: this.#chipId, value: this.#value, selected: this.#selected };
                const config = { bubbles: true, composed: true, detail };
                const event = customEventFactory('roulette:chipselect', config);
                
                Promise.all([
                    this.dispatchEvent(event),
                    EventBus.publish('roulette:chipselect', this.#chipId, this.#value, this.#selected)
                ]);
            }
        }
    }

    disconnectedCallback() {
        // console.log('Chip component removed!');
        this.removeEventListener('pointerdown', this._clickHandler);
        this.#subscription.unsubscribe();
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