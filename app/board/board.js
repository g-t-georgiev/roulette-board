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

    #subscriptions = [];

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
    }

    #render() {

        // TODO: Think of an algorithm for laying out board fields
        
        this.#template.innerHTML = `
            <link rel="stylesheet" href="/app/board/board.css" />
            <link rel="stylesheet" href="/app/board/responsive.css" />
            
            <section class="gameboard" id="roulette-board-area" disabled>
                <!-- 1st row -->
                <roulette-slot class="bet inside-bet zero">
                    <span class="slot-txt">0</span>
                </roulette-slot>

                <roulette-slot class="bet inside-bet straight-up odd red">
                    <span class="slot-txt">3</span>
                </roulette-slot>

                <roulette-slot class="bet inside-bet straight-up even black">
                    <span class="slot-txt">6</span>
                </roulette-slot>

                <roulette-slot class="bet inside-bet straight-up odd red">
                    <span class="slot-txt">9</span>
                </roulette-slot>

                <roulette-slot class="bet inside-bet straight-up even red">
                    <span class="slot-txt">12</span>
                </roulette-slot>

                <roulette-slot class="bet inside-bet straight-up odd black">
                    <span class="slot-txt">15</span>
                </roulette-slot>

                <roulette-slot class="bet inside-bet straight-up even red">
                    <span class="slot-txt">18</span>
                </roulette-slot>

                <roulette-slot class="bet inside-bet straight-up odd red">
                    <span class="slot-txt">21</span>
                </roulette-slot>

                <roulette-slot class="bet inside-bet straight-up even black">
                    <span class="slot-txt">24</span>
                </roulette-slot>

                <roulette-slot class="bet inside-bet straight-up odd red">
                    <span class="slot-txt">27</span>
                </roulette-slot>

                <roulette-slot class="bet inside-bet straight-up even red">
                    <span class="slot-txt">30</span>
                </roulette-slot>

                <roulette-slot class="bet inside-bet straight-up odd black">
                    <span class="slot-txt">33</span>
                </roulette-slot>

                <roulette-slot class="bet inside-bet straight-up even red">
                    <span class="slot-txt">36</span>
                </roulette-slot>

                <roulette-slot class="bet outside-bet column">
                    <span class="slot-txt">2:1</span>
                </roulette-slot>

                <!-- 2nd row -->
                <roulette-slot class="bet inside-bet straight-up even black">
                    <span class="slot-txt">2</span>
                </roulette-slot>

                <roulette-slot class="bet inside-bet straight-up odd red">
                    <span class="slot-txt">5</span>
                </roulette-slot>

                <roulette-slot class="bet inside-bet straight-up even black">
                    <span class="slot-txt">8</span>
                </roulette-slot>

                <roulette-slot class="bet inside-bet straight-up odd black">
                    <span class="slot-txt">11</span>
                </roulette-slot>

                <roulette-slot class="bet inside-bet straight-up even red">
                    <span class="slot-txt">14</span>
                </roulette-slot>

                <roulette-slot class="bet inside-bet straight-up odd black">
                    <span class="slot-txt">17</span>
                </roulette-slot>

                <roulette-slot class="bet inside-bet straight-up even black">
                    <span class="slot-txt">20</span>
                </roulette-slot>

                <roulette-slot class="bet inside-bet straight-up odd red">
                    <span class="slot-txt">23</span>
                </roulette-slot>

                <roulette-slot class="bet inside-bet straight-up even black">
                    <span class="slot-txt">26</span>
                </roulette-slot>

                <roulette-slot class="bet inside-bet straight-up odd black">
                    <span class="slot-txt">29</span>
                </roulette-slot>

                <roulette-slot class="bet inside-bet straight-up even red">
                    <span class="slot-txt">32</span>
                </roulette-slot>

                <roulette-slot class="bet inside-bet straight-up odd black">
                    <span class="slot-txt">35</span>
                </roulette-slot>

                <roulette-slot class="bet outside-bet column">
                    <span class="slot-txt">2:1</span>
                </roulette-slot>

                <!-- 3rd row -->
                <roulette-slot class="bet inside-bet straight-up odd red">
                    <span class="slot-txt">1</span>
                </roulette-slot>

                <roulette-slot class="bet inside-bet straight-up even black">
                    <span class="slot-txt">4</span>
                </roulette-slot>

                <roulette-slot class="bet inside-bet straight-up odd red">
                    <span class="slot-txt">7</span>
                </roulette-slot>

                <roulette-slot class="bet inside-bet straight-up even black">
                    <span class="slot-txt">10</span>
                </roulette-slot>

                <roulette-slot class="bet inside-bet straight-up odd black">
                    <span class="slot-txt">13</span>
                </roulette-slot>

                <roulette-slot class="bet inside-bet straight-up even red">
                    <span class="slot-txt">16</span>
                </roulette-slot>

                <roulette-slot class="bet inside-bet straight-up odd red">
                    <span class="slot-txt">19</span>
                </roulette-slot>

                <roulette-slot class="bet inside-bet straight-up even black">
                    <span class="slot-txt">22</span>
                </roulette-slot>

                <roulette-slot class="bet inside-bet straight-up odd red">
                    <span class="slot-txt">25</span>
                </roulette-slot>

                <roulette-slot class="bet inside-bet straight-up even black">
                    <span class="slot-txt">28</span>
                </roulette-slot>

                <roulette-slot class="bet inside-bet straight-up odd black">
                    <span class="slot-txt">31</span>
                </roulette-slot>

                <roulette-slot class="bet inside-bet straight-up even red">
                    <span class="slot-txt">34</span>
                </roulette-slot>

                <roulette-slot class="bet outside-bet column">
                    <span class="slot-txt">2:1</span>
                </roulette-slot>

                <!-- 4th row -->
                <roulette-slot class="bet outside-bet dozen">
                    <span class="slot-txt">1st&nbsp;12</span>
                </roulette-slot>

                <roulette-slot class="bet outside-bet dozen">
                    <span class="slot-txt">2nd&nbsp;12</span>
                </roulette-slot>

                <roulette-slot class="bet outside-bet dozen">
                    <span class="slot-txt">3rd&nbsp;12</span>
                </roulette-slot>

                <!-- 5th row -->
                <roulette-slot class="bet outside-bet range">
                    <span class="slot-txt">1&nbsp;&ndash;&nbsp;18</span>
                </roulette-slot>

                <roulette-slot class="bet outside-bet even">
                    <span class="slot-txt">Even</span>
                </roulette-slot>

                <roulette-slot class="bet outside-bet red">
                    <span class="slot-txt">Red</span>
                </roulette-slot>

                <roulette-slot class="bet outside-bet black">
                    <span class="slot-txt">Black</span>
                </roulette-slot>

                <roulette-slot class="bet outside-bet odd">
                    <span class="slot-txt">Odd</span>
                </roulette-slot>

                <roulette-slot class="bet outside-bet range">
                    <span class="slot-txt">19&nbsp;&ndash;&nbsp;36</span>
                </roulette-slot>

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

            this.#subscriptions.push(
                EventBus.subscribe(
                    'roulette:chip', 
                    (chip) => {

                        // Toggle chip cursor
                        if (chip.selected) {
                            // Probably unnecessary preventative clean-up of all chip instances
                            // before creating and appending new ones to the DOM
                            // this.#gameboard.querySelectorAll('roulette-cursor').forEach(el => el.remove());

                            if (!this.#cursor) {
                                this.#cursor = document.createElement('roulette-cursor');
                                this.#gameboard?.append(this.#cursor);
                            }

                            this.#cursor.init(chip.id, chip.value);

                            // Notify BetManager about the currently selected chip
                            BetManager.setPendingBet({ id: chip.id, value: chip.value });
                        } else {
                            this.#cursor?.remove();
                            this.#cursor = null;

                            // Notify BetManager about the currently unselected chip
                            BetManager.setPendingBet(null);
                        }
                        
                        // Toggle gameboard interaction effects
                        this.#gameboard?.toggleAttribute('disabled', !chip.selected);
                    }, 
                    this
                ),
                EventBus.subscribe(
                    'roulette:bet', 
                    (slot, chip) => {
                        // console.log(slot, chip);
    
                        // Clear cursor
                        this.#cursor?.remove();
                        this.#cursor = null;
    
                        // Nullify previously selected chip
                        BetManager.setPendingBet(null);
    
                        // Toggle gameboard interaction effects
                        this.#gameboard?.toggleAttribute('disabled', true);
                    }
                ),
                EventBus.subscribe(
                    'roulette:clear',
                    () => {
                        // Toggle gameboard interaction effects
                        this.#gameboard?.toggleAttribute('disabled', true);
                    }
                )
            );

        }
    }

    disconnectedCallback() {
        // console.log('Roulette board component is removed!');
        this.#gameboard?.removeEventListener('pointerenter', this._cursorEnterHandler);
        this.#gameboard?.removeEventListener('pointerleave', this._cursorLeaveHandler);
        this.#gameboard?.removeEventListener('pointermove', this._cursorMoveHandler);
        this.#subscriptions.forEach(_ => _?.unsubscribe());
    }

}