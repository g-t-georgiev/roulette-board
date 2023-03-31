import { Component } from '../../core/interfaces/index.js';
import { Roulette } from '../../../utils/Roulette.js';
import { EventBus } from '../../core/services/index.js';

import createTemplate from './chip.template.js';

export class ChipComponent extends Component {

    #template = document.createElement('template');
    #shadowRoot = this.attachShadow({ mode: 'open' });

    get #selected() {
        return this.hasAttribute('selected');
    }

    set #selected(v) {
        this.toggleAttribute('selected', v);
    }
    
    constructor() {
        super();
        this.rendered = false;
        this._clickHandler = this._clickHandler.bind(this);
    }

    #render() {
        this.#template
            .innerHTML = createTemplate({ id: this.dataset.id, value: this.dataset.value }).trim();

        this.#shadowRoot.append(this.#template.content.cloneNode(true));
        this.addEventListener('pointerdown', this._clickHandler);
    }

    /**
     * Toggle selected state property and update selected attribute on component accordingly.
     * A boolean flag, which by default is undefined, can be passed to force a certain value.
     * @param {boolean | undefined} flag 
     */
    toggleSelectedState(flag) {
        // console.log(flag);
        if (flag != null) {
            this.#selected = flag;
            return;
        }

        this.#selected = !this.#selected;
    }

    #notify() {
        // console.log('Notifying...');
        const config = { 
            bubbles: true, 
            composed: false, 
            cancelable: true,
            detail: { 
                id: this.dataset.id, 
                value: this.dataset.value, 
                selected: this.#selected 
            } 
        };

        const event = Roulette.customEvent('roulette:chip', config);

        Promise.all([
            this.dispatchEvent(event),
            EventBus.publish(
                'roulette:chip', 
                { 
                    id: this.dataset.id, 
                    value: this.dataset.value, 
                    selected: this.#selected 
                }
            )
        ]);
    }

    /**
     * Pointer click event handler managing chip selection toggling,
     * sending custom select events with details about chip id, value 
     * and a boolean select flag reflecting if the same chip instance 
     * was first selected and then deselected.
     */
    _clickHandler() {
        this.toggleSelectedState();
        this.#notify();
    }

    connectedCallback() {
        
        if (!this.rendered) {
            this.rendered = true;
            this.#render();
            

            if (this.#selected) {
                this.#notify();
            }
        }
    }

    disconnectedCallback() {
        this.removeEventListener('pointerdown', this._clickHandler);
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