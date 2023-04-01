import { Component } from "../../core/interfaces/index.js";

export class CursorComponent extends Component {

    #shadowRoot = this.attachShadow({ mode: 'open' });

    constructor() {
        super();
        this.rendered = false;
    }

    #render() {
        const stylesheetElem = document.createElement('link');
        stylesheetElem.setAttribute('rel', 'stylesheet');
        stylesheetElem.setAttribute('href', '/app/board/cursor/cursor.component.css');

        this.#shadowRoot.append(stylesheetElem);
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