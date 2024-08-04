// Ranges 1-10 and 19-28 odd numbers are red, even numbers are black;
// Ranges 11-18 and 29-36 odd numbers are black, even numbers are red;

const sequence = [
    0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 'col3-36',
    2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35, 'col2-35',
    1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34, 'col1-34',
    'dozen1-12', 'dozen13-24', 'dozen25-36',
    'range1-18', 'even', 'red', 'black', 'odd', 'range19-36'
];

const slotDataMap = {

    // 3rd column slots
    0: { textContent: '0', classList: ['inside-bet', 'zero', 'n-0'] },
    3: { textContent: '3', classList: ['inside-bet', 'straight-up'] },
    6: { textContent: '6', classList: ['inside-bet', 'straight-up'] },
    9: { textContent: '9', classList: ['inside-bet', 'straight-up'] },
    12: { textContent: '12', classList: ['inside-bet', 'straight-up'] },
    15: { textContent: '15', classList: ['inside-bet', 'straight-up'] },
    18: { textContent: '18', classList: ['inside-bet', 'straight-up'] },
    21: { textContent: '21', classList: ['inside-bet', 'straight-up'] },
    24: { textContent: '24', classList: ['inside-bet', 'straight-up'] },
    27: { textContent: '27', classList: ['inside-bet', 'straight-up'] },
    30: { textContent: '30', classList: ['inside-bet', 'straight-up'] },
    33: { textContent: '33', classList: ['inside-bet', 'straight-up'] },
    36: { textContent: '36', classList: ['inside-bet', 'straight-up'] },
    'col3-36': { textContent: '2:1', classList: ['outside-bet', 'column', 'col-3'] },

    // 2nd column slots
    2: { textContent: '2', classList: ['inside-bet', 'straight-up'] },
    5: { textContent: '5', classList: ['inside-bet', 'straight-up'] },
    8: { textContent: '8', classList: ['inside-bet', 'straight-up'] },
    11: { textContent: '11', classList: ['inside-bet', 'straight-up'] },
    14: { textContent: '14', classList: ['inside-bet', 'straight-up'] },
    17: { textContent: '17', classList: ['inside-bet', 'straight-up'] },
    20: { textContent: '20', classList: ['inside-bet', 'straight-up'] },
    23: { textContent: '23', classList: ['inside-bet', 'straight-up'] },
    26: { textContent: '26', classList: ['inside-bet', 'straight-up'] },
    29: { textContent: '29', classList: ['inside-bet', 'straight-up'] },
    32: { textContent: '32', classList: ['inside-bet', 'straight-up'] },
    35: { textContent: '35', classList: ['inside-bet', 'straight-up'] },
    'col2-35': { textContent: '2:1', classList: ['outside-bet', 'column', 'col-2'] },

    // 1st column slots
    1: { textContent: '1', classList: ['inside-bet', 'straight-up'] },
    4: { textContent: '4', classList: ['inside-bet', 'straight-up'] },
    7: { textContent: '7', classList: ['inside-bet', 'straight-up'] },
    10: { textContent: '10', classList: ['inside-bet', 'straight-up'] },
    13: { textContent: '13', classList: ['inside-bet', 'straight-up'] },
    16: { textContent: '16', classList: ['inside-bet', 'straight-up'] },
    19: { textContent: '19', classList: ['inside-bet', 'straight-up'] },
    22: { textContent: '22', classList: ['inside-bet', 'straight-up'] },
    25: { textContent: '25', classList: ['inside-bet', 'straight-up'] },
    28: { textContent: '28', classList: ['inside-bet', 'straight-up'] },
    31: { textContent: '31', classList: ['inside-bet', 'straight-up'] },
    34: { textContent: '34', classList: ['inside-bet', 'straight-up'] },
    'col1-34': { textContent: '2:1', classList: ['outside-bet', 'column', 'col-1'] },

    // Dozens slots
    'dozen1-12': { textContent: '1st 12', classList: ['outside-bet', 'dozen', 'dozen-1'] },
    'dozen13-24': { textContent: '2nd 12', classList: ['outside-bet', 'dozen', 'dozen-2'] }, 
    'dozen25-36': { textContent: '3rd 12', classList: ['outside-bet', 'dozen', 'dozen-3'] },

    // Ranges slots
    'range1-18': { textContent: '1 - 18', classList: ['outside-bet', 'range', 'range-1'] },
    'range19-36': { textContent: '19 - 36', classList: ['outside-bet', 'range', 'range-2'] },

    // Even/Odd slots
    even: { textContent: 'Even', classList: ['outside-bet', 'even'] },
    odd: { textContent: 'Odd', classList: ['outside-bet', 'odd'] },

    // Black/Red slots
    red: { textContent: 'Red', classList: ['outside-bet', 'red'] },
    black: { textContent: 'Black', classList: ['outside-bet', 'black'] }
};

// TODO: Add values and payout odds data to slot objects in later stage

/**
 * Slot metadata object returned/yielded from the
 * resolver function for a given sequene of numbers.
 * @typedef Slot
 * @property {string} textContent 
 * @property {string[]} classList 
 */

/**
 * @param {string} textContent 
 * @param {string[]} classList
 * @returns {Slot}
 */
function createSlotDTO(textContent, classList) {
    return {
        textContent,
        classList
    };
}

/**
 * After passing initial arguments, a comparator function is returned, 
 * validating if an entry number is in a set range between a value start 
 * number and treshold of value + step, repeated n times.
 * @param {number} value Initial or start value. 
 * @param {number} step Step increase of initial value.
 * @param {number} n Step rate treshold.
 * @returns {(entry: number) => boolean}
 */
const isInColumnRange = function (value = 3, step = 3, n = 12) {
    return function (entry) {
        let i = 0;
        while (i < n) {
            if (value === entry) return true;

            i++;
            value += step;
        }

        return false;
    };
};

/**
 * @param {number | string} entry 
 * @returns {Slot}
 */
function formatData(entry) {
    let data = slotDataMap[entry];

    if (typeof entry === 'string') {
        return createSlotDTO(data.textContent, [...data.classList]);
    }

    if (entry === 0) {
        return createSlotDTO(data.textContent, [...data.classList]);
    }

    const classList = [];

    if (isInColumnRange(3)(entry)) {
        // console.log(`Number ${entry} is in col 3: ` + true);
        classList.push('col-3');
    } else if (isInColumnRange(2)(entry)) {
        // console.log(`Number ${entry} is in col 2: ` + true);
        classList.push('col-2');
    } else if (isInColumnRange(1)(entry)) {
        // console.log(`Number ${entry} is in col 1: ` + true);
        classList.push('col-1');
    }

    if (entry >= 1 && entry <= 18) {
        if (entry <= 12) {
            classList.push('doz-1');
        } else {
            classList.push('doz-2');
        }

        classList.push('rn-1');
    }

    if (entry >= 19 && entry <= 36) {
        if (entry <= 24) {
            classList.push('doz-2');
        }

        if (entry >= 25 && entry <= 36) {
            classList.push('doz-3');
        }

        classList.push('rn-2');
    }

    if (
        (entry >= 1 && entry <= 10) ||
        (entry >= 19 && entry <= 28)
    ) {
        // Ranges 1-10 and 19-28
        return entry % 2 === 0
            // Even number slots are black
            ? createSlotDTO(data.textContent, [...data.classList, 'black', 'even', `n-${entry}`, ...classList])
            // Odd number slots are red
            : createSlotDTO(data.textContent, [...data.classList, 'red', 'odd', `n-${entry}`, ...classList]);
    }

    // Ranges 11-18 and 29-36
    return entry % 2 === 0
        // Even number slots are red
        ? createSlotDTO(data.textContent, [...data.classList, 'red', 'even', `n-${entry}`, ...classList])
        // Odd number slots are black
        : createSlotDTO(data.textContent, [...data.classList, 'black', 'odd', `n-${entry}`, ...classList]);
}

export function getData() {
    return sequence.map(entry => formatData(entry));
}