import { Component } from '../app/core/interfaces/index.js';

import createTemplate from './app.template.js';

import { BoardComponent } from './board/board.component.js';
import { UserControlsComponent } from './user-controls/user-controls.component.js';
import { NotificationsComponent } from './notifications/notifications.component.js';

customElements.define('roulette-board', BoardComponent);
customElements.define('roulette-user-controls', UserControlsComponent);
customElements.define('roulette-notifications', NotificationsComponent, { extends: 'h2' });

export class AppComponent extends Component {

    #template = document.createElement('template');
    #shadowRoot = this.attachShadow({ mode: 'open' });

    constructor() {
        super();
        this.rendered = false;
    }

    #render() {
        this.#template.innerHTML = createTemplate().trim();
        this.#shadowRoot.append(this.#template.content.cloneNode(true));
    }

    connectedCallback() {
        if (!this.rendered) {
            this.rendered = true;
            this.#render();
        }
    }

}