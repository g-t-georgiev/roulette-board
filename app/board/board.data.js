// Ranges 1-10 and 19-28 odd numbers are red, even numbers are black;
// Ranges 11-18 and 29-36 odd numbers are black, even numbers are red;

const sequence = [
    0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 'col3-36',
    2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35, 'col2-35',
    1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34, 'col1-34',
    'dozen1-12', 'dozen13-24', 'dozen25-36',
    'range1-18', 'even', 'red', 'black', 'odd', 'range19-36'
];

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

const isInColumnRange = function (value = 3, step = 3, n = 12) {
    return function (entry) {
        for (let i = 0; i < n; i++) {
            if (entry === value) return true;

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
    if (typeof entry === 'string') {

        if (entry === 'col3-36') {
            return createSlotDTO(
                '2:1',
                ['outside-bet', 'column', 'col-3']
            );
        }

        if (entry === 'col2-35') {
            return createSlotDTO(
                '2:1',
                ['outside-bet', 'column', 'col-2']
            );
        }

        if (entry === 'col1-34') {
            return createSlotDTO(
                '2:1',
                ['outside-bet', 'column', 'col-1']
            );
        }

        if (entry === 'dozen1-12') {
            return createSlotDTO(
                '1st 12',
                ['outside-bet', 'dozen', 'dozen-1']
            );
        }

        if (entry === 'dozen13-24') {
            return createSlotDTO(
                '2nd 12',
                ['outside-bet', 'dozen', 'dozen-2']
            );
        }

        if (entry === 'dozen25-36') {
            return createSlotDTO(
                '3rd 12',
                ['outside-bet', 'dozen', 'dozen-3']
            );
        }

        if (entry === 'range1-18') {
            return createSlotDTO(
                '1 - 18',
                ['outside-bet', 'range', 'range-1']
            );
        }

        if (entry === 'even') {
            return createSlotDTO(
                'Even',
                ['outside-bet', 'even']
            )
        }

        if (entry === 'red') {
            return createSlotDTO(
                'Red',
                ['outside-bet', 'red']
            );
        }

        if (entry === 'black') {
            return createSlotDTO(
                'Black',
                ['outside-bet', 'black']
            );
        }

        if (entry === 'odd') {
            return createSlotDTO(
                'Odd',
                ['outside-bet', 'odd']
            )
        }

        if (entry === 'range19-36') {
            return createSlotDTO(
                '19 - 36',
                ['outside-bet', 'range', 'range-2']
            );
        }

    }

    if (entry === 0) {
        return createSlotDTO(entry.toString(), ['inside-bet', 'zero', 'even', `n-${entry}`]);
    }

    const classList = [];

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
        return entry % 2 === 0
            ? createSlotDTO(entry.toString(), [ 'inside-bet', 'straight-up', 'black', 'even', `n-${entry}`, ...classList ])
            : createSlotDTO(entry.toString(), [ 'inside-bet', 'straight-up', 'red', 'odd', `n-${entry}`, ...classList ]);
    }

    return entry % 2 === 0
        ? createSlotDTO(entry.toString(), ['inside-bet', 'straight-up', 'red', 'even', `n-${entry}`, ...classList ])
        : createSlotDTO(entry.toString(), ['inside-bet', 'straight-up', 'black', 'odd', `n-${entry}`, ...classList ]);
}

export function getData() {
    return sequence.map(entry => formatData(entry));
}