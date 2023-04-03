import { Component } from '../../core/interfaces/index.js';
import { EventBus, BetManager } from '../../core/services/index.js';

export class SlotComponent extends Component {

    #shadowRoot = this.attachShadow({ mode: 'open' });

    constructor() {
        super();
        this.rendered = false;
    }

    /**
     * Creates an instance of a chip element.
     * @param {{ id: string, value: string }} data 
     * @param {boolean} stacked 
     * @returns 
     */
    createSlotChipElem(data, stacked = false) {
        const elem = document.createElement('div');

        elem.classList.add('chip');
        elem.classList.toggle('stacked', stacked);
        elem.dataset.id = data.id;
        elem.textContent = data.value;

        const img = document.createElement('img');
        img.classList.add('chip-icon');
        img.setAttribute('src', `/assets/images/chip-background-${data.id}.png`);
        img.setAttribute('alt', 'chip icon');
        img.setAttribute('width', '30');
        img.setAttribute('height', '30');

        elem.append(img);

        return elem;
    }

    appendSlotChipElem(chip) {
        this.#shadowRoot.append(chip);
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
     * Returns the text content value of a slot which is a 
     * summed representation of all chip element values.
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
    }

    /**
     * Handles click events in the slot. Creates a slot chip instance for any selected chip 
     * placed. If there other instances of a chip element are present, shows a stacked version where 
     * the text content is the summed value of all chip elements in that slot.
     */
    #clickHandler() {
        // console.log('Slot toggled.');

        const selectedChipDTO = BetManager.getPendingBet();
        // console.log(selectedChipDTO);

        if (!selectedChipDTO) return;

        // get all chip nodes in the slot
        // get the last chip node value, defaults to 0
        // sum the last chip node value with the currently selected chip value
        const chipsNodeList = this.#shadowRoot.querySelectorAll('.chip');
        // console.log(chipsNodeList.length);
        const lastPlacedChipNodeValue = chipsNodeList.item(chipsNodeList.length - 1)?.textContent ?? 0;
        const summedValue = Number(lastPlacedChipNodeValue) + Number(selectedChipDTO.value);

        const slotChip = this.createSlotChipElem({ ...selectedChipDTO, value: summedValue }, chipsNodeList.length + 1 > 1);
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
            this.addEventListener('pointerdown', this.__clickHandler);
            this.#render();
        }

    }

    disconnectedCallback() {
        this.removeEventListener('pointerdown', this.__clickHandler);
    }

}