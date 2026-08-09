#include "game.hpp"
#include <emscripten/bind.h>
#include <string>
#include <vector>

using namespace emscripten;

static Game game{};

void startGame() { game.startGame(); }

std::string run(int m)
{
    Swipe move{Swipe::Up};
    switch (m)
    {
        //* Up=0, Down=1, Right=2, Left=3
        case 0: move = Swipe::Up;       break;
        case 1: move = Swipe::Down;     break;
        case 2: move = Swipe::Right;    break;
        case 3: move = Swipe::Left;     break;
        default:    break;
    }
    switch (game.run(move))
    {
        case GameStatus::Menu:  return "Menu";      break;
        case GameStatus::InProgress:    return "InProgress";      break;
        case GameStatus::Win:   return "Win";       break;
        case GameStatus::Lose:  return "Lose";      break;
        default:    return "Menu";
    }
}

int getScore() { return game.getScore(); }

std::string getGameStatus()
{
    switch (game.getGameStatus())
    {
        case GameStatus::Menu:  return "Menu";      break;
        case GameStatus::InProgress:    return "InProgress";      break;
        case GameStatus::Win:   return "Win";       break;
        case GameStatus::Lose:  return "Lose";      break;
        default:    return "Menu";
    }
}

std::vector<int> getBoard()
{
    bl_array copy{game.getBoard()};
    std::vector<int> one_dim;
    for (int i{}; i < Constants::GRID_DIM; ++i)
        for (int j{}; j < Constants::GRID_DIM; ++j)
        {
            if (copy[i][j] == std::nullopt)     one_dim.push_back(0);
            else    one_dim.push_back(copy[i][j]->value);
        }
    return one_dim;
}

EMSCRIPTEN_BINDINGS(module)
{
    register_vector<int>("VectorInt");

    function("startGame", &startGame);
    function("run", &run);
    function("getScore", &getScore);
    function("getGameStatus", &getGameStatus);
    function("getBoard", &getBoard);
}