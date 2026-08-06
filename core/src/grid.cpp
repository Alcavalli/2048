#include "grid.hpp"
#include <utility>
#include <random>
#include <ctime>
#include <cassert>

static std::mt19937 rng(std::random_device{}());

static Position randomEmptySquare(const std::vector<Position>& empty_squares)
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
    Position sq{randomEmptySquare(checkEmptySquares())};

    std::uniform_int_distribution<int> dis_value(0, Constants::TWO_SPAWN_RATE + Constants::FOUR_SPAWN_RATE);    // 0-9
    std::optional<Block> value{Block{dis_value(rng) < Constants::FOUR_SPAWN_RATE ? Constants::MIN_VALUE * 2 : Constants::MIN_VALUE}};

    setSquare(sq.row, sq.col, value);
}

std::optional<Block> Grid::getSquare(int row, int col) const
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

std::vector<Position> Grid::checkEmptySquares() const
{
    std::vector<Position> check_squares;
    for (int i{}; i < Constants::GRID_DIM; ++i)
        for (int j{}; j < Constants::GRID_DIM; ++j)
            if (getSquare(i, j) == std::nullopt)
                check_squares.push_back({i, j});
    return check_squares;
}

static void compactTiles(std::array<std::optional<Block>, Constants::GRID_DIM>& line)
{
    for (int i{}; ++i < Constants::GRID_DIM; )
    {
        if (line[i] == std::nullopt)    continue;
        for (int j{i}; j > 0; --j)
        {
            if (line[j - 1] == std::nullopt && j > 1)   continue;
            if (line[j - 1] == std::nullopt)
            {
                line[0] = line[i];
                line[i] = std::nullopt;
                break;
            }
            else
            {
                line[j] = line[i];
                if (j != i) line[i] = std::nullopt;
                break;
            }
        }
    }
}

static void mergeTiles(std::array<std::optional<Block>, Constants::GRID_DIM>& line)
{
    for (int i{}; i < Constants::GRID_DIM - 1; ++i)
    {
        if (line[i] == std::nullopt || line[i + 1] == std::nullopt) continue;
        if (line[i].value().value == line[i + 1].value().value)
        {
            line[i].value().merge();
            line[i + 1] = std::nullopt;
        }
    }
}

static void checkMove(std::array<std::optional<Block>, Constants::GRID_DIM>& line)
{
    compactTiles(line);
    mergeTiles(line);
    compactTiles(line);
}

bool Grid::applyMove(Swipe move)
{
    std::array<std::array<std::optional<Block>, Constants::GRID_DIM>, Constants::GRID_DIM> check = grid;
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
    return !(check == grid);
}