import { Component } from '../../../core/interfaces/index.js';
import { Roulette } from '../../../../utils/Roulette.js';

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
        const stylesheets = [];

        const stylesheetElem = document.createElement('link');
        stylesheetElem.rel = 'stylesheet';
        stylesheetElem.href = '/app/board/slot/slot-chip/slot-chip.component.css';

        stylesheets.push(stylesheetElem);

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

        this.#shadowRoot.append(...stylesheets, div);
    }

    connectedCallback() {
        if (!this.rendered) {
            this.rendered = true;
            this.#render();
        }
    }

    disconnectedCallback() {}

}