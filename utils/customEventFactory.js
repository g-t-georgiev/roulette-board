    /**
     * Factory function for creating custom events.
     * @param {string} evntType 
     * @param {{ bubbles?: boolean, composed?: boolean, cancelable?: boolean, detail: any }} config Config init options for the custom event
     * @returns {CustomEvent<{ chipId: string, value: string, selected: boolean }>}
     */
    export function customEventFactory(evntType, config = {}) {
        return new CustomEvent(
            evntType, 
            {
                bubbles: config.bubbles ?? true,
                composed: config.bubbles ?? false,
                cancelable: config.bubbles ?? false,
                detail: config.detail
            }
        );
    }