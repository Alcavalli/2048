#pragma once

#include "grid.hpp"

class Game
{
    private:
        Grid board{};
        GameStatus state_game{GameStatus::Menu};
    public:
        Game();
        void startGame();
        GameStatus run(Swipe move);
        int getScore() const;
        const bl_array& getBoard() const;
        GameStatus getGameStatus() const;
};