import { RouletteCursor } from './chip-cursor/chip-cursor.js';
import { RouletteSlot } from './slot/slot.js';

import EventBus from '../services/event-bus.js';
import BetManager from '../services/bet-manager.js';

customElements.define('roulette-cursor', RouletteCursor);
customElements.define('roulette-slot', RouletteSlot);

// Ranges 1-10 and 19-28 odd numbers are red, even numbers are black;
// Ranges 11-18 and 29-36 odd numbers are black, even numbers are red;

// new Set([ 
//     0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 
//     11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 
//     22, 18, 29, 7, 28, 12, 35, 3, 26 
// ]);

export class RouletteBoard extends HTMLElement {

    #template = document.createElement('template');
    #shadowRoot = this.attachShadow({ mode: 'open' });

    #chipSelectSubscription;
    #betPlacedSubscription;
    #betsClearedSubscription;

    /**
     * @type HTMLElement | null
     */
    #gameboard = null;

    /**
     * @type RouletteCursor | null
     */
    #cursor = null;

    constructor() {
        super();
        this.rendered = false;
        this._cursorEnterHandler = this._cursorEnterHandler.bind(this);
        this._cursorLeaveHandler = this._cursorLeaveHandler.bind(this);
        this._cursorMoveHandler = this._cursorMoveHandler.bind(this);
        this._slotClickHandler = this._slotClickHandler.bind(this);
    }

    #render() {
        this.#template.innerHTML = `
            <link rel="stylesheet" href="/app/board/board.css" />
            
            <section class="gameboard" id="roulette-board-area" disabled>
                <!-- 1st row -->
                <roulette-slot class="bet inside-bet zero">0</roulette-slot>
                <roulette-slot class="bet inside-bet straight-up odd red">3</roulette-slot>
                <roulette-slot class="bet inside-bet straight-up even black">6</roulette-slot>
                <roulette-slot class="bet inside-bet straight-up odd red">9</roulette-slot>
                <roulette-slot class="bet inside-bet straight-up even red">12</roulette-slot>
                <roulette-slot class="bet inside-bet straight-up odd black">15</roulette-slot>
                <roulette-slot class="bet inside-bet straight-up even red">18</roulette-slot>
                <roulette-slot class="bet inside-bet straight-up odd red">21</roulette-slot>
                <roulette-slot class="bet inside-bet straight-up even black">24</roulette-slot>
                <roulette-slot class="bet inside-bet straight-up odd red">27</roulette-slot>
                <roulette-slot class="bet inside-bet straight-up even red">30</roulette-slot>
                <roulette-slot class="bet inside-bet straight-up odd black">33</roulette-slot>
                <roulette-slot class="bet inside-bet straight-up even red">36</roulette-slot>
                <roulette-slot class="bet outside-bet column">2:1</roulette-slot>
                <!-- 2nd row -->
                <roulette-slot class="bet inside-bet straight-up even black">2</roulette-slot>
                <roulette-slot class="bet inside-bet straight-up odd red">5</roulette-slot>
                <roulette-slot class="bet inside-bet straight-up even black">8</roulette-slot>
                <roulette-slot class="bet inside-bet straight-up odd black">11</roulette-slot>
                <roulette-slot class="bet inside-bet straight-up even red">14</roulette-slot>
                <roulette-slot class="bet inside-bet straight-up odd black">17</roulette-slot>
                <roulette-slot class="bet inside-bet straight-up even black">20</roulette-slot>
                <roulette-slot class="bet inside-bet straight-up odd red">23</roulette-slot>
                <roulette-slot class="bet inside-bet straight-up even black">26</roulette-slot>
                <roulette-slot class="bet inside-bet straight-up odd black">29</roulette-slot>
                <roulette-slot class="bet inside-bet straight-up even red">32</roulette-slot>
                <roulette-slot class="bet inside-bet straight-up odd black">35</roulette-slot>
                <roulette-slot class="bet outside-bet column">2:1</roulette-slot>
                <!-- 3rd row -->
                <roulette-slot class="bet inside-bet straight-up odd red">1</roulette-slot>
                <roulette-slot class="bet inside-bet straight-up even black">4</roulette-slot>
                <roulette-slot class="bet inside-bet straight-up odd red">7</roulette-slot>
                <roulette-slot class="bet inside-bet straight-up even black">10</roulette-slot>
                <roulette-slot class="bet inside-bet straight-up odd black">13</roulette-slot>
                <roulette-slot class="bet inside-bet straight-up even red">16</roulette-slot>
                <roulette-slot class="bet inside-bet straight-up odd red">19</roulette-slot>
                <roulette-slot class="bet inside-bet straight-up even black">22</roulette-slot>
                <roulette-slot class="bet inside-bet straight-up odd red">25</roulette-slot>
                <roulette-slot class="bet inside-bet straight-up even black">28</roulette-slot>
                <roulette-slot class="bet inside-bet straight-up odd black">31</roulette-slot>
                <roulette-slot class="bet inside-bet straight-up even red">34</roulette-slot>
                <roulette-slot class="bet outside-bet column">2:1</roulette-slot>
                <!-- 4th row -->
                <roulette-slot class="bet outside-bet dozen">1st&nbsp;12</roulette-slot>
                <roulette-slot class="bet outside-bet dozen">2nd&nbsp;12</roulette-slot>
                <roulette-slot class="bet outside-bet dozen">3rd&nbsp;12</roulette-slot>
                <!-- 5th row -->
                <roulette-slot class="bet outside-bet range">1&nbsp;&ndash;&nbsp;18</roulette-slot>
                <roulette-slot class="bet outside-bet even">Even</roulette-slot>
                <roulette-slot class="bet outside-bet red">Red</roulette-slot>
                <roulette-slot class="bet outside-bet black">Black</roulette-slot>
                <roulette-slot class="bet outside-bet odd">Odd</roulette-slot>
                <roulette-slot class="bet outside-bet range">19&nbsp;&ndash;&nbsp;36</roulette-slot>
            </section>`.trim();
    }

    /**
     * Manages pointer enter events inside gameboard component. 
     * Toggle the styles for displaying of the chip icon upon entering 
     * of mouse cursor inside the boundaries of the gameboard component.
     */
    _cursorEnterHandler() {
        if (!this.#cursor) return;

        this.#cursor.show();
    }

    /**
     * Manages pointer leave events inside gameboard component. 
     * Toggle the styles for hiding chip icon upon leaving of mouse
     * cursor beyond the boundaries of the gameboard component.
     */
    _cursorLeaveHandler() {
        if (!this.#cursor) return;

        this.#cursor.hide();
    }

    /**
     * Manages pointer move events inside gameboard component. 
     * Toggle the styles necessary for mouse tracking of the chip icon.
     * @param {PointerEvent} e 
     */
    _cursorMoveHandler(e) {
        if (!this.#cursor || !this.#gameboard) return;

        const y = (e.clientY - this.#gameboard?.offsetTop) * 100 / this.#gameboard?.offsetHeight;
        const x = (e.clientX - this.#gameboard?.offsetLeft) * 100 / this.#gameboard?.offsetWidth;
        // console.log(x, y);
        this.#cursor.move(x, y);
    }

    /**
     * Manages outcome on click events occurred at a slot.
     * Prevents default behavior if no chip is selected (gameboard is disabled).
     * @param {CustomEvent<{ target: HTMLElement }>} e 
     */
    _slotClickHandler(e) {
        // console.log(e.detail.target);

        if (this.#gameboard.hasAttribute('disabled')) {
            e.preventDefault();
        }
    }

    connectedCallback() {
        
        if (!this.rendered) {
            this.rendered = true;
            this.#render();
            // console.log('Roulette board component is rendered!');
            this.#shadowRoot.append(this.#template.content.cloneNode(true));

            this.#gameboard = this.#shadowRoot.querySelector('#roulette-board-area');
            this.#gameboard?.addEventListener('pointerenter', this._cursorEnterHandler);
            this.#gameboard?.addEventListener('pointerleave', this._cursorLeaveHandler);
            this.#gameboard?.addEventListener('pointermove', this._cursorMoveHandler);
            this.#gameboard?.addEventListener('roulette:slotclick', this._slotClickHandler);

            this.#chipSelectSubscription = EventBus.subscribe(
                'roulette:chipselect', 
                (chipId, value, selected) => {

                    // Toggle chip cursor
                    if (selected) {
                        // Probably unnecessary preventative clean-up of all chip instances
                        // before creating and appending new ones to the DOM
                        // this.#gameboard.querySelectorAll('roulette-cursor').forEach(el => el.remove());

                        if (!this.#cursor) {
                            this.#cursor = document.createElement('roulette-cursor');
                            this.#gameboard?.append(this.#cursor);
                        }

                        this.#cursor.init(chipId, value);

                        // Notify BetManager about the currently selected chip
                        BetManager.updatePendingBet({ id: chipId, value });
                    } else {
                        this.#cursor?.remove();
                        this.#cursor = null;

                        // Notify BetManager about the currently selected chip
                        BetManager.updatePendingBet(null);
                    }
                    
                    // Toggle gameboard interaction effects
                    this.#gameboard?.toggleAttribute('disabled', !selected);
                }, 
                this
            );

            this.#betPlacedSubscription = EventBus.subscribe(
                'roulette:betplaced', 
                (slot, chip) => {
                    // console.log(slot, chip);

                    // Clear cursor
                    this.#cursor?.remove();
                    this.#cursor = null;

                    // Nullify previously selected chip
                    BetManager.updatePendingBet(null);

                    // Toggle gameboard interaction effects
                    this.#gameboard?.toggleAttribute('disabled', true);
                }
            );

            this.#betsClearedSubscription = EventBus.subscribe(
                'roulette:betscleared',
                () => {
                    // Toggle gameboard interaction effects
                    this.#gameboard?.toggleAttribute('disabled', true);
                }
            );

        }
    }

    disconnectedCallback() {
        // console.log('Roulette board component is removed!');
        this.#gameboard?.removeEventListener('pointerenter', this._cursorEnterHandler);
        this.#gameboard?.removeEventListener('pointerleave', this._cursorLeaveHandler);
        this.#gameboard?.removeEventListener('pointermove', this._cursorMoveHandler);
        this.#gameboard?.removeEventListener('roulette:slotclick', this._slotClickHandler);
        this.#chipSelectSubscription?.unsubscribe();
        this.#betPlacedSubscription?.unsubscribe();
        this.#betsClearedSubscription?.unsubscribe();
    }

}