#pragma once

#include "Enums.hpp"
#include "block.hpp"
#include <array>
#include <optional>
#include <vector>

class Grid
{
    private:
        std::array<std::array<std::optional<Block>, Constants::GRID_DIM>, Constants::GRID_DIM> grid{std::nullopt};
    public:
        Grid();
        const std::optional<Block> getSquare(int row, int col) const;
        void setSquare(int row, int col, std::optional<Block>);
        void spawnBlock();
        const std::vector<std::pair<int, int>> checkGrid() const;
        void applyMove(Swipe move);
};