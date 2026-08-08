#include "game.hpp"

Game::Game() : state_game{GameStatus::Menu} {}

void Game::startGame()
{
    state_game = GameStatus::InProgress;
    board = Grid{};
}

GameStatus Game::run(Swipe move)
{
    if (state_game != GameStatus::InProgress)   return state_game;
    if (board.applyMove(move))
    {
        if (board.isWin())
        {
            state_game = GameStatus::Win;
            return state_game;
        }
        board.spawnBlock();
        if (board.isLose()) state_game = GameStatus::Lose;
    }
    return state_game;
}

int Game::getScore() const { return board.getScore(); }

const bl_array& Game::getBoard() const { return board.getGrid(); }

GameStatus Game::getGameStatus() const { return state_game; }