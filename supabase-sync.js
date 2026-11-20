/* Sincronização opcional com Supabase.
   - Sem config válida ou sem login, o site funciona só com localStorage (como antes).
   - Com login, favoritos/status/notas/tags são copiados para a nuvem e entre aparelhos. */
(function () {
    "use strict";

    // raiz do site (este arquivo fica em /compartilhados/), usada como destino após o login
    const SITE_ROOT = document.currentScript ? new URL("../", document.currentScript.src).href : location.origin + "/";

    const cfg = window.SUPABASE_CONFIG || {};
    const configured = cfg.url && cfg.anonKey && !/COLE_/.test(cfg.url + cfg.anonKey);
    if (!configured || !window.supabase) return;

    const KEYS = ["wenclair_favorites", "wenclair_status", "wenclair_ratings", "wenclair_tags"];
    const META_KEY = "jemmaverso_sync_meta";
    const client = window.supabase.createClient(cfg.url, cfg.anonKey);

    let user = null;
    let resolveReady;
    const ready = new Promise(r => { resolveReady = r; });
    let pulling = false;
    const timers = {};
    const ui = {};

    /* ---------- utilidades ---------- */
    function readLocal(key) { try { return JSON.parse(localStorage.getItem(key)) || {}; } catch (e) { return {}; } }
    function readMeta() { try { return JSON.parse(localStorage.getItem(META_KEY)) || {}; } catch (e) { return {}; } }
    function writeMeta(m) { try { localStorage.setItem(META_KEY, JSON.stringify(m)); } catch (e) {} }

    // JSON com chaves ordenadas: o jsonb do Postgres reordena chaves, então comparar o texto cru daria falso "diferente"
    function stable(v) {
        return JSON.stringify(v, (k, val) =>
            val && typeof val === "object" && !Array.isArray(val)
                ? Object.keys(val).sort().reduce((a, k2) => (a[k2] = val[k2], a), {})
                : val);
    }

    function merge(key, remote, local) {
        if (key === "wenclair_tags") {
            const out = { ...remote };
            for (const id in local) out[id] = [...new Set([...(out[id] || []), ...local[id]])];
            return out;
        }
        return { ...remote, ...local };
    }

    /* ---------- envio ---------- */
    async function push(key, value) {
        if (!user) return;
        const { data, error } = await client
            .from("user_data")
            .upsert({ user_id: user.id, key, value }, { onConflict: "user_id,key" })
            .select("updated_at");
        if (error) { console.error("Sync (envio):", error.message); setStatus("Não foi possível salvar na nuvem."); return; }
        const meta = readMeta();
        meta.userId = user.id;
        meta.keys = meta.keys || {};
        if (data && data[0]) meta.keys[key] = data[0].updated_at;
        writeMeta(meta);
        setStatus("Sincronizado ✓");
    }

    // chamado pelo storage.js a cada saveStorage()
    window.onStorageSaved = function (key, value) {
        if (!user || !KEYS.includes(key)) return;
        clearTimeout(timers[key]);
        timers[key] = setTimeout(() => { delete timers[key]; push(key, value); }, 800);
    };

    async function flushPending() {
        const pending = Object.keys(timers);
        pending.forEach(k => clearTimeout(timers[k]));
        for (const k of pending) { delete timers[k]; await push(k, readLocal(k)); }
    }

    /* ---------- recebimento ---------- */
    async function pull() {
        if (!user || pulling) return;
        pulling = true;
        setStatus("Sincronizando…");
        try {
            const { data, error } = await client.from("user_data").select("key,value,updated_at");
            if (error) { console.error("Sync (leitura):", error.message); setStatus("Erro ao sincronizar."); return; }

            const meta = readMeta();
            const firstTime = meta.userId !== user.id;
            const newMeta = { userId: user.id, keys: firstTime ? {} : { ...(meta.keys || {}) } };
            const remoteByKey = Object.fromEntries(data.map(r => [r.key, r]));
            const toPush = [];
            let changed = false;

            for (const key of KEYS) {
                const r = remoteByKey[key];
                const local = readLocal(key);
                let result = local;

                if (!r) {
                    if (Object.keys(local).length) toPush.push(key);
                } else if (firstTime) {
                    result = merge(key, r.value, local);          // 1º login: junta nuvem + o que já existia neste aparelho
                    if (stable(result) !== stable(r.value)) toPush.push(key);
                    else newMeta.keys[key] = r.updated_at;
                } else if (r.updated_at > ((meta.keys || {})[key] || "")) {
                    result = r.value;                             // a nuvem tem algo mais novo
                    newMeta.keys[key] = r.updated_at;
                } else if (stable(local) !== stable(r.value)) {
                    toPush.push(key);                             // mudança feita offline
                }

                if (stable(result) !== stable(local)) {
                    try { localStorage.setItem(key, JSON.stringify(result)); changed = true; } catch (e) {}
                }
            }

            writeMeta(newMeta);
            for (const key of toPush) await push(key, readLocal(key));
            setStatus("Sincronizado ✓");

            if (changed && !sessionStorage.getItem("jv_sync_reloaded")) {
                sessionStorage.setItem("jv_sync_reloaded", "1");
                location.reload();                                // redesenha a tela com os dados da nuvem
            } else if (!changed) {
                sessionStorage.removeItem("jv_sync_reloaded");
            }
        } finally {
            pulling = false;
        }
    }

    /* ---------- logout ---------- */
    async function logout() {
        await flushPending();
        await client.auth.signOut();
        KEYS.forEach(k => localStorage.removeItem(k));            // aparelho compartilhado: não deixa dados para trás
        localStorage.removeItem(META_KEY);
        localStorage.removeItem("jv_profile_cache");
        location.href = SITE_ROOT + "index.html";
    }

    /* ---------- botão no topo: leva ao login ou ao perfil ---------- */
    function setStatus() {}

    function buildUI() {
        document.head.append(Object.assign(document.createElement("style"), { textContent:
            ".jv-sync-btn{display:inline-flex;align-items:center;gap:.45rem;text-decoration:none;background:var(--card,#1c1827);color:var(--text,#ece8f3);border:1px solid var(--line,#2a2538);border-radius:999px;padding:.45rem .9rem;font-size:.85rem}" +
            ".jv-sync-btn img{width:22px;height:22px;border-radius:50%;object-fit:cover}.jv-sync-btn:hover{border-color:var(--accent,#b794f6)}.jv-sync-btn.floating{position:fixed;right:14px;bottom:14px;z-index:900}" }));
        ui.btn = document.createElement("a");
        ui.btn.className = "jv-sync-btn";
        const topbar = document.querySelector(".topbar");
        if (topbar) topbar.append(ui.btn); else { ui.btn.classList.add("floating"); document.body.append(ui.btn); }
        renderUI();
    }

    const PCACHE = "jv_profile_cache";
    function cachedProfile() {
        try { const p = JSON.parse(localStorage.getItem(PCACHE)); return p && user && p.u === user.id ? p : null; } catch (e) { return null; }
    }

    function renderUI() {
        if (!ui.btn) return;
        ui.btn.textContent = "";
        ui.btn.href = SITE_ROOT + (user ? "perfil/perfil.html" : "login/login.html");
        if (!user) { ui.btn.textContent = "☁ Entrar"; return; }
        const p = cachedProfile();
        if (p && p.a) { const img = document.createElement("img"); img.src = p.a; img.alt = ""; ui.btn.append(img); }
        else ui.btn.append("👤 ");
        ui.btn.append((p && p.n) || "Perfil");
    }

    // busca nome e foto para mostrar no botão do topo
    async function loadChip() {
        if (!user || !ui.btn) return;
        const { data } = await client.from("profiles").select("display_name,avatar_path").maybeSingle();
        const a = data && data.avatar_path ? client.storage.from("profile-media").getPublicUrl(data.avatar_path).data.publicUrl : "";
        try { localStorage.setItem(PCACHE, JSON.stringify({ u: user.id, n: data ? data.display_name || "" : "", a })); } catch (e) {}
        renderUI();
    }

    window.jvAuth = { client, SITE_ROOT, ready, logout, getUser: () => user };

    /* ---------- início ---------- */
    function start() {
        if (!window.JV_NO_WIDGET) buildUI();
        // não use await de chamadas do supabase dentro deste callback (risco de travar): por isso o setTimeout
        client.auth.onAuthStateChange((event, session) => {
            user = session ? session.user : null;
            renderUI();
            resolveReady(user);
            if (user && (event === "INITIAL_SESSION" || event === "SIGNED_IN")) { setTimeout(pull, 0); setTimeout(loadChip, 0); }
        });
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
