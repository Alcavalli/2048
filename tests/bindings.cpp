// esempio_bindings.cpp — SOLO esempio di sintassi, non fa parte del tuo progetto

#include <emscripten/bind.h>
#include <string>
#include <vector>

using namespace emscripten;

// Una classe C++ qualsiasi, scritta come faresti normalmente
class Counter
{
    private:
        int value{};
    public:
        Counter(int start) : value{start} {}
        void increment() { ++value; }
        int getValue() const { return value; }
        std::string label() const { return "counter"; }
};

// Un enum qualsiasi
enum class Direction { North, South, East, West };

// Una funzione libera (non un metodo di classe)
int sumTwo(int a, int b) { return a + b; }


// Questo blocco è quello che "traduce" il C++ verso JS.
// Il nome dentro le parentesi è arbitrario, un'etichetta per il modulo.
EMSCRIPTEN_BINDINGS(esempio_module)
{
    // Esporre una classe: elenchi costruttore e metodi uno per uno
    class_<Counter>("Counter")
        .constructor<int>()                          // Counter(int) diventa "new Module.Counter(5)" in JS
        .function("increment", &Counter::increment)
        .function("getValue", &Counter::getValue)
        .function("label", &Counter::label);

    // Esporre un enum: ogni valore va elencato a mano
    enum_<Direction>("Direction")
        .value("North", Direction::North)
        .value("South", Direction::South)
        .value("East", Direction::East)
        .value("West", Direction::West);

    // Esporre una funzione libera
    function("sumTwo", &sumTwo);

    // Esporre un tipo container — necessario se una tua funzione
    // ritorna/accetta std::vector<int>, altrimenti JS non sa "leggerlo"
    register_vector<int>("VectorInt");
}