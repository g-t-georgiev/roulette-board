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

    /**
     * Initialize cursor with chip id and value data.
     * @param {string | null} id 
     * @param {string | null} value 
     */
    init(id, value) {
        this.setAttribute('chip-id', id);
        this.setAttribute('chip-value', value);
    }

    /**
     * Removes disabled attribute making the element to appear in the DOM.
     */
    show() {
        this.toggleAttribute('disabled', false);
    }

    /**
     * Sets disabled attribute making the element to hide.
     */
    hide() {
        this.toggleAttribute('disabled', true);
    }

    /**
     * Sets top and left positioning according to mouse cursor movement.
     * @param {number} x 
     * @param {number} y 
     */
    move(x, y) {
        // Added additional spacing of 2-3%;
        this.style.setProperty('top', `${y + 3}%`);
        this.style.setProperty('left', `${x + 2}%`);
    }

    connectedCallback() {

        if (!this.rendered) {
            this.rendered = true;
            this.#render();
            // console.log('Chip cursor component rendered!');
            this.#shadowRoot.append(this.#template.content.cloneNode(true));
            
            // Instantiate with a disabled attribute
            this.hide();
        }

    }

    disconnectedCallback() {
        // console.log('Chip cursor component removed!');
    }

}