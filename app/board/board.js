import { RouletteCursor } from './chip-cursor/chip-cursor.js';
import EventBus from '../services/eventBus.js';

customElements.define('roulette-cursor', RouletteCursor);

// Ranges 1-10 and 19-28 odd numbers are red, even numbers are black;
// Ranges 11-18 and 29-36 odd numbers are black, even numbers are red;

export const numSequence =  new Set([ 
    0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 
    11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 
    22, 18, 29, 7, 28, 12, 35, 3, 26 
]);

export class RouletteBoard extends HTMLElement {

    #template = document.createElement('template');
    #shadowRoot = this.attachShadow({ mode: 'open' });
    #subscription;

    /**
     * @type HTMLElement
     */
    #rouletteBoardArea;

    #cursorMetaInfo = Object.preventExtensions({
        chipId: null,
        value: null,
        selected: false
    });

    get #cursor() {
        return this.#rouletteBoardArea.querySelector('roulette-cursor');
    }

    /**
     * Cleans up previous cursor element occurences and 
     * adds newly passed element to the board game area.
     * Validates if new value is an instance of RouletteCursor or null and throws
     * TypeError on every other occasion.
     */
    set #cursor(el) {
        this.#rouletteBoardArea.querySelectorAll('roulette-cursor')
            .forEach(cursor => cursor.remove());

        if (el != null) {
            this.#rouletteBoardArea.append(el);
        }
    }

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
            
            <section class="gameboard" id="roulette-board-area">
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
     * Manages pointer enter events inside roulette board component.
     * Attaches chip-id and chip-value attributes to cursor component if presented.
     * @param {PointerEvent} e 
     * @returns {void}
     */
    _cursorEnterHandler(e) {
        if (!this.#cursor) return;

        this.#cursor.setAttribute('chip-id', this.#cursorMetaInfo.chipId);
        this.#cursor.setAttribute('chip-value', this.#cursorMetaInfo.value);
    }

    /**
     * Manages pointer leave events inside roulette board component.
     * Detaches chip-id and chip-value attributes from cursor component if presented.
     * @param {PointerEvent} e 
     * @returns {void}
     */
    _cursorLeaveHandler(e) {
        if (!this.#cursor) return;

        this.#cursor.removeAttribute('style');
        this.#cursor.removeAttribute('chip-id');
        this.#cursor.removeAttribute('chip-value');
    }

    /**
     * Manages pointer move events inside roulette board component.
     * Detaches chip-id and chip-value attributes from cursor component if presented.
     * @param {PointerEvent} e 
     * @returns {void}
     */
    _cursorMoveHandler(e) {
        if (!this.#cursor) return;

        const cursorOffsetY = e.pageY - 130;
        const cursorOffsetX = e.pageX - 220;
        // console.log(cursorOffsetY, cursorOffsetX);

        this.#cursor.style.setProperty('top', `${cursorOffsetY}px`);
        this.#cursor.style.setProperty('left', `${cursorOffsetX}px`);
    }

    connectedCallback() {
        
        if (!this.rendered) {
            this.rendered = true;
            this.#render();
            // console.log('Roulette board component is rendered!');
            this.#shadowRoot.append(this.#template.content.cloneNode(true));

            this.#rouletteBoardArea = this.#shadowRoot.querySelector('#roulette-board-area');
            this.#rouletteBoardArea.addEventListener('pointerenter', this._cursorEnterHandler);
            this.#rouletteBoardArea.addEventListener('pointerleave', this._cursorLeaveHandler);
            this.#rouletteBoardArea.addEventListener('pointermove', this._cursorMoveHandler);

            this.#subscription = EventBus.subscribe(
                'roulette:chipselect', 
                (chipId, value, selected) => {
                    // console.log(chipId, value, selected);

                    // Toggle chip cursor logic
                    this.#cursorMetaInfo.chipId = chipId;
                    this.#cursorMetaInfo.value = value;
                    this.#cursorMetaInfo.selected = selected;
                    this.#cursor = selected ? document.createElement('roulette-cursor') : null;

                    //TODO: Toggle lock/unlock betting functionality
                }, 
                this
            );
        }
    }

    disconnectedCallback() {
        // console.log('Roulette board component is removed!');
        this.#rouletteBoardArea.removeEventListener('pointerenter', this._cursorEnterHandler);
        this.#rouletteBoardArea.removeEventListener('pointerleave', this._cursorLeaveHandler);
        this.#rouletteBoardArea.removeEventListener('pointermove', this._cursorMoveHandler);
        this.#subscription.unsubscribe();
    }

}