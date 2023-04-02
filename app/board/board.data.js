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

/**
 * @param {number | string} entry 
 * @returns {{ value: Slot, done: boolean }}
 */
function* resolveSlotData(entry) {
    if (typeof entry === 'string') {
       if (entry === 'col3-36') {
            yield createSlotDTO(
                '2:1',
                [ 'outside-bet', 'column', 'col-3' ]
            );
       } else if (entry === 'col2-35') {
            yield createSlotDTO(
                '2:1',
                [ 'outside-bet', 'column', 'col-2' ]
            );
       } else if (entry === 'col1-34') {
                yield createSlotDTO(
                    '2:1',
                    [ 'outside-bet', 'column', 'col-1' ]
                );
       } else if (entry === 'dozen1-12') {
                yield createSlotDTO(
                    '1st 12',
                    [ 'outside-bet', 'dozen', 'dozen-1' ]
                );
       } else if (entry === 'dozen13-24') {
                yield createSlotDTO(
                    '2nd 12',
                    [ 'outside-bet', 'dozen', 'dozen-2' ]
                );
       } else if (entry === 'dozen25-36') {
                yield createSlotDTO(
                    '3rd 12',
                    [ 'outside-bet', 'dozen', 'dozen-3' ]
                );
       } else if (entry === 'range1-18') {
                yield createSlotDTO(
                    '1 - 18',
                    [ 'outside-bet', 'range', 'range-1' ]
                );
       } else if (entry === 'even') {
                yield createSlotDTO(
                    'Even',
                    [ 'outside-bet', 'even' ]
                )
       } else if (entry === 'red') {
                yield createSlotDTO(
                    'Red',
                    [ 'outside-bet', 'red' ]
                );
       } else if (entry === 'black') {
                yield createSlotDTO(
                    'Black',
                    [ 'outside-bet', 'black' ]
                );
       } else if (entry === 'odd') {
                yield createSlotDTO(
                    'Odd',
                    [ 'outside-bet', 'odd' ]
                )
       } else {
                yield createSlotDTO(
                    '19 - 36',
                    [ 'outside-bet', 'range', 'range-2' ]
                );
       }
    } else if (entry === 0) {
        yield createSlotDTO(entry.toString(), [ 'inside-bet', 'zero', 'even', `n-${entry}` ]);
    } else if (
        (entry >= 1 && entry <= 10) || 
        (entry >= 19 && entry <= 28)
    ) {
        yield entry % 2 === 0 
            ? createSlotDTO(entry.toString(), [ 'inside-bet', 'straight-up', 'black', 'even', `n-${entry}` ]) 
            : createSlotDTO(entry.toString(), [ 'inside-bet', 'straight-up', 'red', 'odd', `n-${entry}` ]);
    } else {
        return entry % 2 === 0 
            ? createSlotDTO(entry.toString(), [ 'inside-bet', 'straight-up', 'red', 'even', `n-${entry}` ])
            : createSlotDTO(entry.toString(), [ 'inside-bet', 'straight-up', 'black', 'odd', `n-${entry}` ])
    }
}

export function getData() {
    return sequence.map(entry => {
        const { value, done } = resolveSlotData(entry).next();
        return value;
    });
}