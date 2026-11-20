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
    about(box, img, text, src) {
      box.hidden = !(text || src); img.hidden = !src; if (src) img.src = src;
    }
  };
})();
