const FAV_KEY = "jv_shipper_favs";
const coverCache = new Map();
const decks = {};
const state = { values: {}, locked: {}, chaos: false, favs: [] };

const $ = id => document.getElementById(id);
const grid = $("plotGrid");
let statusTimer;

function say(message) {
    $("status").textContent = message;
    clearTimeout(statusTimer);
    statusTimer = setTimeout(() => { $("status").textContent = ""; }, 4000);
}
function esc(v) { return String(v).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]); }
function cat(id) { return PLOT_CATEGORIES.find(c => c.id === id); }
function categoryLabel(category) { return t(`shipper.category.${category.id}`); }
function localizedValue(category, value) { return localizePlotValue(category, value); }
function categoryHint(category, value) {
    return getLanguage() === "pt"
        ? describeOption(category, value)
        : t(`shipper.hint.${category.id}`);
}

// ---------- sorteio sem repetição (baralho embaralhado por categoria) ----------
function drawFrom(id, list, current, same) {
    if (!decks[id] || !decks[id].length) {
        decks[id] = shuffle(list);
        const last = decks[id][decks[id].length - 1];
        if (current && list.length > 1 && same(last, current)) decks[id].unshift(decks[id].pop());
    }
    return decks[id].pop();
}
function rollCategory(category) {
    if (category.type === "ship") {
        state.values.ship = drawShip(state.values.ship);
        return;
    }

    if (category.type === "music") {
        const current = state.values.music;

        const song = drawFrom(
            "music",
            SONG_LIST,
            current,
            (a, b) => a[0] === b.title && a[1] === b.artist
        );

        state.values.music = {
            title: song[0],
            artist: song[1]
        };

        loadCover(state.values.music);
    } else {
        state.values[category.id] = drawFrom(
            category.id,
            category.items,
            state.values[category.id],
            (a, b) => a === b
        );
    }
}
function rollAll() {
    const forced = state.chaos ? randomFrom(CHAOS_RULES) : {};
    PLOT_CATEGORIES.forEach(category => {
        if (state.locked[category.id]) return;
        if (forced[category.id]) state.values[category.id] = forced[category.id];
        else rollCategory(category);
    });
    render();
    say(t(state.chaos ? "shipper.status.chaosRolled" : "shipper.status.rolled"));
}
function rollOne(id) { rollCategory(cat(id)); render(); }
function toggleLock(id) { state.locked[id] = !state.locked[id]; render(); }

// ---------- capa da música ----------
// JSONP: não depende de CORS, que era o que bloqueava a busca da capa.
function jsonp(url, timeout = 7000) {
    return new Promise((resolve, reject) => {
        const name = "jvcb_" + Date.now() + "_" + Math.floor(Math.random() * 1e6);
        const script = document.createElement("script");
        const finish = (value, error) => {
            clearTimeout(timer); delete window[name]; script.remove();
            error ? reject(error) : resolve(value);
        };
        const timer = setTimeout(() => finish(null, new Error("timeout")), timeout);
        window[name] = data => finish(data);
        script.onerror = () => finish(null, new Error("falhou"));
        script.src = url + (url.includes("?") ? "&" : "?") + "callback=" + name;
        document.head.appendChild(script);
    });
}
async function findCover(song) {
    const term = encodeURIComponent(`${song.title} ${song.artist}`);
    try {
        const data = await jsonp(`https://itunes.apple.com/search?entity=song&limit=1&term=${term}`);
        const art = data.results && data.results[0] && data.results[0].artworkUrl100;
        if (art) return art.replace("100x100bb", "600x600bb").replace("100x100", "600x600");
    } catch (e) {}
    try {
        const data = await jsonp(`https://api.deezer.com/search?q=${term}&limit=1&output=jsonp`);
        const album = data.data && data.data[0] && data.data[0].album;
        if (album) return album.cover_xl || album.cover_big || album.cover_medium || "";
    } catch (e) {}
    return "";
}
async function loadCover(song) {
    const key = `${song.title}|${song.artist}`;
    if (!coverCache.has(key)) coverCache.set(key, findCover(song));
    song.cover = await coverCache.get(key);
    if (state.values.music === song) render();
}
function spotifyUrl(song) {
    return "https://open.spotify.com/search/" + encodeURIComponent(`${song.title} ${song.artist}`);
}

// ---------- pôster em imagem ----------
function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
}
function loadImage(src, cors) {
    return new Promise(resolve => {
        if (!src) return resolve(null);
        const img = new Image();
        if (cors) img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src;
    });
}
function drawCover(ctx, img, x, y, w, h, r, focusTop) {
    ctx.save();
    roundRect(ctx, x, y, w, h, r); ctx.clip();
    const scale = Math.max(w / img.width, h / img.height);
    const dw = img.width * scale, dh = img.height * scale;
    ctx.drawImage(img, x + (w - dw) / 2, focusTop ? y : y + (h - dh) / 2, dw, dh);
    ctx.restore();
}
function wrapLines(ctx, text, maxWidth) {
    const lines = [];
    let line = "";
    text.split(" ").forEach(word => {
        const test = line ? line + " " + word : word;
        if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = word; } else line = test;
    });
    if (line) lines.push(line);
    return lines;
}
// Reduz a fonte até o texto caber; se nem assim couber, corta com reticências
function fitText(ctx, text, maxWidth, maxHeight, maxSize, minSize, weight, family) {
    for (let size = maxSize; size >= minSize; size -= 2) {
        ctx.font = `${weight} ${size}px ${family}`;
        const lh = Math.round(size * 1.28);
        const lines = wrapLines(ctx, text, maxWidth);
        if (lines.length * lh <= maxHeight) return { lines, size, lh };
    }
    ctx.font = `${weight} ${minSize}px ${family}`;
    const lh = Math.round(minSize * 1.28);
    const max = Math.max(1, Math.floor(maxHeight / lh));
    const lines = wrapLines(ctx, text, maxWidth).slice(0, max);
    let last = lines[max - 1] || "";
    while (last && ctx.measureText(last + "…").width > maxWidth) last = last.slice(0, -1);
    lines[lines.length - 1] = last.trimEnd() + "…";
    return { lines, size: minSize, lh };
}
function oneLine(ctx, text, maxWidth, size, weight, family) {
    let s = size;
    ctx.font = `${weight} ${s}px ${family}`;
    while (ctx.measureText(text).width > maxWidth && s > 14) { s -= 2; ctx.font = `${weight} ${s}px ${family}`; }
    let out = text;
    while (out.length > 1 && ctx.measureText(out).width > maxWidth) out = out.slice(0, -1);
    return out === text ? text : out.trimEnd() + "…";
}

async function buildPoster(values) {
    const css = getComputedStyle(document.documentElement);
    const v = name => css.getPropertyValue(name).trim();
    const color = { bg: v("--bg") || "#0f0d14", panel: v("--panel") || "#17141f", card: v("--card") || "#1c1827", line: v("--line") || "#2a2538", text: v("--text") || "#ece8f3", muted: v("--muted") || "#9a93ab", accent: v("--accent") || "#b794f6", on: v("--on-accent") || "#17101f" };
    try { await Promise.all([document.fonts.load("600 40px Cinzel"), document.fonts.load("400 24px Poppins"), document.fonts.load("600 24px Poppins")]); } catch (e) {}
    const SERIF = "Cinzel, Georgia, serif", SANS = "Poppins, system-ui, sans-serif";

    const items = PLOT_CATEGORIES.filter(c => !c.type && values[c.id]);
    const W = 1080, M = 60, GAP = 12, CELL_W = (W - 2 * M - GAP) / 2, CELL_H = 130;
    const rows = Math.ceil(items.length / 2);
    const musicTop = values.ship ? 585 : 225;
    const contentBottom = values.music
        ? musicTop + 170
        : values.ship ? 555 : 225;
    const gridTop = items.length ? Math.max(260, contentBottom + 35) : contentBottom + 85;
    const H = gridTop + rows * (CELL_H + GAP) + 110;

    const [imgA, imgB, cover] = await Promise.all([
        loadImage(values.ship && values.ship.a.img), loadImage(values.ship && values.ship.b.img),
        loadImage(values.music && values.music.cover, true)
    ]);

    const canvas = document.createElement("canvas");
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext("2d");

    // fundo
    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, color.bg); bgGrad.addColorStop(1, color.panel);
    ctx.fillStyle = bgGrad; ctx.fillRect(0, 0, W, H);
    [[W * 0.15, 120, 480], [W * 0.9, H - 200, 520]].forEach(([x, y, r]) => {
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, color.accent + "30"); g.addColorStop(1, color.accent + "00");
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    });
    ctx.strokeStyle = color.accent; ctx.globalAlpha = 0.5; ctx.lineWidth = 2;
    roundRect(ctx, 24, 24, W - 48, H - 48, 28); ctx.stroke(); ctx.globalAlpha = 1;

    // cabeçalho
    ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
    ctx.fillStyle = color.accent; ctx.font = `600 22px ${SANS}`;
    ctx.letterSpacing = "6px"; ctx.fillText(t("shipper.poster.title"), W / 2, 96); ctx.letterSpacing = "0px";
    ctx.fillStyle = color.text; ctx.font = `600 60px ${SERIF}`;
    ctx.fillText("JemmaVerso", W / 2, 168);
    ctx.fillStyle = color.accent; ctx.fillRect(W / 2 - 40, 190, 80, 3);

    // shipp
    if (values.ship) {
        const size = 250, y = 225, cx = W / 2;
        [[values.ship.a, imgA, cx - 45 - size], [values.ship.b, imgB, cx + 45]].forEach(([person, img, x]) => {
            ctx.save(); ctx.shadowColor = "rgba(0,0,0,.45)"; ctx.shadowBlur = 24; ctx.shadowOffsetY = 8;
            ctx.fillStyle = color.card; roundRect(ctx, x, y, size, size, 26); ctx.fill(); ctx.restore();
            if (img) drawCover(ctx, img, x, y, size, size, 26, true);
            ctx.strokeStyle = color.accent; ctx.lineWidth = 3; roundRect(ctx, x, y, size, size, 26); ctx.stroke();
            ctx.fillStyle = color.text; ctx.textAlign = "center";
            ctx.fillText(oneLine(ctx, person.name, size + 70, 28, 600, SERIF), x + size / 2, y + size + 44);
            ctx.fillStyle = color.muted;
            ctx.fillText(oneLine(ctx, person.source, size + 70, 17, 400, SANS), x + size / 2, y + size + 72);
        });
        ctx.fillStyle = color.accent; ctx.font = `600 50px ${SERIF}`; ctx.textAlign = "center";
        ctx.fillText("×", cx, y + size / 2 + 16);
    }

    // música
    if (values.music) {
        const x = M, y = musicTop, w = W - 2 * M, h = 170, cs = 130;
        ctx.fillStyle = color.card; roundRect(ctx, x, y, w, h, 22); ctx.fill();
        ctx.strokeStyle = color.line; ctx.lineWidth = 2; roundRect(ctx, x, y, w, h, 22); ctx.stroke();
        const cx = x + 20, cy = y + 20;
        if (cover) drawCover(ctx, cover, cx, cy, cs, cs, 14);
        else {
            ctx.fillStyle = color.panel; roundRect(ctx, cx, cy, cs, cs, 14); ctx.fill();
            ctx.fillStyle = color.accent; ctx.font = `400 64px ${SANS}`; ctx.textAlign = "center"; ctx.fillText("♪", cx + cs / 2, cy + cs / 2 + 22);
        }
        const tx = cx + cs + 26, tw = w - (tx - x) - 24;
        ctx.textAlign = "left"; ctx.fillStyle = color.accent; ctx.font = `600 17px ${SANS}`;
        ctx.letterSpacing = "3px"; ctx.fillText(t("shipper.poster.music"), tx, y + 52); ctx.letterSpacing = "0px";
        ctx.fillStyle = color.text; ctx.fillText(oneLine(ctx, values.music.title, tw, 38, 600, SERIF), tx, y + 100);
        ctx.fillStyle = color.muted; ctx.fillText(oneLine(ctx, values.music.artist, tw, 26, 400, SANS), tx, y + 138);
    }

    // grade de categorias
    items.forEach((category, i) => {
        const x = M + (i % 2) * (CELL_W + GAP), y = gridTop + Math.floor(i / 2) * (CELL_H + GAP);
        ctx.fillStyle = color.card; roundRect(ctx, x, y, CELL_W, CELL_H, 18); ctx.fill();
        ctx.strokeStyle = color.line; ctx.lineWidth = 2; roundRect(ctx, x, y, CELL_W, CELL_H, 18); ctx.stroke();
        ctx.textAlign = "left"; ctx.fillStyle = color.accent; ctx.font = `600 15px ${SANS}`;
        ctx.letterSpacing = "2px"; ctx.fillText(categoryLabel(category).toUpperCase(), x + 22, y + 32); ctx.letterSpacing = "0px";
        const fit = fitText(ctx, String(localizedValue(category, values[category.id])), CELL_W - 44, CELL_H - 58, 28, 17, 400, SANS);
        ctx.fillStyle = color.text; ctx.font = `400 ${fit.size}px ${SANS}`;
        fit.lines.forEach((line, n) => ctx.fillText(line, x + 22, y + 62 + fit.size * 0.9 + n * fit.lh - fit.size * 0.9 + 4));
    });

    ctx.textAlign = "center"; ctx.fillStyle = color.muted; ctx.font = `400 20px ${SANS}`;
    ctx.fillText(t("shipper.poster.footer"), W / 2, H - 56);
    return canvas;
}

// ---------- janela da imagem ----------
const imageDialog = $("imageDialog");
const posterOptionsDialog = $("posterOptionsDialog");
const posterOptions = $("posterOptions");
let posterBlob = null, posterName = "plot-jemmaverso.png";
let posterSourceValues = null;

function posterOptionSummary(category, value) {
    if (category.type === "ship") return `${value.a.name} × ${value.b.name}`;
    if (category.type === "music") return `${value.title} — ${value.artist}`;
    return localizedValue(category, value);
}
function renderPosterOptions() {
    const previouslySelected = new Set(
        [...posterOptions.querySelectorAll("input:checked")].map(input => input.dataset.category)
    );
    const hasExistingOptions = posterOptions.childElementCount > 0;
    const categories = PLOT_CATEGORIES.filter(category => posterSourceValues && posterSourceValues[category.id]);
    posterOptions.innerHTML = categories.map(category => {
        const checked = !hasExistingOptions || previouslySelected.has(category.id);
        return `<label class="poster-option">
            <input type="checkbox" data-category="${esc(category.id)}" ${checked ? "checked" : ""}>
            <span class="poster-option-copy">
                <strong>${esc(categoryLabel(category))}</strong>
                <small>${esc(posterOptionSummary(category, posterSourceValues[category.id]))}</small>
            </span>
        </label>`;
    }).join("");
    updatePosterOptionsControls();
}
function updatePosterOptionsControls() {
    $("generatePoster").disabled = posterOptions.querySelectorAll("input:checked").length === 0;
}
function openPosterOptions(values) {
    posterSourceValues = JSON.parse(JSON.stringify(values));
    posterOptions.innerHTML = "";
    renderPosterOptions();
    if (typeof posterOptionsDialog.showModal === "function") posterOptionsDialog.showModal();
    else posterOptionsDialog.setAttribute("open", "");
}
function generateSelectedPoster() {
    const selectedIds = [...posterOptions.querySelectorAll("input:checked")].map(input => input.dataset.category);
    if (!selectedIds.length) return;
    const selectedValues = Object.fromEntries(selectedIds.map(id => [id, posterSourceValues[id]]));
    posterOptionsDialog.close();
    showPoster(selectedValues);
}

function canvasToBlob(canvas) {
    return new Promise((resolve, reject) => {
        try { canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error("vazio")), "image/png"); }
        catch (e) { reject(e); }
    });
}
async function showPoster(values) {
    say(t("shipper.status.generatingImage"));
    try {
        if (values.music && !values.music.cover) {
            const key = `${values.music.title}|${values.music.artist}`;
            if (coverCache.has(key)) values.music.cover = await coverCache.get(key);
        }
        const canvas = await buildPoster(values);
        posterBlob = await canvasToBlob(canvas);
    } catch (e) {
        say(t("shipper.status.imageFailed"));
        return;
    }
    const url = URL.createObjectURL(posterBlob);
    const old = $("posterPreview").src;
    $("posterPreview").src = url;
    if (old && old.startsWith("blob:")) URL.revokeObjectURL(old);
    const ship = values.ship ? `${values.ship.a.id}-${values.ship.b.id}` : "plot";
    posterName = `plot-jemmaverso-${ship}.png`;
    $("downloadPoster").href = url; $("downloadPoster").download = posterName;
    const file = new File([posterBlob], posterName, { type: "image/png" });
    $("sharePoster").hidden = !(navigator.canShare && navigator.canShare({ files: [file] }));
    $("copyPoster").hidden = !(navigator.clipboard && window.ClipboardItem);
    say("");
    if (typeof imageDialog.showModal === "function") { if (!imageDialog.open) imageDialog.showModal(); } else imageDialog.setAttribute("open", "");
}
$("sharePoster").addEventListener("click", async () => {
    try { await navigator.share({ files: [new File([posterBlob], posterName, { type: "image/png" })], title: t("shipper.share.title") }); } catch (e) {}
});
$("copyPoster").addEventListener("click", async () => {
    try { await navigator.clipboard.write([new ClipboardItem({ "image/png": posterBlob })]); say(t("shipper.status.imageCopied")); }
    catch (e) { say(t("shipper.status.copyFailed")); }
});
$("closePoster").addEventListener("click", () => imageDialog.close());
imageDialog.addEventListener("click", event => { if (event.target === imageDialog) imageDialog.close(); });
$("cancelPosterOptions").addEventListener("click", () => posterOptionsDialog.close());
$("generatePoster").addEventListener("click", generateSelectedPoster);
$("selectAllPosterOptions").addEventListener("click", () => {
    posterOptions.querySelectorAll("input").forEach(input => { input.checked = true; });
    updatePosterOptionsControls();
});
$("clearPosterOptions").addEventListener("click", () => {
    posterOptions.querySelectorAll("input").forEach(input => { input.checked = false; });
    updatePosterOptionsControls();
});
posterOptions.addEventListener("change", updatePosterOptionsControls);
posterOptionsDialog.addEventListener("click", event => {
    if (event.target === posterOptionsDialog) posterOptionsDialog.close();
});

// ---------- favoritos (valem durante a sessão da aba) ----------
const plotKey = values => PLOT_CATEGORIES.map(c => JSON.stringify(values[c.id] && (c.type === "ship" ? [values.ship.a.id, values.ship.b.id] : c.type === "music" ? [values.music.title, values.music.artist] : values[c.id]))).join("|");
function loadFavs() { try { state.favs = JSON.parse(sessionStorage.getItem(FAV_KEY)) || []; } catch (e) { state.favs = []; } }
function persistFavs() { try { sessionStorage.setItem(FAV_KEY, JSON.stringify(state.favs)); } catch (e) {} }
function saveFav() {
    const snapshot = JSON.parse(JSON.stringify(state.values));
    if (state.favs.some(f => plotKey(f.values) === plotKey(snapshot))) { say(t("shipper.status.duplicateFavorite")); return; }
    state.favs.unshift({ id: Date.now(), values: snapshot });
    persistFavs(); renderFavs(); say(t("shipper.status.savedFavorite"));
}
function renderFavs() {
    $("favCount").textContent = state.favs.length;
    $("favEmpty").hidden = state.favs.length > 0;
    $("favList").innerHTML = state.favs.map(fav => {
        const val = fav.values;
        const ship = val.ship ? `${esc(val.ship.a.name)} × ${esc(val.ship.b.name)}` : esc(t("shipper.favorites.plot"));
        const summary = ["relationship", "setting", "tone", "ending"].map(id => {
            const category = cat(id);
            return val[id] && localizedValue(category, val[id]);
        }).filter(Boolean).map(esc).join(" · ");
        return `<article class="fav-card" data-id="${fav.id}">
            <div><h3>${ship}</h3><p>${summary}</p>${val.music ? `<p class="fav-song">♪ ${esc(val.music.title)} — ${esc(val.music.artist)}</p>` : ""}</div>
            <div class="fav-buttons">
                <button class="btn ghost" data-act="image" type="button">${esc(t("shipper.favorites.image"))}</button>
                <button class="btn ghost" data-act="remove" type="button" aria-label="${esc(t("shipper.favorites.remove"))}" title="${esc(t("shipper.favorites.remove"))}">✕</button>
            </div></article>`;
    }).join("");
}
$("favList").addEventListener("click", event => {
    const button = event.target.closest("button[data-act]");
    if (!button) return;
    const id = Number(button.closest(".fav-card").dataset.id);
    const fav = state.favs.find(f => f.id === id);
    if (button.dataset.act === "remove") { state.favs = state.favs.filter(f => f.id !== id); persistFavs(); renderFavs(); }
    else if (fav) openPosterOptions(fav.values);
});

// ---------- tela ----------
function cardBody(category, value) {
    const localizedValue = localizePlotValue(category, value);
    if (category.type === "ship") {
        const person = c => `<span class="ship-person"><img src="${esc(c.img)}" alt="${esc(c.name)}"><b>${esc(c.name)}</b><small>${esc(c.source)}</small></span>`;
        return `<div class="ship-pair">${person(value.a)}<span class="ship-x" aria-hidden="true">×</span>${person(value.b)}</div>`;
    }
    if (category.type === "music") {
        const cover = value.cover
            ? `<img class="song-cover" src="${esc(value.cover)}" alt="${esc(t("shipper.music.cover").replace("{title}", value.title))}">`
            : `<span class="song-cover song-cover-empty" aria-hidden="true">♪</span>`;
        return `<div class="song">${cover}<div><b>${esc(value.title)}</b><span>${esc(value.artist)}</span>
            <a class="btn ghost song-link" href="${spotifyUrl(value)}" target="_blank" rel="noopener noreferrer">${esc(t("shipper.music.listen"))}</a></div></div>
            <small class="song-note">${esc(t("shipper.music.note"))}</small>`;
    }
    const description = categoryHint(category, value);

return `
    <div class="plot-result">
        <p class="plot-value">${esc(localizedValue)}</p>
        ${description ? `<p class="plot-description">${esc(description)}</p>` : ""}
    </div>
`;
}
function getVisibleCategories() {
    return PLOT_CATEGORIES;
}
function render() {
    grid.innerHTML = getVisibleCategories().map(category => {
        const value = state.values[category.id];
        const locked = !!state.locked[category.id];
        const label = categoryLabel(category);
        const lockLabel = t(locked ? "shipper.action.unlock" : "shipper.action.lock").replace("{category}", label);
        const rollLabel = t("shipper.action.rollOne");
        return `<article class="plot-card${locked ? " locked" : ""}${category.type ? " wide" : ""}" data-cat="${category.id}">
                <header><h2>${category.icon} ${esc(label)}</h2>
            <span class="plot-card-buttons">
                    <button type="button" data-act="roll" title="${esc(rollLabel)}" aria-label="${esc(rollLabel)}: ${esc(label)}">⚄</button>
                    <button type="button" data-act="lock" aria-pressed="${locked}" title="${esc(lockLabel)}" aria-label="${esc(lockLabel)}">${locked ? "◆" : "◇"}</button>
            </span></header>
            ${value ? cardBody(category, value) : ""}</article>`;
    }).join("");
}
grid.addEventListener("click", event => {
    const button = event.target.closest("button[data-act]");
    if (!button) return;
    const id = button.closest(".plot-card").dataset.cat;
    if (button.dataset.act === "roll") rollOne(id); else toggleLock(id);
});

$("rollAll").addEventListener("click", rollAll);
$("makeImage").addEventListener("click", () => openPosterOptions(state.values));
$("saveFav").addEventListener("click", saveFav);
$("unlockAll").addEventListener("click", () => { state.locked = {}; render(); say(t("shipper.status.unlockedAll")); });
$("chaosBtn").addEventListener("click", () => {
    state.chaos = !state.chaos;
    $("chaosBtn").setAttribute("aria-pressed", String(state.chaos));
    $("chaosBtn").classList.toggle("on", state.chaos);
    say(t(state.chaos ? "shipper.status.chaosOn" : "shipper.status.chaosOff"));
});

// ---------- início ----------
loadFavs();
renderFavs();
const fromCharacters = findShipFromParam(new URLSearchParams(location.search).get("ship"));
if (fromCharacters) {
    state.values.ship = fromCharacters;
    state.locked.ship = true;
    rollAll();
    say(t("shipper.status.shipLocked"));
} else {
    rollAll();
}
document.querySelectorAll("#languageSelector").forEach(select => {
    select.addEventListener("change", () => {
        render();
        renderFavs();
        if (posterOptionsDialog.open) renderPosterOptions();
    });
});
