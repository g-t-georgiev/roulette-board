/**
 * @param {{ id: string, value: string }} data 
 * @returns 
 */
export default function ({ id, value }) {
    return `
        <link rel="stylesheet" href="/app/user-controls/chip/chip.component.css" />

        <div class="chip">
            <img class="chip-img" src="/assets/images/chip-background-${id}.png" alt="chip-background-${id}" />
            <span class="chip-txt">${value}</span>
        </div>`;
}