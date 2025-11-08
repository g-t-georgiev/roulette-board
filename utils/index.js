/**
 * Each subscriber is an id symbol key and callback (subscriber) value.
 * @typedef {Map<symbol, (...args: any[]) => void>} Subscribers 
 */

/**
 * Each subscription is an event type and sunscribers key-value pair.
 * @typedef {Map<string, Subscribers>} Subscriptions
 */

/**
 * Utility class for creating event emitter instances.
 */
export class PubSub {

    /**
     * Key-value pair map object where each key is an event type and 
     * each value is another map object storing the subscribers (callback functions) under "id" symbol keys. 
     * @type Subscriptions
     */
    #subscriptions = new Map();

    /**
     * Returns all subscribers from a single event subscription.
     * @param {string} eventType 
     * @returns Subscribers | undefined
     */
    #getSubscribers(eventType) {
        return this.#subscriptions.get(eventType);
    }

    /**
     * Adds new subscription or updates current subscription subscribers.
     * @param {string} eventType 
     * @param {symbol} [id] 
     * @param {(...args: any[]) => void} [subscriber] 
     */
    #setSubscriber(eventType, id, subscriber) {
        // create new event type entry if not present
        if (!this.#subscriptions.has(eventType)) {
            this.#subscriptions.set(eventType, new Map());
        }

        // register subscriber 
        this.#subscriptions.set(eventType, this.#getSubscribers(eventType).set(id, subscriber));
    }

    /**
     * Removes a subscriber from current event subscriptions and 
     * if no subscribers are left the whole event subscription entry is removed.
     * @param {string} eventType 
     * @param {symbol} id 
     */
    #deleteSubscriber(eventType, id) {
        const deletedSuccessfully = this.#getSubscribers(eventType).delete(id);

        if (deletedSuccessfully && this.#getSubscribers(eventType).size === 0) {
            this.#subscriptions.delete(eventType);
        }
    }

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

        this.#setSubscriber(evntType, id, thisArg ? handler.bind(thisArg) : handler);

        return {
            unsubscribe: () => {
                this.#deleteSubscriber(evntType, id);
            }
        }
    }

    /**
     * Synchronously emits an event of certain type with arguments to be passed down to the subscribers. 
     * If no subscribers are present for a certain event immediately returns.
     * @param {string} evntType Event type name
     * @param  {...any} args Arguments list to be passed to subscribers
     * @returns {void}
     */
    publishSync(evntType, ...args) {
        const subscribers = this.#getSubscribers(evntType);
        if (!subscribers) return;

        for (const subscriber of subscribers.values()) {
            subscriber(...args);
        }
    }

    /**
     * Asynchronously emits an event of certain type with arguments to be passed down to the subscribers. 
     * If no subscribers are present for a certain event immediately returns.
     * @param {string} evntType Event type name
     * @param  {...any} args Arguments list to be passed to subscribers
     * @returns {Promise<void>}
     */
    async publish(evntType, ...args) {
        const subscribers = this.#getSubscribers(evntType);

        if (!subscribers) return;

        const actions = Array.from(subscribers.values());       
        const notifyPromises = actions.map(async (callback) => {
            await Promise.resolve();
            callback(...args);
        });

        await Promise.all(notifyPromises);
    }

    /**
     * Static class method providing alternative way to create 
     * a new PubSub instance.
     * @returns { PubSub }
     */
    static createInstance() {
        return new this();
    }

}

/**
 * Makes a flattening recursive iteration through nested list 
 * structure, invoking a callback function for each non-list item.
 * The starting point is by default 0, but can be set at any valid index 
 * in the provided target list length range.
 * @param {Array<any>} target 
 * @param {(item: any) => void} callback 
 * @param {number} startIndex 
 */
export function forEachOf(target, callback, startIndex = 0) {
    const len = target.length;
    let i = startIndex;

    while (i < len) {
        const item = target[i++];
        if (Array.isArray(item)) {
            forEachOf(item, callback);
        } else {
            callback(item);
        }
    }
}
