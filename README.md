# 2048

Un classico 2048 giocabile da browser, con la logica di gioco scritta in C++ e compilata in WebAssembly.

## Stack tecnico

- **Core**: C++17, compilato in WebAssembly con Emscripten
- **Frontend**: HTML / CSS / JavaScript
- **Build system**: CMake + Ninja
- **Testing**: CTest, test scritti a mano con `assert`
- **Hosting**: GitHub Pages, servito dalla cartella `docs/`

## Struttura del progetto

2048/
├── core/ # Logica di gioco in C++
│ ├── include/
│ │ ├── Block.hpp # Singolo blocco/tile della griglia
│ │ ├── Constants.hpp # Costanti di gioco (dimensione griglia, spawn rate...)
│ │ ├── Enums.hpp # GameStatus, Swipe
│ │ ├── Grid.hpp # Griglia 4x4 e meccaniche (spawn, merge, win/lose)
│ │ └── Game.hpp # Stato di gioco e API esposta al frontend
│ └── src/
├── docs/ # Servito da GitHub Pages
│ ├── assets/
│ └── wasm/ # Output della build Emscripten (compilato in locale)
├── tests/ # Test unitari del core
├── CMakeLists.txt
└── README.md


## Stato del progetto

- [x] Logica di gioco in C++ (griglia, spawn, merge, punteggio, vittoria/sconfitta)
- [x] Macchina a stati di gioco (Menu → InProgress → Win/Lose, con restart)
- [ ] Binding verso JavaScript (Embind)
- [ ] Frontend HTML/CSS/JS
- [ ] PWA installabile

🚧 In sviluppo

## Build in locale

### Build nativa (sviluppo e test)

```bash
cmake -S . -B build -G Ninja -DCMAKE_CXX_COMPILER=g++
cmake --build build
ctest --test-dir build --output-on-failure
```

### Build WebAssembly (richiede Emscripten SDK)

```bash
emcmake cmake -S . -B build-wasm -DBUILD_TESTS=OFF
emmake cmake --build build-wasm
```

L'output va in `docs/wasm/` e viene committato direttamente nel repository (nessuna build automatica in CI per questo progetto).

## Licenza

MIT