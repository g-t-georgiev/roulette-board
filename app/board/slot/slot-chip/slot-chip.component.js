import { Component } from '../../../core/interfaces/index.js';
import Roulette from '../../../../utils/Roulette.js';


const stylesheets = [];

export class SlotChipComponent extends Component {

    #shadowRoot = this.attachShadow({ mode: 'open' });
    #onRenderCallback = () => {};

    constructor() {
        super();
        this.rendered = false;
    }

    get textContent() {
        const chip = this.#shadowRoot.querySelector('.chip');
        // console.log(chip);
        return chip?.textContent;
    }

    set textContent(v) {
        // console.log(v);

        this.#onRenderCallback = (chip) => {
            chip.textContent = v;
        };
    }

    async #render() {
        try {
            if (!stylesheets.length) {

                const cssText = await Roulette.fetchComponentStyles('/app/board/slot/slot-chip/slot-chip.component.css');
                // console.log(cssText);
                const styleElem = document.createElement('style');
                // console.log(styleElem);
                styleElem.textContent = cssText;

                stylesheets.push(styleElem);
                this.#shadowRoot.prepend(styleElem);
    
            } else {
                this.#shadowRoot.prepend(...stylesheets.map(styleEl => styleEl.cloneNode(true)));
            }
    
            const div = document.createElement('div');
    
            div.classList.add('chip');
            div.textContent = this.dataset.computedValue;
    
            const img = document.createElement('img');
            img.classList.add('chip-icon');
            img.setAttribute('src', `/assets/images/chip-background-${this.dataset.id}.png`);
            img.setAttribute('alt', 'chip icon');
            img.setAttribute('width', '30');
            img.setAttribute('height', '30');
    
            div.append(img);
            
            this.#onRenderCallback?.(div);
            this.#shadowRoot.append(div);
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

}