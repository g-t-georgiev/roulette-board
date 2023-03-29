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

    // console.log(bets);

    const copy = [ ...bets ].map(
        ({ chip, slot }) => {
            const nodeList = slot.querySelectorAll('.chip');
            const lastBetPlaced = nodeList.item(nodeList.length - 1) ?? 0;
            const chipRefClone = chip.ref?.cloneNode(true);
            chipRefClone.textContent = Number(lastBetPlaced.textContent) + Number(chip.value);
            chipRefClone.classList.add('stacked');
            slot.append(chipRefClone);

            return { chip: { ...chip, ref: chipRefClone }, slot };
        }
    );

    bets = [ ...bets, ...copy ];
    // console.log(bets);
    return true;
}

export default {
    setPendingBet, 
    getPendingBet,
    hasPlacedBets,
    placeBet,
    undoLastBet,
    clearBets,
    doubleBets
};