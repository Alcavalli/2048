# 2048

Replica del classico gioco 2048, con qualche modifica meme.

## Stack tecnico

- **Core**: C++17, compilato in WebAssembly con Emscripten
- **Frontend**: HTML / CSS / JavaScript, PWA installabile
- **Build system**: CMake + Ninja
- **CI/CD**: GitHub Actions — build automatica e deploy su GitHub Pages

## Struttura del progetto

```
2048/
├── core/              # Logica di gioco in C++
│   ├── include/
│   └── src/
├── docs/              # Servito da GitHub Pages
│   ├── assets/
│   └── wasm/          # Output build Emscripten (generato dalla CI)
├── tests/             # Test unitari del core
├── CMakeLists.txt
└── README.md
```

## Build in locale

### Build nativa (sviluppo e test)

```bash
cmake -S . -B build
cmake --build build
ctest --test-dir build --output-on-failure
```

### Build WebAssembly (richiede Emscripten SDK)

```bash
emcmake cmake -S . -B build-wasm -DBUILD_TESTS=OFF
emmake cmake --build build-wasm
```

## Funzionalità

- [ ] ...

## Stato

🚧 In sviluppo

## Licenza

MIT