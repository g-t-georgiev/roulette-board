export default function () {
    return `
    <link rel="stylesheet" href="/app/app.component.css" />

    <section id="roulette-board-app-container">
        <h2 class="notification" is="roulette-notifications">Select a chip to start betting</h2>

        <roulette-board></roulette-board>
        <roulette-user-controls></roulette-user-controls>
    <section>`;
}