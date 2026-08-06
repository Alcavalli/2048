#include "grid.hpp"
#include <iostream>
#include <iomanip>
#include <string>

void showGrid(const Grid& grid)
{
    for (int i{}; i < Constants::GRID_DIM; ++i)
    {
        for (int j{}; j < Constants::GRID_DIM; ++j)
        {
            if (grid.getSquare(i, j))
                std::cout << std::setw(4) << std::to_string(grid.getSquare(i, j).value().value);
            else
                std::cout << std::setw(4) << ' ';
            std::cout << '|';
        }
        std::cout << '\n' << std::string(10, '-') << '\n';
    }
}

int main()
{
    Grid griglia;
    showGrid(griglia);

    while (true)
    {
        char c;
        std::cin >> c;
        switch (c)
        {
            case 'W':
                griglia.applyMove(Swipe::Up);
                break;
            case 'S':
                griglia.applyMove(Swipe::Down);
                break;
            case 'A':
                griglia.applyMove(Swipe::Left);
                break;
            case 'D':
                griglia.applyMove(Swipe::Right);
                break;
        }
        showGrid(griglia);
        std::cin.get();
        griglia.spawnBlock();
        showGrid(griglia);
    }

    return 0;
}