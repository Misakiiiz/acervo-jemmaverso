const modal = $("modal");
const modalBox = modal.querySelector(".modal-box");
const previousAuButton = $("prevAu"), nextAuButton = $("nextAu");
const modalSeriesNavigation = $("modalSeriesNavigation");
let openAu = null, modalAus = [], openAuIndex = -1, swipeStart = null;

function openModal(au, visibleAus){
    modalAus = visibleAus.length ? visibleAus : [au];
    openAuIndex = modalAus.findIndex(item => item.id === au.id);
    if (openAuIndex < 0) {
        modalAus = [au];
        openAuIndex = 0;
    }
    showAu(au);
}

function showAu(au){
    openAu = au;
    $("modalTitle").textContent = translateTitle(au);
    const authorLinks = getAuAuthors(au).map(author => {
        const handle = String(author.name).replace(/^@/, "");
        return `<a href="https://x.com/${encodeURIComponent(handle)}" target="_blank" rel="noopener">${esc(author.display)}</a>`;
    });
    const a = $("modalAuthor");
    a.innerHTML = authorLinks.join(" · ");
    a.removeAttribute("href");
    const inactive = $("modalInactive");
    inactive.hidden = !au.inactiveAuthor;
    inactive.innerHTML = au.inactiveAuthor
        ? `Conta não mais ativa. Siga este autor em <a href="https://x.com/${encodeURIComponent(au.inactiveAuthor)}" target="_blank" rel="noopener noreferrer">@${esc(au.inactiveAuthor)}</a>`
        : "";
    $("mShip").textContent = au.fandom;
    $("mStatus").textContent = translateStatus(au.status);
    $("mSize").textContent = translateSize(au.size || "Não informado");
    $("modalDescription").textContent = au.description ? translateSynopsis(au) : (au.tweet ? t("synopsisInPost") : t("noSynopsis"));
    $("modalTweet").innerHTML = au.tweet ? `<blockquote class="twitter-tweet" data-theme="dark"><a href="https://twitter.com/i/status/${au.tweet}"></a></blockquote>` : "";
    const topReadUrl = au.readUrl || (au.readPlacementTop ? au.url : "");
    const useTopReadLink = Boolean(au.readPlacementTop && topReadUrl);
    $("modalLink").style.display = au.url && !(useTopReadLink && !au.readUrl) ? "" : "none";
    if (au.url) $("modalLink").href = au.url;
    const modalSiteLink = $("modalSiteLink");
    const topReadLink = $("modalTopReadLink");
    const extraReadLink = $("modalExtraReadLink");
    topReadLink.classList.toggle("site-read-btn", au.readLabelKey === "modal.read");
    topReadLink.classList.toggle("read-site-wide", au.readLabelKey === "modal.readSite");
    modalSiteLink.style.display = au.readUrl && !useTopReadLink ? "" : "none";
    if (au.readUrl && !useTopReadLink) modalSiteLink.href = au.readUrl;
    else modalSiteLink.removeAttribute("href");
    topReadLink.hidden = !useTopReadLink;
    if (useTopReadLink) {
        topReadLink.href = topReadUrl;
        topReadLink.textContent = au.readLabel || t(au.readLabelKey || (au.readUrl ? "modal.readSite" : "modal.read"));
    } else {
        topReadLink.removeAttribute("href");
    }
    extraReadLink.hidden = !au.additionalReadUrl;
    if (au.additionalReadUrl) {
        extraReadLink.href = au.additionalReadUrl;
        extraReadLink.textContent = t(au.additionalReadLabelKey || "modal.read");
    } else {
        extraReadLink.removeAttribute("href");
        extraReadLink.textContent = "";
    }
    $("modalReadActions").hidden = !useTopReadLink && !au.additionalReadUrl;
    updateSeriesNavigation(au);
    updateModalNavigation();
    refreshModal();
    modal.classList.add("active");
    if (window.twttr && twttr.widgets) twttr.widgets.load($("modalTweet"));
}

function updateSeriesNavigation(au){
    const seriesAus = au.series
        ? aus
            .filter(item => item.series === au.series)
            .sort((a, b) => a.seriesOrder - b.seriesOrder)
        : [];
    const links = $("modalSeriesLinks");
    links.replaceChildren();
    modalSeriesNavigation.hidden = seriesAus.length < 2;
    const seriesLabel = modalSeriesNavigation.querySelector("p");
    if (au.series && seriesLabel) seriesLabel.textContent = `Parte da saga "${au.series}"`;
    modalSeriesNavigation.setAttribute("aria-label", au.series ? `Saga ${au.series}` : "");
    if (seriesAus.length < 2) return;

    seriesAus.forEach(seriesAu => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "series-navigation-button";
        button.textContent = translateTitle(seriesAu);
        button.dataset.seriesAuId = String(seriesAu.id);
        if (seriesAu.id === au.id) button.setAttribute("aria-current", "page");
        links.append(button);
    });
}

modalSeriesNavigation.addEventListener("click", event => {
    const button = event.target.closest("[data-series-au-id]");
    if (!button) return;

    const selectedAu = aus.find(item => item.id === Number(button.dataset.seriesAuId));
    if (!selectedAu) return;

    modalAus = aus
        .filter(item => item.series === selectedAu.series)
        .sort((a, b) => a.seriesOrder - b.seriesOrder);
    openAuIndex = modalAus.findIndex(item => item.id === selectedAu.id);
    showAu(selectedAu);
});

function updateModalNavigation(){
    const hasMultipleAus = modalAus.length > 1;
    previousAuButton.hidden = !hasMultipleAus;
    nextAuButton.hidden = !hasMultipleAus;
    previousAuButton.disabled = openAuIndex <= 0;
    nextAuButton.disabled = openAuIndex >= modalAus.length - 1;
}

function navigateModal(direction){
    const nextIndex = openAuIndex + direction;
    if (nextIndex < 0 || nextIndex >= modalAus.length) return;
    openAuIndex = nextIndex;
    showAu(modalAus[openAuIndex]);
}

function refreshModal(){
    const id = openAu.id, cur = getReadingStatus(id) || "naolido", rate = getRating(id);
    document.querySelectorAll("#readingButtons .status-btn").forEach(b => b.classList.toggle("active", b.dataset.status === cur));
    document.querySelectorAll("#rating span").forEach(s => s.classList.toggle("active", Number(s.dataset.rate) <= rate));
    $("modalFav").textContent = isFavorite(id) ? t("modal.favorited") : t("modal.favorite");
    $("modalFav").classList.toggle("active", isFavorite(id));
}

function closeModal(){ modal.classList.remove("active"); filterAus(); }

previousAuButton.addEventListener("click", () => navigateModal(-1));
nextAuButton.addEventListener("click", () => navigateModal(1));
modalBox.addEventListener("touchstart", e => {
    if (e.touches.length !== 1 || e.target.closest("button,a,input,select,textarea,[contenteditable=true]")) {
        swipeStart = null;
        return;
    }
    swipeStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
}, { passive: true });
modalBox.addEventListener("touchend", e => {
    if (!swipeStart) return;
    const deltaX = e.changedTouches[0].clientX - swipeStart.x;
    const deltaY = e.changedTouches[0].clientY - swipeStart.y;
    swipeStart = null;
    if (Math.abs(deltaX) < 60 || Math.abs(deltaX) < Math.abs(deltaY) * 1.25) return;
    navigateModal(deltaX < 0 ? 1 : -1);
}, { passive: true });

document.querySelectorAll("#readingButtons .status-btn").forEach(b => b.addEventListener("click", () => {
    setReadingStatus(openAu.id, b.dataset.status); refreshModal(); updateStatistics();
}));
document.querySelectorAll("#rating span").forEach(s => s.addEventListener("click", () => {
    const v = Number(s.dataset.rate);
    setRating(openAu.id, getRating(openAu.id) === v ? 0 : v); refreshModal();
}));
$("modalFav").addEventListener("click", () => { toggleFavorite(openAu.id); refreshModal(); updateStatistics(); });
$("closeModal").addEventListener("click", closeModal);
modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeModal();
    if (!modal.classList.contains("active") || e.target.closest("input,textarea,select,[contenteditable=true]")) return;
    if (e.key === "ArrowLeft") navigateModal(-1);
    if (e.key === "ArrowRight") navigateModal(1);
});
$("menuBtn").addEventListener("click", () => toggleSidebar());
$("closeSidebar").addEventListener("click", () => toggleSidebar(false));
$("sidebarBackdrop").addEventListener("click", () => toggleSidebar(false));
document.querySelectorAll(".nav [data-view]").forEach(button => {
    button.addEventListener("click", () => {
        if (window.matchMedia("(max-width: 800px)").matches) toggleSidebar(false);
    });
});

const sidebarBreakpoint = window.matchMedia("(max-width: 800px)");
const syncSidebarWithViewport = event => toggleSidebar(!event.matches, false);
if (sidebarBreakpoint.matches) toggleSidebar(false, false);
if (typeof sidebarBreakpoint.addEventListener === "function") {
    sidebarBreakpoint.addEventListener("change", syncSidebarWithViewport);
} else {
    sidebarBreakpoint.addListener(syncSidebarWithViewport);
}

filterAus();
updateStatistics();
