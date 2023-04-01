import { Component } from '../core/interfaces/index.js';
import { EventBus } from '../core/services/index.js';

import { UndoButtonComponent } from './undo-button/undo-button.component.js';
import { ClearButtonComponent } from './clear-button/clear-button.component.js';
import { DoubleButtonComponent } from './double-button/double-button.component.js';
import { ChipComponent } from './chip/chip.component.js';

import * as data from './user-controls.data.js';

customElements.define('roulette-undo-button', UndoButtonComponent, { extends: 'button' });
customElements.define('roulette-clear-button', ClearButtonComponent, { extends: 'button' });
customElements.define('roulette-double-button', DoubleButtonComponent, { extends: 'button' });

customElements.define('roulette-chip', ChipComponent);


export class UserControlsComponent extends Component {

    #subscriptions = [];
    #shadowRoot = this.attachShadow({ mode: 'open' });
    
    constructor() {
        super();
        this.rendered = false;
        this._chipSelectHandler = this._chipSelectHandler.bind(this);
    }

    #render() {
        const stylesheets = [];

        const stylesheetElem = document.createElement('link');
        stylesheetElem.setAttribute('rel', 'stylesheet');
        stylesheetElem.setAttribute('href', '/app/user-controls/user-controls.component.css');

        stylesheets.push(stylesheetElem);

        const userControlsSectionElem = document.createElement('section');
        userControlsSectionElem.classList.add('user-controls');

        const buttonElemList = data.buttons.map(data => {
            const btnElem = document.createElement('button', { is: data.is });
            btnElem.type = 'button';
            btnElem.role = 'button';
            btnElem.disabled = true;
            btnElem.classList.add('btn', ...data.classList);
            btnElem.title = data.title;

            const iconElem = document.createElement('img');
            iconElem.src = `/assets/images/${data.imageUrl}`;
            iconElem.width = 55;
            iconElem.height = 55;
            iconElem.alt = data.alt;
            iconElem.classList.add('btn-icon');

            btnElem.append(iconElem);
            return btnElem;
        });

        const chipElemList = data.chips.map(data => {
            const elem = document.createElement('roulette-chip');
            elem.selected = data.selected;
            elem.dataset.id = data.id;
            elem.dataset.value = data.value;
            return elem;
        });

        userControlsSectionElem.append(...buttonElemList, ...chipElemList);

        this.addEventListener('roulette:chip', this._chipSelectHandler);
        this.#shadowRoot.append(...stylesheets, userControlsSectionElem);
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
            chip.selected = isSelected;
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