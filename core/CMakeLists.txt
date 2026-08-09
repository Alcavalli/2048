# Libreria con la logica di gioco — nessuna dipendenza da Emscripten qui dentro
add_library(game2048_core
    src/grid.cpp
    src/game.cpp
)

target_include_directories(game2048_core PUBLIC include)

# Questo target esiste solo quando configuri con emcmake
if(EMSCRIPTEN)
    add_executable(game2048_wasm src/bindings.cpp)   # da creare quando fai il binding JS
    target_link_libraries(game2048_wasm PRIVATE game2048_core)
    target_link_options(game2048_wasm PRIVATE
        "-sMODULARIZE=1"
        "-sEXPORT_ES6=1"
        "-sEXPORTED_RUNTIME_METHODS=[\"ccall\",\"cwrap\"]"
        "-sALLOW_MEMORY_GROWTH=1"
        "--bind"
    )
    set_target_properties(game2048_wasm PROPERTIES
        OUTPUT_NAME "game2048"
        RUNTIME_OUTPUT_DIRECTORY "${CMAKE_SOURCE_DIR}/docs/wasm"
    )
endif()