/* Efeitos compartilhados do perfil (perfil.html e ver.html) */
(function () {
  const SP = /(?:open\.spotify\.com\/(?:intl-[a-z]+\/)?|^spotify:)(track|album|playlist|episode|show|artist)[\/:]([A-Za-z0-9]{10,30})/;
  const rgb = h => { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
  const hex = a => "#" + a.map(c => Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, "0")).join("");
  window.jvFx = {
    spotifyId(u) { const m = (u || "").trim().match(SP); return m ? m[1] + "/" + m[2] : ""; },
    COLORS: [["accent", "Destaques, botões e tag"], ["text", "Letras"], ["muted", "Letras secundárias"], ["bg", "Fundo da página"],
             ["panel", "Quadrado do perfil"], ["card", "Blocos internos"], ["line", "Bordas"]],
    theme(el, c) {
      c = c || {}; const s = el.style, map = { accent: "--accent", text: "--text", muted: "--muted", bg: "--bg", panel: "--panel", card: "--card", line: "--line" };
      Object.values(map).concat(["--accent2", "--on-accent"]).forEach(p => s.removeProperty(p));
      const ok = v => /^#[0-9a-f]{6}$/i.test(v || "");
      for (const k in map) if (ok(c[k])) s.setProperty(map[k], c[k]);
      if (ok(c.accent)) {
        const a = rgb(c.accent), l = (.299 * a[0] + .587 * a[1] + .114 * a[2]) / 255;
        s.setProperty("--accent2", hex(a.map(v => v * .7)));
        s.setProperty("--on-accent", l > .6 ? "#17101f" : "#ffffff");
      }
    },
    bg(url) {
      document.body.classList.toggle("pf-hasbg", !!url);
      document.body.style.setProperty("--pf-bg", url ? 'url("' + encodeURI(url) + '")' : "none");
    },
    badge(a, text, author) {
      a.hidden = !(text || author); a.textContent = ""; a.removeAttribute("href");
      if (a.hidden) return;
      if (text) a.append(text);
      if (author) {
        const b = document.createElement("b"); b.textContent = (text ? " " : "") + "@" + author; a.append(b);
        a.href = "../index.html?autor=" + encodeURIComponent(author);
        a.title = "Ver só as AUs de @" + author;
      }
    },
    spotify(box, id) {
      box.textContent = ""; box.hidden = !id;
      if (!id) return;
      const f = document.createElement("iframe");
      f.src = "https://open.spotify.com/embed/" + id; f.title = "Spotify"; f.loading = "lazy";
      f.height = /^(track|episode)/.test(id) ? 152 : 352;
      f.allow = "encrypted-media; clipboard-write; fullscreen";
      box.append(f);
    },
    userSearch(A) {
      const inp = document.getElementById("pfSearch"), box = document.getElementById("pfRes");
      if (!inp || !box) return;
      let timer, seq = 0;
      const pub = x => x ? A.client.storage.from("profile-media").getPublicUrl(x).data.publicUrl : "";
      const go = s => { location.href = "ver.html?u=" + encodeURIComponent(s); };
      const note = txt => Object.assign(document.createElement("p"), { className: "pf-snote", textContent: txt });
      inp.addEventListener("input", () => {
        inp.value = inp.value.toLowerCase().replace(/^@/, "").replace(/[^a-z0-9_]/g, "");
        clearTimeout(timer); const q = inp.value;
        if (q.length < 2) { box.hidden = true; return; }
        timer = setTimeout(async () => {
          const my = ++seq, { data, error } = await A.client.rpc("search_public_profiles", { p_q: q });
          if (my !== seq) return;
          box.textContent = "";
          if (error) box.append(note("Busca indisponível no momento."));
          else if (!data || !data.length) box.append(note("Nenhum perfil público encontrado."));
          else data.forEach(p => {
            const b = document.createElement("button"); b.type = "button"; b.className = "pf-sitem";
            const src = pub(p.avatar_path), nm = p.display_name || p.slug;
            if (src) { const im = document.createElement("img"); im.src = src; im.alt = ""; b.append(im); }
            else b.append(Object.assign(document.createElement("i"), { textContent: nm[0].toUpperCase() }));
            const s = document.createElement("span"); s.textContent = nm + " ";
            const sm = document.createElement("small"); sm.textContent = "@" + p.slug; s.append(sm); b.append(s);
            b.onclick = () => go(p.slug); box.append(b);
          });
          box.hidden = false;
        }, 250);
      });
      inp.addEventListener("keydown", e => { if (e.key === "Enter" && inp.value.length >= 3) go(inp.value); });
      document.addEventListener("click", e => { if (e.target !== inp && !box.contains(e.target)) box.hidden = true; });
    },
    about(box, img, text, src) {
      box.hidden = !(text || src); img.hidden = !src; if (src) img.src = src;
    }
  };
})();
