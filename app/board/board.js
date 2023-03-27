import { RouletteCursor } from './chip-cursor/chip-cursor.js';
import EventBus from '../services/eventBus.js';

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
                <article class="bet inside-bet zero">0</article>
                <article class="bet inside-bet straight-up odd red">3</article>
                <article class="bet inside-bet straight-up even black">6</article>
                <article class="bet inside-bet straight-up odd red">9</article>
                <article class="bet inside-bet straight-up even red">12</article>
                <article class="bet inside-bet straight-up odd black">15</article>
                <article class="bet inside-bet straight-up even red">18</article>
                <article class="bet inside-bet straight-up odd red">21</article>
                <article class="bet inside-bet straight-up even black">24</article>
                <article class="bet inside-bet straight-up odd red">27</article>
                <article class="bet inside-bet straight-up even red">30</article>
                <article class="bet inside-bet straight-up odd black">33</article>
                <article class="bet inside-bet straight-up even red">36</article>
                <article class="bet outside-bet column">2:1</article>
                <article class="bet inside-bet straight-up even black">2</article>
                <article class="bet inside-bet straight-up odd red">5</article>
                <article class="bet inside-bet straight-up even black">8</article>
                <article class="bet inside-bet straight-up odd black">11</article>
                <article class="bet inside-bet straight-up even red">14</article>
                <article class="bet inside-bet straight-up odd black">17</article>
                <article class="bet inside-bet straight-up even black">20</article>
                <article class="bet inside-bet straight-up odd red">23</article>
                <article class="bet inside-bet straight-up even black">26</article>
                <article class="bet inside-bet straight-up odd black">29</article>
                <article class="bet inside-bet straight-up even red">32</article>
                <article class="bet inside-bet straight-up odd black">35</article>
                <article class="bet outside-bet column">2:1</article>
                <article class="bet inside-bet straight-up odd red">1</article>
                <article class="bet inside-bet straight-up even black">4</article>
                <article class="bet inside-bet straight-up odd red">7</article>
                <article class="bet inside-bet straight-up even black">10</article>
                <article class="bet inside-bet straight-up odd black">13</article>
                <article class="bet inside-bet straight-up even red">16</article>
                <article class="bet inside-bet straight-up odd red">19</article>
                <article class="bet inside-bet straight-up even black">22</article>
                <article class="bet inside-bet straight-up odd red">25</article>
                <article class="bet inside-bet straight-up even black">28</article>
                <article class="bet inside-bet straight-up odd black">31</article>
                <article class="bet inside-bet straight-up even red">34</article>
                <article class="bet outside-bet column">2:1</article>
                <article class="bet outside-bet dozen">1st&nbsp;12</article>
                <article class="bet outside-bet dozen">2nd&nbsp;12</article>
                <article class="bet outside-bet dozen">3rd&nbsp;12</article>
                <article class="bet outside-bet range">1&nbsp;&ndash;&nbsp;18</article>
                <article class="bet outside-bet even">Even</article>
                <article class="bet outside-bet red">Red</article>
                <article class="bet outside-bet black">Black</article>
                <article class="bet outside-bet odd">Odd</article>
                <article class="bet outside-bet range">19&nbsp;&ndash;&nbsp;36</article>
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