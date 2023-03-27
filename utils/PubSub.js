/**
 * @typedef Subscriptions
 * @property {{ [id: symbol]: (...args: any[]) => void }} [eventType]
 */

export class PubSub {

    /**
     * List of subscriptions where each entry is an event type with
     * subscribers (callback functions) registered with an id under that event. 
     * @type Subscriptions
     */
    #subscriptions = {};

    /**
     * Allows subscribing to an event. Takes an event name, a callback handler 
     * invoked on each event with the specific type is emitted and an optional third argument, 
     * which when presented serves as execution context (this) for the handler callback.
     * @param {string} evntType event type name
     * @param {(...args: any[]) => void} handler Subscriber callback invoked on each event emitted
     * @param {any} [thisArg] If present is used as this for the handler
     * @returns {{ unsubscribe: () => void }} Object exposing unsubscribe functionality
     */
    subscribe(evntType, handler, thisArg) {
        const id = Symbol("id");

        // create new event type entry if not present
        if (!this.#subscriptions.hasOwnProperty(evntType)) {
            this.#subscriptions[evntType] = {};
        }

        // register subscriber / event handler function
        this.#subscriptions[evntType][id] = thisArg 
            ? handler.bind(thisArg) 
            : handler;
        
        return {
            unsubscribe: () => {
                delete this.#subscriptions[evntType][id];
                if (Reflect.ownKeys(this.#subscriptions[evntType]).length === 0) {
                    delete this.#subscriptions[evntType];
                }
            }
        }
    }

    /**
     * Emits an event of certain type with arguments to be passed down to the subscribers.
     * @param {string} evntType Event type name
     * @param  {...any} args Arguments list to be passed to subscribers
     * @returns {void}
     */
    publish(evntType, ...args) {
        if (!this.#subscriptions[evntType]) return;

        Reflect.ownKeys(this.#subscriptions[evntType])
            .forEach(id => this.#subscriptions[evntType][id](...args), this);
    }

}