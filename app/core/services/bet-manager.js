import { forEachOf } from '../../../utils/nested-list-iterator.js';
import Roulette from '../../../utils/Roulette.js'

/**
 * Data object representing a betted chip containing information 
 * about the id, value and DOM object reference onthe board.
 * @typedef {object} chip 
 * @property {string} id 
 * @property {string} value 
 * @property {HTMLElement} ref 
 */

/**
 * Associative list of all the session bets. 
 * Each entry represents a pair of a chip 
 * data object and the associated slot instance 
 * reference it was placed in.
 * @type {Array<{ chip: chip }>}
 */
let bets = [];

/**
 * Holds a slice of the latest bets 
 * for presented slots from the board.
 * @type {Map<HTMLElement, chip>}
 */
const latestBets = new Map();

/**
 * Loops through the bets list and 
 * on each iteration updates the current 
 * state for the latest bets and returns a 
 * reference for it. 
 */
function updateLatestBets() {
    forEachOf(
        bets,
        /**
         * @param {{ chip: chip }} bet 
         * @callback
         * @returns
         */
        ({ chip }) => {
            // console.log(chip);
            // console.log(chip.ref.parentElement);
            latestBets.set(chip.ref.parentElement, chip);
        }
    );

    return latestBets;
}

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
 * @param {{ chip: chip }} bet 
 */
function placeBet(bet) {
    const { chip } = bet;
    // console.log(chip);
    const betsCount = bets.push({ chip: { ...chip } });
    // console.log(bets[bets.length - 1]);
    return betsCount;
}

/**
 * Undo last bet made. Returns the value of the revoked chip (or group of chips if 
 * they are doubled bets) and false if action was unsucccessful.
 */
function undoLastBet() {
    if (!bets.length) {
        return false;
    }

    let value = 0;

    const revokedBet = bets.pop();
    // console.log(revokedBet);

    if (Array.isArray(revokedBet)) {

        value = revokedBet.reduce(
            /**
             * @param {number} total 
             * @param {{ chip: chip }} bet 
             * @callback
             * @returns {number}
             */
            (total, bet) => {
                // console.log(bet);
                const { chip } = bet;
                chip.ref?.remove();
                total += Number(chip.value);
                return total;
            }, 
            0
        );

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
        /**
         * @param {{ chip: chip }} bet 
         * @callback
         * @returns
         */
        ({ chip }) => {
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
 * Doubles all bets on the board. Returns doubled chips' summed values 
 * if operation was successful and false otherwise.
 */
function doubleBets() {
    if (!bets.length) {
        return false;
    }

    let totalValue = 0;
    const latestBets = updateLatestBets();

    const latestBetsFormatted = [ ...latestBets ].map(
        (bet) => {
            // console.log(bet);
            const [ slot, chip ] = bet;
            // console.log(slot, chip);

            let value = 0;

            if (chip.ref.hasAttribute('stacked')) {
                value = chip.ref.textContent;
            } else {
                value = chip.value;
            }

            const newChipElem = Roulette.createElement(
                { 
                    name: 'roulette-slot-chip', 
                    attributes: {
                        dataset: {
                            id: String(chip.id),
                            value: String(value),
                            computedValue: String(value * 2),
                        },
                        stacked: ''
                    }
                }
            )

            chip.ref.after(newChipElem);

            totalValue += Number(value); 

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
    );

    bets.push(latestBetsFormatted);

    latestBets.clear();
    return totalValue;
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