import { Component } from '../core/interfaces/index.js';
import Roulette from '../../utils/Roulette.js';

const stylesheets = [];

export class ActionTextComponent extends Component {

    #shadowRoot = this.attachShadow({ mode: 'open' });
    #textElem;
    #timerId;
    #onRenderCallback = () => {};

    constructor() {
        super();
        this.rendered = false;
    }

    initialize(data) {
        // console.log(data);

        this.#onRenderCallback = (textElem) => {
            // console.log(textElem);
            if (!textElem) return;

            textElem.classList.toggle('chip-added', data.state === 'appended');
            textElem.classList.toggle('chip-removed', data.state === 'removed');

            const sign = data.state === 'appended' ? '+' : '-';
            
            textElem.textContent = sign + (typeof data.value === 'number' ? data.value : Number(data.value)).toFixed(2);

            this.#discard(1.5e3);
        }
    }

    #discard(timeout = 1e3) {
        this.#timerId = setTimeout(() => {
            this?.remove();
        }, timeout);
    }

    async #render() {
        try {
            // console.log('Rendering notification');
            if (!stylesheets.length) {
                const cssText = await Roulette.fetchComponentStyles('/app/action-text/action-text.component.css');
                // console.log(cssText);
                const styleElem = document.createElement('style');
                styleElem.textContent = cssText;
                // console.log(styleElem);
                stylesheets.push(styleElem);
                this.#shadowRoot.prepend(styleElem);
            } else {
                this.#shadowRoot.prepend(...stylesheets.map(styleEl => styleEl.cloneNode(true)));
            }
    
            const textBoxElem = Roulette.createElement({ name: 'div', attributes: { classList: 'text-box' }});
    
            this.#textElem = Roulette.createElement({ name: 'span', attributes: { classList: 'text-content' }});
            this.#onRenderCallback?.(this.#textElem);
            textBoxElem.append(this.#textElem);

            this.#shadowRoot.append(textBoxElem);
        } catch (error) {
            console.error(error);
        }
    }

    connectedCallback() {
        if (!this.rendered) {
            this.rendered = true;
            this.#render();
        }
    }

    disconnectedCallback() {
        // console.log('ActionText component removed.');
        // console.log(this.#timerId);
        clearTimeout(this.#timerId);
    }

}