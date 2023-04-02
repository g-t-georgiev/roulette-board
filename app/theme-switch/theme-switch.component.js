import { Component } from '../core/interfaces/Component.js';
import { Roulette } from '../../utils/Roulette.js'


const Theme = {
    Light: 'Light',
    Dark: 'Dark'
};

export class ThemeSwitchComponent extends Component {

    #darkMode = false;
    #shadowRoot = this.attachShadow({ mode: 'open' });
    #switchElem = document.createElement('button');

    constructor() {
        super();
        this.rendered = false;

        this.#switchElem.type = 'button';
        this.#switchElem.textContent = this.#darkMode ? Theme.Light : Theme.Dark;
    }

    /**
     * Wrapper function on top of a private click handler,
     * binding the calls context to the component instance. 
     * @param  {...PointerEvent} args 
     */
    __clickHandler(...args) {
        this.#clickHandler.call(this, ...args);
    }

    /**
     * Toggle theme component internal state. Method is primarily for internal use, 
     * inside the component click event handler, but is made public for two-way communication for synchronizing 
     * the internal state with the parent context theme state. 
     * When an optional boolean parameter is passed, the value is assigned as the current theme state value.
     * @param {boolean | undefined} darkMode 
     */
    __toggle(darkMode) {
        this.#darkMode = darkMode != null ? darkMode : !this.#darkMode;
        this.#switchElem.textContent = this.#darkMode ? Theme.Light : Theme.Dark;
    }

    #render() {
        const stylesheetElem = document.createElement('link');
        stylesheetElem.rel = 'stylesheet';
        stylesheetElem.href = '/app/theme-switch/theme-switch.component.css';

        this.#shadowRoot.append(stylesheetElem, this.#switchElem);
        this.addEventListener('pointerdown', this.__clickHandler);
    }

    /**
     * Handles click events logic. Makes internal call to the __toggle() 
     * method for changing internal theme state and dispatches roulette:theme event.
     */
    #clickHandler() {
        this.__toggle();

        this.dispatchEvent(
            Roulette.customEvent(
                'roulette:theme', 
                {
                    bubbles: true,
                    composed: false,
                    cancelable: true,
                    detail: {
                        darkMode: this.#darkMode
                    }
                }
            )
        );
    }

    connectedCallback() {
        if (!this.rendered) {
            this.rendered = true;
            this.#render();
        }
    }

    disconnectedCallback() {
        this.removeEventListener('pointerdown', this.__clickHandler);
    }

}