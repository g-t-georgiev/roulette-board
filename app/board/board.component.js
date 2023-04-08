import { Component } from '../core/interfaces/index.js';
import { EventBus, BetManager } from '../core/services/index.js';

import { CursorComponent } from './cursor/cursor.component.js';
import { SlotComponent } from './slot/slot.component.js';

import { getData } from './board.data.js';

customElements.define('roulette-cursor', CursorComponent);
customElements.define('roulette-slot', SlotComponent);


export class BoardComponent extends Component {

    #shadowRoot = this.attachShadow({ mode: 'open' });
    #subscriptions = [];

    /**
     * @type HTMLElement
     */
    #gameboard = document.createElement('section');

    /**
     * @type CursorComponent
     */
    #cursor = document.createElement('roulette-cursor');

    constructor() {
        super();
        this.rendered = false;

        this.#gameboard.classList.add('gameboard');
        this.#gameboard.id = 'roulette-board-area';

        this.__cursorEnterHandler = this.#cursorEnterHandler.bind(this);
        this.__cursorLeaveHandler = this.#cursorLeaveHandler.bind(this);
        this.__cursorMoveHandler = this.#cursorMoveHandler.bind(this);
    }

    #render() {
        const stylesheetLinks = [];

        const stylesheetElem = document.createElement('link');
        stylesheetElem.setAttribute('rel', 'stylesheet');
        stylesheetElem.setAttribute('href', '/app/board/board.component.css');

        const responsiveStylesheetElem = document.createElement('link');
        responsiveStylesheetElem.setAttribute('rel', 'stylesheet');
        responsiveStylesheetElem.setAttribute('href', '/app/board/responsive.part.css');

        stylesheetLinks.push(stylesheetElem, responsiveStylesheetElem);

        const slotElemList = getData().map(value => {
            // console.log(value);

            const slotElem = document.createElement('roulette-slot');
            slotElem.classList.add('bet', ...value.classList);
            slotElem.setTextContent(value.textContent);

            return slotElem;
        });

        // console.log(slotElemList);

        this.#gameboard.append(...slotElemList);
        
        this.#gameboard.addEventListener('pointerenter', this.__cursorEnterHandler);
        this.#gameboard.addEventListener('pointerleave', this.__cursorLeaveHandler);
        this.#gameboard.addEventListener('pointermove', this.__cursorMoveHandler);

        this.#shadowRoot.append(...stylesheetLinks, this.#gameboard);
    }

    /**
     * Manages pointer enter events inside gameboard component. 
     * Toggle the styles for displaying of the chip icon upon entering 
     * of mouse cursor inside the boundaries of the gameboard component.
     */
    #cursorEnterHandler() {
        if (!this.#cursor.isConnected) return;

        this.#cursor.toggle(true);
    }

    /**
     * Manages pointer leave events inside gameboard component. 
     * Toggle the styles for hiding chip icon upon leaving of mouse
     * cursor beyond the boundaries of the gameboard component.
     */
    #cursorLeaveHandler() {
        if (!this.#cursor.isConnected) return;

        this.#cursor.toggle(false);
    }

    /**
     * Manages pointer move events inside gameboard component. 
     * Toggle the styles necessary for mouse tracking of the chip icon.
     * @param {MouseEvent} e 
     */
    #cursorMoveHandler(e) {
        if (
            !this.#cursor || 
            !this.#gameboard || 
            !this.#cursor.isConnected || 
            !this.#gameboard.isConnected
        ) return;

        let y = (e.clientY - this.#gameboard.offsetTop) * 100 / this.#gameboard.offsetHeight;
        let x = (e.clientX - this.#gameboard.offsetLeft) * 100 / this.#gameboard.offsetWidth;

        // console.log(x, y);
        this.#cursor.move(x, y);
    }

    connectedCallback() {
        
        if (!this.rendered) {
            this.rendered = true;
            this.#render();

            this.#subscriptions.push(
                EventBus.subscribe(
                    'roulette:chipselected', 
                    (chip) => {

                        // Toggle chip cursor
                        if (chip.selected) {

                            if (!this.#cursor.isConnected) {
                                this.#gameboard.append(this.#cursor);
                            }

                            this.#cursor.set(chip.id, chip.value);

                            // Notify BetManager about the currently selected chip
                            BetManager.setPendingBet({ id: chip.id, value: chip.value });
                        } else {
                            this.#cursor.remove();

                            // Notify BetManager about the currently unselected chip
                            BetManager.setPendingBet(null);
                        }
                        
                        // Toggle gameboard interaction effects
                        this.#gameboard.toggleAttribute('disabled', !chip.selected);
                    }, 
                    this
                )
            );

        }
    }

    disconnectedCallback() {
        this.#gameboard.removeEventListener('pointerenter', this.__cursorEnterHandler);
        this.#gameboard.removeEventListener('pointerleave', this.__cursorLeaveHandler);
        this.#gameboard.removeEventListener('pointermove', this.__cursorMoveHandler);
        this.#subscriptions.forEach(_ => _?.unsubscribe());
    }

}