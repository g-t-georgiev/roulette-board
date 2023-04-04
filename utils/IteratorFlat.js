/**
 * @param {any} entry 
 * @param {(item: any) => void} callback 
 */
function handler(entry, callback) {
    if (Array.isArray(entry)) {
        walkNestedLists(entry, callback);
    } else {
        callback?.(entry);
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
export function walkNestedLists(target, callback, startIndex = 0) {
    let entry = target?.[startIndex++];

    // if array is empty just exit execution
    if (entry == null) return;

    if (startIndex < target.length) {
        handler(entry, callback);

        walkNestedLists(target, callback, startIndex);
    } else {
        handler(entry, callback);
    }
}