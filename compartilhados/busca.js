/* ===== Busca tolerante: ignora acentos/maiúsculas/pontuação e aceita pequenos erros de digitação ===== */
window.jvNorm = function (text) {
    return String(text == null ? "" : text)
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .toLowerCase().replace(/[^a-z0-9@\s]+/g, " ").replace(/\s+/g, " ").trim();
};
window.jvDistance = function (a, b, max) {
    if (Math.abs(a.length - b.length) > max) return max + 1;
    let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
        const cur = [i];
        let rowMin = i;
        for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            let v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
            // troca de letras adjacentes conta como 1 erro (ex.: "wenclari" / "wenclair")
            if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, prev[j - 2] + 1);
            cur[j] = v;
            if (v < rowMin) rowMin = v;
        }
        if (rowMin > max) return max + 1;
        prev = cur;
    }
    return prev[b.length];
};
/* haystack: texto já normalizado (use jvNorm). Todas as palavras da busca precisam combinar. */
window.jvMatch = function (query, haystack) {
    const q = window.jvNorm(query);
    if (!q) return true;
    const words = haystack.split(" ").filter(Boolean);
    return q.split(" ").every(token => {
        if (haystack.includes(token)) return true;
        const max = token.length >= 8 ? 2 : token.length >= 4 ? 1 : 0;
        if (!max) return false;
        return words.some(word => {
            if (window.jvDistance(token, word, max) <= max) return true;
            // erro de digitação em busca parcial: compara com o começo da palavra
            return word.length > token.length && window.jvDistance(token, word.slice(0, token.length), max) <= max;
        });
    });
};

