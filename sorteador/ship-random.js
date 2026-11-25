// Botão "Sortear shipps" da página de personagens: 1 personagem da Jenna + 1 da Emma
(function () {
    const button = document.getElementById("randomShipBtn");
    if (!button || typeof SHIP_POOL === "undefined") return;

    const dialog = document.createElement("dialog");
    dialog.className = "ship-dialog";
    dialog.setAttribute("aria-labelledby", "shipDialogTitle");
    document.body.appendChild(dialog);

    let current = null;
    const esc = v => String(v).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
    const person = c => `<span class="ship-person"><img src="${esc(c.img)}" alt="${esc(c.name)}"><b>${esc(c.name)}</b><small>${esc(c.source)}</small></span>`;

    function draw() {
        current = drawShip(current);
        dialog.innerHTML = `<h2 id="shipDialogTitle">${t("characters.shipTitle")}</h2>
            <div class="ship-pair">${person(current.a)}<span class="ship-x" aria-hidden="true">×</span>${person(current.b)}</div>
            <div class="ship-dialog-buttons">
                <button class="btn" type="button" data-act="again">⚄ ${t("characters.shipAgain")}</button>
                <a class="btn ghost" href="../sorteador/sorteador.html?ship=${current.a.id},${current.b.id}">✦ ${t("characters.shipPlot")}</a>
                <button class="btn ghost" type="button" data-act="close">${t("characters.shipClose")}</button>
            </div>
            <p class="ship-note">${t("characters.shipNote")}</p>`;
    }

    button.addEventListener("click", () => {
        draw();
        if (typeof dialog.showModal === "function") { if (!dialog.open) dialog.showModal(); }
        else dialog.setAttribute("open", "");
    });
    dialog.addEventListener("click", event => {
        const act = event.target.closest("[data-act]");
        if (act && act.dataset.act === "again") draw();
        else if ((act && act.dataset.act === "close") || event.target === dialog) dialog.close();
    });
})();
