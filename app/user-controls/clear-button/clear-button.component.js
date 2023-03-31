import { ButtonComponent } from '../../core/interfaces/index.js';
import { EventBus, BetManager } from '../../core/services/index.js'

export class ClearButtonComponent extends ButtonComponent {
    
    constructor() {
        super();
        this.rendered = false;
        this._clickHandler = this._clickHandler.bind(this);
    }

    _clickHandler() {
        if (this.disabled) return;
        const success = BetManager.clearBets();
        
        if (!success) return;
        EventBus.publish('roulette:clear');
    }

    connectedCallback() {
        if (!this.rendered) {
            this.rendered = true;
            this.addEventListener('pointerdown', this._clickHandler);
        }
    }

    disconnectedCallback() {
        this.removeEventListener('pointerdown', this._clickHandler);
    }

}