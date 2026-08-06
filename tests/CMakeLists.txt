add_executable(game2048_tests
    test_grid.cpp
)

target_link_libraries(game2048_tests PRIVATE game2048_core)

add_test(NAME game2048_tests COMMAND game2048_tests)