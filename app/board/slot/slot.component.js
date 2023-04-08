import { Component } from '../../core/interfaces/index.js';
import { EventBus, BetManager } from '../../core/services/index.js';
import Roulette from '../../../utils/Roulette.js';

import { SlotChipComponent } from './slot-chip/slot-chip.component.js';

customElements.define('roulette-slot-chip', SlotChipComponent);


Roulette.fetchComponentStyles(
    '/app/board/slot/slot.component.css',
    '/app/board/slot/responsive.part.css'
).then((cssTextStyles) => {
    // console.log(cssTextStyles);
    const styleElems = cssTextStyles.map(cssText => {
        const styleElem = document.createElement('style');
        styleElem.textContent = cssText;
        return styleElem;
    });

    EventBus.publish('SLOTSTYLESLOAD', styleElems);
}).catch(error => {
    console.error(error);
});

export class SlotComponent extends Component {

    #shadowRoot = this.attachShadow({ mode: 'open' });
    #subscriptions = [];
    #onRenderCallback = () => {};

    constructor() {
        super();
        this.rendered = false;
    }

    /**
     * Creates an instance of a chip element and adds it to the slot.
     * @param {{ id: string, value: string, computedValue: number }} data 
     * @param {boolean} stacked 
     * @returns 
     */
    placeChipInSlot(data, stacked = false) {
        const elem = document.createElement('roulette-slot-chip');
        elem.toggleAttribute('stacked', stacked);
        elem.dataset.id = data.id;
        elem.dataset.value = data.value;
        elem.dataset.computedValue = data.computedValue

        this.#shadowRoot.append(elem);
        return elem;
    }

    /**
     * Creates and appends to the shadow DOM a notification with 
     * the recently placed chip's value.
     * @param {{ id: string, value: string | number }} chip 
     * @param {"appended" | "removed"} state 
     */
    toggleChipNotification(chip, state = 'appended') {
        // console.log(chip);
        const { id, value } = chip;

        const notificationElem = document.createElement('roulette-popup');
        notificationElem?.initialize({ value, state });
        
        this.#shadowRoot.append(notificationElem);
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
        // console.log(textContent);

        this.#onRenderCallback = (spanElem) => {
            // console.log(spanElem);
            if (!spanElem) return;

            spanElem.textContent = textContent;
        };
    }

    #render() {
        const spanElem = document.createElement('span');
        spanElem.classList.add('slot-txt');
        this.#onRenderCallback?.(spanElem);
        this.#shadowRoot.append(spanElem);
        this.addEventListener('pointerdown', this.__clickHandler);
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

        const slotChip = this.placeChipInSlot({ ...selectedChipDTO, value: selectedChipDTO.value, computedValue: summedValue }, chipsNodeList.length + 1 > 1);
        const betsCount = BetManager.placeBet({ chip: { ...selectedChipDTO, ref: slotChip }, slot: this });
        // console.log(betsCount);

        if (betsCount === 1) {
            EventBus.publish('roulette:boardnotempty');
        }

        this.toggleChipNotification(selectedChipDTO);
        // EventBus.publish('roulette:chipplaced', this, selectedChipDTO);
    }

    connectedCallback() {

        if (!this.rendered) {
            this.rendered = true;
            this.#render();

            this.#subscriptions.push(
                EventBus.subscribe(
                    'SLOTSTYLESLOAD',
                    (stylesheets) => {
                        // console.log(stylesheets);
                        this.#shadowRoot.prepend(...stylesheets.map(styleEl => styleEl.cloneNode(true)));
                    }
                )
            );
        }

    }

    disconnectedCallback() {
        this.removeEventListener('pointerdown', this.__clickHandler);
        this.#subscriptions.forEach(_=>_.unsubscribe());
    }

}