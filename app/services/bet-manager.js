/**
 * Contains reference to all gameboard slots, as map keys,
 * and a list of corresponding chip objects, with their 
 * respective id and value properties, as map values.
 * @type {Map<HTMLElement, { id: string, value: string }[]>}
 */
const bets = new Map();

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
    // console.log(slotBets);
    bets.set(slot, slotBets);
    // console.log(bets.get(slot));
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
        bets.set(slot, slotBets);
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
function clearBets() {

    let isEmpty;

    bets.forEach((entries, key) => {
        // console.log(key, entries);
        if (entries.length > 0) {
            // console.log(key, entries);
            entries.length = 0;
        }
    });

    isEmpty = Object.values(bets).every(entry => entry.length === 0);

    return isEmpty;
}

/**
 * Doubles all bets on the board.
 * @param {HTMLElement} slot 
 */
function doubleBets() {
    bets.forEach((entries, key) => {
        if (entries.length > 0) {
            bets.set(key, entries.concat(entries));
            // console.log(bets.get(key));
        }
    });
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