/* Abre o index já filtrado por autor: index.html?autor=nome (usado pela tag do perfil) */
(function () {
  const q = new URLSearchParams(location.search).get("autor");
  const inp = document.getElementById("authorFilter");
  if (!q || !inp) return;
  const norm = s => (s || "").toLowerCase().replace(/^@/, "").trim(), want = norm(q);
  window.addEventListener("load", () => setTimeout(() => {
    const hit = [...document.querySelectorAll("#authorOptions option")].find(o => norm(o.value) === want);
    inp.value = hit ? hit.value : q;
    ["input", "change"].forEach(e => inp.dispatchEvent(new Event(e, { bubbles: true })));
  }, 0));
})();
