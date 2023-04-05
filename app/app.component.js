import { Component } from '../app/core/interfaces/index.js';

import { BoardComponent } from './board/board.component.js';
import { ChipsContainerComponent } from './chips/chips.component.js';
import { UserControlsComponent } from './user-controls/user-controls.component.js';

customElements.define('roulette-board', BoardComponent);
customElements.define('roulette-chips', ChipsContainerComponent);
customElements.define('roulette-user-controls', UserControlsComponent);

export class AppComponent extends Component {

    #shadowRoot = this.attachShadow({ mode: 'closed' });

    constructor() {
        super();
        this.rendered = false;
    }

    #render() {
        const stylesheets = [];

        const stylesheetElem = document.createElement('link');
        stylesheetElem.setAttribute('rel', 'stylesheet');
        stylesheetElem.setAttribute('href', '/app/app.component.css');

        const responsiveStylesheetElem = document.createElement('link');
        responsiveStylesheetElem.setAttribute('rel', 'stylesheet');
        responsiveStylesheetElem.setAttribute('href', '/app/responsive.part.css');

        stylesheets.push(stylesheetElem, responsiveStylesheetElem);

        const contentWrapperElem = document.createElement('section');
        contentWrapperElem.id = 'roulette-board-app-container';

        const rouletteBoardElem = document.createElement('roulette-board');
        const rouletteChipsContainerElem = document.createElement('roulette-chips');
        const rouletteUserControlsElem = document.createElement('roulette-user-controls');

        contentWrapperElem.append( 
            rouletteBoardElem, 
            rouletteChipsContainerElem, 
            rouletteUserControlsElem
        );

        this.#shadowRoot.append(...stylesheets, contentWrapperElem);
    }

    connectedCallback() {
        if (!this.rendered) {
            this.rendered = true;
            this.#render();
        }
    }

}