export class RouletteCursor extends HTMLElement {

    #template = document.createElement('template');
    #shadowRoot = this.attachShadow({ mode: 'open' });

    constructor() {
        super();
        this.rendered = false;
    }

    #render() {
        this.#template.innerHTML = `<link rel="stylesheet" href="/app/board/chip-cursor/chip-cursor.css" />`.trim();
    }

    connectedCallback() {

        if (!this.rendered) {
            this.rendered = true;
            this.#render();
            // console.log('Chip cursor component rendered!');
            this.#shadowRoot.append(this.#template.content.cloneNode(true));
        }

    }

    disconnectedCallback() {
        // console.log('Chip cursor component removed!');
    }

}