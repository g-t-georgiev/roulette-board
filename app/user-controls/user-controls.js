import { RouletteUndoButton } from './undo-button/undo-button.js';
import { RouletteClearButton } from './clear-button/clear-button.js';
import { RouletteDoubleButton } from './double-button/double-button.js';
import { RouletteChip } from './chip/chip.js';

import EventBus from '../services/event-bus.js';

customElements.define('roulette-undo-button', RouletteUndoButton, { extends: 'button' });
customElements.define('roulette-clear-button', RouletteClearButton, { extends: 'button' });
customElements.define('roulette-double-button', RouletteDoubleButton, { extends: 'button' });

customElements.define('roulette-chip', RouletteChip);

export class RouletteUserControls extends HTMLElement {

    #subscriptions = [];

    #template = document.createElement('template');
    #shadowRoot = this.attachShadow({ mode: 'open' });
    
    constructor() {
        super();
        this.rendered = false;
        this._chipSelectHandler = this._chipSelectHandler.bind(this);
    }

    #render() {
        this.#template.innerHTML = `
            <link rel="stylesheet" href="/app/user-controls/user-controls.css" />
            <link rel="stylesheet" href="/app/user-controls/responsive.css" />

            <section class="user-controls">
                <button type="button" role="button" class="btn btn-undo" disabled is="roulette-undo-button">
                    <img class="btn-icon" src="/assets/images/btn-undo.png" width="55" height="55" alt="btn-undo" />
                </button>

                <button type="button" role="button" class="btn btn-clear" disabled is="roulette-clear-button">
                    <img class="btn-icon" src="/assets/images/btn-clear.png" width="55" height="55" alt="btn-clear" />
                </button>

                <button type="button" role="button" class="btn btn-double" disabled is="roulette-double-button">
                    <img class="btn-icon" src="/assets/images/btn-x2.png" width="55" height="55" alt="btn-double" />
                </button>

                <section class="chips">

                    <!-- 
                        Selected attribute can be hard-coded and still works. 
                        If more than one chip is hard-coded with selected attribute, 
                        the last one in the HTML definition, takes precedence over the others.
                    -->
                    <!-- <roulette-chip selected chip-id="1" value="1"></roulette-chip> -->

                    <roulette-chip chip-id="1" value="1"></roulette-chip>

                    <roulette-chip chip-id="2" value="2"></roulette-chip>

                    <roulette-chip chip-id="3" value="5"></roulette-chip>

                </section>

            </section>`.trim();
    }

    /**
     * Manage custom events about selected chip.
     * @param {CustomEvent<{ id: string, value: string, selected: boolean }>} e 
     */
    _chipSelectHandler(e) {
        // console.log(e);

        const chips = this.shadowRoot.querySelectorAll('roulette-chip');
        // console.log(chips);

        /**
         * Callback looping over chip instances with selected attribute.
         * Calls #toggleSelectState method if a possible previously selected chip instance
         * is not the trigger of the current event.
         * @param {RouletteChip} chip 
         */
        const cb = chip => {
            const isEvntTarget = chip.getAttribute('chip-id') === e.detail.id;
            const isSelected = isEvntTarget && e.detail.selected;
            chip.toggleSelectedState(isSelected);
        };

        chips.forEach(cb);
    }

    connectedCallback() {

        if (!this.rendered) {
            this.rendered = true;
            this.#render();
            // console.log('User controls component rendered.');
            this.#shadowRoot.append(this.#template.content.cloneNode(true));
            this.addEventListener('roulette:chip', this._chipSelectHandler);

            this.#subscriptions.push(
                // EventBus.subscribe(
                //     'roulette:bet', 
                //     (slot, selectedChipDTO) => {
                //         // console.log(slot, selectedChipDTO);

                //         // toggle selected state for the chip
                //         // the bet was initiated with

                //         this.#shadowRoot.querySelectorAll('roulette-chip').forEach(
                //             chip => {
                //                 const currChipId = chip.getAttribute('chip-id');
                //                 const isTarget = selectedChipDTO.id === currChipId;

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
        // console.log('User controls component removed.');
        this.removeEventListener('roulette:chip', this._chipSelectHandler);
        this.#subscriptions.forEach(_=>_?.unsubscribe());
    }

}