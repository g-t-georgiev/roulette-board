/**
 * Slot metadata object returned/yielded from the
 * resolver function for a given sequene of numbers.
 * @typedef Slot
 * @property {string} textContent 
 * @property {string[]} classList 
 */

/**
 * @param {{ slots: Slot[] }} data 
 * @returns 
 */
export default function (data) {
    return `
        <link rel="stylesheet" href="/app/board/board.component.css" />
        <link rel="stylesheet" href="/app/board/responsive.part.css" />
        
        <section class="gameboard" id="roulette-board-area" disabled>
            ${data.slots.map(slot => {
                const { textContent, classList } = slot;
                
                return `
                <roulette-slot class="bet ${classList.join(' ')}">
                    <span class="slot-txt">${textContent}</span>
                </roulette-slot>`.trim();
            }).join('\n')}
        </section>`
}