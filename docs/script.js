import createModule from './wasm/game2048.js';

const Module = await createModule();


// ============================================================
// DOM
// ============================================================

const sc_game_over = document.getElementById("screen-game_over");

const btn_play = document.getElementById("button-play");
const btn_play_again = document.getElementById("button-play_again");
const btn_close = document.getElementById("close-overlay");
const btn_back_menu = document.getElementById("btn-back-menu");

const text_game_over = document.getElementById("text-game_over");
const game_over_subtitle = document.getElementById("game-over-subtitle");

const gameOverVideo = document.getElementById("game-over-video");
const videoContainer = document.getElementById("video-container");

const blocks = document.querySelectorAll(".cell");
const score = document.getElementById("score");


// ============================================================
// INPUT
// ============================================================

let start_x = null;
let start_y = null;
let end_x = null;
let end_y = null;


// ============================================================
// GAME STATE
// ============================================================

let previousBoard = new Array(16).fill(0);

/*
 * Valori che sono già stati ottenuti tramite MERGE
 * durante questa partita.
 *
 * Importante:
 *
 * Se all'inizio compare una 4 casualmente,
 * "4" NON viene inserito qui.
 *
 * Quindi il primo merge che produce 4
 * può comunque essere considerato speciale.
 */
let mergedValues = new Set();


// ============================================================
// SOUND SYSTEM
// ============================================================

const SoundSystem = {

    /*
     * Quando avrai i tuoi file puoi mettere, ad esempio:
     *
     * start: "assets/start.mp3"
     * merge: "assets/merge.mp3"
     * newTile: "assets/new_tile.mp3"
     * win: "assets/win.mp3"
     * lose: "assets/lose.mp3"
     *
     * Se rimangono null, viene usato il sintetizzatore.
     */

    files: {
        start: null,
        merge: null,
        newTile: null,
        win: null,
        lose: null
    },


    audioCtx: null,


    init() {

        if (!this.audioCtx)
        {
            const AudioContext =
                window.AudioContext ||
                window.webkitAudioContext;

            if (AudioContext)
                this.audioCtx = new AudioContext();
        }


        if (
            this.audioCtx &&
            this.audioCtx.state === "suspended"
        )
        {
            this.audioCtx.resume();
        }
    },


    play(type, tileValue = 0) {

        this.init();


        /*
         * Se esiste un file personalizzato,
         * usiamo quello.
         */

        if (this.files[type])
        {
            const audio = new Audio(this.files[type]);

            audio.volume = 0.65;

            audio.play().catch(() => {});

            return;
        }


        /*
         * Fallback sintetizzato.
         */

        if (!this.audioCtx)
            return;


        const ctx = this.audioCtx;
        const now = ctx.currentTime;


        const osc = ctx.createOscillator();
        const gain = ctx.createGain();


        osc.connect(gain);
        gain.connect(ctx.destination);


        // ----------------------------------------------------
        // START
        // ----------------------------------------------------

        if (type === "start")
        {
            osc.type = "sine";

            osc.frequency.setValueAtTime(
                330,
                now
            );

            osc.frequency.exponentialRampToValueAtTime(
                660,
                now + 0.18
            );


            gain.gain.setValueAtTime(
                0.10,
                now
            );

            gain.gain.exponentialRampToValueAtTime(
                0.01,
                now + 0.23
            );


            osc.start(now);
            osc.stop(now + 0.23);
        }


        // ----------------------------------------------------
        // NORMAL MERGE
        // ----------------------------------------------------

        else if (type === "merge")
        {
            const frequency =
                220 +
                Math.min(tileValue * 4, 600);


            osc.type = "triangle";


            osc.frequency.setValueAtTime(
                frequency,
                now
            );

            osc.frequency.exponentialRampToValueAtTime(
                frequency * 1.25,
                now + 0.11
            );


            gain.gain.setValueAtTime(
                0.13,
                now
            );

            gain.gain.exponentialRampToValueAtTime(
                0.01,
                now + 0.14
            );


            osc.start(now);
            osc.stop(now + 0.14);
        }


        // ----------------------------------------------------
        // NEW VALUE
        // ----------------------------------------------------

        else if (type === "newTile")
        {
            const baseFrequency =
                360 +
                Math.min(tileValue * 3, 900);


            osc.type = "sine";


            osc.frequency.setValueAtTime(
                baseFrequency,
                now
            );

            osc.frequency.setValueAtTime(
                baseFrequency * 1.25,
                now + 0.10
            );

            osc.frequency.setValueAtTime(
                baseFrequency * 1.5,
                now + 0.20
            );


            gain.gain.setValueAtTime(
                0.18,
                now
            );

            gain.gain.exponentialRampToValueAtTime(
                0.01,
                now + 0.38
            );


            osc.start(now);
            osc.stop(now + 0.38);
        }


        // ----------------------------------------------------
        // WIN
        // ----------------------------------------------------

        else if (type === "win")
        {
            osc.type = "sine";


            osc.frequency.setValueAtTime(
                440,
                now
            );

            osc.frequency.setValueAtTime(
                554,
                now + 0.15
            );

            osc.frequency.setValueAtTime(
                659,
                now + 0.30
            );


            gain.gain.setValueAtTime(
                0.17,
                now
            );

            gain.gain.exponentialRampToValueAtTime(
                0.01,
                now + 0.55
            );


            osc.start(now);
            osc.stop(now + 0.55);
        }


        // ----------------------------------------------------
        // LOSE
        // ----------------------------------------------------

        else if (type === "lose")
        {
            osc.type = "sawtooth";


            osc.frequency.setValueAtTime(
                280,
                now
            );

            osc.frequency.exponentialRampToValueAtTime(
                110,
                now + 0.35
            );


            gain.gain.setValueAtTime(
                0.12,
                now
            );

            gain.gain.exponentialRampToValueAtTime(
                0.01,
                now + 0.40
            );


            osc.start(now);
            osc.stop(now + 0.40);
        }
    }
};


// ============================================================
// VIBRATION
// ============================================================

function vibrate(pattern)
{
    if (
        "vibrate" in navigator
    )
    {
        try
        {
            navigator.vibrate(pattern);
        }
        catch
        {
            // Alcuni browser possono rifiutare
            // la vibrazione.
        }
    }
}


// ============================================================
// BUTTON EVENTS
// ============================================================

btn_play.addEventListener("click", () => {

    SoundSystem.play("start");

    renderGame();
});


btn_play_again.addEventListener("click", () => {

    SoundSystem.play("start");

    renderGame();
});


btn_close.addEventListener("click", () => {

    renderMenu();
});


btn_back_menu.addEventListener("click", () => {

    renderMenu();
});


// ============================================================
// KEYBOARD
// ============================================================

document.addEventListener("keydown", (event) => {

    const keyToSwipe = {

        "ArrowUp": 0,
        "ArrowDown": 1,
        "ArrowRight": 2,
        "ArrowLeft": 3
    };


    if (event.key in keyToSwipe)
    {
        event.preventDefault();


        const direction =
            keyToSwipe[event.key];


        const result =
            Module.runGame(direction);


        renderBoard(direction);


        if (
            result === "Win" ||
            result === "Lose"
        )
        {
            renderGameOver(result);
        }
    }
});


// ============================================================
// TOUCH START
// ============================================================

document.addEventListener("touchstart", (event) => {

    start_x =
        event.touches[0].clientX;

    start_y =
        event.touches[0].clientY;

}, { passive: true });


// ============================================================
// TOUCH END
// ============================================================

document.addEventListener("touchend", (event) => {

    end_x =
        event.changedTouches[0].clientX;

    end_y =
        event.changedTouches[0].clientY;


    const diff_x =
        end_x - start_x;

    const diff_y =
        end_y - start_y;


    if (
        Math.abs(diff_x) <= 30 &&
        Math.abs(diff_y) <= 30
    )
    {
        return;
    }


    let direction;


    if (
        Math.abs(diff_x) >=
        Math.abs(diff_y)
    )
    {
        direction =
            diff_x > 0
                ? 2
                : 3;
    }
    else
    {
        direction =
            diff_y > 0
                ? 1
                : 0;
    }


    const result =
        Module.runGame(direction);


    renderBoard(direction);


    if (
        result === "Win" ||
        result === "Lose"
    )
    {
        renderGameOver(result);
    }

}, { passive: true });


// ============================================================
// MENU
// ============================================================

function renderMenu()
{
    showScreen("menu");


    if (gameOverVideo)
    {
        gameOverVideo.pause();
    }
}


// ============================================================
// START GAME
// ============================================================

function renderGame()
{
    showScreen("game");


    if (gameOverVideo)
    {
        gameOverVideo.pause();
    }


    Module.startGame();


    /*
     * Reset stato grafico.
     */

    previousBoard =
        new Array(16).fill(0);


    mergedValues =
        new Set();


    renderBoard(null);
}


// ============================================================
// RENDER BOARD
// ============================================================

function renderBoard(direction = null)
{
    const board =
        Module.getBoard();


    let normalMerge = false;
    let specialMerge = false;

    let specialValue = 0;


    const currentBoard =
        new Array(16);


    // ========================================================
    // LEGGO BOARD
    // ========================================================

    for (let i = 0; i < 16; i++)
    {
        const rawValue =
            board.get(i);


        currentBoard[i] =
            rawValue;
    }


    // ========================================================
    // RENDER TILE
    // ========================================================

    for (let i = 0; i < 16; i++)
    {
        const rawValue =
            currentBoard[i];


        /*
         * 64 viene mostrato come 67.
         */

        const displayValue =
            rawValue === 64
                ? 67
                : rawValue;


        const previousValue =
            previousBoard[i];


        const cell =
            blocks[i];


        // ----------------------------------------------------
        // CONTENT
        // ----------------------------------------------------

        cell.textContent =
            displayValue === 0
                ? ""
                : displayValue;


        // ----------------------------------------------------
        // CSS VALUE
        // ----------------------------------------------------

        if (displayValue > 0)
        {
            cell.dataset.value =
                displayValue;
        }
        else
        {
            delete cell.dataset.value;
        }


        // ----------------------------------------------------
        // RESET ANIMATIONS
        // ----------------------------------------------------

        cell.classList.remove(
            "slide-up",
            "slide-down",
            "slide-left",
            "slide-right",
            "merge-pop",
            "special-merge",
            "tile-spawn"
        );


        /*
         * Forza un reflow.
         * Serve per permettere di ripetere
         * la stessa animazione consecutivamente.
         */

        void cell.offsetWidth;


        // ----------------------------------------------------
        // TILE APPENA CREATA
        // ----------------------------------------------------

        if (
            rawValue !== 0 &&
            previousValue === 0
        )
        {
            cell.classList.add(
                "tile-spawn"
            );
        }


        // ----------------------------------------------------
        // SLIDE
        // ----------------------------------------------------

        if (
            direction !== null &&
            rawValue !== 0
        )
        {
            if (direction === 0)
            {
                cell.classList.add(
                    "slide-up"
                );
            }

            else if (direction === 1)
            {
                cell.classList.add(
                    "slide-down"
                );
            }

            else if (direction === 2)
            {
                cell.classList.add(
                    "slide-right"
                );
            }

            else if (direction === 3)
            {
                cell.classList.add(
                    "slide-left"
                );
            }
        }


        // ----------------------------------------------------
        // MERGE
        // ----------------------------------------------------

        /*
         * Questo è volutamente semplice perché
         * la logica del merge è nel C++.
         *
         * Se il valore attuale è il doppio del
         * precedente nella stessa posizione,
         * trattiamo la tile come merge.
         */

        if (
            previousValue > 0 &&
            rawValue === previousValue * 2
        )
        {
            /*
             * Nuovo valore mai prodotto tramite merge
             * in questa partita.
             */

            if (
                !mergedValues.has(displayValue)
            )
            {
                specialMerge = true;

                specialValue =
                    Math.max(
                        specialValue,
                        displayValue
                    );


                cell.classList.add(
                    "special-merge"
                );


                mergedValues.add(
                    displayValue
                );
            }

            else
            {
                normalMerge = true;

                cell.classList.add(
                    "merge-pop"
                );
            }
        }
    }


    // ========================================================
    // SOUND + VIBRATION
    // ========================================================

    if (specialMerge)
    {
        SoundSystem.play(
            "newTile",
            specialValue
        );


        /*
         * Pattern:
         *
         * vibra
         * pausa
         * vibra più lunga
         */

        vibrate([
            35,
            25,
            70
        ]);
    }

    else if (normalMerge)
    {
        SoundSystem.play(
            "merge"
        );


        vibrate(25);
    }

    else if (direction !== null)
    {
        /*
         * Movimento normale:
         * vibrazione appena percettibile.
         */

        vibrate(8);
    }


    // ========================================================
    // SAVE BOARD
    // ========================================================

    previousBoard =
        currentBoard;


    // ========================================================
    // SCORE
    // ========================================================

    score.textContent =
        Module.getScore()
            .toLocaleString("it-IT");
}


// ============================================================
// GAME OVER
// ============================================================

function renderGameOver(result)
{
    if (result === "Win")
    {
        text_game_over.textContent =
            "Hai vinto!";


        document
            .getElementById("game-over-subtitle")
            .textContent =
            "Hai raggiunto 2048!";


        sc_game_over.classList.remove(
            "lose"
        );

        sc_game_over.classList.add(
            "win"
        );


        SoundSystem.play("win");


        vibrate([
            50,
            40,
            80,
            40,
            130
        ]);
    }

    else
    {
        text_game_over.textContent =
            "Game Over";


        document
            .getElementById("game-over-subtitle")
            .textContent =
            "La board è piena...";


        sc_game_over.classList.remove(
            "win"
        );

        sc_game_over.classList.add(
            "lose"
        );


        SoundSystem.play("lose");


        vibrate(120);
    }


    // --------------------------------------------------------
    // VIDEO
    // --------------------------------------------------------

    /*
     * Il video verrà gestito qui quando
     * aggiungerai il file.
     */

    if (
        gameOverVideo &&
        gameOverVideo.src
    )
    {
        gameOverVideo.currentTime = 0;

        gameOverVideo
            .play()
            .catch(() => {});
    }


    sc_game_over.classList.remove(
        "hidden"
    );
}


// ============================================================
// SCREEN MANAGEMENT
// ============================================================

function showScreen(id)
{
    [
        "menu",
        "game",
        "game_over"
    ].forEach(screen => {

        const element =
            document.getElementById(
                "screen-" + screen
            );


        if (element)
        {
            element.classList.add(
                "hidden"
            );
        }
    });


    const target =
        document.getElementById(
            "screen-" + id
        );


    if (target)
    {
        target.classList.remove(
            "hidden"
        );
    }
}


// ============================================================
// INITIAL SCREEN
// ============================================================

renderMenu();