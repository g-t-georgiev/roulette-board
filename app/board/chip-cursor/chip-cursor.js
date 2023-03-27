export class RouletteCursor extends HTMLElement {

    #template = document.createElement('template');
    #shadowRoot = this.attachShadow({ mode: 'open' });

    constructor() {
        super();
        this.rendered = false;
    }

    #render() {
        this.#template.innerHTML = `
            <!-- <link rel="stylesheet" href="/app/board/chip-cursor/chip-cursor.css" /> -->
        
            <style>
                :host {
                    display: inline-block;
                    position: absolute;
                
                    inline-size: 23px;
                    aspect-ratio: 1 / 1;
                
                    font-size: 12px;
                    font-weight: 700;
                    line-height: 23px;
                    text-align: center;
                
                    background-repeat: no-repeat;
                    background-size: contain;
                }
                
                :host([disabled]) {
                    display: none;
                }
                
                :host([chip-id="1"]) {
                    background-image: url("/assets/images/chip-background-1.png");
                }
                
                :host([chip-id="2"]) {
                    background-image: url("/assets/images/chip-background-2.png");
                }
                
                :host([chip-id="3"]) {
                    background-image: url("/assets/images/chip-background-3.png");
                }
                
                :host::before {
                    content: attr(chip-value);
                }
            </style>`.trim();
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