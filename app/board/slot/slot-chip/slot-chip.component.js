import { Component } from '../../../core/interfaces/index.js';
import Roulette from '../../../../utils/Roulette.js';


const stylesheets = [];

export class SlotChipComponent extends Component {

    #shadowRoot = this.attachShadow({ mode: 'open' });

    constructor() {
        super();
        this.rendered = false;
    }

    get textContent() {
        return this.#shadowRoot.querySelector('.chip').textContent;
    }

    set textContent(v) {
        this.#shadowRoot.querySelector('.chip').textContent = v;
    }

    #render() {

        if (!stylesheets.length) {

            Roulette
                .fetchComponentStyles('/app/board/slot/slot-chip/slot-chip.component.css')
                .then(cssText => {
                    // console.log(cssText);
                    const styleElem = document.createElement('style');
                    // console.log(styleElem);
                    styleElem.textContent = cssText;

                    stylesheets.push(styleElem);
                    this.#shadowRoot.prepend(styleElem);
                });

        } else {
            this.#shadowRoot.prepend(...stylesheets.map(styleEl => styleEl.cloneNode(true)));
        }

        const div = document.createElement('div');

        div.classList.add('chip');
        div.textContent = this.dataset.value;

        const img = document.createElement('img');
        img.classList.add('chip-icon');
        img.setAttribute('src', `/assets/images/chip-background-${this.dataset.id}.png`);
        img.setAttribute('alt', 'chip icon');
        img.setAttribute('width', '30');
        img.setAttribute('height', '30');

        div.append(img);

        this.#shadowRoot.append(div);

        this.dispatchEvent(
            Roulette.customEvent(
                'roulette:chipplaced',
                {
                    bubbles: true,
                    composed: true,
                    cancelable: true,
                    detail: {
                        id: this.dataset.id,
                        value: this.dataset.value
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

    disconnectedCallback() { }

}