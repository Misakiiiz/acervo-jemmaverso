(async function () {
  const $ = id => document.getElementById(id);
  const el = (tag, props, kids) => { const n = Object.assign(document.createElement(tag), props || {}); (kids || []).forEach(k => n.append(k)); return n; };
  const A = window.jvAuth, gate = $("gate");
  if (!A) { gate.textContent = "Supabase indisponível."; return; }
  const user = await A.ready;
  if (!user) { gate.textContent = ""; gate.append("Entre na sua conta para continuar: ", el("a", { href: "../login/login.html", textContent: "fazer login" })); return; }
  const { data: isAdmin } = await A.client.rpc("is_site_admin");
  if (!isAdmin) { gate.textContent = "Esta conta não é a administradora do site."; return; }
  gate.hidden = true; $("app").hidden = false; $("who").textContent = user.email || "";

  const BASE = (typeof aus !== "undefined") ? aus : [];
  const uniq = k => [...new Set(BASE.map(a => a[k]).filter(Boolean))];
  const STATUS = [...new Set(["Concluída", "Em andamento", "Não informado"].concat(uniq("status")))];
  const SIZES = [...new Set(["Short", "Long", "One-shot", "Indefinido"].concat(uniq("size")))];
  const FANDOMS = uniq("fandom").sort();
  const fill = (sel, list) => list.forEach(v => sel.append(new Option(v, v)));
  fill($("f_status"), STATUS); fill($("f_size"), SIZES); FANDOMS.forEach(f => $("fandoms").append(new Option(f, f)));

  let mine = [], editing = null;
  const say = (t, kind) => { const m = $("msg"); m.hidden = !t; m.textContent = t || ""; m.className = "msg " + (kind || ""); };
  const tweetId = u => (String(u).match(/status\/(\d+)/) || [])[1];
  const handleOf = u => (String(u).match(/(?:x|twitter)\.com\/([A-Za-z0-9_]+)\/status/i) || [])[1];
  const known = id => id && (BASE.some(a => String(a.tweet) === id) || mine.some(a => tweetId(a.url) === id && a.id !== editing));

  document.querySelectorAll(".tabs button").forEach(b => b.onclick = () => {
    document.querySelectorAll(".tabs button").forEach(x => x.classList.toggle("on", x === b));
    ["one", "bulk", "list"].forEach(t => $("tab-" + t).hidden = t !== b.dataset.tab); say("");
  });

  async function reload() {
    const { data, error } = await A.client.from("admin_aus").select("*").order("id", { ascending: false });
    if (error) return say("Erro ao carregar: " + error.message + " (rodou o admin-aus.sql?)", "err");
    mine = data; $("count").textContent = mine.length;
    const tb = $("rows"); tb.textContent = "";
    mine.forEach(r => tb.append(el("tr", {}, [el("td", { textContent: r.id }), el("td", { textContent: r.title }), el("td", { textContent: r.authors }), el("td", { textContent: r.fandom }),
      el("td", {}, [el("button", { className: "btn", textContent: "Editar", onclick: () => edit(r) }), " ", el("button", { className: "btn red", textContent: "Excluir", onclick: () => del(r) })])])));
  }

  // ---- uma AU ----
  const F = ["url", "title", "authors", "fandom", "status", "size", "desc", "tags", "read", "series", "order"];
  const clearForm = () => { editing = null; F.forEach(k => $("f_" + k).value = ""); $("f_status").value = "Não informado"; $("f_size").value = "Short"; $("f_order").value = 1; $("formTitle").textContent = "Nova AU"; $("dup").textContent = ""; };
  function edit(r) {
    document.querySelector('[data-tab="one"]').click(); editing = r.id; $("formTitle").textContent = "Editando AU #" + r.id;
    $("f_url").value = r.url; $("f_title").value = r.title; $("f_authors").value = r.authors; $("f_fandom").value = r.fandom; $("f_status").value = r.status; $("f_size").value = r.size;
    $("f_desc").value = r.description || ""; $("f_tags").value = (r.tags || []).join(", "); $("f_read").value = r.read_url || ""; $("f_series").value = r.series || ""; $("f_order").value = r.series_order || 1;
  }
  async function del(r) { if (!confirm("Excluir “" + r.title + "”?")) return; const { error } = await A.client.from("admin_aus").delete().eq("id", r.id); say(error ? error.message : "AU excluída.", error ? "err" : "ok"); reload(); }
  $("f_url").addEventListener("input", () => {
    const u = $("f_url").value.trim(), h = handleOf(u), id = tweetId(u);
    if (h && !$("f_authors").value) $("f_authors").value = h;
    $("dup").textContent = known(id) ? "⚠ Este post já está no acervo." : "";
  });
  $("clear").onclick = clearForm;
  $("save").onclick = async () => {
    const url = $("f_url").value.trim(), row = {
      title: $("f_title").value.trim(), authors: $("f_authors").value.trim().replace(/@/g, ""), fandom: $("f_fandom").value.trim(),
      status: $("f_status").value, size: $("f_size").value, description: $("f_desc").value.trim(), url,
      tags: $("f_tags").value.split(",").map(s => s.trim()).filter(Boolean), read_url: $("f_read").value.trim() || null,
      series: $("f_series").value.trim() || null, series_order: $("f_series").value.trim() ? (+$("f_order").value || 1) : null };
    if (!row.title || !row.authors || !row.fandom || !/^https?:\/\//.test(url)) return say("Preencha link, título, autor e fandom.", "err");
    if (!editing && known(tweetId(url)) && !confirm("Este post já existe no acervo. Adicionar mesmo assim?")) return;
    const q = editing ? A.client.from("admin_aus").update(row).eq("id", editing) : A.client.from("admin_aus").insert(row);
    const { error } = await q; if (error) return say(error.message, "err");
    say(editing ? "AU atualizada ✓" : "AU adicionada ✓ (aparece no acervo ao recarregar)", "ok"); clearForm(); reload();
  };

  // ---- várias de uma vez ----
  const FANDOM_TAGS = [["pipravitara", "PipRaviTara"], ["piptara", "PipTara"], ["pipvada", "PipVada"], ["pipkiki", "PipKiki"], ["animobi", "Animobi"], ["sweetcc", "SweetCC"], ["wenclair", "Wenclair"]];
  function parseBulk(text) {
    const out = []; let buf = [], authors = null;
    text.normalize("NFKC").replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").split(/\r?\n/).forEach(raw => {
      const line = raw.trim(), m = line.match(/https?:\/\/(?:x|twitter)\.com\/([A-Za-z0-9_]+)\/status\/(\d+)/i);
      const au = line.match(/^autor(?:es|a|as)?\s*:\s*(.+)$/i);
      if (au) { authors = au[1].replace(/@/g, "").split(/\s*(?:,|\be\b)\s*/i).join(" e "); return; }
      if (!m) { if (line) buf.push(line); return; }
      const all = buf.join(" ").toLowerCase(), first = buf[0] || "";
      const quoted = first.match(/["“]([^"”]+)["”]/);
      let title = quoted ? quoted[1] : first.replace(/#\w+/g, "").replace(/\b(mini[- ]?au|short au|au interativa|crack au|au)\b/ig, "").replace(/[|—–\-*⭑\/:.]+/g, " ").replace(/\s+/g, " ").trim();
      if (title.length < 2) title = "Mini AU";
      const rest = quoted ? [] : buf.slice(1);
      const f = FANDOM_TAGS.find(([k]) => all.includes(k));
      out.push({ title: title.slice(0, 80), authors: authors || m[1], fandom: f ? f[1] : "Wenclair", description: rest.join(" ").trim() || "Mini AU.", url: m[0], id: m[2] });
      buf = []; authors = null;
    });
    return out;
  }
  let parsed = [];
  $("parse").onclick = () => {
    parsed = parseBulk($("bulk").value); const box = $("preview"); box.textContent = "";
    if (!parsed.length) return say("Não achei nenhum link de post (x.com/…/status/…).", "err"); say("");
    const tb = el("tbody");
    parsed.forEach((p, i) => {
      const dupe = known(p.id), inp = (k, w) => { const n = el("input", { value: p[k], style: "min-width:" + w + "px" }); n.oninput = () => p[k] = n.value; return n; };
      const fs = el("select"); [...new Set(FANDOMS.concat(FANDOM_TAGS.map(x => x[1])))].forEach(f => fs.append(new Option(f, f))); fs.value = p.fandom; fs.onchange = () => p.fandom = fs.value;
      const ck = el("input", { type: "checkbox", checked: !dupe }); ck.onchange = () => p.skip = !ck.checked; p.skip = dupe;
      tb.append(el("tr", {}, [el("td", {}, [ck]), el("td", {}, [inp("title", 160), dupe ? el("div", { className: "hint", textContent: "⚠ já existe no acervo" }) : ""]), el("td", {}, [inp("authors", 120)]), el("td", {}, [fs]), el("td", {}, [inp("description", 220)])]));
    });
    box.append(el("table", {}, [el("thead", {}, [el("tr", {}, ["", "Título", "Autor(es)", "Fandom", "Sinopse"].map(t => el("th", { textContent: t })))]), tb]),
      el("div", { className: "acts" }, [el("button", { className: "btn main", textContent: "Adicionar marcadas", onclick: addBulk })]));
  };
  async function addBulk() {
    const rows = parsed.filter(p => !p.skip).map(p => ({ title: p.title, authors: p.authors.replace(/@/g, ""), fandom: p.fandom, status: "Não informado", size: "Short", description: p.description, tags: ["Short"], url: p.url }));
    if (!rows.length) return say("Nada marcado para adicionar.", "err");
    const { error } = await A.client.from("admin_aus").insert(rows); if (error) return say(error.message, "err");
    say(rows.length + " AUs adicionadas ✓", "ok"); $("bulk").value = ""; $("preview").textContent = ""; reload();
  }

  clearForm(); reload();
})();
