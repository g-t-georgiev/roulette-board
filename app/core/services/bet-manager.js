import { forEachOf } from '../../../utils/nested-list-iterator.js';

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
    // console.log(bets[bets.length - 1]);
    return betsCount;
}

/**
 * Undo last bet made. Returns the value of the revoked chip (or group of chips if 
 * they are doubled bets) and false if action was unsucccessful.
 * @param {HTMLElement} slot 
 */
function undoLastBet() {
    if (!bets.length) {
        return false;
    }

    let value = 0;

    const revokedBet = bets.pop();
    // console.log(revokedBet);

    if (Array.isArray(revokedBet)) {

        value = revokedBet.reduce((total, { chip, slot }) => {
            // console.log(chip, slot);
            chip.ref?.remove();
            total += Number(chip.value);
            return total;
        }, 0);

    } else {
        value = Number(revokedBet.chip.value);
        revokedBet.chip.ref?.remove();
    }

    // console.log(value);
    return value;
}

/**
 * Clears all the bets from the board. Returns the summed value of the 
 * chips if action was successful and false otherwise.
 */
function clearBets() {
    if (!bets.length) {
        return false;
    }

    let totalValue = 0;

    forEachOf(
        bets,
        ({ chip, slot }) => {
            // console.log(chip, slot);
            // console.log(chip.value);
            totalValue += Number(chip.value);
            chip.ref?.remove();
        }
    );

    bets.length = 0;
    // console.log(totalValue);
    return totalValue;
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

    forEachOf(
        bets,
        ({ chip, slot}) => {
            // console.log(chip, slot);
            latestBets.set(slot, chip);
        }
    );

    bets.push(
        [ ...latestBets ].map(
            (bet) => {
                // console.log(bet);
                const [ slot, chip ] = bet;
                // console.log(slot, chip);

                let value = 0;

                if (chip.ref.hasAttribute('stacked')) {
                    value = Number(chip.ref.textContent);
                } else {
                    value = Number(chip.value);
                }

                const newChipElem = slot.placeChipInSlot(
                    { 
                        id: chip.id, 
                        value,
                        computedValue: value * 2 
                    }, 
                    true
                );

                return (
                    { 
                        chip: { 
                            id: chip.id, 
                            value, 
                            ref: newChipElem 
                        }, 
                        slot 
                    }
                );
            }
        )
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