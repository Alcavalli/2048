// Incrementa questo numero ogni volta che rilasci una nuova versione
// del gioco: forza i client a scaricare i file aggiornati invece di
// restare bloccati sulla cache vecchia.
const CACHE_NAME = "game2048-v1";

const ASSETS_TO_CACHE = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json",
    "./wasm/game2048.js",
    "./wasm/game2048.wasm",
    "./assets/icons/icon-192.png",
    "./assets/icons/icon-512.png",
    "./assets/icons/icon-512-maskable.png"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
    );
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            )
        )
    );
    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    // Non intercettare richieste diverse da GET (non ne hai, ma è corretto
    // ignorarle: la cache non sa gestire POST/PUT/ecc.)
    if (event.request.method !== "GET") return;

    event.respondWith(
        caches.match(event.request).then((cached) => {
            if (cached) return cached;

            return fetch(event.request)
                .then((response) => {
                    // Metti in cache anche le nuove richieste dello stesso
                    // dominio, così la seconda visita offline le trova già.
                    if (response.ok && event.request.url.startsWith(self.location.origin))
                    {
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
                    }
                    return response;
                })
                .catch(() => cached);
        })
    );
});
