
const creditsList = document.getElementById("creditsList");
const contributors = new Map();

function escapeHtml(value) {
    return String(value).replace(/[&<>"]/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;"
    })[character]);
}

function addContribution(handle, profileUrl) {
    const username = String(handle || "").replace(/^@/, "").trim();

    if (!username) return;

    const key = username.toLocaleLowerCase();

    if (!contributors.has(key)) {
        contributors.set(key, {
            username,
            profileUrl: profileUrl || `https://x.com/${encodeURIComponent(username)}`
        });
    }
}

// Autores das histórias do acervo
aus.forEach(story => {
    getAuAuthors(story).forEach(author => {
        const username = author.name || author.display;

        addContribution(
            username,
            `https://x.com/${encodeURIComponent(String(username).replace(/^@/, ""))}`
        );
    });
});

// Autores das fanfics recomendadas
recommendedFanfics.forEach(story => {
    addContribution(
        story.author,
        story.authorUrl || `https://x.com/${encodeURIComponent(String(story.author || "").replace(/^@/, ""))}`
    );
});

// Organiza os autores em ordem alfabética
const entries = [...contributors.values()].sort((a, b) =>
    a.username.localeCompare(b.username, "pt-BR", { sensitivity: "base" })
);

// Exibe somente os autores
creditsList.innerHTML = entries.map(contributor => `
    <article class="credit-card">
        <h3>
            <a href="${escapeHtml(contributor.profileUrl)}"
               target="_blank"
               rel="noopener noreferrer">
                @${escapeHtml(contributor.username)}
            </a>
        </h3>
    </article>
`).join("");
