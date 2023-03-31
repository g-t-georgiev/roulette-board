/**
 * Component abstract class.
 */
export class Component extends HTMLElement {

    constructor() {
        super();
        
        if (this.constructor.name === 'Component') {
            throw new Error('Component is an abstract class.');
        }
    }

    /**
     * This method is called when the custom 
     * element is rendered into the DOM. This is 
     * useful for making initial API calls for fetching data, etc.
     */
    connectedCallback() { }

    /**
     * This method is called when the custom 
     * element is removed from the DOM. This is
     * useful for clean-up, such as removing event 
     * listeners, unsubscribing from observables, etc.
     */
    disconnectedCallback() { }

    /**
     * This is a static getter property that should 
     * return an array of name of the attributes you 
     * wish to observe for changes.
     * @returns {Array<string>}
     */
    static get observedAttributes() { }

    /**
     * This method is called each time one of the observed 
     * attributes changes, including after the element has been
     * rendered into the DOM. The first argument is the attribute name, 
     * followed by the previous and current values. 
     * @param {string} attribute 
     * @param {string} previousValue 
     * @param {string} currentValue 
     */
    attributeChangedCallback(attribute, previousValue, currentValue) { }

}