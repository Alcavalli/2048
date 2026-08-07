#pragma once

struct Block
{
    int value{};
    void merge() { value *= 2; }
    bool operator==(const Block& other) const { return value == other.value; }
};