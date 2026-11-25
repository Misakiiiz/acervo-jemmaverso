const characterMobileQuery = window.matchMedia("(max-width: 600px)");
const characterReducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

function listenToMediaQuery(query, callback) {
    if (typeof query.addEventListener === "function") {
        query.addEventListener("change", callback);
    } else {
        query.addListener(callback);
    }
}

document.querySelectorAll(".character-grid").forEach((track, carouselIndex) => {
    const cards = [...track.children].filter(card => card.classList.contains("character-card"));
    if (cards.length < 2) return;

    const section = track.closest(".info-section");
    const heading = section && section.querySelector("h2");
    const actorName = heading ? heading.textContent.trim() : "personagens";
    const carousel = document.createElement("div");
    const viewport = document.createElement("div");
    const previousButton = document.createElement("button");
    const nextButton = document.createElement("button");
    carousel.className = "character-carousel";
    viewport.className = "character-carousel-viewport";
    track.classList.add("character-carousel-track");
    track.id = track.id || `character-track-${carouselIndex}`;
    track.setAttribute("aria-live", "off");

    previousButton.className = "fanfic-carousel-arrow fanfic-carousel-previous";
    previousButton.type = "button";
    previousButton.setAttribute("aria-controls", track.id);
    previousButton.textContent = "‹";
    nextButton.className = "fanfic-carousel-arrow fanfic-carousel-next";
    nextButton.type = "button";
    nextButton.setAttribute("aria-controls", track.id);
    nextButton.textContent = "›";

    function updateButtonLabels() {
        const previousLabel = typeof t === "function" ? t("characters.previous") : "Personagens anteriores de {name}";
        const nextLabel = typeof t === "function" ? t("characters.next") : "Próximos personagens de {name}";
        previousButton.setAttribute("aria-label", previousLabel.replace("{name}", actorName));
        nextButton.setAttribute("aria-label", nextLabel.replace("{name}", actorName));
    }

    updateButtonLabels();
    document.querySelectorAll("#languageSelector").forEach(select => {
        select.addEventListener("change", updateButtonLabels);
    });

    track.parentNode.insertBefore(carousel, track);
    carousel.append(previousButton, viewport, nextButton);
    viewport.append(track);

    const slides = cards.map(card => {
        const slide = document.createElement("div");
        slide.className = "character-slide";
        slide.append(card);
        track.append(slide);
        return slide;
    });

    let activeSlide = 0;
    let autoplayTimer;
    let touchStart = null;

    function showSlide(index) {
        activeSlide = (index + slides.length) % slides.length;
        if (!characterMobileQuery.matches) return;

        track.style.transform = `translateX(-${activeSlide * 100}%)`;
        slides.forEach((slide, slideIndex) => {
            const isInactive = slideIndex !== activeSlide;
            slide.setAttribute("aria-hidden", String(isInactive));
            slide.inert = isInactive;
        });
    }

    function stopAutoplay() {
        window.clearInterval(autoplayTimer);
    }

    function startAutoplay() {
        stopAutoplay();
        if (characterMobileQuery.matches && slides.length > 1 && !characterReducedMotionQuery.matches && !document.hidden) {
            autoplayTimer = window.setInterval(() => showSlide(activeSlide + 1), 5000);
        }
    }

    function updateMode() {
        stopAutoplay();
        const isMobile = characterMobileQuery.matches;
        previousButton.hidden = !isMobile || slides.length < 2;
        nextButton.hidden = !isMobile || slides.length < 2;

        if (isMobile) {
            showSlide(activeSlide);
            startAutoplay();
        } else {
            track.style.transform = "";
            slides.forEach(slide => {
                slide.setAttribute("aria-hidden", "false");
                slide.inert = false;
            });
        }
    }

    previousButton.addEventListener("click", () => {
        showSlide(activeSlide - 1);
        startAutoplay();
    });
    nextButton.addEventListener("click", () => {
        showSlide(activeSlide + 1);
        startAutoplay();
    });
    carousel.addEventListener("mouseenter", stopAutoplay);
    carousel.addEventListener("mouseleave", startAutoplay);
    carousel.addEventListener("focusin", stopAutoplay);
    carousel.addEventListener("focusout", event => {
        if (!carousel.contains(event.relatedTarget)) startAutoplay();
    });
    viewport.addEventListener("touchstart", event => {
        if (event.touches.length !== 1) {
            touchStart = null;
            return;
        }
        touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    }, { passive: true });
    viewport.addEventListener("touchend", event => {
        if (!touchStart) return;
        const deltaX = event.changedTouches[0].clientX - touchStart.x;
        const deltaY = event.changedTouches[0].clientY - touchStart.y;
        touchStart = null;
        if (Math.abs(deltaX) < 50 || Math.abs(deltaX) < Math.abs(deltaY)) return;
        showSlide(activeSlide + (deltaX < 0 ? 1 : -1));
        startAutoplay();
    }, { passive: true });

    listenToMediaQuery(characterMobileQuery, updateMode);
    listenToMediaQuery(characterReducedMotionQuery, startAutoplay);
    document.addEventListener("visibilitychange", startAutoplay);
    updateMode();
});
