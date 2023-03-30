export default function () {
    return `
        <link rel="stylesheet" href="/app/board/board.component.css" />
        <link rel="stylesheet" href="/app/board/responsive.part.css" />
        
        <section class="gameboard" id="roulette-board-area" disabled>
            <!-- 1st row -->
            <roulette-slot class="bet inside-bet zero">
                <span class="slot-txt">0</span>
            </roulette-slot>

            <roulette-slot class="bet inside-bet straight-up odd red">
                <span class="slot-txt">3</span>
            </roulette-slot>

            <roulette-slot class="bet inside-bet straight-up even black">
                <span class="slot-txt">6</span>
            </roulette-slot>

            <roulette-slot class="bet inside-bet straight-up odd red">
                <span class="slot-txt">9</span>
            </roulette-slot>

            <roulette-slot class="bet inside-bet straight-up even red">
                <span class="slot-txt">12</span>
            </roulette-slot>

            <roulette-slot class="bet inside-bet straight-up odd black">
                <span class="slot-txt">15</span>
            </roulette-slot>

            <roulette-slot class="bet inside-bet straight-up even red">
                <span class="slot-txt">18</span>
            </roulette-slot>

            <roulette-slot class="bet inside-bet straight-up odd red">
                <span class="slot-txt">21</span>
            </roulette-slot>

            <roulette-slot class="bet inside-bet straight-up even black">
                <span class="slot-txt">24</span>
            </roulette-slot>

            <roulette-slot class="bet inside-bet straight-up odd red">
                <span class="slot-txt">27</span>
            </roulette-slot>

            <roulette-slot class="bet inside-bet straight-up even red">
                <span class="slot-txt">30</span>
            </roulette-slot>

            <roulette-slot class="bet inside-bet straight-up odd black">
                <span class="slot-txt">33</span>
            </roulette-slot>

            <roulette-slot class="bet inside-bet straight-up even red">
                <span class="slot-txt">36</span>
            </roulette-slot>

            <roulette-slot class="bet outside-bet column">
                <span class="slot-txt">2:1</span>
            </roulette-slot>

            <!-- 2nd row -->
            <roulette-slot class="bet inside-bet straight-up even black">
                <span class="slot-txt">2</span>
            </roulette-slot>

            <roulette-slot class="bet inside-bet straight-up odd red">
                <span class="slot-txt">5</span>
            </roulette-slot>

            <roulette-slot class="bet inside-bet straight-up even black">
                <span class="slot-txt">8</span>
            </roulette-slot>

            <roulette-slot class="bet inside-bet straight-up odd black">
                <span class="slot-txt">11</span>
            </roulette-slot>

            <roulette-slot class="bet inside-bet straight-up even red">
                <span class="slot-txt">14</span>
            </roulette-slot>

            <roulette-slot class="bet inside-bet straight-up odd black">
                <span class="slot-txt">17</span>
            </roulette-slot>

            <roulette-slot class="bet inside-bet straight-up even black">
                <span class="slot-txt">20</span>
            </roulette-slot>

            <roulette-slot class="bet inside-bet straight-up odd red">
                <span class="slot-txt">23</span>
            </roulette-slot>

            <roulette-slot class="bet inside-bet straight-up even black">
                <span class="slot-txt">26</span>
            </roulette-slot>

            <roulette-slot class="bet inside-bet straight-up odd black">
                <span class="slot-txt">29</span>
            </roulette-slot>

            <roulette-slot class="bet inside-bet straight-up even red">
                <span class="slot-txt">32</span>
            </roulette-slot>

            <roulette-slot class="bet inside-bet straight-up odd black">
                <span class="slot-txt">35</span>
            </roulette-slot>

            <roulette-slot class="bet outside-bet column">
                <span class="slot-txt">2:1</span>
            </roulette-slot>

            <!-- 3rd row -->
            <roulette-slot class="bet inside-bet straight-up odd red">
                <span class="slot-txt">1</span>
            </roulette-slot>

            <roulette-slot class="bet inside-bet straight-up even black">
                <span class="slot-txt">4</span>
            </roulette-slot>

            <roulette-slot class="bet inside-bet straight-up odd red">
                <span class="slot-txt">7</span>
            </roulette-slot>

            <roulette-slot class="bet inside-bet straight-up even black">
                <span class="slot-txt">10</span>
            </roulette-slot>

            <roulette-slot class="bet inside-bet straight-up odd black">
                <span class="slot-txt">13</span>
            </roulette-slot>

            <roulette-slot class="bet inside-bet straight-up even red">
                <span class="slot-txt">16</span>
            </roulette-slot>

            <roulette-slot class="bet inside-bet straight-up odd red">
                <span class="slot-txt">19</span>
            </roulette-slot>

            <roulette-slot class="bet inside-bet straight-up even black">
                <span class="slot-txt">22</span>
            </roulette-slot>

            <roulette-slot class="bet inside-bet straight-up odd red">
                <span class="slot-txt">25</span>
            </roulette-slot>

            <roulette-slot class="bet inside-bet straight-up even black">
                <span class="slot-txt">28</span>
            </roulette-slot>

            <roulette-slot class="bet inside-bet straight-up odd black">
                <span class="slot-txt">31</span>
            </roulette-slot>

            <roulette-slot class="bet inside-bet straight-up even red">
                <span class="slot-txt">34</span>
            </roulette-slot>

            <roulette-slot class="bet outside-bet column">
                <span class="slot-txt">2:1</span>
            </roulette-slot>

            <!-- 4th row -->
            <roulette-slot class="bet outside-bet dozen">
                <span class="slot-txt">1st&nbsp;12</span>
            </roulette-slot>

            <roulette-slot class="bet outside-bet dozen">
                <span class="slot-txt">2nd&nbsp;12</span>
            </roulette-slot>

            <roulette-slot class="bet outside-bet dozen">
                <span class="slot-txt">3rd&nbsp;12</span>
            </roulette-slot>

            <!-- 5th row -->
            <roulette-slot class="bet outside-bet range">
                <span class="slot-txt">1&nbsp;&ndash;&nbsp;18</span>
            </roulette-slot>

            <roulette-slot class="bet outside-bet even">
                <span class="slot-txt">Even</span>
            </roulette-slot>

            <roulette-slot class="bet outside-bet red">
                <span class="slot-txt">Red</span>
            </roulette-slot>

            <roulette-slot class="bet outside-bet black">
                <span class="slot-txt">Black</span>
            </roulette-slot>

            <roulette-slot class="bet outside-bet odd">
                <span class="slot-txt">Odd</span>
            </roulette-slot>

            <roulette-slot class="bet outside-bet range">
                <span class="slot-txt">19&nbsp;&ndash;&nbsp;36</span>
            </roulette-slot>

        </section>`
}