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

    toggle(darkMode = false) {
        this.#darkMode = darkMode || !this.#darkMode;
        this.#switchElem.textContent = this.#darkMode ? Theme.Dark : Theme.Light;
    }

    constructor() {
        super();
        this.rendered = false;
        this._clickHandler = this._clickHandler.bind(this);

        this.#switchElem.type = 'button';
        this.#switchElem.textContent = this.#darkMode ? Theme.Dark : Theme.Light;
    }

    #render() {
        const stylesheetElem = document.createElement('link');
        stylesheetElem.rel = 'stylesheet';
        stylesheetElem.href = '/app/theme-switch/theme-switch.component.css';

        this.#shadowRoot.append(stylesheetElem, this.#switchElem);
        this.addEventListener('pointerdown', this._clickHandler);
    }

    _clickHandler() {
        this.toggle();

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
        this.removeEventListener('pointerdown', this._clickHandler);
    }

}