import { RouletteCursor } from './chip-cursor/chip-cursor.js';

import EventBus from '../services/eventBus.js';

customElements.define('roulette-cursor', RouletteCursor);

// Roulette wheel numbers sequence
// Ranges 1-10 and 19-28 odd numbers are red, even numbers are black
// Ranges 11-18 and 29-36 odd numbers are black, even numbers are red 
// 0 32 15 19 4 21 2 25 17 34 6 27 13 36 11 30 8 23 10 5 24 16 33 1 20 14 31 9 22 18 29 7 28 12 35 3 26

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
            <!-- <link rel="stylesheet" href="/app/board/board.css" /> -->
            
            <style>
                @import '/assets/styles/reset.css';
                @import '/assets/styles/main.css';

                :host {
                    display: block;
                }
                
                #roulette-board-area {
                    position: relative;
                
                    max-inline-size: 700px;
                    min-block-size: 175px;
                
                    border: 2px solid #000;
                
                    margin-block: 5rem 3rem;
                    margin-inline: auto;
                }
            </style>
            
            <section id="roulette-board-area"></section>`.trim();
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

        this.#cursor.style.setProperty('top', `${e.offsetY + 15}px`);
        this.#cursor.style.setProperty('left', `${e.offsetX + 15}px`);
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