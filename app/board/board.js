import { RouletteCursor } from './chip-cursor/chip-cursor.js';
import EventBus from '../services/event-bus.js';

customElements.define('roulette-cursor', RouletteCursor);

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
    #subscription;

    /**
     * @type HTMLElement
     */
    #gameboard;

    /**
     * @type RouletteCursor
     */
    #cursor;

    constructor() {
        super();
        this.rendered = false;
        this._cursorEnterHandler = this._cursorEnterHandler.bind(this);
        this._cursorLeaveHandler = this._cursorLeaveHandler.bind(this);
        this._cursorMoveHandler = this._cursorMoveHandler.bind(this);
    }

    #render() {
        this.#template.innerHTML = `
            <link rel="stylesheet" href="/app/board/board.css" />
            
            <section class="gameboard" id="roulette-board-area" disabled>
                <!-- 1st row -->
                <div class="bet inside-bet zero">0</div>
                <div class="bet inside-bet straight-up odd red">3</div>
                <div class="bet inside-bet straight-up even black">6</div>
                <div class="bet inside-bet straight-up odd red">9</div>
                <div class="bet inside-bet straight-up even red">12</div>
                <div class="bet inside-bet straight-up odd black">15</div>
                <div class="bet inside-bet straight-up even red">18</div>
                <div class="bet inside-bet straight-up odd red">21</div>
                <div class="bet inside-bet straight-up even black">24</div>
                <div class="bet inside-bet straight-up odd red">27</div>
                <div class="bet inside-bet straight-up even red">30</div>
                <div class="bet inside-bet straight-up odd black">33</div>
                <div class="bet inside-bet straight-up even red">36</div>
                <div class="bet outside-bet column">2:1</div>
                <!-- 2nd row -->
                <div class="bet inside-bet straight-up even black">2</div>
                <div class="bet inside-bet straight-up odd red">5</div>
                <div class="bet inside-bet straight-up even black">8</div>
                <div class="bet inside-bet straight-up odd black">11</div>
                <div class="bet inside-bet straight-up even red">14</div>
                <div class="bet inside-bet straight-up odd black">17</div>
                <div class="bet inside-bet straight-up even black">20</div>
                <div class="bet inside-bet straight-up odd red">23</div>
                <div class="bet inside-bet straight-up even black">26</div>
                <div class="bet inside-bet straight-up odd black">29</div>
                <div class="bet inside-bet straight-up even red">32</div>
                <div class="bet inside-bet straight-up odd black">35</div>
                <div class="bet outside-bet column">2:1</div>
                <!-- 3rd row -->
                <div class="bet inside-bet straight-up odd red">1</div>
                <div class="bet inside-bet straight-up even black">4</div>
                <div class="bet inside-bet straight-up odd red">7</div>
                <div class="bet inside-bet straight-up even black">10</div>
                <div class="bet inside-bet straight-up odd black">13</div>
                <div class="bet inside-bet straight-up even red">16</div>
                <div class="bet inside-bet straight-up odd red">19</div>
                <div class="bet inside-bet straight-up even black">22</div>
                <div class="bet inside-bet straight-up odd red">25</div>
                <div class="bet inside-bet straight-up even black">28</div>
                <div class="bet inside-bet straight-up odd black">31</div>
                <div class="bet inside-bet straight-up even red">34</div>
                <div class="bet outside-bet column">2:1</div>
                <!-- 4th row -->
                <div class="bet outside-bet dozen">1st&nbsp;12</div>
                <div class="bet outside-bet dozen">2nd&nbsp;12</div>
                <div class="bet outside-bet dozen">3rd&nbsp;12</div>
                <!-- 5th row -->
                <div class="bet outside-bet range">1&nbsp;&ndash;&nbsp;18</div>
                <div class="bet outside-bet even">Even</div>
                <div class="bet outside-bet red">Red</div>
                <div class="bet outside-bet black">Black</div>
                <div class="bet outside-bet odd">Odd</div>
                <div class="bet outside-bet range">19&nbsp;&ndash;&nbsp;36</div>
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
        if (!this.#cursor) return;

        const y = (e.clientY - this.#gameboard.offsetTop) * 100 / this.#gameboard.offsetHeight;
        const x = (e.clientX - this.#gameboard.offsetLeft) * 100 / this.#gameboard.offsetWidth;
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
            this.#gameboard.addEventListener('pointerenter', this._cursorEnterHandler);
            this.#gameboard.addEventListener('pointerleave', this._cursorLeaveHandler);
            this.#gameboard.addEventListener('pointermove', this._cursorMoveHandler);

            this.#subscription = EventBus.subscribe(
                'roulette:chipselect', 
                (chipId, value, selected) => {

                    // Toggle chip cursor
                    if (selected) {
                        // Probably unnecessary preventative clean-up of all chip instances
                        // before creating and appending new ones to the DOM
                        // this.#gameboard.querySelectorAll('roulette-cursor').forEach(el => el.remove());

                        if (!this.#cursor) {
                            this.#cursor = document.createElement('roulette-cursor');
                            this.#gameboard.append(this.#cursor);
                        }

                        this.#cursor.init(chipId, value);                        
                    } else {
                        this.#cursor?.remove();
                        this.#cursor = null;
                    }
                    
                    // Toggle gameboard interaction effects
                    this.#gameboard.toggleAttribute('disabled', !selected);
                }, 
                this
            );
        }
    }

    disconnectedCallback() {
        // console.log('Roulette board component is removed!');
        this.#gameboard.removeEventListener('pointerenter', this._cursorEnterHandler);
        this.#gameboard.removeEventListener('pointerleave', this._cursorLeaveHandler);
        this.#gameboard.removeEventListener('pointermove', this._cursorMoveHandler);
        this.#subscription.unsubscribe();
    }

}