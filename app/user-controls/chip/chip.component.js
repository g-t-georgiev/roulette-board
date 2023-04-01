import { Component } from '../../core/interfaces/index.js';
import { Roulette } from '../../../utils/Roulette.js';
import { EventBus } from '../../core/services/index.js';


export class ChipComponent extends Component {

    #shadowRoot = this.attachShadow({ mode: 'open' });

    get selected() {
        return this.hasAttribute('selected');
    }

    set selected(v) {
        this.toggleAttribute('selected', v);
    }
    
    constructor() {
        super();
        this.rendered = false;
        this._clickHandler = this._clickHandler.bind(this);
    }

    #render() {
        const stylesheetElem = document.createElement('link');
        stylesheetElem.rel = 'stylesheet';
        stylesheetElem.href = '/app/user-controls/chip/chip.component.css';

        const chipContentElem = document.createElement('div');
        chipContentElem.classList.add('chip');
        
        const chipIconElem = document.createElement('img');
        chipIconElem.classList.add('chip-img');
        chipIconElem.src = `/assets/images/chip-background-${this.dataset.id}.png`;
        chipIconElem.alt = `chip-background-${this.dataset.id}`;

        const chipTxtElem = document.createElement('span');
        chipTxtElem.classList.add('chip-txt');
        chipTxtElem.textContent = this.dataset.value;

        chipContentElem.append(chipIconElem, chipTxtElem);

        this.#shadowRoot.append(stylesheetElem, chipContentElem);
        this.addEventListener('pointerdown', this._clickHandler);
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
                selected: this.selected 
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
                    selected: this.selected 
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
        this.selected = !this.selected;
        this.#notify();
    }

    connectedCallback() {
        
        if (!this.rendered) {
            this.rendered = true;
            this.#render();
            

            if (this.selected) {
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