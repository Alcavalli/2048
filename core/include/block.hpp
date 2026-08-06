#pragma once

struct Block
{
    int value{};
    void merge() { value *= 2; }
};