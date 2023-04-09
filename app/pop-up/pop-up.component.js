import { Component } from '../core/interfaces/index.js';
import Roulette from '../../utils/Roulette.js';

const stylesheets = [];

export class PopUpComponent extends Component {

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

            this.#timerId = setTimeout(() => {
                this?.remove();
            }, 1e3);
        }
    }

    async #render() {
        try {
            // console.log('Rendering notification');
            if (!stylesheets.length) {
                const cssText = await Roulette.fetchComponentStyles('/app/pop-up/pop-up.component.css');
                // console.log(cssText);
                const styleElem = document.createElement('style');
                styleElem.textContent = cssText;
                // console.log(styleElem);
                stylesheets.push(styleElem);
                this.#shadowRoot.prepend(styleElem);
            } else {
                this.#shadowRoot.prepend(...stylesheets.map(styleEl => styleEl.cloneNode(true)));
            }
    
            const notificationElem = document.createElement('div');
            notificationElem.classList.add('notification');
    
            this.#textElem = document.createElement('span');
            this.#textElem.classList.add('notification-text');
            this.#onRenderCallback?.(this.#textElem);
            
            notificationElem.append(this.#textElem);
            this.#shadowRoot.append(notificationElem);
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
        // console.log('Popup component removed.');
        // console.log(this.#timerId);
        clearTimeout(this.#timerId);
    }

}