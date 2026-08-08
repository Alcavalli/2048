#pragma once

#include <array>
#include <optional>
#include <vector>
#include "Enums.hpp"
#include "block.hpp"
#include "Constants.hpp"

using bl_array = std::array<std::array<std::optional<Block>, Constants::GRID_DIM>, Constants::GRID_DIM>;

struct Position { int row{}, col{}; };

class Grid
{
    private:
        bl_array grid{};
        int score{};
    public:
        Grid();
        std::optional<Block> getSquare(int row, int col) const;
        void setSquare(int row, int col, std::optional<Block>);
        void spawnBlock();
        std::vector<Position> checkEmptySquares() const;
        bl_array tryMove(Swipe move, int& points) const;
        bool applyMove(Swipe move);
        int getScore() const;
        bool isWin() const;
        bool isLose() const;
        const bl_array& getGrid() const;
};