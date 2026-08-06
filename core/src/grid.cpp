#include "grid.hpp"
#include <utility>
#include <random>
#include <ctime>
#include <cassert>

std::mt19937 rng(time(0));

std::pair<int, int> randomEmptySquare(const std::vector<std::pair<int, int>>& empty_squares)
{
    assert(empty_squares.size() > 0);

    std::uniform_int_distribution<int> dis_sq(0, empty_squares.size() - 1);
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
    std::optional<Block> value{Block{dis_value(rng) < Constants::FOUR_SPAWN_RATE ? Constants::MIN_VALUE * 2 : Constants::MIN_VALUE}};

    setSquare(sq.first, sq.second, value);
}

const std::optional<Block> Grid::getSquare(int row, int col) const
{
    assert(row >= 0 && row < Constants::GRID_DIM);
    assert(col >= 0 && col < Constants::GRID_DIM);

    return grid[row][col];
}

void Grid::setSquare(int row, int col, std::optional<Block> val)
{
    assert(row >= 0 && row < Constants::GRID_DIM);
    assert(col >= 0 && col < Constants::GRID_DIM);

    grid[row][col] = val;
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

void checkMove(std::array<std::optional<Block>, Constants::GRID_DIM>& array)
{
    for (int i{}; ++i < Constants::GRID_DIM; )
    {
        bool check{false};
        if (array[i] == std::nullopt)   continue;
        for (int j{i}; j > 0; --j)
        {
            if (array[j - 1] == std::nullopt && j > 1)  continue;
            if (array[j - 1] == std::nullopt)
            {
                array[0] = array[i];
                check = true;
                break;
            }
            else if (array[j - 1].value().value == array[i].value().value)
            {
                array[j - 1].value().value *= 2;
                check = true;
                break;
            }
            else
            {
                array[j] = array[i];
                check = (j != i);
                break;
            }
        }
        if (check)
            array[i] = std::nullopt;
    }
}

void Grid::applyMove(Swipe move)
{
    switch(move)
    {
        case Swipe::Up:
        {
            for (int j{}; j < Constants::GRID_DIM; ++j)
            {
                std::array<std::optional<Block>, Constants::GRID_DIM> temp;
                for (int i{}; i < Constants::GRID_DIM; ++i)
                    temp[i] = getSquare(i, j);
                checkMove(temp);
                for (int i{}; i < Constants::GRID_DIM; ++i)
                    setSquare(i, j, temp[i]);
            }
            break;
        }

        case Swipe::Down:
        {
            for (int j{}; j < Constants::GRID_DIM; ++j)
            {
                std::array<std::optional<Block>, Constants::GRID_DIM> temp;
                for (int i{}; i < Constants::GRID_DIM; ++i)
                    temp[i] = getSquare(Constants::GRID_DIM - 1 - i, j);
                checkMove(temp);
                for (int i{}; i < Constants::GRID_DIM; ++i)
                    setSquare(Constants::GRID_DIM - 1 - i, j, temp[i]);
            }
            break;
        }

        case Swipe::Right:
        {
            for (int i{}; i < Constants::GRID_DIM; ++i)
            {
                std::array<std::optional<Block>, Constants::GRID_DIM> temp;
                for (int j{}; j < Constants::GRID_DIM; ++j)
                    temp[j] = getSquare(i, Constants::GRID_DIM - 1 - j);
                checkMove(temp);
                for (int j{}; j < Constants::GRID_DIM; ++j)
                    setSquare(i, Constants::GRID_DIM - 1 - j, temp[j]);
            }
            break;
        }

        case Swipe::Left:
        {
            for (int i{}; i < Constants::GRID_DIM; ++i)
            {
                std::array<std::optional<Block>, Constants::GRID_DIM> temp;
                for (int j{}; j < Constants::GRID_DIM; ++j)
                    temp[j] = getSquare(i, j);
                checkMove(temp);
                for (int j{}; j < Constants::GRID_DIM; ++j)
                    setSquare(i, j, temp[j]);
            }
            break;
        }

        default:
            assert(false);
    }
}