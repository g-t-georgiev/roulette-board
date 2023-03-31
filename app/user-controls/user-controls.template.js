/**
 * @param {{ chips: Array<{ id: string, value: string, selected: boolean }> }} data
 * @returns 
 */
export default function (data) {
    return `
        <link rel="stylesheet" href="/app/user-controls/user-controls.component.css" />
        <link rel="stylesheet" href="/app/user-controls/responsive.part.css" />

        <section class="user-controls">
            <button type="button" role="button" class="btn btn-undo" disabled is="roulette-undo-button">
                <img class="btn-icon" src="/assets/images/btn-undo.png" width="55" height="55" alt="btn-undo" />
            </button>

            <button type="button" role="button" class="btn btn-clear" disabled is="roulette-clear-button">
                <img class="btn-icon" src="/assets/images/btn-clear.png" width="55" height="55" alt="btn-clear" />
            </button>

            <button type="button" role="button" class="btn btn-double" disabled is="roulette-double-button">
                <img class="btn-icon" src="/assets/images/btn-x2.png" width="55" height="55" alt="btn-double" />
            </button>

            <section class="chips">
                ${
                    data.chips.map(
                        chip => {
                            return `
                            <roulette-chip data-id="${chip.id}" data-value="${chip.value}" ${chip.selected ? 'selected' : ''}></roulette-chip>`
                        }
                    )
                    .join('\n')
                }
            </section>

        </section>`;
}