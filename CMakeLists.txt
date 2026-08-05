cmake_minimum_required(VERSION 3.20)
project(game2048 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)   # utile per clangd / IntelliSense

option(BUILD_TESTS "Compila i test unitari" ON)

add_subdirectory(core)

if(BUILD_TESTS)
    enable_testing()
    add_subdirectory(tests)
endif()