// Personagens que entram no sorteio de shipps (1 da Jenna + 1 da Emma).
// Ficam de fora crianças e robôs. As imagens são as mesmas da página de personagens.
const SHIP_POOL = {
    jenna: [
        { id: "wednesday", name: "Wednesday Addams", source: "Wednesday (2022-Presente)", img: "../assets/imagens/wednesday.jpeg" },
        { id: "tara", name: "Tara Carpenter", source: "Scream (2022) / Scream VI (2023)", img: "../assets/imagens/tara.jpg" },
        { id: "cairo", name: "Cairo Sweet", source: "Miller's Girl (2024)", img: "../assets/imagens/cairo.jpg" },
        { id: "vada", name: "Vada Cavell", source: "The Fallout (2021)", img: "../assets/imagens/vada.jpg" },
        { id: "anima", name: "Anima", source: "Hurry Up Tomorrow (2025)", img: "../assets/imagens/anima.jpg" },
        { id: "kiki", name: "Kiki Gorman", source: "The Gallerist (2026)", img: "../assets/imagens/kiki.jpg" },
        { id: "ridley", name: "Ridley Kintner", source: "Death of a Unicorn (2025)", img: "../assets/imagens/ridley.jpg" },
        { id: "astrid", name: "Astrid Deetz", source: "Beetlejuice Beetlejuice (2024)", img: "../assets/imagens/astrid.jpg" },
        { id: "lorraine", name: "Lorraine Day", source: "X (2022)", img: "../assets/imagens/lorriane.jpg" },
        { id: "remi", name: "Remi Aguilar", source: "Winter Spring Summer or Fall (2024)", img: "../assets/imagens/remi.jpg" },
        { id: "mabel", name: "Mabel", source: "Finestkind (2023)", img: "../assets/imagens/mabel.jpg" },
        { id: "phoebe", name: "Phoebe Atwell", source: "The Babysitter: Killer Queen (2020)", img: "../assets/imagens/phoebe.jpg" }
    ],
    emma: [
        { id: "enid", name: "Enid Sinclair", source: "Wednesday (2022–Presente)", img: "../assets/imagens/enid.jpeg" },
        { id: "beebee", name: "BeeBee Jordan", source: "A Taste of Christmas (2020)", img: "../assets/imagens/beebee.jpg" },
        { id: "cc", name: "CC Walker", source: "Family Switch (2023)", img: "../assets/imagens/cc.jpg" },
        { id: "pippa", name: "Pippa Fitz-Amobi", source: "A Good Girl's Guide to Murder (2024–presente)", img: "../assets/imagens/pip.jpg" },
        { id: "natalie", name: "Natalie", source: "A Minecraft Movie (2025)", img: "../assets/imagens/natalie.jpg" },
        { id: "sam", name: "Sam", source: "Galaxy S23 Ultra: 'Epic Worlds’ feat. Emma Myers | Samsung (2023)", img: "../assets/imagens/sam.jpg" }
    ]
};

function randomFrom(list) { return list[Math.floor(Math.random() * list.length)]; }

function shuffle(list) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// "Baralho" de pares: nenhum shipp se repete até todos os 60 terem saído
let shipDeck = [];
function drawShip(avoid) {
    if (!shipDeck.length) {
        shipDeck = shuffle(SHIP_POOL.jenna.flatMap(a => SHIP_POOL.emma.map(b => ({ a, b }))));
        const last = shipDeck[shipDeck.length - 1];
        if (avoid && last.a.id === avoid.a.id && last.b.id === avoid.b.id) shipDeck.unshift(shipDeck.pop());
    }
    return shipDeck.pop();
}

function findShipFromParam(param) {
    const [ida, idb] = String(param || "").split(",");
    const a = SHIP_POOL.jenna.find(c => c.id === ida);
    const b = SHIP_POOL.emma.find(c => c.id === idb);
    return a && b ? { a, b } : null;
}
