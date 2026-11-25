/* Carrega as AUs cadastradas pelo painel admin (tabela admin_aus) e junta às AUs do data.js. Falha em silêncio se estiver offline. */
window.jvAdminAus = {
    toAu(r) {
        const handles = String(r.authors).split(/\s+e\s+/i).map(h => h.trim().replace(/^@/, "")).filter(Boolean);
        const m = String(r.url).match(/status\/(\d+)/);
        const au = {
            id: r.id, title: r.title,
            author: { name: handles.join(" e "), display: handles.map(h => "@" + h).join(" e ") },
            fandom: r.fandom, status: r.status, size: r.size, cover: "", description: r.description || "",
            tags: (r.tags && r.tags.length) ? r.tags : [r.size], tweet: m ? m[1] : "", url: r.url
        };
        if (r.read_url) { au.readUrl = r.read_url; }
        if (r.series) { au.series = r.series; au.seriesOrder = r.series_order || 1; }
        return au;
    },
    async load() {
        const A = window.jvAuth;
        if (!A || !A.client) return [];
        const { data, error } = await A.client.from("admin_aus").select("*").order("id");
        if (error || !data) return [];
        return data.map(this.toAu);
    }
};
(async function () {
    if (typeof aus === "undefined" || typeof filterAus !== "function") return;
    try {
        const extra = (await jvAdminAus.load()).filter(a => !aus.some(x => x.id === a.id));
        if (!extra.length) return;
        aus.push(...extra);
        // fandoms novas entram no filtro
        const sel = document.getElementById("fandom");
        if (sel) {
            const have = new Set([...sel.options].map(o => o.value));
            [...new Set(extra.map(a => a.fandom))].filter(f => !have.has(f)).forEach(f => sel.append(new Option(f, f)));
        }
        filterAus();
    } catch (e) { console.warn("AUs do admin indisponíveis", e); }
})();

// Link do painel: só aparece para a administradora
(async function () {
    try {
        const A = window.jvAuth; if (!A) return;
        const user = await A.ready; if (!user) return;
        const { data } = await A.client.rpc("is_site_admin");
        const box = document.querySelector(".sidebar-links");
        if (data && box) { const a = document.createElement("a"); a.className = "archive-link"; a.href = "admin/admin.html"; a.textContent = "✦ Painel admin"; box.append(a); }
    } catch (e) {}
})();
