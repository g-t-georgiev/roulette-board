import BetManager from '../../services/bet-manager.js';
import EventBus from '../../services/event-bus.js';

export class RouletteSlot extends HTMLElement {

    constructor() {
        super();
        this.rendered = false;
        this._clickHandler = this._clickHandler.bind(this);
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

    getTextContent() {
        const spanElem = this.querySelector('.slot-txt');
        // console.log(spanElem);
        const textContent = spanElem.textContent;
        // console.log(textContent);
        return textContent;
    }

    _clickHandler() {
        // console.log('Slot toggled.');

        const selectedChipDTO = BetManager.getPendingBet();
        // console.log(selectedChipDTO);

        if (!selectedChipDTO) return;

        // get all chip nodes in the slot
        // get the last chip node value, defaults to 0
        // sum the last chip node value with the currently selected chip value
        const chipsNodeList = this.querySelectorAll('.chip');
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
            // console.log('Slot component was rendered!');
            this.addEventListener('pointerdown', this._clickHandler);
        }

    }

    disconnectedCallback() {
        // console.log('Slot component was removed!');
        this.removeEventListener('pointerdown', this._clickHandler);
    }

}