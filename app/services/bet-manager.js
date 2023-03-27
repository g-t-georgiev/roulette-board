/**
 * Contains reference to all gameboard slots, as map keys,
 * and a list of corresponding chip objects, with their 
 * respective id and value properties, as map values.
 * @type {WeakMap<HTMLElement, { id: string, value: string }[]>}
 */
const bets = new WeakMap();

/**
 * Stores the currently selected chip.
 * Null if not chip has been selected.
 * @type {{ id: string, value: string } | null}
 */
let pendingBet = null;

/**
 * Updates pending bet with the currently selected chip.
 * @param {{ id: string, value: string } | null} chip 
 */
function updatePendingBet(chip) {
    pendingBet = chip;
}

function getPendingBet() {
    return pendingBet;
}

/**
 * Registers a new slot. Throws an error if 
 * already registered slot reference is passed.
 * @param {HTMLElement} slot 
 */
function registerSlot(slot) {
    if (bets.has(slot)) {
        throw new Error('Cannot register a slot twice.');
    }

    bets.set(slot, []);
}

/**
 * Adds a new bet (chip) to that slot's list of bets.
 * Throws error if unregistered slot is passed as argument.
 * @param {HTMLElement} slot 
 * @param {{ id: string, value: string }} chip 
 */
function placeBet(slot, chip) {
    if (!bets.has(slot)) {
        throw new Error('Cannot place a bet in an unregistered slot.');
    }

    const slotBets = bets.get(slot);
    slotBets.push(chip);
}

/**
 * Undo last bet made. Throws error 
 * if unregirestered slot is passed as argument. 
 * Returns true if slot is not empty, false otherwise.
 * @param {HTMLElement} slot 
 */
function undoLastBet(slot) {
    if (!bets.has(slot)) {
        throw new Error('Cannot undo last bet on unregistered slot.');
    }

    const slotBets = bets.get(slot);

    if (slotBets.length > 0) {
        slotBets.pop();
        return true;
    }
    
    return false;
}

/**
 * Clears all the bets from a slot.
 * Throws error if unregistered slot is passed as argument. 
 * Returns true if slot was cleared successfully and 
 * false if slot was empty already prior to the method invokation.
 * @param {HTMLElement} slot 
 */
function clearBets(slot) {
    if (!bets.has(slot)) {
        throw new Error('Cannot clear bets from unregistered slot.');
    }

    const slotBets = bets.get(slot);

    if (slotBets.length > 0) {
        slotBets.length = 0;
        return true;
    }
    
    return false;
}

/**
 * Doubles all bets in a slot. Throws error if 
 * unregistered slot is passed as argument.
 * Returns false if slot was empty prior to method invokation,
 * true if operation was successful.
 * @param {HTMLElement} slot 
 */
function doubleBets(slot) {
    if (!bets.has(slot)) {
        throw new Error('Cannot double bets from unregistered slot.');
    }

    const slotBets = bets.get(slot);

    if (slotBets.length > 0) {
        bets.set(slot, slotBets.concat(slotBets));
        return true;
    }
    
    return false;
}

/**
 * Deletes a slot by reference. If unregistered 
 * slot reference is passed an error is thrown. 
 * Returns true or false depending on if the delete 
 * operation was successful.
 * @param {HTMLElement} slot 
 * @returns 
 */
function deleteSlot(slot) {
    if (!bets.has(slot)) {
        throw new Error('Cannot delete unregistered slot.');
    }

    return bets.delete(slot);
}

export default {
    updatePendingBet, 
    getPendingBet,
    registerSlot,
    deleteSlot,
    placeBet,
    undoLastBet,
    clearBets,
    doubleBets
};