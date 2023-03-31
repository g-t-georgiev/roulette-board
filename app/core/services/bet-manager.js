/**
 * @typedef chip 
 * @property {string} id 
 * @property {string} value 
 * @property {HTMLElement} ref 
 */

/**
 * Contains reference to all gameboard slots, as map keys,
 * and a list of corresponding chip objects, with their 
 * respective id and value properties, as map values.
 * @type {Array<{ chip: chip, slot: HTMLElement }>}
 */
let bets = [];

/**
 * Holds a slice of the latest bets 
 * for presented slots from the board.
 * @type {Map<HTMLElement, chip>}
 */
const latestBets = new Map();

/**
 * Stores the currently selected chip.
 * Null if not chip has been selected.
 * @type {Pick<chip, 'id' | 'value'> | null}
 */
let pendingBet = null;

/**
 * Updates pending bet value with the currently selected chip data.
 * @param {Pick<chip, 'id' | 'value'> | null} chip 
 */
function setPendingBet(chip) {
    pendingBet = chip;
}

/**
 * Gets the selected chip data or null if such is not present.
 */
function getPendingBet() {
    return pendingBet;
}

/**
 * Returns true if there are entries 
 * in bets list, false otherwise.
 */
function hasPlacedBets() {
    return bets.length > 0;
}

/**
 * Places a new bet on the board. 
 * Returns the updated bets count.
 * @param {{ chip: chip, slot: HTMLElement }} bet 
 */
function placeBet(bet) {
    const { chip, slot } = bet;
    // console.log(chip, slot);
    const betsCount = bets.push({ chip: { ...chip }, slot });
    slot.append(bets[bets.length - 1].chip.ref);
    // console.log(bets[bets.length - 1]);
    return betsCount;
}

/**
 * Undo last bet made. Return the revoked bet or 
 * false if operation was unsucccessful.
 * @param {HTMLElement} slot 
 */
function undoLastBet() {
    if (!bets.length) {
        return false;
    }

    const revokedBet = bets.pop();
    // console.log(revokedBet);
    revokedBet.chip.ref?.remove();
    return revokedBet;
}

/**
 * Clears all the bets from the board. Returns true if 
 * all bets were cleared successfully and false otherwise.
 */
function clearBets() {
    if (!bets.length) {
        return false;
    }

    bets.forEach(
        ({ chip, slot }) => {
            // console.log(chip, slot);
            chip.ref?.remove();
        }
    );

    bets.length = 0;
    return true;
}

/**
 * Doubles all bets on the board. Returns 
 * true if operation was successful and false otherwise.
 * @param {HTMLElement} slot 
 */
function doubleBets() {
    if (!bets.length) {
        return false;
    }

    bets.forEach(
        ({ chip, slot}) => {

            latestBets.set(slot, chip);
        }
    );

    latestBets.forEach(
        (chip, slot) => {
            // console.log(chip, slot);

            let value = 0;

            if (chip.ref.classList.contains('stacked')) {
                value = Number(chip.ref.textContent);
            } else {
                value = Number(chip.value);
            }

            const newChipElem = slot.createSlotChipElem(
                { 
                    id: chip.id, 
                    value: value * 2 
                }, 
                true
            );

            slot.append(newChipElem);
            bets.push(
                { 
                    chip: { 
                        id: chip.id, 
                        value: value, 
                        ref: newChipElem 
                    }, 
                    slot 
                }
            );
        }
    );

    latestBets.clear();
    return true;
}

export {
    setPendingBet, 
    getPendingBet,
    hasPlacedBets,
    placeBet,
    undoLastBet,
    clearBets,
    doubleBets
};