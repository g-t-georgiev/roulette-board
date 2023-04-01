import { Component } from '../app/core/interfaces/index.js';

import { BoardComponent } from './board/board.component.js';
import { UserControlsComponent } from './user-controls/user-controls.component.js';
import { NotificationsComponent } from './notifications/notifications.component.js';
import { ThemeSwitchComponent } from './theme-switch/theme-switch.component.js';

customElements.define('roulette-board', BoardComponent);
customElements.define('roulette-user-controls', UserControlsComponent);
customElements.define('roulette-notifications', NotificationsComponent, { extends: 'h2' });
customElements.define('roulette-theme-switch', ThemeSwitchComponent);

export class AppComponent extends Component {

    #shadowRoot = this.attachShadow({ mode: 'closed' });

    constructor() {
        super();
        this.rendered = false;
    }

    #render() {
        const stylesheetElem = document.createElement('link');
        stylesheetElem.setAttribute('rel', 'stylesheet');
        stylesheetElem.setAttribute('href', '/app/app.component.css');

        const contentWrapperElem = document.createElement('section');
        contentWrapperElem.id = 'roulette-board-app-container';

        const notificationElem = document.createElement('h2', { is: 'roulette-notifications' });
        notificationElem.classList.add('notification');
        notificationElem.textContent = 'Select a chip to start betting';

        const rouletteBoardElem = document.createElement('roulette-board');
        const rouletteUserControlsElem = document.createElement('roulette-user-controls');

        const toggleThemeElem = document.createElement('roulette-theme-switch');
        const isThemeDark = this.getAttribute('theme') === 'dark';
        toggleThemeElem.toggle(isThemeDark);

        contentWrapperElem.append(toggleThemeElem, notificationElem, rouletteBoardElem, rouletteUserControlsElem);

        this.#shadowRoot.append(stylesheetElem, contentWrapperElem);

        this.addEventListener('roulette:theme', (e) => {
            this.setAttribute('theme', e.detail.darkMode ? 'dark' : 'light');
        });
    }

    connectedCallback() {
        if (!this.rendered) {
            this.rendered = true;
            this.#render();
        }
    }

}