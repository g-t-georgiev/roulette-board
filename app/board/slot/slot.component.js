import { Component } from '../../core/interfaces/index.js';
import { EventBus, BetManager } from '../../core/services/index.js';
import Roulette from '../../../utils/Roulette.js';

import { SlotChipComponent } from './slot-chip/slot-chip.component.js';

customElements.define('roulette-slot-chip', SlotChipComponent);


Roulette.fetchComponentStyles(
    './app/board/slot/slot.component.css',
    './app/board/slot/responsive.part.css'
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

    /**
     * @private 
     * @description Handles click events in the slot. Creates a slot chip instance for any selected chip 
     * placed. If other instances of a chip element are present, shows a stacked version where 
     * the text content is the summed value of all chip elements in that slot. But the real value 
     * of the chip kept in the bets manager remains (1, 2, 5, etc.).
     */
    #clickHandler;
    #shadowRoot = this.attachShadow({ mode: 'open' });
    #subscriptions = [];
    #onRenderCallback = () => {};

    #slotContainer = Roulette.createElement({ 
        name: 'div', 
        attributes: { 
            classList: 'slot-container',
            part: 'slot-container', 
        }, 
        parent: this.#shadowRoot 
    });

    #insertedChips = this.#slotContainer.getElementsByTagName('roulette-slot-chip');

    #observer = new MutationObserver((mutationsList) => {
        // console.log(mutationsList);
        if (!mutationsList.length > 0) {
            return;
        }

        const slotChipsMutationsList = [ ...mutationsList ].filter(
            mutationEntry => {
                // console.log(mutationEntry);
                const triggerElem = 
                    mutationEntry.addedNodes.length > 0 
                        ? mutationEntry.addedNodes.item(mutationEntry.addedNodes.length - 1) 
                        : mutationEntry.removedNodes.length > 0 
                            ? mutationEntry.removedNodes.item(mutationEntry.removedNodes.length - 1) 
                            : null;
                
                
                // console.log(triggerElem);
                const ActionTextComponent = customElements.get('roulette-action-text');
                
                if (triggerElem == null) return false;

                return !(triggerElem instanceof ActionTextComponent);
            }
        );

        // console.log(slotChipsMutationsList);

        if (slotChipsMutationsList.length > 0) {

            const stateObject = {
                value: 0,
                state: undefined
            };

            slotChipsMutationsList.forEach(
                mutationEntry => {
                    // Ensure that added/removed nodes are instances of ROULETTE-SLOT-CHIP
                    const isAdded = mutationEntry.addedNodes.length > 0 && Array.from(mutationEntry.addedNodes).some(node => node.nodeName === 'ROULETTE-SLOT-CHIP');
                    const isRemoved = mutationEntry.removedNodes.length > 0 && Array.from(mutationEntry.removedNodes).some(node => node.nodeName === 'ROULETTE-SLOT-CHIP');

                    const triggerElem = 
                            isAdded
                            ? mutationEntry.addedNodes.item(mutationEntry.addedNodes.length - 1)
                            : isRemoved
                                ? mutationEntry.removedNodes.item(mutationEntry.removedNodes.length - 1) 
                                : null;
                    
                    if (slotChipsMutationsList.length === 1) {
                        stateObject.id = triggerElem.dataset.id;
                        stateObject.value = triggerElem.dataset.value;
                    } else {
                        stateObject.value += triggerElem ? Number(triggerElem.dataset.value) : 0;
                    }

                    this.classList.toggle('empty', this.#insertedChips.length === 0);
                    stateObject.state = isAdded ? 'appended' : isRemoved ? 'removed' : undefined;
                }
            );

            // console.log(stateObject);
            this.#toggleActionText(stateObject);
        }
    });

    constructor() {
        super();
        this.rendered = false;

        /**
         * @this SlotComponent 
         * @param {PointerEvent} [e] 
         * @returns {void} 
         */
        this.#clickHandler = () => {
            // console.log('Slot toggled.');

            const selectedChipDTO = BetManager.getPendingBet();
            // console.log(selectedChipDTO);

            if (!selectedChipDTO) return;

            const lastPlacedChipNodeValue = this.#insertedChips.item(this.#insertedChips.length - 1)?.textContent ?? 0;
            const summedValue = Number(lastPlacedChipNodeValue) + Number(selectedChipDTO.value);

            const slotChip = this.#placeChipInSlot(
                { 
                    ...selectedChipDTO, 
                    computedValue: summedValue 
                }, 
                this.#insertedChips.length + 1 > 1
            );

            BetManager.placeBet({ chip: { ...selectedChipDTO, ref: slotChip } });

            if (this.#insertedChips.length === 1) {
                EventBus.publish('roulette:boardnotempty');
            }

            // EventBus.publish('roulette:chipplaced', this, selectedChipDTO);
        };
    }

    /**
     * Creates an instance of a chip element and adds it to the slot.
     * @param {{ id: string, value: string, computedValue: number }} data 
     * @param {boolean} stacked 
     * @returns 
     */
    #placeChipInSlot(data, stacked = false) {
        const elem = Roulette.createElement({ 
            name: 'roulette-slot-chip', 
            attributes: {
                dataset: {
                    id: String(data.id),
                    value: String(data.value),
                    computedValue: String(data.computedValue),
                },
                ...(stacked ? { stacked: '' } : {})
            },
            parent: this.#slotContainer
        });

        return elem;
    }

    /**
     * Creates and appends to the shadow DOM a notification 
     * with the recently placed chip's value.
     * @param {{ id?: string, value?: string | number, state?: "appended" | "removed" }} data 
     */
    #toggleActionText(data) {
        // console.log(data);
        const { value, state } = data;
        const notificationElem = Roulette.createElement({ name: 'roulette-action-text' });
        notificationElem?.initialize({ value, state });        
        this.#slotContainer.append(notificationElem);
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
        const spanElem = Roulette.createElement({
            name: 'span',
            attributes: {
                classList: 'slot-txt'
            },
            parent: this.#slotContainer
        });

        this.#onRenderCallback?.(spanElem);
        this.addEventListener('click', this.#clickHandler);
        this.#observer.observe(this.#slotContainer, { childList: true });

        this.classList.toggle('empty', this.#insertedChips.length === 0);
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
        this.removeEventListener('click', this.#clickHandler);
        this.#subscriptions.forEach(_=>_.unsubscribe());
        this.#observer.disconnect();
    }

}