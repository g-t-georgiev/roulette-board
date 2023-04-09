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
     * Creates element instance with the given name, attributes, optional parent 
     * to be appended to and content for the element, which can be either a 
     * sequence of strings or other elements.
     * @param {{ name: string, attributes?: { classList?: string | string[], dataset?: { [key: string]: string } }, parent?: HTMLElement }} options 
     * @param  {...string | HTMLElement} content 
     */
    static createElement({ name, attributes, parent }, ...content) {
        if (typeof name !== 'string') {
            throw new TypeError(`[#CREATE_ELEMENT]: Name argument must be a string.`);
        }

        const elem = document.createElement(name);

        if (!elem.matches(`${name}:defined`)) {
            console.log(`[#CREATE_ELEMENT]: <${name.toUpperCase()}> should be defined.`);
        }


        for (const attributeKey in attributes) {
            if (Object.prototype.hasOwnProperty.call(attributes, attributeKey)) {
                const attributeValue = attributes[attributeKey];
                const isValidAttributeValue = 
                    Array.isArray(attributeValue)
                        ? attributeValue.every(v => typeof v === 'string') 
                        : typeof attributeValue === 'object' 
                            ? Object.values(attributeValue).every(v => typeof v === 'string' )
                            : typeof attributeValue === 'string';

                if (!isValidAttributeValue) {
                    throw new TypeError(`[#CREATE_ELEMENT]: Attribute "${attributeKey}" value (or list of values) must be of type string.`);
                }

                if (attributeKey === 'classList') {
                    elem.classList.add(...(Array.isArray(attributeValue) ? attributeValue : [ attributeValue ]));
                    continue;
                }

                if (attributeKey === 'dataset') {
                    const datasetKeys = Object.keys(attributeValue);
                    
                    datasetKeys.forEach(datasetKey => {
                        elem.dataset[datasetKey] = attributeValue[datasetKey];
                    });

                    continue;
                }

                elem.setAttribute(attributeKey, attributeValue);
            }
        }

        if (content.length > 0) {
            const isValidContentType = content.every(v => typeof v === 'string' || typeof v === 'number' || v instanceof HTMLElement);

            if (!isValidContentType) {
                throw new TypeError(`[#CREATE_ELEMENT]: Element child nodes should be of either type string or HTMLElement instances.`);
            }

            if ([ 'input', 'textarea' ].includes(elem.tagName)) {
                content.forEach(v => elem.value = v);
            }

            elem.append(...content);
        }

        if (
            parent != null && 
            parent instanceof HTMLElement || 
            parent instanceof DocumentFragment
        ) {
            parent.append(elem);
        }

        return elem;
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