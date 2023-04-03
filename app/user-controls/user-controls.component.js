import { Component } from '../core/interfaces/index.js';
import { EventBus } from '../core/services/index.js';

import { UndoButtonComponent } from './undo-button/undo-button.component.js';
import { ClearButtonComponent } from './clear-button/clear-button.component.js';
import { DoubleButtonComponent } from './double-button/double-button.component.js';

import * as data from './user-controls.data.js';

customElements.define('roulette-undo-button', UndoButtonComponent, { extends: 'button' });
customElements.define('roulette-clear-button', ClearButtonComponent, { extends: 'button' });
customElements.define('roulette-double-button', DoubleButtonComponent, { extends: 'button' });


export class UserControlsComponent extends Component {

    #subscriptions = [];
    #shadowRoot = this.attachShadow({ mode: 'open' });
    
    constructor() {
        super();
        this.rendered = false;
    }

    #render() {
        const stylesheets = [];

        const stylesheetElem = document.createElement('link');
        stylesheetElem.setAttribute('rel', 'stylesheet');
        stylesheetElem.setAttribute('href', '/app/user-controls/user-controls.component.css');

        const responsiveStylesheetElem = document.createElement('link');
        responsiveStylesheetElem.rel = 'stylesheet';
        responsiveStylesheetElem.href = '/app/user-controls/responsive.part.css';

        stylesheets.push(stylesheetElem, responsiveStylesheetElem);

        const userControlsSectionElem = document.createElement('section');
        userControlsSectionElem.classList.add('user-controls');

        const buttonElemList = data.buttons.map(data => {
            const btnElem = document.createElement('button', { is: data.is });
            btnElem.type = 'button';
            btnElem.role = 'button';
            btnElem.disabled = true;
            btnElem.classList.add('btn', ...data.classList);
            btnElem.title = data.title;

            const iconElem = document.createElement('img');
            iconElem.src = `/assets/images/${data.imageUrl}`;
            iconElem.width = 55;
            iconElem.height = 55;
            iconElem.alt = data.alt;
            iconElem.classList.add('btn-icon');

            btnElem.append(iconElem);
            return btnElem;
        });

        userControlsSectionElem.append(...buttonElemList);

        this.#shadowRoot.append(...stylesheets, userControlsSectionElem);
    }

    connectedCallback() {

        if (!this.rendered) {
            this.rendered = true;
            this.#render();

            this.#subscriptions.push(
                EventBus.subscribe(
                    'roulette:clear', 
                    () => {
                        this.#shadowRoot.querySelectorAll('.btn').forEach(
                            btn => {
                                btn.toggleDisabledState(true);
                            }
                        );
                    }, 
                    this
                ),
                EventBus.subscribe(
                    'roulette:notempty',
                    () => {
                        this.#shadowRoot.querySelectorAll('.btn').forEach(
                            btn => {
                                btn.toggleDisabledState(false);
                            }
                        );
                    },
                    this
                )
            );
        }
    }

    disconnectedCallback() {
        this.#subscriptions.forEach(_=>_?.unsubscribe());
    }

}