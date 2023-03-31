import { Component } from '../core/interfaces/index.js';
import createTemplate from './user-controls.template.js';
import { EventBus } from '../core/services/index.js';

import { UndoButtonComponent } from './undo-button/undo-button.component.js';
import { ClearButtonComponent } from './clear-button/clear-button.component.js';
import { DoubleButtonComponent } from './double-button/double-button.component.js';
import { ChipComponent } from './chip/chip.component.js';

customElements.define('roulette-undo-button', UndoButtonComponent, { extends: 'button' });
customElements.define('roulette-clear-button', ClearButtonComponent, { extends: 'button' });
customElements.define('roulette-double-button', DoubleButtonComponent, { extends: 'button' });

customElements.define('roulette-chip', ChipComponent);

const chips = [
    {
        id: 1,
        value: 1,
        selected: false,
    },
    {
        id: 2,
        value: 2,
        selected: true,
    },
    {
        id: 3,
        value: 5,
        selected: false,
    },
];

export class UserControlsComponent extends Component {

    #subscriptions = [];

    #template = document.createElement('template');
    #shadowRoot = this.attachShadow({ mode: 'open' });
    
    constructor() {
        super();
        this.rendered = false;
        this._chipSelectHandler = this._chipSelectHandler.bind(this);
    }

    #render() {
        this.#template.innerHTML = createTemplate({ chips }).trim();
        this.addEventListener('roulette:chip', this._chipSelectHandler);
        this.#shadowRoot.append(this.#template.content.cloneNode(true));
    }

    /**
     * Manage custom events about selected chip.
     * @param {CustomEvent<{ id: string, value: string, selected: boolean }>} e 
     */
    _chipSelectHandler(e) {
        // console.log(e.detail);

        const chips = this.#shadowRoot.querySelectorAll('roulette-chip[selected]');
        // console.log(chips);

        /**
         * Callback looping over chip instances with selected attribute.
         * Calls #toggleSelectState method if a possible previously selected chip instance
         * is not the trigger of the current event.
         * @param {RouletteChip} chip 
         */
        const cb = chip => {
            const isEvntTarget = chip.dataset.id === e.detail.id;
            const isSelected = isEvntTarget && e.detail.selected;
            chip.toggleSelectedState?.(isSelected);
        };

        chips.forEach(cb);
    }

    connectedCallback() {

        if (!this.rendered) {
            this.rendered = true;
            this.#render();

            this.#subscriptions.push(
                // EventBus.subscribe(
                //     'roulette:bet', 
                //     (slot, selectedChipDTO) => {
                //         // console.log(slot, selectedChipDTO);

                //         this.#shadowRoot.querySelectorAll('roulette-chip').forEach(
                //             chip => {
                //                 const isTarget = selectedChipDTO.id === chip.dataset.id;

                //                 if (isTarget) {
                //                     chip.toggleSelectedState();
                //                 }
                //             }
                //         );
                //     }
                // ),
                EventBus.subscribe(
                    'roulette:clear', 
                    () => {
                        this.#shadowRoot.querySelectorAll('.btn').forEach(
                            btn => {
                                btn.toggleDisabledState(true);
                            }
                        );
                    }, 
                    this
                ),
                EventBus.subscribe(
                    'roulette:notempty',
                    () => {
                        this.#shadowRoot.querySelectorAll('.btn').forEach(
                            btn => {
                                btn.toggleDisabledState(false);
                            }
                        );
                    },
                    this
                )
            );
        }
    }

    disconnectedCallback() {
        this.removeEventListener('roulette:chip', this._chipSelectHandler);
        this.#subscriptions.forEach(_=>_?.unsubscribe());
    }

}