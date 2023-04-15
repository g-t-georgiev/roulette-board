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
            // console.log('Rendering slot chip');
            if (!stylesheets.length) {

                const cssTextStyles = await Roulette.fetchComponentStyles(
                    '/app/board/slot/slot-chip/slot-chip.component.css',
                    '/app/board/slot/slot-chip/responsive.part.css'
                );

                const styleElem = Roulette.createElement(
                    {
                        name: 'style',
                        parent: this.#shadowRoot
                    },
                    ...(Array.isArray(cssTextStyles) ? cssTextStyles : [ cssTextStyles ])
                );

                stylesheets.push(styleElem);
            } else {
                this.#shadowRoot.prepend(...stylesheets.map(styleEl => styleEl.cloneNode(true)));
            }
    
            const contentElem = Roulette.createElement(
                {
                    name: 'div',
                    attributes: {
                        classList: 'chip'
                    }
                },
                this.dataset.computedValue,
                Roulette.createElement(
                    {
                        name: 'img',
                        attributes: {
                            classList: 'chip-icon',
                            src: `/assets/images/chip-background-${this.dataset.id}.png`,
                            alt: 'chip icon',
                            width: '30',
                            height: '30'
                        }
                    }
                )
            );
            
            this.#onRenderCallback?.(contentElem);
            this.#shadowRoot.append(contentElem);
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