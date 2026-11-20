const CACHE_NAME = "jemmaverso-app-v25";
const APP_SHELL = [
    "./index.html",
    "./sobre/sobre.html",
    "./estatisticas/stats.html",
    "./acervo-fanfics/fanfics.html",
    "./personagens/personagens.html",
    "./sorteador/sorteador.html",
    "./agradecimentos/agradecimentos.html",
    "./manifest.webmanifest",
    "./assets/css/style.css",
    "./assets/css/extras.css",
    "./assets/css/shipper.css",
    "./assets/imagens/icon.png",
    "./assets/imagens/wenclair.png",
    "./assets/imagens/fanfics-wenclair.png",
    "./compartilhados/theme.js",
    "./compartilhados/translations-extra.js",
    "./compartilhados/titulo-traducoes.js",
    "./compartilhados/i18n.js",
    "./compartilhados/common.js",
    "./compartilhados/app-install.js",
    "./compartilhados/supabase-config.js",
    "./compartilhados/supabase-sync.js",
    "./login/login.html",
    "./perfil/perfil.html",
    "./perfil/ver.html",
    "./perfil/perfil-fx.js",
    "./home/autor-url.js",
    "./assets/css/perfil.css",
    "./compartilhados/sparkles.js",
    "./home/data.js",
    "./home/storage.js",
    "./home/cards.js",
    "./home/filters.js",
    "./home/app.js",
    "./home/extras.js",
    "./estatisticas/stats.js",
    "./acervo-fanfics/fanfics-data.js",
    "./acervo-fanfics/fanfics.js",
    "./personagens/personagens.js",
    "./sorteador/ship-pool.js",
    "./sorteador/ship-random.js",
    "./sorteador/sorteador-data.js",
    "./sorteador/sorteador-localization.js",
    "./sorteador/sorteador-descriptions.js",
    "./sorteador/sorteador.js",
    "./agradecimentos/agradecimentos.js"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(async cache => {
                await Promise.all(APP_SHELL.map(async url => {
                    const response = await fetch(url, { cache: "reload" });
                    if (!response.ok) throw new Error(`Não foi possível salvar ${url} no cache.`);
                    await cache.put(url, response.clone());
                }));
            })
            .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys
                .filter(key => key.startsWith("jemmaverso-app-") && key !== CACHE_NAME)
                .map(key => caches.delete(key))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", event => {
    const request = event.request;
    if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;

    event.respondWith((async () => {
        let response;
        try {
            response = await fetch(request, { cache: "no-store" });
        } catch (error) {
            const cachedResponse = await caches.match(request);
            if (cachedResponse) return cachedResponse;
            if (request.mode === "navigate") {
                const homePage = await caches.match("./index.html");
                if (homePage) return homePage;
            }
            throw error;
        }

        if (response.ok) {
            try {
                const cache = await caches.open(CACHE_NAME);
                await cache.put(request, response.clone());
            } catch (error) {
                console.error("Não foi possível atualizar o cache offline.", error);
            }
        }
        return response;
    })());
});
