import { Component } from '../core/interfaces/index.js';
import { EventBus, BetManager } from '../core/services/index.js';

import createTemplate from './board.template.js';

import { CursorComponent } from './cursor/cursor.component.js';
import { SlotComponent } from './slot/slot.component.js';

import { sequence, resolveSlotData } from './board.data.js';

customElements.define('roulette-cursor', CursorComponent);
customElements.define('roulette-slot', SlotComponent);


export class BoardComponent extends Component {

    #template = document.createElement('template');
    #shadowRoot = this.attachShadow({ mode: 'open' });

    #subscriptions = [];

    /**
     * @type HTMLElement | null
     */
    #gameboard = null;

    /**
     * @type CursorComponent | null
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
        const slotsData = sequence.map(num => resolveSlotData(num).next().value);
        // console.log(slotsData);

        this.#template.innerHTML = createTemplate({ slots: slotsData }).trim();
        this.#shadowRoot.append(this.#template.content.cloneNode(true));

        this.#gameboard = this.#shadowRoot.querySelector('#roulette-board-area');
        this.#gameboard?.addEventListener('pointerenter', this._cursorEnterHandler);
        this.#gameboard?.addEventListener('pointerleave', this._cursorLeaveHandler);
        this.#gameboard?.addEventListener('pointermove', this._cursorMoveHandler);
    }

    /**
     * Manages pointer enter events inside gameboard component. 
     * Toggle the styles for displaying of the chip icon upon entering 
     * of mouse cursor inside the boundaries of the gameboard component.
     */
    _cursorEnterHandler() {
        if (!this.#cursor) return;

        this.#cursor.toggle(true);
    }

    /**
     * Manages pointer leave events inside gameboard component. 
     * Toggle the styles for hiding chip icon upon leaving of mouse
     * cursor beyond the boundaries of the gameboard component.
     */
    _cursorLeaveHandler() {
        if (!this.#cursor) return;

        this.#cursor.toggle(false);
    }

    /**
     * Manages pointer move events inside gameboard component. 
     * Toggle the styles necessary for mouse tracking of the chip icon.
     * @param {MouseEvent} e 
     */
    _cursorMoveHandler(e) {
        if (!this.#cursor || !this.#gameboard) return;

        let y = (e.clientY - this.#gameboard?.offsetTop) * 100 / this.#gameboard?.offsetHeight;
        let x = (e.clientX - this.#gameboard?.offsetLeft) * 100 / this.#gameboard?.offsetWidth;

        // console.log(x, y);
        this.#cursor.move(x, y);
    }

    connectedCallback() {
        
        if (!this.rendered) {
            this.rendered = true;
            this.#render();

            this.#subscriptions.push(
                EventBus.subscribe(
                    'roulette:chip', 
                    (chip) => {

                        // Toggle chip cursor
                        if (chip.selected) {

                            if (!this.#cursor) {
                                this.#cursor = document.createElement('roulette-cursor');
                                this.#gameboard?.append(this.#cursor);
                            }

                            this.#cursor.set(chip.id, chip.value);

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
                // EventBus.subscribe(
                //     'roulette:bet', 
                //     (slot, chip) => {
                //         // console.log(slot, chip);

                //         this.#cursor?.remove();
                //         this.#cursor = null;
    
                //         BetManager.setPendingBet(null);
                    
                //         this.#gameboard?.toggleAttribute('disabled', true);
                //     }
                // ),
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