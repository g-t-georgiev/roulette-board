/**
 * Utility methods library
 */
export class Roulette {

    constructor() {
        if (this.constructor.name === 'Roulette') {
            throw new Error('Roulette class is non-instantiable.');
        }
    }

    /**
     * Factory function for creating custom events.
     * @param {string} evntType Event name.
     * @param {{ bubbles?: boolean, composed?: boolean, cancelable?: boolean, detail: any }} config Init options for the custom event.
     * @returns {CustomEvent<any>}
     */
    static customEvent(evntType, config = {}) {
        return new CustomEvent(
            evntType, 
            {
                bubbles: config.bubbles ?? true,
                composed: config.composed ?? false,
                cancelable: config.cancelable ?? false,
                detail: config.detail
            }
        );
    }

    /**
     * @param  {...string} URLs 
     * @returns {Promise<string|string[]|undefined>}
     */
    static async fetchComponentStyles(...URLs) {
        const responses = URLs.length > 1 
            ? await Promise.all(URLs.map(url => fetch(url))) 
            : await fetch(...URLs);
    
        return Array.isArray(responses)
            ? Promise.all(responses.map(r => r.text())) 
            : responses.text();
    }

}

export default Roulette;