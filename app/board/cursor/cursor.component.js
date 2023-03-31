import { Component } from "../../core/interfaces/index.js";

import createTemplate from './cursor.template.js';

export class CursorComponent extends Component {

    #template = document.createElement('template');
    #shadowRoot = this.attachShadow({ mode: 'open' });

    constructor() {
        super();
        this.rendered = false;
    }

    #render() {
        this.#template.innerHTML = createTemplate().trim();
        this.#shadowRoot.append(this.#template.content.cloneNode(true));
        this.toggle(false);
    }

    /**
     * Toggle cursor visibility.
     * @param {boolean} v 
     */
    toggle(v) {
        this.toggleAttribute('hidden', !v);
    }

    /**
     * @param {string} id Selected chip id.
     * @param {string} value Selected chip value.
     */
    set(id, value) {
        this.dataset.id = id;
        this.dataset.value = value;
    }

    /**
     * @param {number} x Cursor x-offset value.
     * @param {number} y Cursor y-offset value.
     */
    move(x, y) {
        // Added additional spacing of 2-3%;
        this.style.setProperty('top', `${y + 3}%`);
        this.style.setProperty('left', `${x + 2}%`);
    }

    connectedCallback() {
        if (!this.rendered) {
            this.rendered = true;
            this.#render();
        }
    }

}