import { forEachOf } from '../../../utils/nested-list-iterator.js';

/**
 * @typedef {object} chip 
 * @property {string} id 
 * @property {string} value 
 * @property {HTMLElement} ref 
 */

/**
 * @typedef {object} slot 
 * @property {({ id: string, value: string, computedValue: string }) => HTMLElement } placeChipInSlot 
 * @property {(chip: { id?: string, value?: string | number }, state: 'appended' | 'removed') => void} toggleChipNotification 
 */

/**
 * Contains reference to all gameboard slots, as map keys,
 * and a list of corresponding chip objects, with their 
 * respective id and value properties, as map values.
 * @type {Array<{ chip: chip, slot: slot }>}
 */
let bets = [];

/**
 * Holds a slice of the latest bets 
 * for presented slots from the board.
 * @type {Map<slot, chip>}
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

        value = revokedBet.reduce(
            /**
             * @param {number} total 
             * @param {{ chip: chip, slot: slot }} bet 
             * @callback
             * @returns {number}
             */
            (total, bet) => {
                // console.log(bet);
                const { chip, slot } = bet;
                chip.ref?.remove();
                slot.toggleChipNotification({ id: chip.id, value: chip.value }, 'removed');
                total += Number(chip.value);
                return total;
            }, 
            0
        );

    } else {
        value = Number(revokedBet.chip.value);
        revokedBet.chip.ref?.remove();
        revokedBet.slot.toggleChipNotification({ id: revokedBet.chip.id, value: revokedBet.chip.value }, 'removed');
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
         * @param {{ chip: chip, slot: slot }} bet 
         * @callback
         * @returns
         */
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
 * Doubles all bets on the board. Returns doubled chips' summed values 
 * if operation was successful and false otherwise.
 */
function doubleBets() {
    if (!bets.length) {
        return false;
    }

    forEachOf(
        bets,
        /**
         * @param {{ chip: chip, slot: slot }} bet 
         * @callback
         * @returns
         */
        ({ chip, slot}) => {
            // console.log(chip, slot);
            latestBets.set(slot, chip);
        }
    );

    let totalValue = 0;

    bets.push(
        [ ...latestBets ].map(
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

                const newChipElem = slot.placeChipInSlot(
                    { 
                        id: chip.id, 
                        value,
                        computedValue: value * 2
                    }, 
                    true
                );

                totalValue += Number(value); 
                slot.toggleChipNotification({ id: chip.id, value });

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