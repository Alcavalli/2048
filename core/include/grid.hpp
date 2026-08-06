#pragma once

#include <array>
#include <optional>
#include <vector>
#include "Enums.hpp"
#include "block.hpp"
#include "Constants.hpp"

struct Position { int row{}, col{}; };

class Grid
{
    private:
        std::array<std::array<std::optional<Block>, Constants::GRID_DIM>, Constants::GRID_DIM> grid{};
    public:
        Grid();
        std::optional<Block> getSquare(int row, int col) const;
        void setSquare(int row, int col, std::optional<Block>);
        void spawnBlock();
        std::vector<Position> checkEmptySquares() const;
        bool applyMove(Swipe move);
};