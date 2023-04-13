import { Component } from '../core/interfaces/index.js';
import { EventBus } from '../core/services/index.js';
import Roulette from '../../utils/Roulette.js';

import { UndoButtonComponent } from './undo-button/undo-button.component.js';
import { ClearButtonComponent } from './clear-button/clear-button.component.js';
import { DoubleButtonComponent } from './double-button/double-button.component.js';

import * as data from './user-controls.data.js';

customElements.define('roulette-undo-button', UndoButtonComponent);
customElements.define('roulette-clear-button', ClearButtonComponent);
customElements.define('roulette-double-button', DoubleButtonComponent);


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
            return Roulette.createElement(
                {
                    name: data.is,
                    attributes: {
                        role: 'button',
                        disabled: '',
                        classList: [ 'btn', ...data.classList ],
                        title: data.title
                    }
                },
                Roulette.createElement(
                    {
                        name: 'img',
                        attributes: {
                            src: `/assets/images/${data.imageUrl}`,
                            width: '55',
                            height: '55',
                            alt: data.alt,
                            classList: 'btn-icon'
                        }
                    }
                )
            );
        });

        // console.log(buttonElemList);

        userControlsSectionElem.append(...buttonElemList);

        this.#shadowRoot.append(...stylesheets, userControlsSectionElem);
    }

    connectedCallback() {

        if (!this.rendered) {
            this.rendered = true;
            this.#render();

            this.#subscriptions.push(
                EventBus.subscribe(
                    'roulette:boardnotempty',
                    () => {
                        this.#shadowRoot.querySelectorAll('.btn').forEach(
                            /**
                             * Toggle disabled state false of every button instance 
                             * when the game board is not empty.
                             * @param {import('../core/interfaces/button/button.component.js').ButtonComponent} btn 
                             */
                            btn => {
                                btn.toggleDisabledState(false);
                            }
                        );
                    },
                    this
                ),
                EventBus.subscribe(
                    'roulette:chipscleared', 
                    (totalValueOfClearedChips) => {
                        this.#shadowRoot.querySelectorAll('.btn').forEach(
                            /**
                             * Toggle disabled state true of every button instance 
                             * when the game board is being cleared.
                             * @param {import('../core/interfaces/button/button.component.js').ButtonComponent} btn 
                             */
                            btn => {
                                btn.toggleDisabledState(true);
                            }
                        );

                        // console.log(totalValueOfClearedChips);
                        const actionTextElem = Roulette.createElement({ name: 'roulette-action-text' });
                        actionTextElem?.initialize({ value: totalValueOfClearedChips, state: 'removed' });
                        this.#shadowRoot.querySelector('.user-controls').append(actionTextElem);
                    }, 
                    this
                ),
                EventBus.subscribe(
                    'roulette:betundone',
                    (revokedChipValue) => {
                        // console.log(revokedChipValue);
                        const actionTextElem = Roulette.createElement({ name: 'roulette-action-text' });
                        actionTextElem?.initialize({ value: revokedChipValue, state: 'removed' });
                        
                        this.#shadowRoot.querySelector('.user-controls').append(actionTextElem);
                    },
                    this
                ),
                EventBus.subscribe(
                    'roulette:chipsdoubled',
                    (totalValueOfDoubledChips) => {
                        // console.log(totalValueOfDoubledChips);
                        const actionTextElem = Roulette.createElement({ name: 'roulette-action-text' });
                        actionTextElem?.initialize({ value: totalValueOfDoubledChips, state: 'appended' });
                        
                        this.#shadowRoot.querySelector('.user-controls').append(actionTextElem);
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