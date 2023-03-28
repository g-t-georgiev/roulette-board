import { RouletteBoard } from './board/board.js';
import { RouletteUserControls } from './user-controls/user-controls.js';
import { RouletteNotifications } from './notifications/notifications.js';

customElements.define('roulette-board', RouletteBoard);
customElements.define('roulette-user-controls', RouletteUserControls);
customElements.define('roulette-notifications', RouletteNotifications, { extends: 'h2' });

class RouletteApp extends HTMLElement {

    #template = document.createElement('template');
    #shadowRoot = this.attachShadow({ mode: 'open' });

    constructor() {
        super();
        this.rendered = false;
    }

    #render() {
        this.#template.innerHTML = `
            <!-- <link rel="stylesheet" href="/app/app.css" /> -->

            <style>
                @import '/assets/styles/reset.css';
                @import '/assets/styles/main.css';

                :host {
                    display: block;
                }

                #roulette-board-app-container {
                    margin-block-start: 2rem;
                }

                .notification {
                    text-align: center;
                    margin-block: 1rem;
                }
            </style>

            <section id="roulette-board-app-container">
                <h2 class="notification" is="roulette-notifications">Select a chip to start betting</h2>

                <roulette-board></roulette-board>
                <roulette-user-controls></roulette-user-controls>
            <section>`.trim();
    }

    connectedCallback() {
        
        if (!this.rendered) {
            this.rendered = true;
            this.#render();
            this.#shadowRoot.append(this.#template.content.cloneNode(true));
        }
    }

}

customElements.define('roulette-app', RouletteApp);