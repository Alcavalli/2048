#include "grid.hpp"
#include <utility>
#include <random>
#include <ctime>
#include <cassert>

std::mt19937 rng(time(0));

std::pair<int, int> randomEmptySquare(const std::vector<std::pair<int, int>>& empty_squares)
{
    assert(empty_squares.size() > 0);

    std::uniform_int_distribution<int> dis_sq(0, empty_squares.size());
    return empty_squares[dis_sq(rng)];
}

Grid::Grid()
{
    spawnBlock();
    spawnBlock();
}

void Grid::spawnBlock()
{
    std::pair<int, int> sq{randomEmptySquare(checkGrid())};

    std::uniform_int_distribution<int> dis_value(0, Constants::TWO_SPAWN_RATE + Constants::FOUR_SPAWN_RATE);    // 0-9
    int value{dis_value(rng) < Constants::FOUR_SPAWN_RATE ? Constants::MIN_VALUE * 2 : Constants::MIN_VALUE};

    setSquare(sq.first, sq.second, value);
}

const std::optional<Block> Grid::getSquare(int row, int col) const
{
    assert(row >= 0 && row < Constants::GRID_DIM);
    assert(col >= 0 && col < Constants::GRID_DIM);

    return grid[row][col];
}

void Grid::setSquare(int row, int col, int val)
{
    assert(row >= 0 && row < Constants::GRID_DIM);
    assert(col >= 0 && col < Constants::GRID_DIM);

    grid[row][col].emplace(val);
}

const std::vector<std::pair<int, int>> Grid::checkGrid() const
{
    std::vector<std::pair<int, int>> check_squares;
    for (int i{}; i < Constants::GRID_DIM; ++i)
        for (int j{}; j < Constants::GRID_DIM; ++j)
            if (getSquare(i, j) == std::nullopt)
                check_squares.push_back({i, j});
    return check_squares;
}

void Grid::applyMove(Swipe move)
{
    
}