import createModule from './wasm/game2048.js';

const Module = await createModule();
let sc_menu = document.getElementById("screen-menu");
let sc_game = document.getElementById("screen-game");
let sc_board = document.getElementById("board");
let sc_game_over = document.getElementById("screen-game_over");
let btn_play = document.getElementById("button-play");
let btn_play_again = document.getElementById("button-play_again");
let btn_close = document.getElementById("close-overlay");
let text_game_over = document.getElementById("text-game_over");
let blocks = document.querySelectorAll(".cell");

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
        get_run = Module.run(keyToSwipe[event.key]);
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
        if (board.get(i) !== 0)
            blocks[i].textContent = (board.get(i) === 0 ? "" : board.get(i));
}

function renderGameOver(result)
{
    if (result === "Win")
        text_game_over.textContent = "Hai vinto!";
    else
        text_game_over.textContent = "Hai perso!";
    showScreen("game_over");
}

function showScreen(id)
{
    ["menu", "game", "game_over"].forEach(x => {
        document.getElementById("screen-" + x).classList.add("hidden");
    });
    document.getElementById("screen-" + id).classList.remove("hidden");
}