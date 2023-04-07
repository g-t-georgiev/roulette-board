import { Component } from '../../core/interfaces/index.js';
import { EventBus, BetManager } from '../../core/services/index.js';

import { SlotChipComponent } from './slot-chip/slot-chip.component.js';

customElements.define('roulette-slot-chip', SlotChipComponent);


export class SlotComponent extends Component {

    #shadowRoot = this.attachShadow({ mode: 'open' });

    constructor() {
        super();
        this.rendered = false;
    }

    /**
     * Creates an instance of a chip element and adds it to the slot.
     * @param {{ id: string, value: string }} data 
     * @param {boolean} stacked 
     * @returns 
     */
    placeChipInSlot(data, stacked = false) {
        const elem = document.createElement('roulette-slot-chip');
        elem.toggleAttribute('stacked', stacked);
        elem.dataset.id = data.id;
        elem.dataset.value = data.value;

        this.#shadowRoot.append(elem);
        return elem;
    }

    /**
     * Protected wrapper method forwarding the calls its 
     * private counterpart with the 'this' context binded 
     * to the component instance.
     * @param  {...any} args 
     */
    __chipPlacedHandler(...args) {
        this.#chipPlacedHandler.call(this, ...args);
    }

    /**
     * Protected wrapper method forwarding the calls to 
     * its private counterpart with the 'this' context 
     * binded to the component instance.
     * @param  {...any} args 
     */
    __clickHandler(...args) {
        this.#clickHandler.call(this, ...args);
    }

    /**
     * Returns the text content value 
     * of a the component which is the slot's label.
     */
    getTextContent() {
        const spanElem = this.#shadowRoot.querySelector('.slot-txt');
        // console.log(spanElem);
        const textContent = spanElem.textContent;
        // console.log(textContent);
        return textContent;
    }

    /**
     * Sets component text content.
     * @param {string} textContent 
     */
    setTextContent(textContent) {
        // Delay DOM queries to avoid null pointer exceptions.
        const timerId = setTimeout(() => {
            const spanElem = this.#shadowRoot.querySelector('.slot-txt');
            // console.log(spanElem);
            spanElem.textContent = textContent;

            clearTimeout(timerId);
        });
    }

    #render() {
        const stylesheets = [];

        const stylesheetElem = document.createElement('link');
        stylesheetElem.rel = 'stylesheet';
        stylesheetElem.href = '/app/board/slot/slot.component.css';

        const responsiveStylesheetElem = document.createElement('link');
        responsiveStylesheetElem.rel = 'stylesheet';
        responsiveStylesheetElem.href = '/app/board/slot/responsive.part.css';

        stylesheets.push(stylesheetElem, responsiveStylesheetElem);

        const spanElem = document.createElement('span');
        spanElem.classList.add('slot-txt');

        this.#shadowRoot.append(...stylesheets, spanElem);
        this.addEventListener('roulette:chipplaced', this.__chipPlacedHandler);
        this.addEventListener('pointerdown', this.__clickHandler);
    }

    /**
     * Handles chip placed custom events with details about the 
     * created chip instance, such as the id and the value.
     * @param {CustomEvent<{ id: string, value: string }>} e 
     */
    #chipPlacedHandler(e) {
        console.log(e.detail);


    }

    /**
     * Handles click events in the slot. Creates a slot chip instance for any selected chip 
     * placed. If other instances of a chip element are present, shows a stacked version where 
     * the text content is the summed value of all chip elements in that slot. But the real value 
     * of the chip kept in the bets manager remains (1, 2, 5, etc.).
     */
    #clickHandler() {
        // console.log('Slot toggled.');

        const selectedChipDTO = BetManager.getPendingBet();
        // console.log(selectedChipDTO);

        if (!selectedChipDTO) return;

        // get all chip nodes in the slot
        // get the last chip node value, defaults to 0
        // sum the last chip node value with the currently selected chip value
        const chipsNodeList = this.#shadowRoot.querySelectorAll('roulette-slot-chip');
        // console.log(chipsNodeList.length);
        const lastPlacedChipNodeValue = chipsNodeList.item(chipsNodeList.length - 1)?.textContent ?? 0;
        const summedValue = Number(lastPlacedChipNodeValue) + Number(selectedChipDTO.value);

        const slotChip = this.placeChipInSlot({ ...selectedChipDTO, value: summedValue }, chipsNodeList.length + 1 > 1);
        const betsCount = BetManager.placeBet({ chip: { ...selectedChipDTO, ref: slotChip }, slot: this });
        // console.log(betsCount);

        if (betsCount === 1) {
            EventBus.publish('roulette:notempty');
        }
        
        EventBus.publish('roulette:bet', this, selectedChipDTO);
    }

    connectedCallback() {

        if (!this.rendered) {
            this.rendered = true;
            this.#render();
        }

    }

    disconnectedCallback() {
        this.removeEventListener('pointerdown', this.__clickHandler);
    }

}