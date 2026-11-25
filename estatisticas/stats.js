let likeData = null;

function paintLikes(){
    const got = document.getElementById("stLikesGot"), n = document.getElementById("stLikedN"), box = document.getElementById("stLiked");
    if (!got) return;
    if (!likeData){ box.hidden = true; return; }
    const A = window.jvAuth;
    const pub = p => A.client.storage.from("profile-media").getPublicUrl(p).data.publicUrl;
    got.textContent = likeData.received;
    n.textContent = likeData.liked.length;
    const cards = likeData.liked.map(p => {
        const raw = p.display_name || p.slug;
        const av = p.avatar_path ? `<img src="${esc(pub(p.avatar_path))}" alt="">` : `<span>${esc(raw[0].toUpperCase())}</span>`;
        return `<a href="../perfil/ver.html?u=${encodeURIComponent(p.slug)}">${av}<b>${esc(raw)}</b></a>`;
    }).join("");
    box.hidden = false;
    box.innerHTML = `<h2>✦ Perfis que curti</h2>` + (cards ? `<div class="liked-list">${cards}</div>` : `<p class="empty">${t("stats.none")}</p>`);
}
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

function countBy(list, fn){
    const map = new Map();
    list.forEach(item => { const k = fn(item); if (k) map.set(k, (map.get(k) || 0) + 1); });
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
}

function bars(rows, total){
    if (!rows.length) return `<p class="empty">${t("stats.none")}</p>`;
    const max = Math.max(...rows.map(r => r[1]), 1);
    return rows.map(([label, value, extra]) => `<div class="bar-row"><span title="${esc(label)}">${esc(label)}</span>
        <div class="bar"><i style="width:${Math.round(value / (total || max) * 100)}%"></i></div><em>${value}${extra ? " · " + extra : ""}</em></div>`).join("");
}

function render(){
    const statuses = getStatuses(), ratings = getRatings(), favorites = getFavorites();
    const readOf = au => statuses[au.id];
    const total = aus.length;
    const done = aus.filter(a => readOf(a) === "lido"), reading = aus.filter(a => readOf(a) === "lendo"), paused = aus.filter(a => readOf(a) === "pausada");
    const rated = aus.filter(a => ratings[a.id] > 0);
    const avg = rated.length ? (rated.reduce((n, a) => n + ratings[a.id], 0) / rated.length).toFixed(1) : "–";
    const authors = new Set(aus.flatMap(getAuAuthors).map(a => a.display));
    const pct = Math.round(done.length / total * 100);

    const byShip = countBy(aus, a => a.fandom).map(([ship, n]) => [ship, n, `${aus.filter(a => a.fandom === ship && readOf(a) === "lido").length} ${t("stats.readOf")}`]);
    const byStatus = countBy(aus, a => translateStatus(a.status));
    const bySize = countBy(aus, a => a.size && translateSize(a.size));
    const topAuthors = countBy(aus.flatMap(a => getAuAuthors(a)), a => a.display).slice(0, 8);
    const tagRows = TAG_KEYS.map(k => [t("tag." + k), aus.filter(a => getAuTags(a.id).includes(k)).length]).filter(r => r[1]);
    const top = rated.filter(a => ratings[a.id] >= 4).sort((a, b) => ratings[b.id] - ratings[a.id]).slice(0, 8);
    const favs = aus.filter(a => favorites[a.id]).slice(0, 8);
    const list = (items, withStars) => items.length ? `<ul class="mini-list">${items.map(a => `<li>${esc(translateTitle(a))} ${withStars ? `<span>${"★".repeat(ratings[a.id])}</span>` : ""}</li>`).join("")}</ul>` : `<p class="empty">${t("stats.none")}</p>`;

    document.getElementById("stats").innerHTML = `
    <div class="stats-grid">
        <div class="stat"><b>${total}</b><span>${t("stats.total")}</span></div>
        <div class="stat"><b>${done.length}</b><span>${t("nav.completed")}</span></div>
        <div class="stat"><b>${reading.length}</b><span>${t("nav.reading")}</span></div>
        <div class="stat"><b>${paused.length}</b><span>${t("nav.paused")}</span></div>
        <div class="stat"><b>${Object.keys(favorites).length}</b><span>${t("nav.favorites").replace("♥ ", "")}</span></div>
        <div class="stat"><b>${avg}</b><span>${t("stats.avg")}</span></div>
        <div class="stat"><b>${authors.size}</b><span>${t("stats.authors")}</span></div>
        <div class="stat"><b>${rated.length}</b><span>avaliadas</span></div>
        <div class="stat"><b id="stLikesGot">–</b><span>curtidas recebidas</span></div>
        <div class="stat"><b id="stLikedN">–</b><span>perfis curtidos</span></div>
    </div>
    <div class="panels">
        <section class="panel wide"><h2>${t("stats.progress")} · ${pct}%</h2>${bars([[t("stats.read"), done.length, ""], [t("nav.reading"), reading.length, ""], [t("nav.paused"), paused.length, ""]], total)}</section>
        <section class="panel"><h2>${t("stats.byShip")}</h2>${bars(byShip, total)}</section>
        <section class="panel"><h2>${t("stats.byStatus")}</h2>${bars(byStatus, total)}</section>
        <section class="panel"><h2>${t("stats.bySize")}</h2>${bars(bySize, total)}</section>
        <section class="panel"><h2>${t("stats.topAuthors")}</h2>${bars(topAuthors)}</section>
        <section class="panel"><h2>${t("stats.tags")}</h2>${bars(tagRows)}</section>
        <section class="panel"><h2>${t("stats.topRated")}</h2>${list(top, true)}</section>
        <section class="panel"><h2>${t("stats.favs")}</h2>${list(favs, false)}</section>
        <section class="panel wide" id="stLiked" hidden></section>
    </div>`;
}

const origRender = render;
render = function(){ origRender(); paintLikes(); };

render();
document.getElementById("languageSelector").addEventListener("change", render);

if (window.jvAuth) {
    window.jvAuth.ready.then(u => {
        if (!u) return;
        window.jvAuth.client.rpc("get_my_like_stats").then(({ data }) => {
            if (data) { likeData = data; paintLikes(); }
        });
    });
}