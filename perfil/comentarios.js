/* Comentários no perfil público + lista de bloqueados no editor. Toda a regra de segurança está no SQL (perfil-comentarios.sql). */
window.jvComments = (function () {
  const el = (tag, props, kids) => { const n = Object.assign(document.createElement(tag), props || {}); (kids || []).forEach(k => n.append(k)); return n; };
  const MAX = 300;

  function mount(box, slug, A, pubUrl, opts) {
    opts = opts || {};
    const load = () => A.client.rpc("get_profile_comments", { p_slug: slug }).then(({ data, error }) => {
      if (error || !data || !data.allowed) { box.hidden = true; return; }
      box.hidden = false; box.textContent = "";
      const cnt = box.dataset.count && document.getElementById(box.dataset.count); if (cnt) cnt.textContent = data.items.length;
      box.append(el("h2", { className: "pf-h2" }, ["✦ Comentários", data.items.length ? el("span", { className: "pf-cm-total", textContent: String(data.items.length) }) : ""]));

      if (!data.logged_in) {
        box.append(el("p", { className: "pf-hint" }, ["Para comentar, ", el("a", { href: "../login/login.html", textContent: "entre na sua conta" }), "."]));
      } else if (data.enabled === false) {
        box.append(el("p", { className: "pf-hint", textContent: "Os comentários estão desligados. Ative em “Editar perfil” para as pessoas poderem comentar." }));
      } else if (data.blocked) {
        box.append(el("p", { className: "pf-hint", textContent: "Você não pode comentar neste perfil." }));
      } else {
        const ta = el("textarea", { className: "pf-cm-text", maxLength: MAX, rows: 3, placeholder: "Escreva um comentário…" });
        const count = el("span", { className: "pf-count", textContent: "0/" + MAX });
        const msg = el("p", { className: "pf-msg", hidden: true });
        const send = el("button", { className: "pf-btn main", type: "button", textContent: "Comentar" });
        ta.addEventListener("input", () => { count.textContent = ta.value.length + "/" + MAX; });
        send.addEventListener("click", async () => {
          send.disabled = true; msg.hidden = true;
          const { error: err } = await A.client.rpc("add_profile_comment", { p_slug: slug, p_body: ta.value });
          send.disabled = false;
          if (err) { msg.textContent = err.message || "Não foi possível comentar."; msg.hidden = false; return; }
          load();
        });
        box.append(el("p", { className: "pf-hint", textContent: "Seja gentil: é um espaço de fãs. Comentários não podem ser editados, só apagados." }),
          el("div", { className: "pf-cm-compose" }, [ta, el("div", { className: "pf-cm-row" }, [count, send])]), msg);
      }

      if (!data.items.length) box.append(el("p", { className: "pf-empty", textContent: "Ainda não há comentários." }));
      data.items.forEach(c => {
        const name = c.display_name || "Leitor(a)";
        const av = c.avatar_path ? el("img", { className: "pf-cm-av", alt: "", src: pubUrl(c.avatar_path) }) : el("span", { className: "pf-cm-av", textContent: name[0].toUpperCase() });
        const who = c.slug ? el("a", { className: "pf-cm-name", href: "ver.html?u=" + encodeURIComponent(c.slug), textContent: name }) : el("b", { className: "pf-cm-name", textContent: name });
        const row = el("div", { className: "pf-cm" }, [av, el("div", { className: "pf-cm-main" }, [
          el("div", { className: "pf-cm-head" }, [who, el("small", { textContent: " · " + new Date(c.created_at).toLocaleDateString("pt-BR") })]),
          el("p", { textContent: c.body })])]);
        const actions = el("div", { className: "pf-cm-actions" });
        const canDelete = opts.manage ? c.can_delete : (c.can_delete && !data.is_owner);
        const canBlock = opts.manage && data.is_owner && c.can_delete;
        if (canDelete) actions.append(el("button", { type: "button", className: "pf-link", textContent: "Apagar", onclick: async () => {
          if (!confirm("Apagar este comentário?")) return;
          await A.client.rpc("delete_profile_comment", { p_id: c.id }); load(); } }));
        if (canBlock) actions.append(el("button", { type: "button", className: "pf-link", textContent: "Bloquear", onclick: async () => {
          if (!confirm("Bloquear " + name + "? Os comentários dessa pessoa aqui serão apagados e ela não poderá comentar de novo.")) return;
          await A.client.rpc("block_commenter", { p_comment_id: c.id }); load(); } }));
        row.lastChild.append(actions);
        box.append(row);
      });
    });
    return load();
  }

  // Lista de bloqueados (editor do perfil)
  function blocked(box, A) {
    return A.client.rpc("get_blocked_commenters").then(({ data }) => {
      box.textContent = "";
      const list = data || [];
      box.hidden = !list.length;
      if (!list.length) return;
      box.append(el("label", { textContent: "Pessoas bloqueadas nos comentários" }));
      list.forEach(b => box.append(el("div", { className: "pf-selitem" }, [b.display_name || b.slug || "Pessoa",
        el("button", { type: "button", textContent: "Desbloquear", onclick: async () => { await A.client.rpc("unblock_commenter", { p_blocked: b.blocked_id }); blocked(box, A); } })])));
    });
  }
  return { mount, blocked };
})();

/* Curtidas de perfil */
window.jvLikes = (function () {
  const el = (tag, props, kids) => { const n = Object.assign(document.createElement(tag), props || {}); (kids || []).forEach(k => n.append(k)); return n; };

  // botão ♥ no perfil público (ver.html)
    function button(btn, slug, A, opts) {
    opts = opts || {};
    A.client.rpc("get_profile_likes", { p_slug: slug }).then(({ data, error }) => {
      if (error || !data) return;
      const paint = () => {
        btn.hidden = false; btn.textContent = "";
        btn.classList.toggle("on", !!data.liked);
        btn.disabled = !!data.is_owner;
        btn.title = data.is_owner ? "Curtidas que seu perfil recebeu" : data.liked ? "Descurtir perfil" : "Curtir perfil";
        btn.append(el("span", { textContent: data.liked ? "♥\uFE0E" : "♡\uFE0E" }));
        if (!opts.hideCount) btn.append(el("span", { textContent: String(data.count) }));
        if (opts.onCount) opts.onCount(data.count);
      };
      paint();
      btn.onclick = async () => {
        if (!data.logged_in) { location.href = "../login/login.html"; return; }
        btn.disabled = true;
        const r = await A.client.rpc("toggle_profile_like", { p_slug: slug });
        if (!r.error && r.data) Object.assign(data, r.data);
        paint();
      };
    });
  }

  // estatísticas na própria página: curtidas recebidas + lista de perfis curtidos
    function mine(A, pub, refs) {
    return A.client.rpc("get_my_like_stats").then(({ data }) => {
      if (!data) return;
      document.querySelectorAll(".js-likes-got").forEach(n => n.textContent = data.received);
      if (refs.n) refs.n.textContent = data.liked.length;
      refs.box.textContent = "";
      refs.box.hidden = false;
      refs.box.append(el("h2", { className: "pf-h2", textContent: "✦ Perfis que curti (" + data.liked.length + ")" }));
      if (!data.liked.length) { refs.box.append(el("p", { className: "pf-empty", textContent: "Você ainda não curtiu nenhum perfil." })); return; }
      const wrap = el("div", { className: "pf-liked" });
      data.liked.forEach(p => {
        const name = p.display_name || p.slug;
        const av = p.avatar_path ? el("img", { className: "pf-cm-av", alt: "", src: pub(p.avatar_path) }) : el("span", { className: "pf-cm-av", textContent: name[0].toUpperCase() });
        wrap.append(el("a", { className: "pf-likedcard", href: "ver.html?u=" + encodeURIComponent(p.slug) }, [av, el("span", { textContent: name })]));
      });
      refs.box.append(wrap);
    });
  }
  return { button, mine };
})();
