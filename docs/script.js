import createModule from './wasm/game2048.js';

const Module = await createModule();
let sc_game_over = document.getElementById("screen-game_over");
let btn_play = document.getElementById("button-play");
let btn_play_again = document.getElementById("button-play_again");
let btn_close = document.getElementById("close-overlay");
let text_game_over = document.getElementById("text-game_over");
let blocks = document.querySelectorAll(".cell");
let score = document.getElementById("score");
let start_x = null, start_y = null, end_x = null, end_y = null;

{
    btn_play.addEventListener("click", () => { renderGame(); });
    btn_play_again.addEventListener("click", () => { renderGame(); });
    btn_close.addEventListener("click", () => { renderMenu(); });
    renderMenu();
    document.addEventListener("keydown", (event) => {
        const keyToSwipe = {
            "ArrowUp": 0,
            "ArrowDown": 1,
            "ArrowRight": 2,
            "ArrowLeft": 3
        };

        let get_run = "";
        if (event.key in keyToSwipe)
        {
            event.preventDefault();
            get_run = Module.runGame(keyToSwipe[event.key]);
            renderBoard();
            if (get_run === "Win" || get_run === "Lose")    renderGameOver(get_run);
        }
    });
    document.addEventListener("touchstart", (event) => {
        start_x = event.touches[0].clientX;
        start_y = event.touches[0].clientY;
    });
    document.addEventListener("touchend", (event) => {
        end_x = event.changedTouches[0].clientX;
        end_y = event.changedTouches[0].clientY;
        let i = null;
        let get_run = "";
        let diff_x = end_x - start_x;
        let diff_y = end_y - start_y;

        if (Math.abs(diff_x) > 30 || Math.abs(diff_y) > 30)
        {
            if (Math.abs(diff_x) >= Math.abs(diff_y))   //* se dovessero essere uguali si agevola l'asse X
            {
                if (diff_x > 0)     i = 2;
                else    i = 3;
            }
            else
            {
                if (diff_y > 0)     i = 1;
                else    i = 0;
            }

            get_run = Module.runGame(i);
            renderBoard();
            if (get_run === "Win" || get_run === "Lose")    renderGameOver(get_run);
        }
    });
}

function renderMenu()
{
    showScreen("menu");
}

function renderGame()
{
    showScreen("game");
    Module.startGame();
    renderBoard();
}

function renderBoard()
{
    let board = Module.getBoard();
    for (let i = 0; i < 16; i++)
    {
        blocks[i].textContent = (board.get(i) === 0 ? "" : board.get(i));
        if (board.get(i) === 64)    blocks[i].textContent = 67;
    }
    score.textContent = "Score: " + Module.getScore();
}

function renderGameOver(result)
{
    if (result === "Win")
        text_game_over.textContent = "Hai vinto!";
    else
        text_game_over.textContent = "Hai perso!";
    document.getElementById("screen-game_over").classList.remove("hidden");
}

function showScreen(id)
{
    ["menu", "game", "game_over"].forEach(x => {
        document.getElementById("screen-" + x).classList.add("hidden");
    });
    document.getElementById("screen-" + id).classList.remove("hidden");
}