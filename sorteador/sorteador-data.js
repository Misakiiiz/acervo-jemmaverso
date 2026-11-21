// Categorias do sorteador de plots. Para adicionar opções, é só incluir linhas nas listas.
const pairUp = (list, join) => list.flatMap((a, i) => list.map((b, j) => i < j ? `${a}${join}${b}` : null)).filter(Boolean);

const ERAS = ["Anos 1920", "Anos 1950", "Anos 1970", "Anos 1980", "Anos 1990", "Anos 2000", "Dias atuais", "Inglaterra vitoriana", "Idade Média", "Futuro distópico", "Era espacial", "Futuro cyberpunk"];
const PLACES = ["em uma cidade pequena", "em um internato", "em uma universidade", "em uma cidade litorânea", "em uma fazenda", "em um hotel de luxo", "em uma metrópole", "em um navio", "em um teatro", "em uma ilha isolada", "em uma vila nas montanhas", "em um castelo", "em um bairro boêmio"];
const ROLES = ["detetive", "jornalista", "médica", "atriz", "diretora de cinema", "advogada", "promotora", "professora", "escritora", "cantora", "compositora", "chef", "crítica gastronômica", "princesa", "guarda real", "arqueóloga", "historiadora", "fotógrafa", "modelo", "veterinária", "bibliotecária", "livreira", "astronauta", "engenheira", "florista", "confeiteira", "bailarina", "coreógrafa", "hacker", "policial", "pintora", "curadora de galeria", "bruxa", "caçadora de monstros", "barista", "dublê", "pilota", "mecânica", "cientista", "psicóloga", "tatuadora", "DJ", "jogadora de futebol", "treinadora", "bombeira", "paramédica", "arquiteta", "estilista", "produtora musical", "tradutora", "apresentadora de TV", "cineasta", "roteirista", "pianista", "violinista", "agente secreta", "investigadora do sobrenatural", "restauradora de arte", "sommelier", "diplomata"];
const OBJECTS = ["Uma fotografia rasgada", "Um anel antigo", "Uma máquina de escrever", "Uma fita cassete", "Um livro com dedicatória", "Uma chave sem fechadura conhecida", "Uma caixa de cartas", "Um relógio parado", "Uma passagem de avião", "Um diário escondido", "Uma flor prensada entre páginas", "Um colar com pingente quebrado", "Um mapa desenhado à mão", "Uma polaroid com data errada", "Uma jaqueta emprestada", "Um vinil riscado", "Um violão sem uma corda", "Um guarda-chuva esquecido", "Um caderno de receitas", "Uma câmera analógica com filme não revelado", "Um vestido de festa", "Uma garrafa com mensagem", "Um espelho rachado", "Uma caixinha de música", "Um bilhete de loteria", "Uma carta de baralho", "Um telefone antigo de disco", "Um par de luvas", "Um broche de família", "Um cachecol tricotado à mão", "Um convite de casamento", "Um pen drive", "Um ingresso de show", "Um gravador de voz", "Um lenço bordado", "Uma agenda com nomes riscados", "Um quadro inacabado", "Uma coroa de papel", "Uma pulseira da amizade", "Um telescópio", "Uma lanterna", "Uma rosa de vidro", "Um álbum de figurinhas", "Um perfume que já saiu de linha", "Um relógio de bolso", "Uma partitura manuscrita", "Um terço antigo", "Um chaveiro de lembrança", "Uma xícara lascada", "Uma capa de chuva amarela", "Um livro de feitiços", "Uma tesoura de costura", "Um taco de baseball autografado", "Um cartão-postal sem remetente", "Um tarô incompleto", "Um colar de conchas", "Um vídeo de câmera VHS", "Uma playlist gravada em CD"];
const OBJECT_SUFFIX = ["", " que ninguém sabe de quem é", " que uma delas guarda há anos", " com uma inscrição misteriosa", " que uma delas jura nunca ter visto", " achado no lugar mais improvável"];

const PLOT_CATEGORIES = [
    { id: "ship", label: "Shipp", icon: "❤︎", type: "ship" },
    { id: "relationship", label: "Tipo de relacionamento", icon: ".✦ ݁˖", items: [
        "Enemies to Lovers","AgeGap", "Friends to Lovers", "Rivals to Lovers", "Strangers to Lovers", "Friends with Benefits", "Forbidden Love", "Second Chance",
        "Fake Dating", "Childhood Friends", "Love at First Sight", "One Bed", "Grumpy x Sunshine", "Opposites Attract", "Unrequited Love", "Slow Burn",
        "Right Person, Wrong Time", "Secret Relationship", "Mutual Pining", "Exes to Lovers", "Coworkers to Lovers", "Best Friend's Sister",
        "Pen Pals to Lovers", "Idols to Lovers", "Hate at First Sight", "Rebound", "Soulmates", "Roommates to Lovers", "Neighbors to Lovers",
        "Arranged Marriage", "Online Friends to Lovers", "Wrong Number to Lovers", "Bandmates to Lovers", "Co-stars to Lovers", "Teammates to Lovers",
        "Study Buddies to Lovers", "Stranded Together", "Star-Crossed Lovers", "Fated Mates", "Reincarnated Lovers", "Lovers to Strangers",
        "Lovers to Enemies", "Exes with Unfinished Business", "Situationship", "Almost Lovers", "Bad Girl x Good Girl", "Rival Heirs",
        "Healing Together", "Matchmaker Becomes the Match", "Pretending Not to Care", "Protector x Protected", "Friends Who Almost Kissed", "Love Letters Never Sent",
        "Mutual Obsession", "Different Worlds", "Found Love in Grief", "Enemies to Friends to Lovers", "Fell for the Best Friend's Ex"
    ] },
    { id: "setting", label: "Época e ambientação", icon: "♖", items: [
        "Inglaterra vitoriana", "Idade Média", "Anos 1920", "Anos 1980", "Anos 2000", "Dias atuais", "Futuro distópico", "Futuro cyberpunk",
        "Universo pós-apocalíptico", "Era espacial", "Mundo mágico", "Academia interna", "Cidade pequena", "Universidade", "Realeza e monarquia",
        "Velho Oeste", "Verão em uma cidade litorânea", "Natal em uma cidade coberta de neve", "Anos 1950", "Anos 1970", "Anos 1990", "Grécia Antiga",
        "Japão feudal", "Navio em alto-mar", "Hollywood dos anos 1940", "Cidade grande em época de chuva", "Fazenda no interior", "Circo itinerante",
        "Vila de pescadores", "Paris nos anos 1960", "Universo paralelo", "Egito Antigo", "Londres durante a guerra", "Nova York anos 1970",
        "Floresta encantada", "Colônia espacial", "Hotel à beira-mar fora de temporada", "Set de filmagem", "Turnê de uma banda", "Mansão assombrada",
        "Acampamento de verão", "Trem atravessando o continente", "Cidade submersa", "Reino de fadas", "Ilha deserta", "Bairro boêmio nos anos 1990",
        "Cassino em Las Vegas", "Cidade sem eletricidade", "Reino em guerra", "Sítio de uma avó no interior"
    ].concat(ERAS.flatMap(era => PLACES.map(place => `${era} ${place}`))) },
    { id: "music", label: "Música inspiradora", icon: "♬", type: "music" },
    { id: "climax", label: "Clímax", icon: "☕︎", items: [
        "Uma das personagens descobre uma mentira que muda tudo.", "Um segredo de família vem à tona.", "Uma carta escrita anos atrás é encontrada.",
        "Uma das personagens precisa escolher entre o amor e a carreira.", "Um casamento inesperado muda os planos.", "Uma delas desaparece sem explicações.",
        "Uma traição coloca tudo a perder.", "Uma doença na família aproxima ou afasta as duas.", "Um reencontro acontece no pior momento possível.",
        "Uma delas recebe uma proposta para morar em outro país.", "Uma identidade falsa é descoberta.", "Uma promessa antiga precisa ser cumprida.",
        "Uma delas descobre que foi a última a saber de algo importante.", "Uma tempestade deixa as duas isoladas.", "Um ex reaparece com um pedido impossível de recusar.",
        "Uma confissão é feita na hora errada.", "Uma briga pública expõe o que elas escondiam.", "Uma delas é acusada de algo que não fez.",
        "Uma despedida que nenhuma das duas queria acontece.", "Um prêmio ou oportunidade coloca uma contra a outra.", "Uma delas ouve sem querer o que a outra pensa dela.",
        "O segredo de uma é publicado para o mundo inteiro.", "Uma delas aparece no casamento da outra.", "Uma gravação antiga é descoberta.",
        "Uma das duas precisa escolher entre a família e o amor.", "Uma delas é obrigada a testemunhar contra a outra.", "O lugar onde elas se conheceram vai ser demolido.",
        "Uma delas descobre quem realmente escreveu as cartas.", "Alguém tenta separar as duas de propósito.", "Uma delas quase morre e a outra descobre o que sente.",
        "Elas ficam presas juntas durante a noite inteira.", "A verdade sobre um acidente do passado vem à tona.", "Uma delas aceita uma proposta de trabalho no lugar da outra.",
        "Uma delas perde a memória justamente antes de uma confissão.", "Um prazo termina e o acordo entre elas expira.", "Uma delas descobre que a outra a vigiava desde o início.",
        "Uma festa surpresa termina em revelação.", "Um ensaio ou estreia dá errado de forma espetacular.", "Elas se reencontram sem saber que são rivais.",
        "A pessoa que unia as duas vai embora.", "Uma delas é obrigada a fingir que não a conhece.", "Um pedido de casamento chega para a pessoa errada.",
        "Uma delas encontra o diário da outra.", "O passado sombrio de uma delas alcança as duas.", "Uma delas foge na noite anterior a uma decisão importante.",
        "Uma delas descobre que a outra já sabia de tudo.", "Elas precisam trabalhar juntas contra o tempo.", "Uma mensagem é enviada para todos por engano.",
        "Uma delas escolhe se sacrificar pela outra.", "A outra descobre que a única saída é deixá-la ir."
    ] },
    { id: "trope", label: "Trope secundário", icon: "⚔︎", items: [
        "Forced Proximity", "Only One Bed", "Secret Identity", "Marriage of Convenience", "Grumpy x Sunshine", "Touch Her and Die", "Found Family",
        "Secret Letters", "Time Loop", "Bodyguard x Princess", "Roommates", "Academic Rivals", "Unlikely Allies", "Hurt/Comfort", "Jealousy",
        "Enemies with a Common Goal", "Mistaken Identity", "Stuck Together", "Matchmaker Friends", "Caught in the Rain", "Love Triangle", "Amnesia",
        "Road Trip", "Dancing in the Kitchen", "Sharing a Jacket", "Accidental Confession", "Fake Engagement", "Undercover", "Bet Gone Wrong",
        "Locked in a Room", "Stuck in an Elevator", "Sick Day Care", "Last-Minute Plus One", "Dress Up Scene", "Rooftop Confessions", "Late-Night Calls",
        "Shared Playlist", "Slow Dance", "Midnight Drive", "She Falls First", "Protective Instinct", "Redemption Arc", "Morally Gray", "Power Imbalance Reversed",
        "Rival Becomes Ally", "Lie Gets Out of Control", "Public Declaration", "Letters in a Bottle", "Wrong Place, Right Time", "Rescue Scene",
        "Locked Out Together", "Matching Scars", "Hidden Talent Revealed", "Haunted Together", "Cursed Together", "Training Montage"
    ] },
    { id: "profession", label: "Profissões e ocupações", icon: "⚖︎", items: [
        "Detetive e jornalista", "Médica e paciente", "Atriz e diretora", "Advogada e promotora", "Professora e escritora", "Cantora e compositora",
        "Chef e crítica gastronômica", "Princesa e guarda real", "Arqueóloga e historiadora", "Fotógrafa e modelo", "Veterinária e dona de abrigo",
        "Duas universitárias", "Duas herdeiras rivais", "Duas vizinhas", "Duas melhores amigas de infância", "Colegas de quarto", "Duas sobreviventes",
        "Duas vizinhas de porta que dividem a parede fina", "Duas colegas de banda", "Duas candidatas na mesma disputa"
    ].concat(pairUp(ROLES, " e ").map(p => p.charAt(0).toUpperCase() + p.slice(1))) },
    { id: "surprise", label: "Elemento surpresa", icon: "ヽ(°〇°)ﾉ", items: [
        "Uma delas recebe mensagens de alguém do passado.", "Elas trocam cartas sem saber a identidade uma da outra.", "Uma delas tem apenas 24 horas para resolver um problema.",
        "As duas acordam sem lembrar da noite anterior.", "Uma delas está escondendo uma identidade.", "Um objeto perdido conecta suas histórias.",
        "Elas precisam fingir que são um casal.", "Uma promessa feita na infância volta para assombrá-las.", "Uma delas conhece um segredo que a outra esqueceu.",
        "Um encontro casual muda completamente seus planos.", "Um apagão deixa a cidade inteira no escuro.", "Uma mensagem é enviada para o número errado.",
        "Uma delas descobre que está sendo observada.", "Um animal de estimação resolve unir as duas.", "Uma foto antiga revela que elas já se conheciam.",
        "Uma delas herda algo inesperado da outra.", "O mesmo sonho se repete para as duas.", "Uma delas é confundida com outra pessoa famosa.",
        "Um vídeo viral muda a vida das duas.", "Elas descobrem que moram no mesmo prédio há anos.", "Uma carta chega com 10 anos de atraso.",
        "Uma delas ganha uma viagem e precisa levar alguém.", "Uma playlist anônima começa a aparecer no celular de uma delas.", "Um desconhecido paga a conta das duas todo dia.",
        "Uma delas descobre que é parente de uma celebridade.", "Uma das duas acorda em outra época.", "Um erro de reserva as coloca no mesmo quarto.",
        "Uma delas encontra o próprio nome em um livro antigo.", "Um prêmio de consolação traz as duas para o mesmo evento.", "Uma delas descobre que o amor da vida da outra era uma farsa.",
        "Um pedido de ajuda chega de madrugada.", "Elas são as únicas pessoas acordadas na cidade.", "O celular de uma delas toca com o nome da outra, que ela nunca salvou.",
        "Uma delas começa a ver o futuro por um dia.", "Um objeto emprestado nunca é devolvido.", "Elas ficam famosas por um mal-entendido.",
        "Uma delas tem um irmão ou irmã que as aproxima sem querer.", "Um crime cometido na cidade as envolve.", "Um convite de casamento chega com um nome apagado.",
        "Uma delas descobre um talento que não sabia que tinha.", "Uma delas é contratada para vigiar a outra.", "Uma delas aparece no lugar errado na hora certa."
    ] },
    { id: "tone", label: "Tom da história", icon: "𓂃✎", items: [
        "Comédia romântica", "Drama psicológico", "Romance melancólico", "Suspense romântico", "Mistério", "Fantasia sombria", "Romance adolescente",
        "Tragédia", "Slice of Life", "Aventura", "Romance gótico", "Terror leve", "Sátira", "Drama de época", "Fofo e confortável (comfort fic)",
        "Angst pesado", "Noir", "Comédia de erros", "Thriller psicológico", "Romance de verão", "Realismo mágico", "Drama familiar", "Road movie",
        "Fantasia leve", "Ficção científica", "Terror psicológico", "Western", "Melodrama", "Musical", "Coming of age", "Estudo de personagem", "Escapista e açucarado"
    ] },
    { id: "object", label: "Objeto importante", icon: ".ᐟ.ᐟ", items: OBJECTS.flatMap(object => OBJECT_SUFFIX.map(suffix => object + suffix)) },
    { id: "ending", label: "Final obrigatório", icon: "▶", items: [
        "Happy Ending", "Tragic Ending", "Bittersweet Ending", "Open Ending", "They Never Meet Again", "Reconciliation", "Sacrifice", "Plot Twist",
        "Full Circle", "A promessa de um reencontro", "Epílogo anos depois", "Casamento", "Uma carta de despedida", "Um beijo na chuva (ou no sol)",
        "Elas se separam, mas se reencontram em outra vida", "Um final em que só uma delas sobrevive", "Final aberto com a última frase cortada", "Final em que tudo era um sonho",
        "Elas escolhem a amizade, por enquanto", "Uma viagem sem destino juntas", "Mudança de cidade juntas", "Um final feliz, mas com um preço", "Cena pós-créditos surpresa",
        "Elas se reencontram depois de muitos anos", "Final em um aeroporto", "Final em uma estação de trem", "Uma última dança", "Final narrado por outra pessoa",
        "Um recomeço improvável", "Final em que uma delas desaparece de vez", "Elas ficam juntas, mas ninguém sabe"
    ] },
    { id: "dynamic", label: "Dinâmica da dupla", icon: "☾☀︎", items: [
        "Uma é caótica, a outra é metódica.", "Uma fala demais, a outra quase nada.", "Uma é rica, a outra está sem dinheiro.", "Uma é a mais velha e protetora, a outra é teimosa.",
        "Uma é famosa, a outra odeia atenção.", "As duas são orgulhosas demais para pedir desculpas.", "Uma é romântica incurável, a outra jura que não acredita em amor.",
        "As duas são igualmente competitivas.", "Uma é a nova na cidade, a outra conhece todos os segredos dela.", "Uma é medrosa, a outra se joga em tudo.",
        "Uma mente muito bem, a outra é sincera demais.", "Uma é otimista, a outra é cética.", "Uma vive no passado, a outra só pensa no futuro.",
        "Uma é popular, a outra é invisível.", "As duas guardam segredos uma da outra.", "Uma salva a outra o tempo todo.", "As duas se provocam sem parar.",
        "Uma é organizada, a outra é desastrada.", "Uma é artista, a outra é prática.", "Uma é leal demais, a outra foge de compromisso.",
        "As duas são tímidas e esperam a outra dar o primeiro passo.", "Uma é caçadora e a outra é a presa que se recusa a fugir.", "Uma é líder, a outra odeia receber ordens.",
        "Uma é sonhadora, a outra é realista demais.", "Uma tem medo de se apegar, a outra se apega a tudo."
    ] },
    { id: "meet", label: "Primeiro encontro", icon: "⌯✈︎", items: [
        "Em uma biblioteca quase fechando", "Na fila de um café", "Em uma festa onde nenhuma queria estar", "Num ônibus lotado", "Num casamento de desconhecidos",
        "No primeiro dia de aula", "Em um velório", "Numa loja de discos", "Durante uma tempestade, no mesmo abrigo", "Num aeroporto com o voo atrasado",
        "Num show pequeno de uma banda desconhecida", "No elevador que para entre dois andares", "Numa livraria de bairro", "Num hospital de madrugada",
        "Num set de filmagem", "Numa festa de aniversário de um amigo em comum", "Em uma lavanderia 24 horas", "Num trem noturno", "Numa exposição de arte",
        "Na casa de um parente distante", "Numa balada onde a música é alta demais", "Num brechó", "Na praia ao amanhecer", "Numa aula de dança", "Numa mudança de apartamento",
        "No telhado de um prédio", "Num campo de futebol", "Em um museu vazio", "Na fila de um show", "Numa entrevista de emprego", "Num cinema com a sessão quase vazia",
        "Em uma noite de karaokê", "Numa cidade onde nenhuma das duas mora", "Numa padaria às 5 da manhã", "Num aplicativo de mensagens, sem se verem"
    ] },
    { id: "format", label: "Formato", icon: "▤", items: [
        "One-shot", "Fanfic de vários capítulos", "Drabble (100 palavras)", "Narrada em cartas", "Em formato de mensagens/chat", "Narrada em primeira pessoa",
        "Dois pontos de vista alternados", "Narrada fora de ordem cronológica", "Roteiro/script", "Diário", "Capítulo único com cenas curtas", "Fanfic em 5 atos",
        "Série de drabbles", "Entrevistas e reportagens", "Fanfic em formato de playlist (uma cena por música)", "Narrada em segunda pessoa", "Contada em flashbacks", "Fic de 24 horas, hora a hora"
    ] },
    { id: "secret", label: "Segredo escondido", icon: "ꄗ", items: [
        "Uma delas já se apaixonou pela outra anos atrás.", "Uma delas mentiu sobre o próprio nome.", "Uma delas está doente e não contou.", "Uma delas é herdeira de uma fortuna que não quer.",
        "Uma delas é a autora de uma carta anônima famosa.", "Uma delas está de mudança e não contou.", "Uma delas já sabia quem a outra era desde o início.",
        "Uma delas fez algo imperdoável no passado.", "Uma delas está sendo chantageada.", "Uma delas é a pessoa por trás de um perfil anônimo.",
        "Uma delas já esteve na prisão.", "Uma delas é, na verdade, de uma família inimiga.", "Uma delas tem um filho ou filha que ninguém conhece.",
        "Uma delas está trabalhando para o outro lado.", "Uma delas guarda o diário de alguém que morreu.", "Uma delas nunca terminou o relacionamento anterior.",
        "Uma delas tem poderes que esconde.", "Uma delas sabe como a história da outra termina.", "Uma delas foi a razão de uma tragédia na vida da outra.",
        "Uma delas foi contratada para se aproximar da outra.", "Uma delas é a última pessoa que viu alguém desaparecido.", "Uma delas não é quem parece ser por causa de uma maldição.",
        "As duas escondem o mesmo segredo uma da outra.", "Uma delas escreveu uma música sobre a outra e nunca mostrou."
    ] },
    { id: "obstacle", label: "Obstáculo", icon: "◷", items: [
        "As famílias das duas são inimigas.", "Uma delas vai se mudar em breve.", "Elas moram em países diferentes.", "Uma delas está noiva de outra pessoa.",
        "Fofocas se espalham pela escola ou cidade.", "Há uma cláusula que proíbe as duas de se envolverem.", "O medo de se machucar de novo.", "Ciúmes de uma pessoa do passado.",
        "A fama e os paparazzi.", "Uma maldição que separa quem se ama.", "Uma guerra entre os reinos delas.", "As carreiras exigem que sigam caminhos diferentes.",
        "Uma delas ainda não aceitou quem é.", "A diferença de classe social.", "Um mal-entendido que ninguém corrige.", "Uma promessa feita a outra pessoa.",
        "Uma delas está de luto.", "Um ex que não aceita o fim.", "Uma delas está em coma ou em tratamento.", "Duas rotinas incompatíveis.",
        "Uma delas trabalha para o inimigo da outra.", "O medo de estragar a amizade.", "O horário de uma é o oposto da outra.", "Uma delas é a pessoa mais difícil de convencer do mundo.",
        "A distância entre cidades e a falta de dinheiro para viajar.", "Uma delas está se escondendo da lei.", "Uma tradição que exige um casamento arranjado.", "Alguém fotografou as duas e ameaça publicar."
    ] },
    { id: "season", label: "Época do ano", icon: "𓂃☂︎", items: [
        "Véspera de Natal", "Carnaval", "Primeiro dia do verão", "Halloween", "Aniversário de uma delas", "Semana de formatura", "Dia dos Namorados", "Virada do Ano Novo",
        "Festa junina", "Outono de folhas alaranjadas", "Uma semana inteira de chuva", "Noite de eclipse", "Semana de provas finais", "Páscoa", "Temporada de festivais",
        "Último dia de aula", "Dia da mudança", "Noite de lua cheia", "Inverno rigoroso", "Primavera com flores por todo lado", "Madrugada de um sábado", "Feriado prolongado",
        "Dia do casamento de alguém", "Semana de estreia de um filme ou peça", "Aniversário da morte de alguém querido", "Primeira neve do ano", "Dia do vestibular", "Noite de São João"
    ] },
    { id: "quote", label: "Frase de abertura", icon: "˗ˏˋ ★ ˎˊ˗", items: [
        "“Você devia ter me contado antes.”", "“Eu não esperava que fosse você.”", "“Isso não era para estar acontecendo.”", "“Pode fingir que não me conhece, por favor?”",
        "“Eu me lembro de tudo, só não do seu nome.”", "“Você é a última pessoa que eu queria ver hoje.”", "“Prometo que é a última vez que peço isso.”", "“Se eu te contar, você me odeia.”",
        "“Eu fiz uma coisa e não sei como te explicar.”", "“Não olha para mim assim.”", "“Eu só precisava de um lugar para ficar por uma noite.”", "“Que bom que você ainda guarda isso.”",
        "“Eu não sei se você vai gostar de saber.”", "“Não foi um acidente.”", "“Pelo menos desta vez, fique.”", "“Deve haver uma explicação.”", "“Eu jurei que nunca mais voltaria aqui.”",
        "“Você cortou o cabelo.”", "“Tem algo que eu preciso te devolver.”", "“Isso é a pior ideia que eu já tive.”", "“Alguém me avisou que você viria?”", "“Cuidado, ela morde.”",
        "“Eu já te vi em algum lugar.”", "“Você me deve uma explicação.”", "“Eu estava esperando você aparecer.”", "“A gente podia só fingir que nada aconteceu.”", "“Ninguém precisa saber.”",
        "“Eu pensei em você hoje.”", "“Não era para ter dado certo.”", "“Eu não sei como você me encontrou.”"
    ] }
];

// ---------- CONTEÚDO ESPECIAL DE CADA SHIPP ----------

const normalizeShipName = name => String(name || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const SHIP_SPECIALS = {
    sweetcc: {
        characters: ["Cairo Sweet", "CC Walker"],

        ideas: [
            "Cairo precisa ajudar CC a estudar literatura, mas as sessões de estudo começam a terminar em conversas que nenhuma das duas planejava ter.",
            "CC aceita fingir ser namorada de Cairo durante um fim de semana em uma mansão antiga. O problema é que Cairo parece estar levando a encenação a sério demais.",
            "Uma estudante popular e uma garota misteriosa são obrigadas a dividir um projeto sobre Frankenstein. Entre provocações e páginas rabiscadas, algo começa a mudar.",
            "CC descobre que Cairo guarda um segredo sobre sua família e decide investigar. Cairo, por sua vez, parece muito mais interessada em manter CC por perto.",
            "Uma festa de Halloween, uma mansão isolada e duas garotas que definitivamente não deveriam estar se apaixonando.",
            "Cairo escreve histórias sobre pessoas que conhece. CC descobre que se tornou a protagonista de uma delas, mas não sabe se gosta do final.",
            "Uma garota que acredita em monstros e outra que talvez seja um deles começam a se encontrar todas as noites na biblioteca.",
            "CC precisa escolher entre uma oportunidade importante no futebol e passar mais tempo com a única pessoa que consegue tirá-la do sério."
        ],

        dates: [
            { title: "Um encontro em uma livraria antiga, terminando com as duas lendo trechos de seus livros favoritos uma para a outra.", phrase: "“Você é a única história que eu não consigo terminar de ler.”" },
            { title: "Uma visita noturna a uma mansão histórica, com velas, música clássica e uma dança improvisada.", phrase: "“Se alguém perguntar, esta noite nunca aconteceu.”" },
            { title: "Uma sessão de cinema particular com filmes de terror, cobertores e uma disputa para decidir quem sente menos medo.", phrase: "“Não precisa fingir que não está com medo. Eu também não vou sair daqui.”" },
            { title: "Um piquenique no jardim durante a madrugada, com café, doces e conversas sobre coisas que nunca contariam a mais ninguém.", phrase: "“Eu gosto de você até quando não está tentando ser interessante.”" },
            { title: "Uma visita a uma exposição de arte seguida de uma competição para interpretar as obras da maneira mais absurda possível.", phrase: "“Talvez eu não entenda de arte, mas reconheceria você em qualquer quadro.”" }
        ]
    },

    wenclair: {
        characters: ["Wednesday Addams", "Enid Sinclair"],

        ideas: [
            "Uma investigação sobrenatural obriga duas colegas de quarto completamente opostas a passar as férias juntas em uma cidade que parece esconder mais segredos do que moradores.",
            "Enid começa a receber cartas anônimas. Wednesday decide descobrir o remetente, embora não admita que está mais preocupada com quem está tentando conquistar sua colega de quarto.",
            "Uma lobisomem e uma garota que não acredita em finais felizes precisam fingir um relacionamento para resolver um problema na Academia Nunca Mais.",
            "Wednesday escreve uma história de mistério e percebe que, sem querer, transformou Enid na personagem principal. O problema é que não consegue decidir como terminar a história.",
            "Depois de uma discussão, Enid deixa de falar com Wednesday. Wednesday descobre que o silêncio da colega é consideravelmente pior do que qualquer reclamação que já recebeu.",
            "Uma maldição faz com que Wednesday e Enid compartilhem os sonhos. O que começa como um inconveniente rapidamente se transforma em uma maneira de conhecerem partes uma da outra que nunca foram reveladas.",
            "Durante uma viagem escolar, as duas acabam perdidas em uma cidade pequena e precisam encontrar abrigo antes do amanhecer.",
            "Wednesday recebe a tarefa de investigar uma série de desaparecimentos. Enid insiste em acompanhá-la, mesmo quando fica claro que a investigação está relacionada ao passado de sua família."
        ],

        dates: [
            { title: "Uma noite no observatório, observando estrelas enquanto Enid tenta ensinar Wednesday a reconhecer constelações.", phrase: "“Você não precisa gostar das estrelas. Só precisa ficar até eu terminar de mostrar.”" },
            { title: "Um passeio por uma feira de Halloween, com Enid escolhendo fantasias e Wednesday fingindo não estar se divertindo.", phrase: "“Você é irritantemente difícil de ignorar.”" },
            { title: "Uma visita a uma floricultura, onde Enid escolhe flores para Wednesday e recebe em troca uma planta carnívora.", phrase: "“Não são flores. São uma declaração de intenções.”" },
            { title: "Uma tarde chuvosa em uma cafeteria, dividindo uma mesa perto da janela e observando as pessoas passarem.", phrase: "“Eu poderia me acostumar com a sua companhia. Infelizmente.”" },
            { title: "Um passeio noturno por um cemitério antigo, seguido de chocolate quente em uma lanchonete aberta de madrugada.", phrase: "“Se você contar a alguém que gostei desta noite, negarei até a morte.”" }
        ]
    },

    piptara: {
        characters: ["Pippa Fitz-Amobi", "Tara Carpenter"],

        ideas: [
            "Uma investigação sobre um caso antigo aproxima duas estudantes de Direito. Uma acredita que toda verdade merece ser descoberta; a outra sabe muito bem o preço de reviver o passado.",
            "Tara começa a receber mensagens de um número desconhecido. Pip promete ajudá-la a descobrir quem está por trás delas, mas a investigação acaba revelando segredos que as duas preferiam esquecer.",
            "Uma estudante de Direito e uma estagiária do tribunal precisam trabalhar juntas em um caso que envolve uma testemunha misteriosa.",
            "Tara não se lembra de parte de seu passado. Pip sabe mais do que deveria e precisa decidir até onde está disposta a ir para protegê-la.",
            "Depois de uma investigação mal resolvida, Pip recebe uma carta de Tara com uma única pergunta: por que você nunca me contou a verdade?",
            "Duas garotas com históricos complicados se conhecem durante uma investigação universitária e descobrem que confiar em alguém pode ser mais assustador do que encontrar um culpado.",
            "Pip decide investigar um caso que Tara gostaria de deixar para trás. As duas precisam descobrir se conseguem construir algo juntas sem permitir que o passado determine o futuro.",
            "Uma testemunha desaparece na véspera de um julgamento importante, e as duas estudantes acabam envolvidas em uma corrida para descobrir o que realmente aconteceu."
        ],

        dates: [
            { title: "Um passeio por uma livraria, seguido de café e uma competição para encontrar o livro com a sinopse mais absurda.", phrase: "“Você faz perguntas demais. Ainda bem que eu gosto de respondê-las.”" },
            { title: "Uma visita a um cinema antigo, com pipoca dividida e comentários sussurrados durante o filme.", phrase: "“Pela primeira vez, não estou tentando descobrir como tudo termina.”" },
            { title: "Uma tarde em uma feira de antiguidades, procurando objetos que tenham histórias interessantes.", phrase: "“Acho que encontrei algo que vale a pena levar para casa.”" },
            { title: "Um jantar em um restaurante pequeno, longe de qualquer pessoa que conheça as duas.", phrase: "“Hoje você não precisa investigar nada. Só fica comigo.”" },
            { title: "Uma viagem de trem sem destino definido, com uma playlist compartilhada e conversas sobre o futuro.", phrase: "“Não sei onde vamos chegar, mas não me importo de ir com você.”" }
        ]
    },

    pipvada: {
        characters: ["Pippa Fitz-Amobi", "Vada Cavell"],

        ideas: [
            "Vada se envolve em uma situação misteriosa e Pip promete não investigar. Naturalmente, a promessa dura menos de um dia.",
            "Uma garota que evita falar sobre o passado e outra que não consegue deixar uma pergunta sem resposta precisam dividir um projeto escolar.",
            "Pip começa a receber mensagens anônimas que parecem conhecer detalhes da vida de Vada. Quanto mais investiga, mais percebe que talvez não devesse ter começado.",
            "Vada decide participar de um concurso de investigação com Pip, mesmo sem entender por que alguém escolheria passar o fim de semana inteiro procurando pistas.",
            "Depois de um acontecimento inesperado, Pip se torna a única pessoa em quem Vada confia para ajudá-la a encontrar alguém desaparecido.",
            "Uma amizade improvável começa quando Vada encontra Pip tendo uma crise de ansiedade em uma festa. Nenhuma das duas sabe muito bem como conversar sobre o que aconteceu, mas decidem tentar.",
            "Pip precisa escrever um artigo sobre sobreviventes de acontecimentos traumáticos. Vada aceita conversar com ela, desde que nenhuma pergunta seja feita sem permissão.",
            "As duas recebem cartas destinadas a pessoas diferentes, mas descobrem que todas foram escritas pelo mesmo remetente."
        ],

        dates: [
            { title: "Uma noite de filmes ruins, cobertores espalhados pela sala e comentários sarcásticos sobre cada cena.", phrase: "“Não sei se gosto mais do filme ou de assistir você reclamando dele.”" },
            { title: "Um passeio por uma loja de discos, escolhendo músicas que lembrem uma à outra.", phrase: "“Quando ouvir essa música, espero que pense em mim.”" },
            { title: "Uma ida a um parque de diversões, com Vada insistindo nas atrações mais assustadoras e Pip tentando manter a dignidade.", phrase: "“Você pode segurar minha mão. É uma questão de segurança.”" },
            { title: "Um piquenique improvisado no quintal, com comida comprada às pressas e uma conversa que acaba durando horas.", phrase: "“Acho que não preciso de um plano para gostar de estar aqui.”" },
            { title: "Uma viagem curta até uma cidade vizinha, com paradas em lojas aleatórias e fotografias que nenhuma das duas pretende apagar.", phrase: "“Quero lembrar de hoje exatamente como foi.”" }
        ]
    },

    astralie: {
        characters: ["Astrid Deetz", "Natalie"],

        ideas: [
            "Duas garotas que não planejam se envolver com ninguém acabam trabalhando juntas em um projeto artístico que exige que revelem mais sobre si mesmas do que gostariam.",
            "Astrid começa a fotografar lugares abandonados da cidade. Natalie aparece em quase todas as fotografias, mesmo sem saber que está sendo observada.",
            "Uma garota cética e outra que acredita em possibilidades improváveis investigam uma antiga lenda local.",
            "Depois de um encontro inesperado, Astrid e Natalie começam a trocar cartas escondidas dentro de livros de uma biblioteca.",
            "As duas são selecionadas para participar de uma competição artística. O que começa como rivalidade se transforma em uma parceria difícil de explicar.",
            "Natalie conhece um segredo sobre a família Deetz e promete não contar a ninguém. Astrid começa a questionar por que confia tanto em uma garota que acabou de conhecer.",
            "Um projeto de fotografia aproxima duas adolescentes que enxergam o mundo de maneiras completamente diferentes.",
            "Astrid e Natalie ficam presas em uma pequena cidade durante uma viagem e precisam encontrar maneiras de passar o tempo até conseguirem voltar para casa."
        ],

        dates: [
            { title: "Uma visita a uma galeria de arte, seguida de uma tentativa de desenhar uma à outra sem mostrar o resultado.", phrase: "“Você fica muito mais bonita quando não percebe que estou olhando.”" },
            { title: "Um passeio por um antiquário, escolhendo objetos estranhos e inventando histórias para seus antigos donos.", phrase: "“Talvez algumas coisas encontrem exatamente quem deveriam encontrar.”" },
            { title: "Uma sessão de fotografia ao entardecer, registrando lugares que parecem ter parado no tempo.", phrase: "“Eu queria guardar esse momento. Você acabou aparecendo em todas as fotos.”" },
            { title: "Uma tarde em um museu, com uma parada para tomar chocolate quente e discutir qual obra representa melhor cada uma.", phrase: "“Acho que você é minha exposição favorita.”" },
            { title: "Uma visita a uma cidade vizinha, explorando lojas pequenas e tirando fotografias de lugares esquecidos.", phrase: "“Não importa muito o lugar quando a companhia é boa.”" }
        ]
    }
};

// Identifica o casal sem depender da ordem em que as personagens aparecem.
function getShipSpecial(ship) {
    if (!ship || !ship.a || !ship.b) return null;

    const names = [
        normalizeShipName(ship.a.name),
        normalizeShipName(ship.b.name)
    ].sort().join("|");

    return Object.values(SHIP_SPECIALS).find(pair =>
        pair.characters
            .map(normalizeShipName)
            .sort()
            .join("|") === names
    ) || null;
}

// Remove repetidos
PLOT_CATEGORIES.forEach(c => { if (c.items) c.items = [...new Set(c.items)]; });

// Modo caos: combinações propositalmente contraditórias (os valores precisam existir nas listas acima)
const CHAOS_RULES = [
    { tone: "Comédia romântica", ending: "Tragic Ending" },
    { tone: "Tragédia", ending: "Happy Ending" },
    { relationship: "Love at First Sight", ending: "They Never Meet Again" },
    { relationship: "Slow Burn", surprise: "Uma delas tem apenas 24 horas para resolver um problema." },
    { tone: "Slice of Life", setting: "Futuro distópico" },
    { relationship: "Secret Relationship", surprise: "Elas precisam fingir que são um casal." },
    { tone: "Romance gótico", setting: "Verão em uma cidade litorânea", ending: "Happy Ending" },
    { relationship: "Childhood Friends", surprise: "Elas trocam cartas sem saber a identidade uma da outra." },
    { setting: "Idade Média", profession: "Fotógrafa e modelo" },
    { relationship: "Unrequited Love", ending: "Reconciliation", trope: "Jealousy" },
    { tone: "Fofo e confortável (comfort fic)", climax: "Uma traição coloca tudo a perder.", ending: "Tragic Ending" },
    { setting: "Universo pós-apocalíptico", trope: "Matchmaker Friends", tone: "Comédia romântica" },
    { tone: "Terror psicológico", season: "Primavera com flores por todo lado", relationship: "Fated Mates" },
    { relationship: "Enemies to Lovers", obstacle: "O medo de estragar a amizade." },
    { tone: "Musical", setting: "Cidade sem eletricidade", ending: "They Never Meet Again" },
    { dynamic: "Uma é romântica incurável, a outra jura que não acredita em amor.", relationship: "Love at First Sight", tone: "Noir" },
    { season: "Véspera de Natal", tone: "Terror leve", climax: "Uma carta escrita anos atrás é encontrada." },
    { format: "Drabble (100 palavras)", relationship: "Slow Burn" }
];

// Músicas (título + artista). A capa é buscada na hora; o botão abre a busca no Spotify.
const SONG_LIST = [
    ["Cardigan", "Taylor Swift"], ["Champagne Problems", "Taylor Swift"], ["Cruel Summer", "Taylor Swift"], ["Lover", "Taylor Swift"], ["Style", "Taylor Swift"],
    ["Enchanted", "Taylor Swift"], ["Dress", "Taylor Swift"], ["Wildest Dreams", "Taylor Swift"], ["Love Story", "Taylor Swift"], ["Anti-Hero", "Taylor Swift"],
    ["The Archer", "Taylor Swift"], ["Death by a Thousand Cuts", "Taylor Swift"], ["Willow", "Taylor Swift"], ["August", "Taylor Swift"], ["All Too Well", "Taylor Swift"],
    ["Delicate", "Taylor Swift"], ["Getaway Car", "Taylor Swift"], ["Daylight", "Taylor Swift"], ["Illicit Affairs", "Taylor Swift"], ["Invisible String", "Taylor Swift"],
    ["Good Luck, Babe!", "Chappell Roan"], ["Pink Pony Club", "Chappell Roan"], ["Casual", "Chappell Roan"], ["Red Wine Supernova", "Chappell Roan"], ["Hot To Go!", "Chappell Roan"],
    ["Femininomenon", "Chappell Roan"], ["Naked in Manhattan", "Chappell Roan"], ["Espresso", "Sabrina Carpenter"], ["Please Please Please", "Sabrina Carpenter"], ["Bed Chem", "Sabrina Carpenter"],
    ["Feather", "Sabrina Carpenter"], ["Nonsense", "Sabrina Carpenter"], ["Taste", "Sabrina Carpenter"], ["Juno", "Sabrina Carpenter"], ["Manchild", "Sabrina Carpenter"],
    ["drivers license", "Olivia Rodrigo"], ["vampire", "Olivia Rodrigo"], ["traitor", "Olivia Rodrigo"], ["get him back!", "Olivia Rodrigo"], ["Bad Idea Right?", "Olivia Rodrigo"],
    ["good 4 u", "Olivia Rodrigo"], ["deja vu", "Olivia Rodrigo"], ["lacy", "Olivia Rodrigo"], ["logical", "Olivia Rodrigo"], ["Birds of a Feather", "Billie Eilish"],
    ["What Was I Made For?", "Billie Eilish"], ["ocean eyes", "Billie Eilish"], ["lovely", "Billie Eilish"], ["Lunch", "Billie Eilish"], ["bury a friend", "Billie Eilish"],
    ["when the party's over", "Billie Eilish"], ["Happier Than Ever", "Billie Eilish"], ["The Greatest", "Billie Eilish"], ["Chihiro", "Billie Eilish"], ["Strawberries & Cigarettes", "Troye Sivan"],
    ["Rush", "Troye Sivan"], ["Youth", "Troye Sivan"], ["Heather", "Conan Gray"], ["Maniac", "Conan Gray"], ["Jealous", "Conan Gray"], ["Creepin' Up On You", "Conan Gray"],
    ["Memories", "Conan Gray"], ["Pretty Girl", "Clairo"], ["Bags", "Clairo"], ["Sofia", "Clairo"], ["Amoeba", "Clairo"], ["Motion Sickness", "Phoebe Bridgers"],
    ["Kyoto", "Phoebe Bridgers"], ["Georgia", "Phoebe Bridgers"], ["Funeral", "Phoebe Bridgers"], ["Garden Song", "Phoebe Bridgers"], ["I Know the End", "Phoebe Bridgers"],
    ["Smoking Section", "Phoebe Bridgers"], ["Kiss Me", "Sixpence None The Richer"], ["Lover, You Should've Come Over", "Jeff Buckley"], ["Hallelujah", "Jeff Buckley"],
    ["Last Goodbye", "Jeff Buckley"], ["Dream a Little Dream of Me", "The Mamas & The Papas"], ["California Dreamin'", "The Mamas & The Papas"], ["Fade Into You", "Mazzy Star"],
    ["Such Great Heights", "The Postal Service"], ["Mr. Brightside", "The Killers"], ["Somebody Told Me", "The Killers"], ["When You Were Young", "The Killers"],
    ["Do I Wanna Know?", "Arctic Monkeys"], ["505", "Arctic Monkeys"], ["Mardy Bum", "Arctic Monkeys"], ["R U Mine?", "Arctic Monkeys"], ["Why'd You Only Call Me When You're High?", "Arctic Monkeys"],
    ["I Wanna Be Yours", "Arctic Monkeys"], ["Cherry-coloured Funk", "Cocteau Twins"], ["Dreams", "Fleetwood Mac"], ["Landslide", "Fleetwood Mac"], ["Gold Dust Woman", "Fleetwood Mac"],
    ["Rhiannon", "Fleetwood Mac"], ["Hounds of Love", "Kate Bush"], ["Running Up That Hill", "Kate Bush"], ["Wuthering Heights", "Kate Bush"], ["Shut Up and Dance", "WALK THE MOON"],
    ["Dance, Dance", "Fall Out Boy"], ["Sugar, We're Goin Down", "Fall Out Boy"], ["Misery Business", "Paramore"], ["Still Into You", "Paramore"], ["Ain't It Fun", "Paramore"],
    ["Hard Times", "Paramore"], ["Decode", "Paramore"], ["Teenage Dream", "Katy Perry"], ["Skinny Love", "Bon Iver"], ["Holocene", "Bon Iver"], ["Cherry Wine", "Hozier"],
    ["Take Me to Church", "Hozier"], ["Work Song", "Hozier"], ["Too Sweet", "Hozier"], ["Movement", "Hozier"], ["Ribs", "Lorde"], ["Green Light", "Lorde"],
    ["Royals", "Lorde"], ["Liability", "Lorde"], ["Supercut", "Lorde"], ["Team", "Lorde"], ["Fast Car", "Tracy Chapman"], ["Torn", "Natalie Imbruglia"],
    ["Linger", "The Cranberries"], ["Zombie", "The Cranberries"], ["Creep", "Radiohead"], ["No Surprises", "Radiohead"], ["Karma Police", "Radiohead"], ["Space Song", "Beach House"],
    ["Myth", "Beach House"], ["Pink + White", "Frank Ocean"], ["Ivy", "Frank Ocean"], ["Nights", "Frank Ocean"], ["Sweater Weather", "The Neighbourhood"], ["Dark Red", "Steve Lacy"],
    ["Bad Habit", "Steve Lacy"], ["Thinking Out Loud", "Ed Sheeran"], ["Sweet Disposition", "The Temper Trap"], ["Eu Te Devoro", "Djavan"], ["Sina", "Djavan"],
    ["Esquinas", "Djavan"], ["Dona de Mim", "IZA"], ["Pra Você Guardei o Amor", "Nando Reis"], ["Mais Ninguém", "Banda do Mar"], ["Sozinho", "Caetano Veloso"],
    ["Ela Disse Adeus", "Os Paralamas do Sucesso"], ["Pais e Filhos", "Legião Urbana"], ["Eduardo e Mônica", "Legião Urbana"], ["Tempo Perdido", "Legião Urbana"],
    ["Será", "Legião Urbana"], ["Por Enquanto", "Cássia Eller"], ["Malandragem", "Cássia Eller"], ["Smells Like Teen Spirit", "Nirvana"], ["Heart-Shaped Box", "Nirvana"],
    ["Black Hole Sun", "Soundgarden"], ["Wonderwall", "Oasis"], ["Don't Look Back in Anger", "Oasis"], ["Champagne Supernova", "Oasis"], ["There She Goes", "The La's"],
    ["Mad World", "Gary Jules"], ["Everybody Wants to Rule the World", "Tears for Fears"], ["Pale Blue Eyes", "The Velvet Underground"], ["Sunday Morning", "The Velvet Underground"],
    ["Heroes", "David Bowie"], ["Space Oddity", "David Bowie"], ["Life on Mars?", "David Bowie"], ["Rebel Rebel", "David Bowie"], ["Bohemian Rhapsody", "Queen"],
    ["Somebody to Love", "Queen"], ["Don't Stop Me Now", "Queen"], ["Under Pressure", "Queen"], ["Take On Me", "a-ha"], ["Girls Just Want to Have Fun", "Cyndi Lauper"],
    ["Time After Time", "Cyndi Lauper"], ["True Colors", "Cyndi Lauper"], ["Don't You (Forget About Me)", "Simple Minds"], ["Just Like Heaven", "The Cure"],
    ["Pictures of You", "The Cure"], ["Lovesong", "The Cure"], ["Friday I'm in Love", "The Cure"], ["Love Will Tear Us Apart", "Joy Division"], ["There Is a Light That Never Goes Out", "The Smiths"],
    ["This Charming Man", "The Smiths"], ["Last Night I Dreamt That Somebody Loved Me", "The Smiths"], ["Blue Monday", "New Order"], ["Dancing Queen", "ABBA"],
    ["The Winner Takes It All", "ABBA"], ["Mamma Mia", "ABBA"], ["Dancing in the Dark", "Bruce Springsteen"], ["Thunder Road", "Bruce Springsteen"], ["Hotel California", "Eagles"],
    ["Take It Easy", "Eagles"], ["Moon River", "Audrey Hepburn"], ["La Vie en Rose", "Édith Piaf"], ["Non, je ne regrette rien", "Édith Piaf"], ["Cheek to Cheek", "Ella Fitzgerald"],
    ["Summertime", "Ella Fitzgerald"], ["At Last", "Etta James"], ["Dream a Little Dream", "Ella Fitzgerald"], ["I Put a Spell on You", "Nina Simone"], ["Feeling Good", "Nina Simone"],
    ["Be My Baby", "The Ronettes"], ["Dancing in the Street", "Martha and the Vandellas"], ["Respect", "Aretha Franklin"], ["Natural Woman", "Aretha Franklin"],
    ["Valerie", "Amy Winehouse"], ["Back to Black", "Amy Winehouse"], ["Love Is a Losing Game", "Amy Winehouse"], ["Rolling in the Deep", "Adele"], ["Someone Like You", "Adele"],
    ["Hometown Glory", "Adele"], ["Chasing Pavements", "Adele"], ["Set Fire to the Rain", "Adele"], ["Hello", "Adele"], ["Easy On Me", "Adele"], ["Stay", "Rihanna"],
    ["Diamonds", "Rihanna"], ["We Found Love", "Rihanna"], ["Umbrella", "Rihanna"], ["Halo", "Beyoncé"], ["Crazy in Love", "Beyoncé"], ["Love on Top", "Beyoncé"],
    ["Pray You Catch Me", "Beyoncé"], ["Formation", "Beyoncé"], ["Bad Guy", "Billie Eilish"], ["Cool for the Summer", "Demi Lovato"], ["Skyscraper", "Demi Lovato"],
    ["Heart Attack", "Demi Lovato"], ["Dancing with a Stranger", "Sam Smith"], ["Stay with Me", "Sam Smith"], ["Say Something", "A Great Big World"], ["Ghost", "Justin Bieber"],
    ["Love Yourself", "Justin Bieber"], ["Peaches", "Justin Bieber"], ["Levitating", "Dua Lipa"], ["Houdini", "Dua Lipa"], ["Dance the Night", "Dua Lipa"], ["Illusion", "Dua Lipa"],
    ["New Rules", "Dua Lipa"], ["Don't Start Now", "Dua Lipa"], ["Physical", "Dua Lipa"], ["Break My Heart", "Dua Lipa"], ["Pov", "Ariana Grande"], ["Needy", "Ariana Grande"],
    ["thank u, next", "Ariana Grande"], ["7 rings", "Ariana Grande"], ["Positions", "Ariana Grande"], ["we can't be friends", "Ariana Grande"], ["The Boy Is Mine", "Ariana Grande"],
    ["Bad Romance", "Lady Gaga"], ["Poker Face", "Lady Gaga"], ["Shallow", "Lady Gaga"], ["Always Remember Us This Way", "Lady Gaga"], ["Abracadabra", "Lady Gaga"],
    ["Die With A Smile", "Lady Gaga"], ["Applause", "Lady Gaga"], ["Judas", "Lady Gaga"], ["Alejandro", "Lady Gaga"], ["Paparazzi", "Lady Gaga"], ["Stacy's Brother", "Mad Tsai"]
];
