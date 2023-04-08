import { Component } from '../core/interfaces/index.js';
import { ChipComponent } from './chip/chip.component.js';
import * as data from './chips.data.js';

customElements.define('roulette-chip', ChipComponent);

export class ChipsContainerComponent extends Component {

    #shadowRoot = this.attachShadow({ mode: 'open' });

    constructor() {
        super();
        this.rendered = false;
    }

    #render() {
        const stylesheets = [];

        const stylesheetElem = document.createElement('link');
        stylesheetElem.setAttribute('rel', 'stylesheet');
        stylesheetElem.setAttribute('href', '/app/chips/chips.component.css');

        const responsiveStylesheetElem = document.createElement('link');
        responsiveStylesheetElem.setAttribute('rel', 'stylesheet');
        responsiveStylesheetElem.setAttribute('href', '/app/chips/responsive.part.css');

        stylesheets.push(stylesheetElem, responsiveStylesheetElem);

        const chipElemList = data.chips.map(data => {
            const elem = document.createElement('roulette-chip');
            elem.selected = data.selected;
            elem.dataset.id = data.id;
            elem.dataset.value = data.value;
            return elem;
        });

        this.addEventListener('roulette:chipselected', this.__selectHandler);
        this.#shadowRoot.append(...stylesheets, ...chipElemList);
    }

    /**
     * Manage custom events about selected chip.
     * @param {CustomEvent<{ id: string, value: string, selected: boolean }>} e 
     */
    #selectHandler(e) {
        // console.log(e.detail);

        const chips = this.#shadowRoot.querySelectorAll('roulette-chip[selected]');
        // console.log(chips);

        /**
         * Callback looping over chip instances with selected attribute.
         * Calls #toggleSelectState method if a possible previously selected chip instance
         * is not the trigger of the current event.
         * @param {ChipComponent} chip 
         */
        const cb = chip => {
            const isEvntTarget = chip.dataset.id === e.detail.id;
            const isSelected = isEvntTarget && e.detail.selected;
            chip.selected = isSelected;
        };

        chips.forEach(cb);
    }

    /**
     * Select chip event handler method for internal use only.
     * Forwards calls to its private counterpart, binding execution 
     * context to the component instance.
     * @param  {...any} args 
     */
    __selectHandler(...args) {
        this.#selectHandler.call(this, ...args);
    }

    connectedCallback() {
        if (!this.rendered) {
            this.rendered = true;
            this.#render();
        }
    }

    disconnectedCallback() {
        this.removeEventListener('roulette:chipselected', this.__selectHandler);
    }

}