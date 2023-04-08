import { Component } from '../core/interfaces/index.js';
import Roulette from '../../utils/Roulette.js';

const stylesheets = [];

export class PopUpComponent extends Component {

    #shadowRoot = this.attachShadow({ mode: 'open' });
    #textContent;

    constructor() {
        super();
        this.rendered = false;
    }

    #render() {

        if (!stylesheets.length) {

            Roulette.fetchComponentStyles('/app/pop-up/pop-up.component.css')
                .then(cssText => {
                    // console.log(cssText);
                    const styleElem = document.createElement('style');
                    styleElem.textContent = cssText;
                    // console.log(styleElem);
                    stylesheets.push(styleElem);
                    this.#shadowRoot.prepend(styleElem);
                })
                .catch(error => {
                    console.error(error);
                });

        } else {
            this.#shadowRoot.prepend(...stylesheets.map(styleEl => styleEl.cloneNode(true)));
        }

        const notificationElem = document.createElement('div');
        notificationElem.classList.add('notification');

        this.#textContent = document.createElement('span');
        this.#textContent.classList.add('notification-text');

        notificationElem.append(this.#textContent);

        this.#shadowRoot.append(this.#textContent);

    }

    connectedCallback() {
        if (!this.rendered) {
            this.rendered = true;
            this.#render();
        }
    }
}