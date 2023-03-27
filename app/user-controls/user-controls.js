import { RouletteUndoButton } from './undo-button/undo-button.js';
import { RouletteClearButton } from './clear-button/clear-button.js';
import { RouletteDoubleButton } from './double-button/double-button.js';
import { RouletteChip } from './chip/chip.js';

customElements.define('roulette-undo-button', RouletteUndoButton, { extends: 'button' });
customElements.define('roulette-clear-button', RouletteClearButton, { extends: 'button' });
customElements.define('roulette-double-button', RouletteDoubleButton, { extends: 'button' });

customElements.define('roulette-chip', RouletteChip);

export class RouletteUserControls extends HTMLElement {

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
     * @param {CustomEvent<{ chipId: string, value: string, selected: boolean }>} e 
     */
    _chipSelectHandler(e) {
        const { chipId: selectedId, selected } = e.detail;
        console.log(selectedId, selected);

        const selectedChips = this.shadowRoot.querySelectorAll('roulette-chip[selected]');
        selectedChips.forEach(console.log);
    }

    connectedCallback() {

        if (!this.rendered) {
            this.rendered = true;
            this.#render();
            // console.log('User controls component rendered.');
            this.#shadowRoot.append(this.#template.content.cloneNode(true));
            // this.addEventListener('roulette:chipselect', this._chipSelectHandler);
        }
    }

    disconnectedCallback() {
        // console.log('User controls component removed.');
        // this.removeEventListener('roulette:chipselect', this._chipSelectHandler);
    }

}