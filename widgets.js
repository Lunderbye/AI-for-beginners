// Interaktiva widgets för varje kapitel. Kräver deck.js (window.Deck).
(() => {
  const { $, $$, sleep, calm, css } = window.Deck;
  const NS = "http://www.w3.org/2000/svg";
  const svg = (tag, attrs = {}, parent) => {
    const el = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    if (parent) parent.appendChild(el);
    return el;
  };
  const fmt = (n) => Math.round(n).toLocaleString(window.I18N ? I18N.locale : "sv-SE");
  const pause = (ms) => sleep(calm() ? Math.min(ms, 250) : ms);

  // ============ HERO: neuralt nät på canvas + chattbubblor ============
  (() => {
    const cv = $("#heroCanvas"), ctx = cv.getContext("2d");
    let W = 0, H = 0, nodes = [], pulses = [], running = false, cols = [], line = "#333", last = 0;
    const readCols = () => { cols = ["--accent", "--cyan", "--pink", "--orange"].map(css); line = css("--line"); };
    const resize = () => {
      const dpr = Math.min(2, devicePixelRatio || 1);
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.max(30, Math.min(110, Math.round((W * H) / 15000)));
      nodes = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25 }));
      draw(0);
    };
    const D = 150;
    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      for (const n of nodes) {
        if (running && !calm()) { n.x += n.vx; n.y += n.vy; if (n.x < 0 || n.x > W) n.vx *= -1; if (n.y < 0 || n.y > H) n.vy *= -1; }
      }
      ctx.strokeStyle = line; ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < D) { ctx.globalAlpha = (1 - d / D) * .7; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
      }
      ctx.globalAlpha = .8; ctx.fillStyle = line;
      for (const n of nodes) { ctx.beginPath(); ctx.arc(n.x, n.y, 2.2, 0, 7); ctx.fill(); }
      if (running && !calm() && t - last > 140) {
        last = t;
        const a = nodes[(Math.random() * nodes.length) | 0];
        const nb = nodes.filter((b) => b !== a && Math.hypot(a.x - b.x, a.y - b.y) < D);
        if (nb.length) pulses.push({ a, b: nb[(Math.random() * nb.length) | 0], p: 0, c: cols[(Math.random() * cols.length) | 0] });
      }
      for (const pu of pulses) {
        pu.p += .018;
        const x = pu.a.x + (pu.b.x - pu.a.x) * pu.p, y = pu.a.y + (pu.b.y - pu.a.y) * pu.p;
        ctx.globalAlpha = Math.sin(Math.PI * Math.min(1, pu.p));
        ctx.fillStyle = pu.c; ctx.shadowColor = pu.c; ctx.shadowBlur = 12;
        ctx.beginPath(); ctx.arc(x, y, 3.4, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
      }
      pulses = pulses.filter((p) => p.p < 1);
      ctx.globalAlpha = 1;
      if (running) requestAnimationFrame(draw);
    }
    readCols();
    addEventListener("resize", resize);
    document.addEventListener("themechange", () => { readCols(); draw(0); });
    window.Deck.onEnter("hero", () => { if (!running) { running = true; requestAnimationFrame(draw); } chat(); });
    window.Deck.onLeave("hero", () => { running = false; });
    resize();

    const PAIRS = L_([
      ["Förklara AI så att min mormor förstår.", "Tänk dig en assistent som har läst nästan allt som någonsin skrivits, och som blivit extremt bra på att gissa vad som kommer härnäst."],
      ["Vad är skillnaden mellan en chatbot och en agent?", "En chatbot svarar på frågor. En agent får ett mål och utför uppgiften själv, steg för steg, med hjälp av verktyg."],
      ["Kan AI ta över mitt jobb?", "Troligare är att AI tar över delar av jobbet, de tråkiga delarna, och att de som kan använda AI får ett försprång."],
    ], [
      ["Explain AI so that my gran understands it.", "Imagine an assistant that has read almost everything ever written, and has become extremely good at guessing what comes next."],
      ["What's the difference between a chatbot and an agent?", "A chatbot answers questions. An agent is given a goal and carries out the task itself, step by step, using tools."],
      ["Can AI take over my job?", "More likely, AI will take over parts of your job, the boring parts, and people who know how to use AI will get a head start."],
    ]);
    let chatTok = 0, k = 0;
    async function type(el, text, speed, t) {
      el.textContent = ""; el.classList.add("caret");
      if (calm()) { el.textContent = text; el.classList.remove("caret"); return; }
      for (let i = 0; i < text.length; i++) { if (t !== chatTok) return; el.textContent += text[i]; await sleep(speed); }
      el.classList.remove("caret");
    }
    async function chat() {
      const t = ++chatTok;
      while (t === chatTok && window.Deck.current().id === "hero") {
        const [q, a] = PAIRS[k++ % PAIRS.length];
        $("#heroA").textContent = "";
        await type($("#heroQ"), q, 38, t); await sleep(500);
        await type($("#heroA"), a, 22, t); await sleep(4200);
      }
    }
  })();

  // ============ KAP 1: AI-cirklar ============
  (() => {
    const el = $("#nestSvg");
    const C = [
      { id: "ai", r: 225, col: "--blue", name: "AI", full: T_("Artificiell intelligens"), en: "Artificial Intelligence",
        d: T_("Allt där datorer gör saker som vi tidigare trodde krävde mänsklig intelligens: planera, känna igen, förstå, bestämma. Begreppet myntades 1956."),
        ex: [T_("♟️ Schackdatorer"), T_("🗺️ Vägval i GPS:en"), T_("👾 Fiender i datorspel"), T_("📋 Regelbaserade system")] },
      { id: "ml", r: 170, col: "--cyan", name: "Machine Learning", full: T_("Maskininlärning"), en: "Machine Learning",
        d: T_("Datorn lär sig mönster från data i stället för att följa regler som en människa har skrivit. Ju mer data, desto bättre."),
        ex: [T_("📧 Spamfilter"), T_("🎬 Netflix-tips"), T_("💳 Bedrägerilarm på kortet"), T_("📈 Prognoser")] },
      { id: "dl", r: 118, col: "--accent", name: "Deep Learning", full: T_("Djupinlärning"), en: "Deep Learning",
        d: T_("Ett sätt att göra maskininlärning: neurala nätverk i många lager som själva hittar mönster i bilder, ljud och text. Oftast tränas de för att <b class='k'>känna igen och bedöma</b>."),
        q: [T_("”Vad är det här?”"), T_("”En katt, 97 % säker.”")],
        ex: ["🤳 Face ID", T_("🗣️ Röstassistenter"), T_("🚗 Självkörande bilar"), T_("🩻 Röntgenanalys")] },
      { id: "gen", r: 66, col: "--pink", name: "GenAI", full: T_("Generativ AI"), en: "Generative AI",
        d: T_("Djupinlärning som <b class='k'>skapar något nytt</b> i stället för att bedöma: text, bilder, ljud, video och kod. Den bygger svaret bit för bit, och läser hela tiden det den själv just skrivit för att välja nästa bit. Här finns språkmodellerna (LLM) som ChatGPT och Claude."),
        q: [T_("”Gör något nytt!”"), T_("”Rita en katt i rymddräkt.”")],
        ex: ["💬 ChatGPT", "🟠 Claude", "✦ Gemini", "🎨 Midjourney", "👩‍💻 Copilot"] },
    ];
    // På engelska vore rubriken (c.en) samma ord som namnet under: visa i stället var cirkeln ligger.
    const EN_LVL = { ai: "The umbrella term", ml: "A part of AI", dl: "A part of machine learning", gen: "A part of deep learning" };
    const cx = 280, bottom = 462;
    C.forEach((c) => {
      const g = svg("g", { "data-id": c.id }, el);
      const cy = bottom - c.r;
      const circ = svg("circle", { cx, cy, r: c.r }, g);
      c.g = g; c.circ = circ;
      const t = svg("text", { x: cx, y: cy - c.r + (c.id === "gen" ? 62 : 34), "text-anchor": "middle", "font-size": c.id === "gen" ? 17 : 20 }, g);
      t.textContent = c.name; c.t = t;
      g.addEventListener("click", (e) => { e.stopPropagation(); pick(c.id); });
    });
    const paint = () => C.forEach((c) => { const col = css(c.col); c.g.style.color = col; c.circ.setAttribute("stroke", col); c.circ.setAttribute("fill", col); c.t.setAttribute("fill", col); });
    function pick(id) {
      const c = C.find((x) => x.id === id);
      C.forEach((x) => x.g.classList.toggle("on", x.id === id)); el.classList.add("picked");
      $("#nestInfo").innerHTML = `<h4>${L_(c.en, EN_LVL[c.id])}</h4><h3 style="color:var(${c.col})">${c.full}</h3><p>${c.d}</p>${c.q ? `<p style="margin:.2rem 0 .4rem"><b>${T_("Frågan den svarar på:")}</b> ${c.q[0]} → <i>${c.q[1]}</i></p>` : ""}<div class="ex-chips">${c.ex.map((x) => `<span>${x}</span>`).join("")}</div>`;
    }
    paint(); document.addEventListener("themechange", paint);
    pick("ai");
  })();

  // ============ KAP 2: tidslinje ============
  (() => {
    const EV = [
      [1943, "🧠", T_("Den första konstgjorda neuronen"), T_("McCulloch och Pitts beskriver en matematisk modell av en hjärncell. Grunden till alla neurala nätverk.")],
      [1950, "🎩", T_("Turingtestet"), T_("Alan Turing frågar: ”Kan maskiner tänka?” och föreslår ett test: kan en dator lura oss att den är en människa?")],
      [1956, "🏫", T_("Ordet ”AI” föds"), T_("Dartmouth-konferensen i USA. John McCarthy myntar begreppet <i>Artificial Intelligence</i>. Optimismen är enorm: man tror att problemet ska vara löst inom en generation.")],
      [1958, "🔌", T_("Perceptronen"), T_("Frank Rosenblatt bygger en maskin som lär sig känna igen enkla mönster. Tidningarna skriver om en dator som snart ska kunna gå, prata och se.")],
      [1966, "💬", T_("ELIZA: den första chatboten"), T_("Joseph Weizenbaum på MIT skapar ett program som låtsas vara terapeut. Folk anförtror sig åt den, trots att den bara speglar deras egna ord.")],
      [1974, "❄️", T_("Den första AI-vintern"), T_("Löftena infrias inte. Datorerna är för svaga, forskningspengarna försvinner och AI blir omodernt i nästan ett decennium.")],
      [1980, "🏭", T_("Expertsystemen"), T_("Företag bygger AI av tusentals handskrivna ”om–så”-regler. Det fungerar inom smala områden, men är dyrt och skört.")],
      [1986, "🔁", "Backpropagation", T_("Rumelhart, Hinton och Williams visar hur neurala nätverk kan lära sig av sina egna fel. Metoden används fortfarande i dag.")],
      [1987, "❄️", T_("Den andra AI-vintern"), T_("Marknaden för expertsystem kraschar. ”AI” blir nästan ett fult ord och forskarna börjar säga ”maskininlärning” i stället.")],
      [1997, "♟️", T_("Deep Blue slår Kasparov"), T_("IBM:s schackdator besegrar världsmästaren Garry Kasparov. Men det är råstyrka och regler, inte inlärning.")],
      [2011, "📱", T_("Siri och Watson"), T_("IBM Watson vinner frågesporten Jeopardy! och Apple lanserar Siri. AI flyttar in i fickan.")],
      [2012, "🖼️", T_("Djupinlärningens genombrott"), T_("Nätverket AlexNet krossar konkurrensen i bildigenkänning (ImageNet), tränat på grafikkort (GPU). Startskottet för dagens AI.")],
      [2016, "⚫", "AlphaGo", T_("DeepMinds AI slår världsstjärnan Lee Sedol i Go, ett spel med fler möjliga ställningar än det finns atomer i universum.")],
      [2017, "⚡", "”Attention Is All You Need”", T_("Forskare på Google presenterar <i>Transformer</i>-arkitekturen. Det är T:et i GPT, och grunden för alla moderna språkmodeller.")],
      [2018, "📖", T_("GPT-1 och BERT"), T_("De första stora förtränade språkmodellerna. De läser enorma mängder text och lär sig språkets mönster.")],
      [2020, "🚀", "GPT-3", T_("175 miljarder parametrar. Skriver texter som är svåra att skilja från människors, men används mest av utvecklare.")],
      [2022, "✨", "ChatGPT", T_("30 november 2022. Över 100 miljoner användare på ungefär två månader, den snabbast växande appen dittills. Samma år slår bildgeneratorer som Midjourney och Stable Diffusion igenom.")],
      [2023, "🏁", T_("Kapplöpningen"), T_("GPT-4, Claude, Llama och Gemini. Alla stora techbolag satsar miljarder. EU enas om AI-förordningen, <i>AI Act</i>.")],
      [2024, "🏅", T_("Nobelpris och multimodalitet"), T_("Nobelpriset i fysik går till Hopfield och Hinton, och i kemi bland annat till Hassabis och Jumper för AlphaFold. Modeller som ser, hör och pratar, och de första <i>reasoning models</i> som tänker innan de svarar.")],
      [2025, "🤖", T_("Agenternas år"), T_("AI går från att svara till att utföra: agenter som skriver kod, surfar och använder verktyg. Standarder som MCP kopplar ihop AI med system. EU:s AI Act börjar gälla stegvis.")],
      [2026, "📍", T_("Idag"), T_("AI finns i mejlen, dokumenten och telefonen. Frågan är inte längre <i>om</i> vi ska använda AI, utan <i>hur</i>.")],
    ];
    // Historiska bilder från Wikimedia Commons (källor och licenser: site/historia/KÄLLOR.md).
    // fx/fy = var nyckeldelen sitter (andel av bredd/höjd), z = hur stor del av bildens kortsida
    // som ryms i medaljongen, ink = svart grafik på ljus/transparent botten (inverteras i mörkt tema).
    const PH = {
      1943: { f: "historia/1943.jpg", w: 490, h: 662, fx: 0.63, fy: 0.28, z: 0.38, ink: 0, by: "Iapx86", lic: "CC BY-SA 3.0", src: "https://commons.wikimedia.org/wiki/File:Lettvin_Pitts.jpg" },
      1950: { f: "historia/1950.jpg", w: 800, h: 1067, fx: 0.52, fy: 0.3, z: 0.58, ink: 0, by: "Elliott & Fry", lic: "Public domain", src: "https://commons.wikimedia.org/wiki/File:Alan_Turing_(1951).jpg" },
      1956: { f: "historia/1956.jpg", w: 960, h: 1112, fx: 0.56, fy: 0.38, z: 0.68, ink: 0, by: "null0", lic: "CC BY-SA 2.0", src: "https://commons.wikimedia.org/wiki/File:John_McCarthy_Stanford.jpg" },
      1958: { f: "historia/1958.png", w: 960, h: 778, fx: 0.5, fy: 0.5, z: 0.95, ink: 0, by: "John C. Hay, Albert E. Murray", lic: "Public domain", src: "https://commons.wikimedia.org/wiki/File:Mark_I_Perceptron,_Figure_2_of_operator%27s_manual.png" },
      1966: { f: "historia/1966.jpg", w: 692, h: 1017, fx: 0.55, fy: 0.24, z: 0.36, ink: 0, by: "Rochester Institute of Technology", lic: "Public domain", src: "https://commons.wikimedia.org/wiki/File:Weizenbaum_1982.jpg" },
      1974: { f: "historia/1974.jpg", w: 960, h: 1440, fx: 0.5, fy: 0.42, z: 1.0, ink: 0, by: "The wub", lic: "CC BY-SA 4.0", src: "https://commons.wikimedia.org/wiki/File:SRI_Shakey_robot,_1969,_Computer_History_Museum.jpg" },
      1980: { f: "historia/1980.jpg", w: 960, h: 638, fx: 0.6, fy: 0.55, z: 0.7, ink: 0, by: "Joe Mabel", lic: "CC BY-SA 3.0", src: "https://commons.wikimedia.org/wiki/File:LCM_-_DEC_VAX_11-780-5_-_01.jpg" },
      1986: { f: "historia/1986.jpg", w: 960, h: 1109, fx: 0.4, fy: 0.24, z: 0.36, ink: 0, by: "Rolf Kickuth", lic: "CC BY-SA 4.0", src: "https://commons.wikimedia.org/wiki/File:DavidRumelhart-IJCNNseattle1991-07-08.jpg" },
      1987: { f: "historia/1987.jpg", w: 960, h: 639, fx: 0.4, fy: 0.4, z: 0.55, ink: 0, by: "Marcin Wichary", lic: "CC BY 2.0", src: "https://commons.wikimedia.org/wiki/File:Symbolics_LISP_Machine,_Google_NY_office_computer_museum.jpg" },
      1997: { f: "historia/1997.jpg", w: 960, h: 1440, fx: 0.42, fy: 0.5, z: 0.9, ink: 0, by: "Anton Chiang", lic: "CC BY 2.0", src: "https://commons.wikimedia.org/wiki/File:IBM_Deep_Blue_at_Computer_History_Museum_(9361685537).jpg" },
      2011: { f: "historia/2011.jpg", w: 960, h: 640, fx: 0.5, fy: 0.65, z: 0.55, ink: 0, by: "Atomic Taco", lic: "CC BY-SA 2.0", src: "https://commons.wikimedia.org/wiki/File:IBM_Watson_w_Jeopardy.jpg" },
      2012: { f: "historia/2012.jpg", w: 960, h: 631, fx: 0.5, fy: 0.48, z: 0.75, ink: 0, by: "Fritzchens Fritz", lic: "CC0", src: "https://commons.wikimedia.org/wiki/File:NVIDIA@40nm@Fermi@GF110@GeForce_GTX_580@UA10B338_1041A1_N2Y540.000_GF110-375-A1_DSC07055_(28114554751).jpg" },
      2016: { f: "historia/2016.jpg", w: 367, h: 550, fx: 0.5, fy: 0.45, z: 0.55, ink: 0, by: "LG Electronics", lic: "CC BY 2.0", src: "https://commons.wikimedia.org/wiki/File:Lee_Se-Dol_-_2016_(cropped).jpg" },
      2017: { f: "historia/2017.png", w: 850, h: 765, fx: 0.65, fy: 0.4, z: 0.55, ink: 1, by: "Yuening Jia", lic: "CC BY-SA 3.0", src: "https://commons.wikimedia.org/wiki/File:The-Transformer-model-architecture.png" },
      2018: { f: "historia/2018.png", w: 960, h: 477, fx: 0.5, fy: 0.5, z: 0.9, ink: 1, by: "Daniel Voigt Godoy", lic: "CC BY 4.0", src: "https://commons.wikimedia.org/wiki/File:BERT_masked_language_modelling_task.png" },
      2020: { f: "historia/2020.jpg", w: 822, h: 1424, fx: 0.45, fy: 0.4, z: 0.5, ink: 1, by: "Gewure", lic: "CC BY-SA 4.0", src: "https://commons.wikimedia.org/wiki/File:GPT-3_generating_descriptive_text.jpg" },
      2022: { f: "historia/2022.png", w: 960, h: 960, fx: 0.5, fy: 0.5, z: 1.0, ink: 1, by: "OpenAI", lic: "Public domain", src: "https://commons.wikimedia.org/wiki/File:ChatGPT-Logo.svg" },
      2023: { f: "historia/2023.jpg", w: 960, h: 640, fx: 0.36, fy: 0.25, z: 0.6, ink: 0, by: "UK Government", lic: "CC BY 2.0", src: "https://commons.wikimedia.org/wiki/File:UK_Government_hosts_AI_Summit_at_Bletchley_Park_(53302263013).jpg" },
      2024: { f: "historia/2024.jpg", w: 960, h: 1277, fx: 0.53, fy: 0.29, z: 0.3, ink: 0, by: "Arthur Petron", lic: "CC BY-SA 4.0", src: "https://commons.wikimedia.org/wiki/File:Geoffrey_E._Hinton,_2024_Nobel_Prize_Laureate_in_Physics_(cropped).jpg" },
      2025: { f: "historia/2025.png", w: 960, h: 672, fx: 0.5, fy: 0.45, z: 0.9, ink: 1, by: "modelcontextprotocol developers", lic: "MIT", src: "https://commons.wikimedia.org/wiki/File:Model_Context_Protocol_Component_diagram.svg" },
    };
    // "Idag" har ingen historisk bild: en ritad kartnål i stället.
    const PIN = `<svg class="tl-ico" viewBox="0 0 64 64" aria-hidden="true"><path d="M32 59Q13 37 13 24a19 19 0 0 1 38 0q0 13-19 35z"/><circle cx="32" cy="24" r="7"/></svg>`;
    // Kortets bild: skarp i full höjd till höger (inzoomad mot nyckeldelen om bilden är hög), suddig kopia som fyllnad bakom.
    const cardFit = (p) => {
      if (p.ink) return "";
      const vh = Math.min(1, (1.7 * p.z * Math.min(p.w, p.h)) / p.h), hp = 100 / vh;
      const top = Math.max(100 - hp, Math.min(0, 50 - p.fy * hp));
      // Nyckeldelen hamnar vid 64 % av bildytans bredd (cqh = kortets höjd i procent).
      const left = `calc(64% - ${(p.fx * p.w / p.h * hp).toFixed(1)}cqh)`;
      return `height:${hp}cqh;top:${top}cqh;left:${left}`;
    };
    const credit = (p) => `<a class="tl-credit" href="${p.src}" target="_blank" rel="noopener">${T_("Bild:")} ${p.by} · ${p.lic}</a>`;
    const HYPE = [[1940, .04], [1950, .14], [1956, .36], [1962, .46], [1968, .42], [1973, .2], [1977, .08], [1981, .2], [1985, .46], [1988, .26], [1991, .1], [1995, .14], [1997, .3], [2001, .2], [2006, .24], [2011, .34], [2013, .44], [2016, .54], [2019, .6], [2021, .64], [2022.9, .9], [2024, .95], [2027, 1]];
    const el = $("#tlSvg");
    const X0 = 1940, X1 = 2027, L = 30, R = 1170, T = 112, B = 322;
    const MR = 17, ROWS = [22, 66];   // medaljongernas radie och två rader ovanför kurvan
    const x = (y) => L + ((y - X0) / (X1 - X0)) * (R - L);
    const yv = (v) => B - v * (B - T);
    const hypeAt = (yr) => { for (let i = 1; i < HYPE.length; i++) if (yr <= HYPE[i][0]) { const [a, va] = HYPE[i - 1], [b, vb] = HYPE[i]; return va + ((yr - a) / (b - a)) * (vb - va); } return 1; };
    const defs = svg("defs", {}, el);
    const lg = svg("linearGradient", { id: "hypeGrad", x1: 0, x2: 1, y1: 0, y2: 0 }, defs);
    const lf = svg("linearGradient", { id: "hypeFill", x1: 0, x2: 0, y1: 0, y2: 1 }, defs);
    const stops = () => {
      lg.innerHTML = ""; lf.innerHTML = "";
      [["0%", "--blue"], ["45%", "--accent"], ["80%", "--pink"], ["100%", "--orange"]].forEach(([o, c]) => svg("stop", { offset: o, "stop-color": css(c) }, lg));
      svg("stop", { offset: "0%", "stop-color": css("--accent"), "stop-opacity": .28 }, lf);
      svg("stop", { offset: "100%", "stop-color": css("--accent"), "stop-opacity": 0 }, lf);
    };
    stops(); document.addEventListener("themechange", stops);
    [[1974, 1980], [1987, 1993]].forEach(([a, b]) => {
      svg("rect", { class: "winter", x: x(a), y: T - 10, width: x(b) - x(a), height: B - T + 10 }, el);
      svg("text", { class: "winter-l", x: (x(a) + x(b)) / 2, y: T + 4, "text-anchor": "middle" }, el).textContent = T_("❄ AI-VINTER");
    });
    svg("line", { class: "axis", x1: L, x2: R, y1: B, y2: B }, el);
    for (let d = 1940; d <= 2020; d += 10) svg("text", { class: "year", x: x(d), y: B + 22, "text-anchor": "middle" }, el).textContent = d;
    // Mjuk kurva (Catmull-Rom → Bézier)
    const P = HYPE.map(([a, v]) => [x(a), yv(v)]);
    let d = `M ${P[0][0]} ${P[0][1]}`;
    for (let i = 0; i < P.length - 1; i++) {
      const p0 = P[i - 1] || P[i], p1 = P[i], p2 = P[i + 1], p3 = P[i + 2] || p2;
      d += ` C ${p1[0] + (p2[0] - p0[0]) / 6} ${p1[1] + (p2[1] - p0[1]) / 6}, ${p2[0] - (p3[0] - p1[0]) / 6} ${p2[1] - (p3[1] - p1[1]) / 6}, ${p2[0]} ${p2[1]}`;
    }
    svg("path", { class: "hype-area", d: d + ` L ${R} ${B} L ${L} ${B} Z` }, el);
    const hp = svg("path", { class: "hype", d }, el);
    const len = hp.getTotalLength();
    hp.style.strokeDasharray = len; hp.style.strokeDashoffset = len;
    let cur = -1;
    // Medaljonger: varannan händelse i övre/undre raden, sedan knuffas de isär så att inga överlappar.
    const mx = EV.map(([yr]) => x(yr));
    [0, 1].forEach((row) => {
      const idx = EV.map((_, i) => i).filter((i) => i % 2 === row);
      for (let it = 0; it < 200; it++) {
        for (let k = 0; k < idx.length - 1; k++) {
          const a = idx[k], b = idx[k + 1], gap = 2 * MR + 5 - (mx[b] - mx[a]);
          if (gap > 0) { mx[a] -= gap / 2; mx[b] += gap / 2; }
        }
        idx.forEach((i) => { mx[i] = Math.max(MR + 2, Math.min(1200 - MR - 2, mx[i])); });
      }
    });
    const leads = svg("g", { class: "tl-leads" }, el);
    const meds = svg("g", { class: "tl-meds" }, el);
    const evs = EV.map(([yr, , t], i) => {
      const px = x(yr), py = yv(hypeAt(yr)), my = ROWS[i % 2];
      const ln = svg("line", { class: "lead", x1: px, y1: py - 7, x2: mx[i], y2: my + MR }, leads);
      const g = svg("g", { class: "ev" }, el);
      svg("circle", { cx: px, cy: py, r: 7 }, g);
      const ph = PH[yr];
      const m = svg("g", { class: "med" + (ph && ph.ink ? " ink" : ""), style: `--d:${i * 90}ms` }, meds);
      svg("title", {}, m).textContent = `${yr} · ${t.replace(/<[^>]+>/g, "")}`;
      svg("circle", { class: "bg", cx: mx[i], cy: my, r: MR }, m);
      if (ph) {
        // Skala så att z × kortsidan fyller cirkeln och placera (fx, fy) i cirkelns mitt.
        const k = (2 * MR) / (ph.z * Math.min(ph.w, ph.h));
        svg("clipPath", { id: "medc" + i }, m).appendChild(svg("circle", { cx: mx[i], cy: my, r: MR }));
        svg("image", { href: ph.f, width: ph.w * k, height: ph.h * k, x: mx[i] - ph.fx * ph.w * k, y: my - ph.fy * ph.h * k, "clip-path": `url(#medc${i})`, preserveAspectRatio: "none" }, m);
      } else {
        svg("svg", { x: mx[i] - 11, y: my - 11, width: 22, height: 22, viewBox: "0 0 64 64", class: "tl-ico" }, m).innerHTML = PIN.replace(/^<svg[^>]*>|<\/svg>$/g, "");
      }
      svg("circle", { class: "ring", cx: mx[i], cy: my, r: MR }, m);
      const pick = () => { stop(); show(i); };
      g.addEventListener("click", pick); m.addEventListener("click", pick);
      return { g, m, ln };
    });
    function show(i) {
      cur = Math.max(0, Math.min(EV.length - 1, i));
      const [yr, , t, txt] = EV[cur];
      evs.forEach(({ g, m, ln }, k) => [g, m, ln].forEach((n) => n.classList.toggle("on", k === cur)));
      meds.appendChild(evs[cur].m);   // aktiv medaljong överst
      const card = $("#tlCard");
      const ph = PH[yr];
      card.innerHTML = ph
        ? `<div class="tl-art photo${ph.ink ? " ink" : ""}">${ph.ink ? "" : `<div class="blur" style="background-image:url('${ph.f}')"></div>`}<img src="${ph.f}" alt="" style="${cardFit(ph)}"></div><div class="tl-txt"><div class="yr">${yr}</div><h3>${t}</h3><p>${txt}</p></div>${credit(ph)}`
        : `<div class="tl-art">${PIN}</div><div class="tl-txt"><div class="yr">${yr}</div><h3>${t}</h3><p>${txt}</p></div>`;
    }
    const ERAS = [[T_("🌱 Födelsen"), 0], [T_("❄️ Vintrar"), 5], [T_("📊 Maskininlärning"), 9], [T_("✨ Generativ AI"), 13]];
    $("#tlEras").innerHTML = ERAS.map(([n, i]) => `<button data-i="${i}">${n}</button>`).join("");
    $("#tlEras").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { stop(); show(+b.dataset.i); } });
    let playing = false, ptok = 0;
    const stop = () => { playing = false; ptok++; $("#tlPlay").textContent = T_("▶ Spela upp"); };
    $("#tlPrev").onclick = () => { stop(); show(cur - 1); };
    $("#tlNext").onclick = () => { stop(); show(cur + 1); };
    $("#tlPlay").onclick = async () => {
      if (playing) return stop();
      playing = true; const t = ++ptok; $("#tlPlay").textContent = T_("⏸ Pausa");
      if (cur >= EV.length - 1) cur = -1;
      while (playing && t === ptok && cur < EV.length - 1) { show(cur + 1); await pause(3800); }
      if (t === ptok) stop();
    };
    window.Deck.onEnter("historia", () => {
      hp.style.transition = calm() ? "none" : "stroke-dashoffset 2.6s ease";
      hp.style.strokeDashoffset = 0;
      el.classList.add("meds-in");
    });
    show(0);
  })();

  // ============ KAP 3: varför nu ============
  (() => {
    const dataSvg = $("#ingData");
    // Varje ruta bär ett tecken (bokstav, siffra eller symbol) som byts ut i rutans mörkaste läge,
    // så att det ser ut som en ström av data som hela tiden förnyas.
    const CHARS = L_("ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖabcdefghijklmnopqrstuvwxyzåäö0123456789#@&%$€?!<>{}=+*/", "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#@&%$£?!<>{}=+*/");
    const rnd = () => CHARS[(Math.random() * CHARS.length) | 0];
    for (let r = 0; r < 7; r++) for (let c = 0; c < 18; c++) {
      const g = svg("g", { class: "pulse-sq data-cell", style: `animation-delay:${((r * 18 + c) * 37) % 1600}ms;animation-duration:${1.4 + ((r * 7 + c * 13) % 9) / 10}s` }, dataSvg);
      svg("rect", { x: 12 + c * 15.5, y: 14 + r * 18, width: 11, height: 12, rx: 2, fill: "var(--cyan)" }, g);
      const t = svg("text", { x: 17.5 + c * 15.5, y: 23.5 + r * 18, "text-anchor": "middle" }, g);
      t.textContent = rnd();
      g.addEventListener("animationiteration", () => { t.textContent = rnd(); });
    }
    const g = $("#ingGpu");
    const chip = svg("g", { class: "chip-gpu" }, g);
    svg("rect", { x: 75, y: 15, width: 150, height: 120, rx: 10 }, chip);
    for (let i = 0; i < 8; i++) { svg("line", { x1: 60, x2: 75, y1: 25 + i * 14, y2: 25 + i * 14, stroke: "var(--green)", "stroke-width": 2 }, g); svg("line", { x1: 225, x2: 240, y1: 25 + i * 14, y2: 25 + i * 14, stroke: "var(--green)", "stroke-width": 2 }, g); }
    for (let r = 0; r < 6; r++) for (let c = 0; c < 8; c++) svg("rect", { x: 87 + c * 16.5, y: 26 + r * 17.5, width: 12, height: 12, rx: 2, fill: "var(--green)", class: "pulse-sq", style: `animation-delay:${Math.random() * 1600}ms;animation-duration:${0.6 + Math.random()}s` }, g);
    // Attention: orden börjar huller om buller, skyfflas om några gånger, hamnar i rätt ordning,
    // och då tänds bågarna (vilka ord hör ihop). Pausen i rätt ordning är ca 6 s, sedan börjar det om.
    const a = $("#ingAlgo");
    const words = L_(["Katten", "satt", "på", "mattan"], ["The", "cat", "sat", "down"]);
    const xs = [45, 115, 170, 240];          // rätt ordning (bågarna är ritade för de här lägena)
    const slots = [40, 110, 185, 255];       // jämna lägen när orden står i fel ordning
    const arcs = svg("g", { class: "attn-arcs" }, a);
    [[0, 1], [0, 3], [1, 3], [2, 3], [0, 2], [1, 2]].forEach(([i, j], k) => {
      const mx = (xs[i] + xs[j]) / 2, h = 18 + (xs[j] - xs[i]) * .45;
      svg("path", { d: `M ${xs[i]} 114 Q ${mx} ${114 - h * 1.6} ${xs[j]} 114`, fill: "none", stroke: "var(--orange)", "stroke-width": 2 + (k % 3), class: "pulse-sq", style: `animation-delay:${k * 260}ms;animation-duration:2.2s` }, arcs);
    });
    const wEl = words.map((w) => { const t = svg("text", { x: 0, y: 0, "text-anchor": "middle", class: "attn-word" }, a); t.textContent = w; return t; });
    const label = svg("text", { x: 150, y: 20, "text-anchor": "middle", fill: "var(--dim)", "font-size": 11, "font-family": "var(--mono)" }, a);
    // Orden flyger i samma sorts bågar som attention-linjerna (kvadratisk Bézier, högre båge för längre
    // sträcka) och lämnar ett gult spår som tonar bort.
    const trails = svg("g", {}, a);
    a.insertBefore(trails, wEl[0]);
    const posX = [0, 0, 0, 0];
    const BASE = 114, Y = 132, DUR = 900;
    const ease = (u) => (u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2);
    const setPos = (wi, x, y) => { wEl[wi].style.transform = `translate(${x}px, ${y}px)`; };
    function place(order, right, animate = true) {
      const target = [];
      order.forEach((wi, pos) => { target[wi] = right ? xs[wi] : slots[pos]; wEl[wi].classList.toggle("ok", right); });
      const moves = [0, 1, 2, 3].filter((wi) => Math.abs(target[wi] - posX[wi]) > 1);
      if (!animate || calm() || !moves.length) { [0, 1, 2, 3].forEach((wi) => { posX[wi] = target[wi]; setPos(wi, target[wi], Y); }); return Promise.resolve(); }
      const paths = moves.map((wi) => {
        const x0 = posX[wi], x1 = target[wi], mx = (x0 + x1) / 2, h = 18 + Math.abs(x1 - x0) * .45, cy = BASE - h * 1.6;
        const tr = svg("path", { class: "attn-trail", d: `M ${x0} ${BASE} Q ${mx} ${cy} ${x1} ${BASE}` }, trails);
        const len = tr.getTotalLength(); tr.style.strokeDasharray = len; tr.style.strokeDashoffset = len;
        return { wi, x0, x1, mx, cy, tr, len };
      });
      return new Promise((res) => {
        const t0 = performance.now();
        const step = (now) => {
          const u = Math.min(1, (now - t0) / DUR), e = ease(u), m = 1 - e;
          for (const p of paths) {
            const bx = m * m * p.x0 + 2 * m * e * p.mx + e * e * p.x1;
            const by = m * m * BASE + 2 * m * e * p.cy + e * e * BASE;
            setPos(p.wi, bx, Y + (by - BASE));
            p.tr.style.strokeDashoffset = p.len * (1 - e);
          }
          if (u < 1) return requestAnimationFrame(step);
          paths.forEach((p) => { posX[p.wi] = p.x1; p.tr.classList.add("fade"); setTimeout(() => p.tr.remove(), 900); });
          res();
        };
        requestAnimationFrame(step);
      });
    }
    const shuffled = () => { let o; do { o = [0, 1, 2, 3].sort(() => Math.random() - .5); } while (o.every((v, i) => v === i)); return o; };
    const showRight = () => { place([0, 1, 2, 3], true, !calm()); arcs.classList.add("on"); label.textContent = T_("ATTENTION: VILKA ORD HÖR IHOP?"); };
    let atok = 0;
    async function attnLoop() {
      const t = ++atok;
      if (calm()) return showRight();
      while (t === atok) {
        arcs.classList.remove("on"); label.textContent = T_("ORDEN I FEL ORDNING …");
        for (let k = 0; k < 4 && t === atok; k++) { await place(shuffled(), false); await sleep(350); }
        if (t !== atok) return;
        label.textContent = T_("… ATTENTION KOPPLAR IHOP DEM");
        await place([0, 1, 2, 3], true); await sleep(250);   // orden har landat: tänd bågarna
        if (t !== atok) return;
        showRight(); await sleep(6000);
      }
    }
    place(shuffled(), false, false); label.textContent = T_("ORDEN I FEL ORDNING …");
    window.Deck.onEnter("varfor", () => attnLoop());
    window.Deck.onLeave("varfor", () => { atok++; });
    document.addEventListener("calmchange", () => { if (calm()) { atok++; showRight(); } else if (window.Deck.current().id === "varfor") attnLoop(); });
    let counted = false;
    window.Deck.onEnter("varfor", () => {
      if (counted) return; counted = true;
      $$("#varfor .stat").forEach((s) => {
        const to = +s.dataset.count, small = s.querySelector("small").outerHTML, pre = s.dataset.prefix || "", suf = s.dataset.suffix || "";
        const t0 = performance.now(), dur = calm() ? 0 : 1800;
        const step = (t) => {
          const p = dur ? Math.min(1, (t - t0) / dur) : 1, v = to * (1 - Math.pow(1 - p, 3));
          s.innerHTML = pre + fmt(v) + suf + small;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    });
    $("#mixBtn").onclick = () => { const r = $("#recipe"); r.classList.remove("mixed"); void r.offsetWidth; r.classList.add("mixed"); };
  })();

  // ============ KAP 4: lär dig skilja katt från hund ============
  (() => {
    const cv = $("#learnCanvas"), ctx = cv.getContext("2d");
    const W = cv.width, H = cv.height, PAD = 50;
    const seed = () => {
      const pts = [];
      const r = (a, b) => a + Math.random() * (b - a);
      for (let i = 0; i < 11; i++) pts.push({ x: r(.06, .5), y: r(.06, .52), c: 0 });
      for (let i = 0; i < 11; i++) pts.push({ x: r(.42, .94), y: r(.42, .94), c: 1 });
      return pts;
    };
    let pts = seed(), w1, w2, b, epoch = 0, training = false, addClass = 0, hover = null, cols = {};
    const initW = () => { const a = Math.random() * Math.PI * 2; w1 = Math.cos(a) * 2; w2 = Math.sin(a) * 2; b = (Math.random() - .5); epoch = 0; };
    initW();
    const sig = (z) => 1 / (1 + Math.exp(-z));
    const pred = (x, y) => sig(w1 * (x - .5) * 6 + w2 * (y - .5) * 6 + b);
    const stats = () => {
      let loss = 0, ok = 0;
      for (const p of pts) { const q = Math.min(1 - 1e-6, Math.max(1e-6, pred(p.x, p.y))); loss += -(p.c ? Math.log(q) : Math.log(1 - q)); if ((q > .5 ? 1 : 0) === p.c) ok++; }
      return { loss: loss / pts.length, acc: ok / pts.length };
    };
    const readCols = () => { cols = { cat: css("--pink"), dog: css("--cyan"), line: css("--accent"), grid: css("--line"), text: css("--dim"), panel: css("--panel") }; };
    const toPx = (x, y) => [PAD + x * (W - PAD * 1.5), H - PAD - y * (H - PAD * 1.5)];
    const fromPx = (px, py) => [(px - PAD) / (W - PAD * 1.5), (H - PAD - py) / (H - PAD * 1.5)];
    function draw() {
      ctx.clearRect(0, 0, W, H);
      const trained = epoch > 0;
      const N = 44, M = 30;
      for (let i = 0; i < N; i++) for (let j = 0; j < M; j++) {
        const x = (i + .5) / N, y = (j + .5) / M, q = pred(x, y);
        const [px, py] = toPx(i / N, (j + 1) / M);
        ctx.fillStyle = q > .5 ? cols.dog : cols.cat;
        ctx.globalAlpha = (trained ? .07 : .03) + Math.abs(q - .5) * (trained ? .3 : .12);
        ctx.fillRect(px, py, (W - PAD * 1.5) / N + 1, (H - PAD * 1.5) / M + 1);
      }
      ctx.globalAlpha = 1;
      ctx.strokeStyle = cols.grid; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(PAD, PAD / 2); ctx.lineTo(PAD, H - PAD); ctx.lineTo(W - PAD / 2, H - PAD); ctx.stroke();
      ctx.fillStyle = cols.text; ctx.font = "600 20px Inter, sans-serif";
      ctx.textAlign = "right"; ctx.fillText(T_("Vikt →"), W - PAD / 2, H - 16);
      ctx.save(); ctx.translate(20, PAD / 2); ctx.rotate(-Math.PI / 2); ctx.textAlign = "right"; ctx.fillText(T_("Apporterar gärna →"), 0, 0); ctx.restore();
      // beslutslinje: w1*(x-.5)*6 + w2*(y-.5)*6 + b = 0
      ctx.save(); ctx.beginPath(); ctx.rect(PAD, PAD / 2, W - PAD * 1.5, H - PAD * 1.5); ctx.clip();
      ctx.strokeStyle = cols.line; ctx.lineWidth = 4; ctx.setLineDash(trained ? [] : [10, 8]);
      ctx.beginPath();
      if (Math.abs(w2) > Math.abs(w1)) {
        const yAt = (x) => .5 - (w1 * (x - .5) * 6 + b) / (w2 * 6);
        const [ax, ay] = toPx(0, yAt(0)), [bx, by] = toPx(1, yAt(1)); ctx.moveTo(ax, ay); ctx.lineTo(bx, by);
      } else {
        const xAt = (y) => .5 - (w2 * (y - .5) * 6 + b) / (w1 * 6);
        const [ax, ay] = toPx(xAt(0), 0), [bx, by] = toPx(xAt(1), 1); ctx.moveTo(ax, ay); ctx.lineTo(bx, by);
      }
      ctx.stroke(); ctx.setLineDash([]); ctx.restore();
      ctx.font = "30px 'Apple Color Emoji', 'Segoe UI Emoji', sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      for (const p of pts) {
        const [px, py] = toPx(p.x, p.y);
        const wrong = trained && ((pred(p.x, p.y) > .5 ? 1 : 0) !== p.c);
        ctx.beginPath(); ctx.arc(px, py, 21, 0, 7); ctx.fillStyle = cols.panel; ctx.fill();
        ctx.lineWidth = wrong ? 4 : 2.5; ctx.strokeStyle = wrong ? css("--red") : (p.c ? cols.dog : cols.cat); ctx.stroke();
        ctx.fillText(p.c ? "🐶" : "🐱", px, py + 2);
      }
      if (hover) {
        const [px, py] = toPx(hover[0], hover[1]);
        ctx.beginPath(); ctx.arc(px, py, 10, 0, 7); ctx.strokeStyle = cols.line; ctx.lineWidth = 3; ctx.stroke();
      }
      ctx.textBaseline = "alphabetic";
      const s = stats();
      $("#mEpoch").textContent = epoch;
      $("#mAcc").textContent = trained ? Math.round(s.acc * 100) + L_(" %", "%") : "–";
      $("#mLoss").textContent = trained ? s.loss.toFixed(2) : "–";
    }
    function stepGD(n) {
      for (let k = 0; k < n; k++) {
        let g1 = 0, g2 = 0, gb = 0;
        for (const p of pts) { const e = pred(p.x, p.y) - p.c; g1 += e * (p.x - .5) * 6; g2 += e * (p.y - .5) * 6; gb += e; }
        const lr = .35 / pts.length;
        w1 -= lr * g1 * 6; w2 -= lr * g2 * 6; b -= lr * gb * 6;
      }
      epoch += n;
    }
    const steps = $$("#learnSteps li");
    // Illustration av ett neuralt nätverk: under träningen tänds kopplingarna lager för lager,
    // framåt (gissning) och sedan bakåt (felet justerar vikterna, backpropagation).
    const net = (() => {
      const el = $("#learnNet"), cap = $("#learnNetCap");
      const L = [2, 5, 5, 4, 2], X0 = 62, X1 = 378, GAP = 32;
      const lx = L.map((_, i) => X0 + (i * (X1 - X0)) / (L.length - 1));
      const ny = (n, j) => 92 - ((n - 1) * GAP) / 2 + j * GAP;
      const edges = [], nodes = [];
      for (let g = 0; g < L.length - 1; g++) {
        edges[g] = [];
        for (let i = 0; i < L[g]; i++) for (let j = 0; j < L[g + 1]; j++) edges[g].push(svg("line", { class: "ln-e", x1: lx[g], y1: ny(L[g], i), x2: lx[g + 1], y2: ny(L[g + 1], j) }, el));
      }
      L.forEach((n, l) => { nodes[l] = []; for (let j = 0; j < n; j++) nodes[l].push(svg("circle", { class: "ln-n", cx: lx[l], cy: ny(n, j), r: 7 }, el)); });
      [[T_("Vikt"), 0], [T_("Apport"), 1]].forEach(([t, j]) => svg("text", { class: "ln-lab", x: X0 - 12, y: ny(2, j) + 4, "text-anchor": "end" }, el).textContent = t);
      [["🐱", 0], ["🐶", 1]].forEach(([t, j]) => svg("text", { x: X1 + 14, y: ny(2, j) + 6, "font-size": 17 }, el).textContent = t);
      [[T_("INDATA"), 0], [T_("DOLDA LAGER"), 2], [T_("UTDATA"), 4]].forEach(([t, l]) => svg("text", { class: "ln-lab", x: lx[l], y: 194, "text-anchor": "middle" }, el).textContent = t);
      const IDLE = T_("Tryck ▶ Träna och se nätverket arbeta.");
      cap.textContent = IDLE;
      const clear = () => { edges.flat().forEach((e) => { e.setAttribute("class", "ln-e"); e.style.opacity = ""; }); nodes.flat().forEach((n) => n.setAttribute("class", "ln-n")); };
      let on = false, t0 = 0, last = "";
      const PERIOD = 640, G = L.length - 1;
      function frame(now) {
        if (!on) return;
        const p = ((now - t0) % PERIOD) / PERIOD, fw = p < .5;
        const g = fw ? Math.min(G - 1, Math.floor(p * 2 * G)) : G - 1 - Math.min(G - 1, Math.floor((p - .5) * 2 * G));
        const key = (fw ? "f" : "b") + g;
        if (key !== last) {
          last = key; clear();
          const cls = fw ? "fw" : "bw";
          edges[g].forEach((e) => { if (Math.random() < .75) { e.setAttribute("class", "ln-e " + cls); e.style.opacity = (.35 + Math.random() * .65).toFixed(2); } });
          nodes[fw ? g + 1 : g].forEach((n) => n.setAttribute("class", "ln-n " + cls));
          cap.innerHTML = fw ? T_('<span style="color:var(--accent)">→ Framåt:</span> nätverket gissar') : T_('<span style="color:var(--orange)">← Bakåt:</span> felet justerar vikterna (<i>backpropagation</i>)');
        }
        requestAnimationFrame(frame);
      }
      return {
        start() { if (calm()) return; on = true; t0 = performance.now(); last = ""; requestAnimationFrame(frame); },
        stop(n) { on = false; clear(); cap.textContent = n ? L_(`Klart: ${n} varv. Varje varv = en gissning framåt och en justering bakåt.`, `Done: ${n} epochs. Each epoch = one guess forwards and one adjustment backwards.`) : IDLE; },
      };
    })();
    async function train() {
      if (training) return; training = true; $("#trainBtn").disabled = true;
      const target = epoch + 240;
      let phase = 0;
      net.start();
      while (epoch < target) {
        steps.forEach((li, i) => li.classList.toggle("on", i === (phase % 3) + 1));
        stepGD(calm() ? 240 : 2); draw(); phase++;
        if (!calm()) await sleep(36);   // ca 4–5 s, så att man hinner se nätverket arbeta
      }
      steps.forEach((li, i) => li.classList.toggle("on", i === 3));
      net.stop(epoch);
      training = false; $("#trainBtn").disabled = false;
    }
    cv.addEventListener("click", (e) => {
      const r = cv.getBoundingClientRect();
      const [x, y] = fromPx((e.clientX - r.left) * (W / r.width), (e.clientY - r.top) * (H / r.height));
      if (x < 0 || x > 1 || y < 0 || y > 1) return;
      pts.push({ x, y, c: addClass }); draw();
    });
    cv.addEventListener("mousemove", (e) => {
      const r = cv.getBoundingClientRect();
      const [x, y] = fromPx((e.clientX - r.left) * (W / r.width), (e.clientY - r.top) * (H / r.height));
      if (x < 0 || x > 1 || y < 0 || y > 1) { hover = null; return; }
      hover = [x, y];
      if (epoch > 0) { const q = pred(x, y); $("#learnGuess").innerHTML = q > .5 ? L_(`Modellen gissar: <b>🐶 Hund</b> (${Math.round(q * 100)} %)`, `The model guesses: <b>🐶 Dog</b> (${Math.round(q * 100)}%)`) : L_(`Modellen gissar: <b>🐱 Katt</b> (${Math.round((1 - q) * 100)} %)`, `The model guesses: <b>🐱 Cat</b> (${Math.round((1 - q) * 100)}%)`); }
      if (!training) draw();
    });
    cv.addEventListener("mouseleave", () => { hover = null; if (!training) draw(); });
    $("#addCat").onclick = () => { addClass = 0; $("#addCat").classList.add("on"); $("#addDog").classList.remove("on"); };
    $("#addDog").onclick = () => { addClass = 1; $("#addDog").classList.add("on"); $("#addCat").classList.remove("on"); };
    $("#trainBtn").onclick = train;
    $("#learnReset").onclick = () => { if (training) return; pts = seed(); initW(); steps.forEach((li, i) => li.classList.toggle("on", i === 0)); $("#learnGuess").textContent = T_("Håll musen över rutan när modellen är tränad."); net.stop(0); draw(); };
    readCols(); document.addEventListener("themechange", () => { readCols(); draw(); });
    steps[0].classList.add("on");
    draw();
  })();

  // ============ KAP 5: neuralt nätverk ============
  (() => {
    const IN = [["👂", T_("Spetsiga öron")], ["〰️", T_("Morrhår")], ["🗣️", T_("Skäller")], ["🎾", T_("Apporterar")], ["🌳", T_("Klättrar i träd")]];
    const W1 = [[1.2, 1.0, -1.0, -0.6, 1.4], [-0.3, -0.2, 1.6, 1.3, -1.0], [0.8, 0.9, 0.6, 0.2, 0.1], [-0.4, 0.2, 0.9, 1.0, -0.6]];
    const B1 = [-0.5, -0.5, -0.3, -0.4];
    const W2 = [[2.2, -1.8, 0.2, -1.0], [-1.6, 2.0, 0.2, 1.2]];
    const B2 = [0.4, -0.4];
    const on = [false, false, false, false, false];
    const el = $("#nnSvg");
    const ix = 50, hx = 260, ox = 470;
    const iy = IN.map((_, i) => 40 + i * 70), hy = [75, 145, 215, 285], oy = [120, 240];
    const edges1 = [], edges2 = [];
    W1.forEach((row, h) => row.forEach((w, i) => edges1.push({ i, h, w, el: svg("line", { class: "edge", x1: ix, y1: iy[i], x2: hx, y2: hy[h] }, el) })));
    W2.forEach((row, o) => row.forEach((w, h) => edges2.push({ h, o, w, el: svg("line", { class: "edge", x1: hx, y1: hy[h], x2: ox, y2: oy[o] }, el) })));
    const inN = iy.map((y, i) => { const c = svg("circle", { class: "node", cx: ix, cy: y, r: 20 }, el); svg("text", { x: ix, y: y + 7, "text-anchor": "middle", "font-size": 19 }, el).textContent = IN[i][0]; return c; });
    const hidN = hy.map((y) => svg("circle", { class: "node", cx: hx, cy: y, r: 18 }, el));
    const outN = oy.map((y, o) => { const c = svg("circle", { class: "node", cx: ox, cy: y, r: 26 }, el); svg("text", { x: ox, y: y + 9, "text-anchor": "middle", "font-size": 24 }, el).textContent = o ? "🐶" : "🐱"; return c; });
    [[T_("INDATA"), ix], [T_("DOLT LAGER"), hx], [T_("UTDATA"), ox]].forEach(([t, x]) => svg("text", { x, y: 352, "text-anchor": "middle", fill: "var(--dim)", "font-size": 11, "font-family": "var(--mono)", "font-weight": 700 }, el).textContent = t);
    const sig = (z) => 1 / (1 + Math.exp(-z));
    function run() {
      const a = on.map((v) => (v ? 1 : 0));
      const h = W1.map((row, k) => sig(row.reduce((s, w, i) => s + w * a[i], B1[k])));
      const z = W2.map((row, k) => row.reduce((s, w, j) => s + w * h[j], B2[k]));
      const m = Math.max(...z), e = z.map((v) => Math.exp(v - m)), S = e[0] + e[1], p = e.map((v) => v / S);
      const pos = css("--green"), neg = css("--red"), acc = css("--accent"), line = css("--line"), panel = css("--panel");
      edges1.forEach((E) => { const c = E.w * a[E.i]; E.el.setAttribute("stroke", c === 0 ? line : c > 0 ? pos : neg); E.el.setAttribute("stroke-width", 1 + Math.abs(c) * 3); E.el.setAttribute("stroke-opacity", c === 0 ? .5 : .35 + Math.min(.65, Math.abs(c) * .5)); E.el.classList.toggle("flow", Math.abs(c) > .3); });
      edges2.forEach((E) => { const c = E.w * h[E.h]; E.el.setAttribute("stroke", Math.abs(c) < .25 ? line : c > 0 ? pos : neg); E.el.setAttribute("stroke-width", 1 + Math.abs(c) * 2.4); E.el.setAttribute("stroke-opacity", .25 + Math.min(.75, Math.abs(c) * .4)); E.el.classList.toggle("flow", c > .6); });
      inN.forEach((n, i) => { n.setAttribute("fill", a[i] ? acc : panel); n.setAttribute("stroke", acc); });
      hidN.forEach((n, k) => { n.setAttribute("fill", `color-mix(in srgb, ${acc} ${Math.round(h[k] * 100)}%, ${panel})`); n.setAttribute("stroke", acc); });
      outN.forEach((n, o) => { n.setAttribute("fill", `color-mix(in srgb, ${css(o ? "--cyan" : "--pink")} ${Math.round(p[o] * 85)}%, ${panel})`); n.setAttribute("stroke", css(o ? "--cyan" : "--pink")); });
      const bars = $$("#nnOut .bar i");
      bars[0].style.width = p[0] * 100 + "%"; bars[1].style.width = p[1] * 100 + "%";
      $("#pCat").textContent = Math.round(p[0] * 100) + L_(" %", "%"); $("#pDog").textContent = Math.round(p[1] * 100) + L_(" %", "%");
    }
    $("#nnIn").innerHTML = IN.map(([e, t], i) => `<button data-i="${i}">${e} ${t}</button>`).join("") + `<button data-i="r" class="dim" style="justify-content:center">${T_("↺ Nollställ")}</button>`;
    $("#nnIn").addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      if (b.dataset.i === "r") { on.fill(false); $$("#nnIn button").forEach((x) => x.classList.remove("on")); }
      else { const i = +b.dataset.i; on[i] = !on[i]; b.classList.toggle("on", on[i]); }
      run();
    });
    document.addEventListener("themechange", run);
    run();
  })();

  // ============ KAP 6: tokens + nästa token ============
  (() => {
    const WHOLE = new Set(L_("och i att det som en på är för med den till av inte har jag de om ett vi så men var kan the and of to a in is it you that for on hej ja nej du",
      // Engelska: vanliga ord är oftast en hel token i riktiga tokenizers.
      "the and of to a in is it you that for on hello thanks about after again also because before being could every first from great have here just know like little love make many more much name people really should some than thank their them then there these they thing think this those time very want what when where which while will with would your years always today morning").split(" "));
    const TCOL = ["--accent", "--cyan", "--pink", "--green", "--orange", "--blue"];
    const hash = (s) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
    function tokenize(s) {
      const parts = s.match(/\s*[\p{L}\p{N}]+|\s*[^\s\p{L}\p{N}]|\s+/gu) || [];
      const out = [];
      for (const p of parts) {
        const lead = p.match(/^\s*/)[0], w = p.slice(lead.length);
        if (w.length <= 4 || WHOLE.has(w.toLowerCase())) { out.push(p); continue; }
        let i = 0, first = true, h = hash(w);
        const sizes = [4, 3, 5, 3, 4];
        while (i < w.length) {
          let n = sizes[(h + i) % sizes.length];
          if (w.length - (i + n) < 2) n = w.length - i;
          out.push((first ? lead : "") + w.slice(i, i + n)); i += n; first = false;
        }
      }
      return out;
    }
    const renderTok = () => {
      const s = $("#tokIn").value, t = tokenize(s);
      $("#tokOut").innerHTML = t.map((x, i) => `<span style="background:color-mix(in srgb, var(${TCOL[i % TCOL.length]}) 24%, transparent)">${x.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/ /g, "·")}</span>`).join("");
      $("#tokN").textContent = t.length; $("#tokC").textContent = s.length; $("#tokR").textContent = t.length ? (s.length / t.length).toFixed(1) : 0;
    };
    $("#tokIn").addEventListener("input", renderTok);
    renderTok();

    // Liten tillståndsmaskin över svenska fortsättningar: [ord, sannolikhet, nästa tillstånd]
    const S = L_({
      a0: [["natur", .3, "s1"], ["fika", .18, "s1"], ["kyla", .14, "s1"], ["musik", .12, "s1"], ["design", .1, "s1"], ["allemansrätt", .09, "s1"], ["surströmming", .07, "s1"]],
      b0: [["kan", .32, "t1"], ["hjälper", .22, "t1"], ["sparar", .16, "t1"], ["aldrig", .12, "t1"], ["förstår", .1, "t1"], ["skriver", .08, "t1"]],
      c0: [["prinsessa", .3, "u1"], ["drake", .2, "u1"], ["robot", .16, "u1"], ["katt", .14, "u1"], ["dator", .12, "u1"], ["kung", .08, "u1"]],
      s1: [["och", .36, "s2"], [".", .3, "END"], ["som", .18, "s4"], ["!", .1, "END"], [",", .06, "s4"]],
      s2: [["sina", .28, "s3"], ["långa", .2, "s3"], ["vackra", .18, "s3"], ["mörka", .17, "s3"], ["kalla", .17, "s3"]],
      s3: [["sjöar", .3, "s5"], ["somrar", .22, "s5"], ["vintrar", .2, "s5"], ["skogar", .16, "s5"], ["kanelbullar", .12, "s5"]],
      s4: [["alla", .3, "s6"], ["många", .25, "s6"], ["turister", .2, "s6"], ["vi", .15, "s6"], ["ingen", .1, "s6"]],
      s6: [["älskar", .42, "s5"], ["pratar om", .28, "s5"], ["saknar", .18, "s5"], ["glömmer", .12, "s5"]],
      s5: [[".", .62, "END"], ["!", .26, "END"], ["…", .12, "END"]],
      t1: [["oss", .34, "t2"], ["mig", .24, "t2"], ["tid", .2, "t2"], ["människor", .14, "t2"], ["allt", .08, "t2"]],
      t2: [["att", .32, "t3"], ["varje", .2, "t4"], [".", .28, "END"], ["snabbare", .2, "s5"]],
      t3: [["skriva", .3, "s5"], ["tänka", .25, "s5"], ["planera", .25, "s5"], ["lära oss", .2, "s5"]],
      t4: [["dag", .6, "s5"], ["vecka", .4, "s5"]],
      u1: [["som", .6, "u2"], [".", .4, "END"]],
      u2: [["drömde", .35, "u3"], ["älskade", .3, "u3"], ["bodde", .2, "u3"], ["kunde", .15, "u3"]],
      u3: [["om att flyga", .35, "s5"], ["om stjärnorna", .25, "s5"], ["i ett slott", .25, "s5"], ["med en papegoja", .15, "s5"]],
    }, {
      // Engelska: egen, grammatiskt rimlig graf (samma format: [ord, sannolikhet, nästa tillstånd]).
      a0: [["nature", .3, "s1"], ["forests", .18, "s1"], ["design", .14, "s1"], ["music", .12, "s1"], ["fika", .1, "s1"], ["lakes", .09, "s1"], ["meatballs", .07, "s1"]],
      s1: [["and", .36, "s2"], [".", .3, "END"], ["that", .18, "s4"], ["!", .1, "END"], ["which", .06, "s4"]],
      s2: [["its", .28, "s3"], ["long", .2, "s3"], ["beautiful", .18, "s3"], ["dark", .17, "s3"], ["cold", .17, "s3"]],
      s3: [["lakes", .3, "s5"], ["summers", .22, "s5"], ["winters", .2, "s5"], ["forests", .16, "s5"], ["cinnamon buns", .12, "s5"]],
      s4: [["everyone", .3, "s6"], ["every tourist", .25, "s6"], ["the world", .2, "s6"], ["my gran", .15, "s6"], ["nobody", .1, "s6"]],
      s6: [["loves", .42, "s5"], ["talks about", .28, "s5"], ["misses", .18, "s5"], ["forgets", .12, "s5"]],
      s5: [[".", .62, "END"], ["!", .26, "END"], ["…", .12, "END"]],
      b0: [["helps", .32, "t1"], ["saves", .22, "t5"], ["can", .18, "t7"], ["never", .14, "t6"], ["writes", .08, "t9"], ["explains", .06, "t9"]],
      t1: [["us", .34, "t2"], ["me", .26, "t2"], ["people", .22, "t2"], ["teachers", .18, "t2"]],
      t2: [["to", .34, "t3"], ["every", .2, "t4"], [".", .28, "END"], ["a lot", .18, "s5"]],
      t3: [["write", .3, "s5"], ["think", .25, "s5"], ["plan", .25, "s5"], ["learn", .2, "s5"]],
      t4: [["day", .6, "s5"], ["week", .4, "s5"]],
      t5: [["time", .45, "t8"], ["us", .3, "t10"], ["money", .25, "s5"]],
      t10: [["time", .6, "t8"], ["hours", .4, "t8"]],
      t8: [["every", .5, "t4"], [".", .5, "END"]],
      t7: [["help", .3, "t1"], ["write", .25, "t9"], ["explain", .25, "t9"], ["translate", .2, "t9"]],
      t9: [["anything", .4, "s5"], ["code", .3, "s5"], ["poems", .3, "s5"]],
      t6: [["gets tired", .5, "s5"], ["sleeps", .3, "s5"], ["complains", .2, "s5"]],
      c0: [["princess", .3, "u1"], ["dragon", .2, "u1"], ["robot", .16, "u1"], ["cat", .14, "u1"], ["computer", .12, "u1"], ["king", .08, "u1"]],
      u1: [["who", .6, "u2"], [".", .4, "END"]],
      u2: [["dreamed", .35, "u3"], ["loved", .3, "u4"], ["lived", .2, "u5"], ["could", .15, "u6"]],
      u3: [["of flying", .4, "s5"], ["about the stars", .35, "s5"], ["of pizza", .25, "s5"]],
      u4: [["the stars", .4, "s5"], ["to sing", .3, "s5"], ["a parrot", .3, "s5"]],
      u5: [["in a castle", .5, "s5"], ["on the moon", .3, "s5"], ["with a parrot", .2, "s5"]],
      u6: [["fly", .4, "s5"], ["talk", .35, "s5"], ["write code", .25, "s5"]],
    });
    const STARTS = L_([["Sverige är känt för sin", "a0"], ["Det bästa med AI är att den", "b0"], ["Det var en gång en", "c0"]],
      [["Sweden is known for its", "a0"], ["The best thing about AI is that it", "b0"], ["Once upon a time there was a", "c0"]]);
    let start = 0, state, gen, busy = 0;
    const temp = () => +$("#npTemp").value;
    const dist = (opts) => { const T = temp(); const q = opts.map(([, p]) => Math.pow(p, 1 / T)); const s = q.reduce((a, b) => a + b, 0); return q.map((v) => v / s); };
    const reset = (i) => { start = i; state = STARTS[i][1]; gen = []; busy++; render(); $$("#npStarts button").forEach((b, k) => b.classList.toggle("on", k === i)); };
    function render(pickI) {
      const txt = STARTS[start][0];
      $("#npSent").innerHTML = txt + gen.map((w) => (/^[.,!…]$/.test(w) ? "" : " ") + `<span class="gen">${w}</span>`).join("") + (state === "END" ? " ✅" : `<span class="caret"></span>`);
      if (state === "END") { $("#npBars").innerHTML = L_(`<div class="dim">Klart. Modellen slutade när den gissade på ett slut-token. Tryck ↺ eller välj en ny början.</div>`, `<div class="dim">Done. The model stopped when it guessed an end token. Press ↺ or pick a new beginning.</div>`); return; }
      const opts = S[state], p = dist(opts);
      $("#npBars").innerHTML = opts.map(([w], i) => `<div class="np-bar${i === pickI ? " pick" : ""}" data-i="${i}"><span class="w">${w}</span><span class="t"><i style="width:${p[i] * 100}%"></i></span><span class="p">${Math.round(p[i] * 100)}${L_(" %", "%")}</span></div>`).join("");
    }
    const choose = (i) => { const o = S[state][i]; gen.push(o[0]); state = o[2]; render(); };
    $("#npBars").addEventListener("click", (e) => { const b = e.target.closest(".np-bar"); if (b && state !== "END") { busy++; choose(+b.dataset.i); } });
    $("#npStarts").innerHTML = STARTS.map(([t], i) => L_(`<button data-i="${i}">”${t} …”</button>`, `<button data-i="${i}">“${t} …”</button>`)).join("");
    $("#npStarts").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) reset(+b.dataset.i); });
    const hint = () => {
      const T = temp(); $("#npTempV").textContent = T.toFixed(1);
      $("#npTempHint").textContent = T < .5 ? T_("Låg temperatur: förutsägbar, väljer nästan alltid det vanligaste ordet.") : T <= 1.3 ? T_("Mellan: balanserat. Det här är standardläget i de flesta chattar.") : T_("Hög temperatur: kreativ, överraskande, och ibland konstig.");
    };
    $("#npTemp").addEventListener("input", () => { hint(); render(); });
    $("#npGen").onclick = async () => {
      const t = ++busy;
      if (state === "END") reset(start), busy = t;
      while (state !== "END" && t === busy) {
        const p = dist(S[state]); let r = Math.random(), i = 0;
        while (i < p.length - 1 && (r -= p[i]) > 0) i++;
        render(i); await pause(900); if (t !== busy) return;
        choose(i); await pause(450);
      }
    };
    $("#npReset").onclick = () => reset(start);
    hint(); reset(0);
  })();

  // ============ KAP 7: träningsstegen ============
  (() => {
    const ST = [
      { e: "📚", t: T_("Förträning"), en: "Pre-training", d: T_("Modellen läser en enorm mängd text: webbsidor, böcker, artiklar och kod. Uppgiften är hela tiden densamma: <b class='k'>gissa nästa ord</b>. Varje fel justerar miljarder små rattar (<span class='en'>parameters</span>). Det tar månader, tusentals GPU:er och kan kosta miljarder kronor."), note: T_("Resultat: en modell som kan språk, men som bara fortsätter text.") },
      { e: "🎓", t: T_("Finjustering"), en: "Fine-tuning", d: T_("Nu tränas modellen på tusentals exempel på bra frågor och svar, skrivna av människor. Den lär sig att vara en <b class='k'>hjälpsam assistent</b> i stället för att bara fortsätta texten."), note: T_("Resultat: den svarar på frågor i stället för att fylla på dem.") },
      { e: "👍", t: T_("Mänsklig feedback"), en: "RLHF", d: T_("Människor jämför olika svar och väljer det bästa. Modellen belönas för svar som är <b class='k'>hjälpsamma, ärliga och säkra</b>. <span class='en'>Reinforcement Learning from Human Feedback</span>."), note: T_("Resultat: bättre ton, färre farliga eller dumma svar.") },
      { e: "💬", t: T_("Användning"), en: "Inference", d: T_("När du chattar <b class='k'>lär sig modellen ingenting nytt</b>. Rattarna är låsta. Den använder bara det den redan kan, och skriver svaret en token i taget."), note: T_("Därför vet den inget om det som hänt efter träningen (knowledge cutoff).") },
    ];
    let cur = 0, tick = null;
    $("#stages").innerHTML = ST.map((s, i) => `<div class="stage" data-i="${i}"><div class="n">${L_(`STEG ${i + 1}`, `STEP ${i + 1}`)}</div><div class="e">${s.e}</div><h3>${s.t}</h3><span class="en">${s.en}</span></div>`).join("");
    $("#stages").addEventListener("click", (e) => { const s = e.target.closest(".stage"); if (s) show(+s.dataset.i); });
    function knobs(n, spin) {
      return `<div class="knobs">${Array.from({ length: n }, () => `<div class="knob${spin ? "" : " set"}" style="transform:rotate(${Math.round(Math.random() * 300 - 150)}deg)"></div>`).join("")}</div>`;
    }
    function show(i) {
      cur = i; clearInterval(tick);
      $$("#stages .stage").forEach((s, k) => s.classList.toggle("on", k === i));
      const s = ST[i];
      $("#stageText").innerHTML = `<h4>${L_(`Steg ${i + 1}`, `Step ${i + 1}`)} · <span class="en">${s.en}</span></h4><h3 style="font-size:1.6rem">${s.e} ${s.t}</h3><p>${s.d}</p><p class="note-chip">${s.note}</p>`;
      const v = $("#stageViz");
      if (i === 0) {
        const items = ["📖", "📰", "💻", "📜", "🌐", "✉️", "📚", "🧾"];
        v.innerHTML = knobs(36, true) + `<div class="brain">🧠</div>` + items.map((e, k) => `<span class="flowing" style="--x0:-40px;--y0:${20 + k * 24}px;--x1:420px;--y1:${90 + (k % 3) * 10}px;animation-delay:${k * .4}s;left:0;top:0">${e}</span>`).join("");
        if (!calm()) tick = setInterval(() => $$("#stageViz .knob").forEach((kn) => { if (Math.random() < .4) kn.style.transform = `rotate(${Math.round(Math.random() * 300 - 150)}deg)`; }), 700);
      } else if (i === 1) {
        const qa = L_([["❓ Vad är huvudstaden i Norge?", "Oslo."], ["❓ Ge mig tre middagstips.", "1. Pasta … 2. Soppa … 3. Tacos …"], ["❓ Översätt ”tack” till franska.", "Merci."]],
          [["❓ What is the capital of Norway?", "Oslo."], ["❓ Give me three dinner ideas.", "1. Pasta … 2. Soup … 3. Tacos …"], ["❓ Translate “thank you” into French.", "Merci."]]);
        v.innerHTML = `<div style="padding:.6rem">${qa.map(([q, a], k) => `<div class="fb-row" style="animation:pop .4s ${k * .25}s both"><span>${q}</span><span class="th" style="font-size:.85rem;color:var(--green)">→ ${a}</span></div>`).join("")}</div>`;
      } else if (i === 2) {
        v.innerHTML = L_(`<div style="padding:.6rem"><div class="fb-row" style="animation:pop .4s both"><b>Svar A:</b> "Här är en tydlig steg-för-steg-förklaring…"<span class="th">👍</span></div><div class="fb-row" style="animation:pop .4s .3s both;opacity:.7"><b>Svar B:</b> "Det vet jag inte, googla det."<span class="th">👎</span></div><div class="fb-row" style="animation:pop .4s .6s both"><b>Svar C:</b> "Jag kan inte hjälpa till med det, men här är ett säkrare alternativ…"<span class="th">👍</span></div></div>`,
          `<div style="padding:.6rem"><div class="fb-row" style="animation:pop .4s both"><b>Answer A:</b> "Here's a clear step-by-step explanation…"<span class="th">👍</span></div><div class="fb-row" style="animation:pop .4s .3s both;opacity:.7"><b>Answer B:</b> "No idea, google it."<span class="th">👎</span></div><div class="fb-row" style="animation:pop .4s .6s both"><b>Answer C:</b> "I can't help with that, but here's a safer alternative…"<span class="th">👍</span></div></div>`);
      } else {
        v.innerHTML = knobs(36, false) + `<div style="position:absolute;inset:auto 12px 12px 12px" class="bubble ai"><span class="who">${T_("AI · 🔒 VIKTERNA ÄR LÅSTA")}</span><span id="infTxt"></span></div>`;
        const words = T_("Självklart! Här kommer ett förslag på en kort och trevlig inbjudan till fredagsfikan …").split(" ");
        let k = 0; const el = $("#infTxt");
        tick = setInterval(() => { if (k >= words.length) { k = 0; el.textContent = ""; } el.textContent += (k ? " " : "") + words[k++]; }, calm() ? 50 : 260);
      }
    }
    window.Deck.onEnter("traning", () => show(cur));
    window.Deck.onLeave("traning", () => clearInterval(tick));
    show(0);
  })();

  // ============ KAP 8: modeller ============
  (() => {
    const M = [
      ["Claude", "Anthropic · USA", "#d97757", "C", 0, ["text", "bild", "kod"], T_("Känd för skrivande, kodning och säkerhetstänk. Finns i Claude.ai, i appar och via API.")],
      ["GPT", "OpenAI · USA", "#10a37f", "G", 0, ["text", "bild", "ljud", "kod"], T_("Modellerna bakom ChatGPT. Används också i Microsoft Copilot.")],
      ["Gemini", "Google · USA", "#4285f4", "✦", 0, ["text", "bild", "ljud", "video"], T_("Inbyggd i Googles tjänster: Sök, Gmail, Docs och Android.")],
      ["Llama", "Meta · USA", "#0866ff", "L", 1, ["text", "bild"], T_("Öppna vikter: kan laddas ner och köras på egna servrar.")],
      ["Mistral", T_("Mistral AI · Frankrike"), "#fa520f", "M", 1, ["text", "kod"], T_("Europeiskt alternativ, med både öppna och kommersiella modeller.")],
      ["DeepSeek", T_("DeepSeek · Kina"), "#4d6bfe", "D", 1, ["text", "kod"], T_("Skakade marknaden 2025 med en öppen reasoning-modell som tränats till låg kostnad.")],
      ["Qwen", T_("Alibaba · Kina"), "#615ced", "Q", 1, ["text", "bild", "kod"], T_("Stor familj öppna modeller i många storlekar.")],
      ["GPT-SW3", T_("AI Sweden · Sverige"), "#006aa7", "SE", 1, ["text"], T_("Svensk språkmodell, tränad på de nordiska språken.")],
      ["Midjourney", "Midjourney · USA", "#6b6b6b", "⛵", 0, ["bild"], T_("Skapar bilder från en textbeskrivning. Populär bland designers.")],
      ["Stable Diffusion · Flux", "Stability AI · Black Forest Labs", "#8b5cf6", "🎨", 1, ["bild"], T_("Öppna bildmodeller som kan köras på en egen dator.")],
      ["Sora · Veo", "OpenAI · Google", "#e11d48", "🎬", 0, ["video"], T_("Skapar korta filmer från text.")],
      [T_("Lokala småmodeller"), T_("t.ex. via Ollama eller LM Studio"), "#0f766e", "💻", 1, ["text"], T_("Körs på din egen dator, utan internet. Bra när datan inte får lämna huset.")],
    ];
    const F = [["Alla", () => true], ["Stängda", (m) => !m[4]], ["Öppna vikter", (m) => m[4]], ["Text", (m) => m[5].includes("text")], ["Bild", (m) => m[5].includes("bild")], ["Ljud", (m) => m[5].includes("ljud")], ["Video", (m) => m[5].includes("video")]];
    $("#models").innerHTML = M.map(([n, o, c, L, open, tags, d]) => `<div class="model"><div class="logo" style="background:${c}">${L}</div><h3>${n}</h3><div class="org">${o}</div><p>${d}</p><div class="tags"><span class="${open ? "open" : "closed"}">${open ? T_("öppna vikter") : T_("stängd")}</span>${tags.map((t) => `<span>${T_(t)}</span>`).join("")}</div></div>`).join("");
    $("#mFilters").innerHTML = F.map(([n], i) => `<button data-i="${i}"${i ? "" : ' class="on"'}>${T_(n)}</button>`).join("");
    $("#mFilters").addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      $$("#mFilters button").forEach((x) => x.classList.toggle("on", x === b));
      const f = F[+b.dataset.i][1];
      $$("#models .model").forEach((el, i) => el.classList.toggle("hide", !f(M[i])));
    });
    const CTX = [[4000, T_("ett långt mejl")], [32000, T_("en rapport")], [128000, T_("en tjock roman")], [200000, T_("en roman och lite till")], [1000000, T_("en hel bokhylla")]];
    const ctx = () => {
      const i = Math.min(+$("#ctxR").value, CTX.length - 1), [t, d] = CTX[i], pages = Math.round(t / 600);
      $("#ctxBar").style.width = (Math.log10(t) - 3) / (Math.log10(1e6) - 3) * 100 + "%";
      $("#ctxTxt").innerHTML = L_(`${fmt(t)} tokens ≈ ${fmt(pages)} sidor <span class="dim" style="font-weight:500">· ${d}</span>`, `${fmt(t)} tokens ≈ ${fmt(pages)} pages <span class="dim" style="font-weight:500">· ${d}</span>`);
      $("#ctxBooks").innerHTML = Array.from({ length: Math.max(1, Math.round(pages / 50)) }, () => "<i></i>").join("");
    };
    $("#ctxR").max = CTX.length - 1; $("#ctxR").addEventListener("input", ctx); ctx();
    const TH = L_(["Jag stavar ordet bokstav för bokstav: j-o-r-d-g-u-b-b-s-t-r-ä-d.", "Jag letar efter ”r”: jo<b>r</b>d … st<b>r</b>äd.", "Jag dubbelkollar resten av bokstäverna. Inga fler.", "<b>Svar: 2 stycken.</b> ✅"],
      ["I spell the word letter by letter: s-t-r-a-w-b-e-r-r-y.", "I look for “r”: st<b>r</b>aw … be<b>rr</b>y.", "I double-check the rest of the letters. No more.", "<b>Answer: 3 of them.</b> ✅"]);
    let tt = 0;
    $("#thinkBtn").onclick = async () => {
      const t = ++tt; $("#thinkSteps").innerHTML = TH.map((x) => `<div>${x}</div>`).join("");
      for (const d of $$("#thinkSteps div")) { await pause(800); if (t !== tt) return; d.classList.add("in"); }
    };
  })();

  // ============ KAP 9: prompt-byggare ============
  (() => {
    const P = [
      { id: "roll", e: "🎭", n: T_("Roll"), s: T_("Vem ska AI:n vara?"), w: 10, col: "--blue", txt: T_("Du är en erfaren kommunikatör på ett svenskt IT-företag.") },
      { id: "kontext", e: "📋", n: T_("Kontext"), s: T_("Fakta den behöver"), w: 30, col: "--green", txt: T_("Kontoret är stängt 23 december–1 januari. Supporten är öppen 27–30 december kl. 9–15 på 08-123 45 67.") },
      { id: "ton", e: "🗣️", n: T_("Målgrupp och ton"), s: T_("Till vem, och hur?"), w: 15, col: "--pink", txt: T_("Mejlet går till våra kunder. Tonen ska vara varm och personlig, inte formell.") },
      { id: "format", e: "📐", n: T_("Format"), s: T_("Längd och struktur"), w: 15, col: "--orange", txt: T_("Max 100 ord. Ämnesrad, två korta stycken och en hälsning.") },
      { id: "exempel", e: "🧩", n: T_("Exempel"), s: T_("Visa hur det ska låta"), w: 15, col: "--cyan", txt: T_("Förra årets mejl började så här: ”Nu laddar vi batterierna inför ett nytt år …”") },
      { id: "grans", e: "🚧", n: T_("Begränsningar"), s: T_("Vad den inte får göra"), w: 15, col: "--red", txt: T_("Hitta inte på information som inte står här. Använd inga emojis.") },
    ];
    const TASK = T_("Skriv ett mejl om att vi har julstängt.");
    const on = new Set();
    $("#pbParts").innerHTML = `<div class="pb-part on" style="cursor:default"><span class="e">🎯</span><span><b>${T_("Uppgift")}</b><small>${TASK}</small></span><span class="dim mono" style="font-size:.7rem">${T_("ALLTID")}</span></div>` +
      P.map((p) => `<button class="pb-part" data-id="${p.id}"><span class="e">${p.e}</span><span><b>${p.n}</b><small>${p.s}</small></span><i class="sw"></i></button>`).join("");
    $("#pbParts").addEventListener("click", (e) => { const b = e.target.closest("button.pb-part"); if (!b) return; const id = b.dataset.id; on.has(id) ? on.delete(id) : on.add(id); b.classList.toggle("on", on.has(id)); render(); });
    function answer() {
      const h = (id) => on.has(id);
      const out = [];
      if (h("format")) out.push(T_("Ämne: God jul – så når du oss under helgerna") + "\n");
      out.push(h("ton") ? T_("Hej!") : T_("Bästa kund,"));
      out.push(h("kontext") ? T_("Vårt kontor är stängt från den 23 december till och med den 1 januari. Behöver du hjälp når du supporten 27–30 december kl. 9–15 på 08-123 45 67.")
        : T_("Vårt kontor kommer att hålla stängt under en period i samband med jul- och nyårshelgerna. [ANGE DATUM]") + (h("grans") ? " " + T_("Kontakta oss gärna efter helgerna.") : " " + T_("Vid akuta ärenden når du oss dygnet runt på support@företaget.se. ⚠️")));
      if (!h("format")) out.push(T_("Under det gångna året har vi genomfört många spännande projekt tillsammans med våra kunder och vi ser verkligen fram emot att fortsätta utveckla vårt samarbete under det kommande året, som vi tror kommer att bli ännu bättre."));
      let thanks = h("ton") ? T_("Tack för att du har varit med oss i år, det betyder mycket! Vi hoppas att du får en riktigt skön ledighet.") : T_("Vi tackar för det gångna året och ser fram emot fortsatt samarbete.");
      if (h("exempel")) thanks = T_("Nu laddar vi batterierna inför ett nytt år.") + " " + thanks;
      if (h("ton") && !h("grans")) thanks += " 🎄✨";
      out.push(thanks);
      out.push(h("roll") ? T_("Varma hälsningar,") + "\n" + T_("Kundteamet på Nordljus AB") : T_("Med vänliga hälsningar") + "\n" + T_("[Ditt namn]"));
      return out.join("\n\n");
    }
    function render() {
      const parts = P.filter((p) => on.has(p.id));
      $("#pbPrompt").innerHTML = [...parts.filter((p) => p.id === "roll"), { txt: TASK, col: "--accent" }, ...parts.filter((p) => p.id !== "roll")].map((p) => `<mark style="border-color:var(${p.col})">${p.txt}</mark>`).join("\n");
      const q = parts.reduce((s, p) => s + p.w, 0);
      const [lab, col] = q < 30 ? [T_("Vagt 😕"), "--red"] : q < 60 ? [T_("Okej 🙂"), "--orange"] : q < 90 ? [T_("Bra 😀"), "--green"] : [T_("Utmärkt 🤩"), "--green"];
      $("#pbQ").style.width = Math.max(6, q) + "%"; $("#pbQ").style.background = `var(${col})`;
      $("#pbQt").textContent = lab; $("#pbQt").style.color = `var(${col})`;
      $("#pbAns").textContent = answer();
      $("#pbAns").innerHTML = $("#pbAns").innerHTML.replace(T_("[ANGE DATUM]"), `<mark style="background:color-mix(in srgb,var(--orange) 30%,transparent);color:inherit">${T_("[ANGE DATUM]")}</mark>`).replace(L_(/(Vid akuta ärenden[^⚠]*⚠️)/, /(For urgent matters[^⚠]*⚠️)/), L_('<mark style="background:color-mix(in srgb,var(--red) 30%,transparent);color:inherit" title="Påhittat av AI:n">$1 påhittat!</mark>', '<mark style="background:color-mix(in srgb,var(--red) 30%,transparent);color:inherit" title="Made up by the AI">$1 made up!</mark>'));
    }
    render();
  })();

  // ============ KAP 10: quiz ============
  (() => {
    const Q = L_([
      ["Honung från egyptiska gravar kan fortfarande vara ätbar efter tusentals år.", 1, "Sant. Honung innehåller lite vatten och är sur, så bakterier har svårt att växa."],
      ["Enligt studien ”Lindqvist et al. 2019” i tidskriften Nature dricker svenskar mest kaffe i världen per person.", 0, "Påhittat. Studien finns inte, och Finland brukar toppa listan. AI:er hittar gärna på källor som ser trovärdiga ut."],
      ["Sverige har 25 landskap, och det största är Lappland.", 1, "Sant. Lappland är det största landskapet, Öland det minsta."],
      ["Astrid Lindgren fick Nobelpriset i litteratur 1979 för Bröderna Lejonhjärta.", 0, "Påhittat. Astrid Lindgren fick aldrig Nobelpriset. Det låter rimligt, och det är just därför det är farligt."],
    ], [
      ["Honey from Egyptian tombs can still be edible after thousands of years.", 1, "True. Honey contains very little water and is acidic, so bacteria struggle to grow in it."],
      ["According to the study “Lindqvist et al. 2019” in the journal Nature, Swedes drink more coffee per person than anyone else in the world.", 0, "Made up. The study doesn’t exist, and Finland usually tops the list. AIs love to invent sources that look credible."],
      ["Sweden has 25 historical provinces, and the largest is Lapland.", 1, "True. Lapland is the largest province, Öland the smallest."],
      ["Astrid Lindgren won the Nobel Prize in Literature in 1979 for The Brothers Lionheart.", 0, "Made up. Astrid Lindgren never won the Nobel Prize. It sounds plausible, and that’s exactly what makes it dangerous."],
    ]);
    $("#quiz").innerHTML = Q.map(([q, ok, a]) => L_(`<div class="qcard"><div class="in"><div class="f"><small>AI-SVAR · KLICKA FÖR ATT VÄNDA</small><div>”${q}”</div></div><div class="b ${ok ? "true" : "false"}"><span class="verdict">${ok ? "✅ SANT" : "❌ HALLUCINATION"}</span><p>${a}</p></div></div></div>`,
      `<div class="qcard"><div class="in"><div class="f"><small>AI ANSWER · CLICK TO FLIP</small><div>“${q}”</div></div><div class="b ${ok ? "true" : "false"}"><span class="verdict">${ok ? "✅ TRUE" : "❌ HALLUCINATION"}</span><p>${a}</p></div></div></div>`)).join("");
    $("#quiz").addEventListener("click", (e) => { const c = e.target.closest(".qcard"); if (c) c.classList.toggle("flip"); });
  })();

  // ============ KAP 11: embeddings ============
  // Orden är placerade så att sambanden är exakta: kön = (+120, 0), ung = (+30, +60), kunglig = (0, −210).
  // Klick på ett ord: närmaste grannar i samma grupp (med vad som skiljer dem åt) och ordets analogi.
  (() => {
    const W = {
      kung: [90, 90, 0, { kön: "m", ung: 0, kunglig: 1 }], drottning: [210, 90, 0, { kön: "k", ung: 0, kunglig: 1 }],
      prins: [120, 150, 0, { kön: "m", ung: 1, kunglig: 1 }], prinsessa: [240, 150, 0, { kön: "k", ung: 1, kunglig: 1 }],
      man: [90, 300, 0, { kön: "m", ung: 0, kunglig: 0 }], kvinna: [210, 300, 0, { kön: "k", ung: 0, kunglig: 0 }],
      pojke: [120, 360, 0, { kön: "m", ung: 1, kunglig: 0 }], flicka: [240, 360, 0, { kön: "k", ung: 1, kunglig: 0 }],
      hund: [400, 80, 1, { art: "hund", ung: 0 }], valp: [430, 140, 1, { art: "hund", ung: 1 }],
      katt: [520, 80, 1, { art: "katt", ung: 0 }], kattunge: [550, 140, 1, { art: "katt", ung: 1 }],
      häst: [600, 200, 1, { art: "häst", ung: 0 }], föl: [630, 260, 1, { art: "häst", ung: 1 }],
      bil: [430, 360, 2, { drivs: "motor", kollektiv: 0, går: "väg" }], buss: [530, 390, 2, { drivs: "motor", kollektiv: 1, går: "väg" }],
      cykel: [400, 425, 2, { drivs: "muskler", kollektiv: 0, går: "väg" }], tåg: [620, 350, 2, { drivs: "motor", kollektiv: 1, går: "räls" }],
      äpple: [300, 225, 3, { sort: "äpple" }], päron: [340, 255, 3, { sort: "päron" }], banan: [300, 290, 3, { sort: "banan" }], apelsin: [345, 195, 3, { sort: "apelsin" }],
    };
    const CL = [["--pink", T_("MÄNNISKOR"), 60, 45], ["--cyan", T_("DJUR"), 390, 40], ["--orange", T_("FORDON"), 390, 330], ["--green", T_("FRUKT"), 285, 175]];
    // Analogier: ordet = a − b + c (stämmer exakt med koordinaterna ovan).
    const AN = {
      kung: ["drottning", "kvinna", "man"], drottning: ["kung", "man", "kvinna"], prins: ["prinsessa", "flicka", "pojke"], prinsessa: ["prins", "pojke", "flicka"],
      man: ["kung", "drottning", "kvinna"], kvinna: ["drottning", "kung", "man"], pojke: ["flicka", "kvinna", "man"], flicka: ["pojke", "man", "kvinna"],
      valp: ["kattunge", "katt", "hund"], kattunge: ["valp", "hund", "katt"], föl: ["valp", "hund", "häst"],
      hund: ["katt", "kattunge", "valp"], katt: ["hund", "valp", "kattunge"], häst: ["hund", "valp", "föl"],
    };
    // Engelska: samma karta och samma analogier, bara orden byts (kitten − cat + dog = puppy osv.).
    const EN = L_(null, {
      kung: "king", drottning: "queen", prins: "prince", prinsessa: "princess", man: "man", kvinna: "woman", pojke: "boy", flicka: "girl",
      hund: "dog", valp: "puppy", katt: "cat", kattunge: "kitten", häst: "horse", föl: "foal",
      bil: "car", buss: "bus", cykel: "bike", tåg: "train", äpple: "apple", päron: "pear", banan: "banana", apelsin: "orange",
    });
    if (EN) for (const o of [W, AN]) for (const k of Object.keys(o)) { const v = o[k]; delete o[k]; o[EN[k]] = o === AN ? v.map((x) => EN[x]) : v; }
    const DIFF = { kön: T_("kön"), ung: T_("ålder"), kunglig: T_("kunglig"), art: T_("djurart"), drivs: T_("motor"), kollektiv: T_("kollektivt"), går: T_("räls"), sort: T_("sort") };
    const diff = (a, b) => Object.keys(W[a][3]).filter((k) => W[a][3][k] !== W[b][3][k]).map((k) => DIFF[k]);
    const el = $("#embSvg");
    const defs = svg("defs", {}, el);
    const mk = svg("marker", { id: "arrowHead", viewBox: "0 0 10 10", refX: 8, refY: 5, markerWidth: 6, markerHeight: 6, orient: "auto-start-reverse" }, defs);
    svg("path", { d: "M0 0 L10 5 L0 10 z", fill: "var(--accent)" }, mk);
    const grid = svg("g", { class: "grid" }, el);
    for (let x = 50; x < 700; x += 50) svg("line", { x1: x, x2: x, y1: 0, y2: 460 }, grid);
    for (let y = 50; y < 460; y += 50) svg("line", { x1: 0, x2: 700, y1: y, y2: y }, grid);
    CL.forEach(([c, t, x, y]) => svg("text", { class: "clab", x, y }, el).textContent = t);
    const lines = svg("g", {}, el), vecs = svg("g", {}, el);
    const nodes = {};
    Object.entries(W).forEach(([w, [x, y, c]]) => {
      const g = svg("g", { class: "w" }, el);
      svg("circle", { cx: x, cy: y, r: 7, fill: `var(${CL[c][0]})` }, g);
      svg("text", { x: x + 11, y: y + 5 }, g).textContent = w;
      g.addEventListener("click", () => pick(w));
      nodes[w] = g;
    });
    const labels = svg("g", {}, el);   // ovanpå orden
    const dist = (a, b) => Math.hypot(W[a][0] - W[b][0], W[a][1] - W[b][1]);
    const sim = (a, b) => Math.max(0, 1 - dist(a, b) / 700);
    const vec = (w) => { let h = [...w].reduce((a, c) => (a * 131 + c.charCodeAt(0)) >>> 0, 17); const [x, y] = W[w]; const out = [(x / 350 - 1).toFixed(2), (1 - y / 230).toFixed(2)]; for (let i = 0; i < 5; i++) { h = (h * 1103515245 + 12345) >>> 0; out.push(((h % 2000) / 1000 - 1).toFixed(2)); } return out; };
    const focus = (set, on) => Object.entries(nodes).forEach(([w, g]) => { g.classList.toggle("dim", !set.has(w)); g.classList.toggle("on", w === on); });
    function arrow(from, to, cls) {
      const [x1, y1] = W[from], [x2, y2] = W[to];
      const L = Math.hypot(x2 - x1, y2 - y1), k = (L - 12) / L;
      const a = svg("line", { class: "vec " + (cls || ""), x1, y1, x2: x1 + (x2 - x1) * k, y2: y1 + (y2 - y1) * k, stroke: "var(--accent)" }, vecs);
      const len = L; a.style.strokeDasharray = len; a.style.strokeDashoffset = len; a.style.transition = "stroke-dashoffset 1s";
      requestAnimationFrame(() => requestAnimationFrame(() => (a.style.strokeDashoffset = 0)));
      return a;
    }
    let tok = 0;
    async function analogy(w, t) {
      const [a, b, c] = AN[w];
      vecs.innerHTML = "";
      focus(new Set([w, a, b, c]), null);
      $("#embAn").innerHTML = L_(`<div class="an-eq"><b>${a}</b> − <b>${b}</b> + <b>${c}</b> = <b class="k">?</b></div><small class="dim">Riktningen <b>${b} → ${c}</b> flyttas till <b>${a}</b> …</small>`,
        `<div class="an-eq"><b>${a}</b> − <b>${b}</b> + <b>${c}</b> = <b class="k">?</b></div><small class="dim">The direction <b>${b} → ${c}</b> is moved to <b>${a}</b> …</small>`);
      arrow(b, c); await pause(1200); if (t !== tok) return;
      arrow(a, w); await pause(1100); if (t !== tok) return;
      nodes[w].classList.add("on");
      const d = diff(b, c).join(" + ");
      $("#embAn").innerHTML = L_(`<div class="an-eq"><b>${a}</b> − <b>${b}</b> + <b>${c}</b> = <b class="k">${w}</b> ✅</div><small class="dim">Steget ${b} → ${c} ändrar bara <b>${d}</b>. Samma steg från ${a} landar på <b>${w}</b>.</small>`,
        `<div class="an-eq"><b>${a}</b> − <b>${b}</b> + <b>${c}</b> = <b class="k">${w}</b> ✅</div><small class="dim">The step ${b} → ${c} only changes <b>${d}</b>. The same step from ${a} lands on <b>${w}</b>.</small>`);
    }
    async function pick(w) {
      const t = ++tok;
      vecs.innerHTML = ""; lines.innerHTML = ""; labels.innerHTML = "";
      const [x, y, c] = W[w];
      const nb = Object.keys(W).filter((v) => v !== w && W[v][2] === c).sort((p, q) => dist(w, p) - dist(w, q)).slice(0, 3);
      focus(new Set([w, ...nb]), w);
      nb.forEach((v) => {
        svg("line", { class: "nb", x1: x, y1: y, x2: W[v][0], y2: W[v][1] }, lines);
        // Etiketten sitter 60 % mot grannen, förskjuten åt sidan, så att etiketter åt samma håll inte krockar.
        const dx = W[v][0] - x, dy = W[v][1] - y, L = Math.hypot(dx, dy) || 1, side = dx >= 0 ? 1 : -1;
        const lx = x + dx * .6 + (-dy / L) * 10 * side, ly = y + dy * .6 + (dx / L) * 10 * side + 4;
        const tx = svg("text", { class: "nb-lab", x: lx, y: ly, "text-anchor": "middle" }, labels);
        tx.textContent = diff(w, v).join(" + ");
      });
      $("#embWord").textContent = w;
      $("#embVec").textContent = `[ ${vec(w).map((n) => n.replace("-", "−")).join(", ")}, … ]`;
      $("#embNb").innerHTML = nb.map((v) => L_(`<div class="nb-row"><b>${v}</b><span class="dim">skiljer sig i: ${diff(w, v).join(", ")}</span><span class="mono dim">${sim(w, v).toFixed(2)}</span></div>`, `<div class="nb-row"><b>${v}</b><span class="dim">differs in: ${diff(w, v).join(", ")}</span><span class="mono dim">${sim(w, v).toFixed(2)}</span></div>`)).join("");
      if (!AN[w]) { $("#embAn").innerHTML = `<small class="dim">${T_("Här finns ingen enkel analogi på vår lilla karta, men grannarna visar vad orden har gemensamt: de hamnar nära varandra för att de används på liknande sätt.")}</small>`; return; }
      $("#embAn").innerHTML = `<small class="dim">${T_("Analogi kommer …")}</small>`;
      await pause(1600); if (t !== tok) return;
      lines.innerHTML = ""; labels.innerHTML = "";
      analogy(w, t);
    }
    $("#embMath").onclick = () => { const t = ++tok; lines.innerHTML = ""; labels.innerHTML = ""; $("#embWord").textContent = L_("drottning", "queen"); $("#embVec").textContent = `[ ${vec(L_("drottning", "queen")).map((n) => n.replace("-", "−")).join(", ")}, … ]`; $("#embNb").innerHTML = ""; analogy(L_("drottning", "queen"), t); };
  })();

  // ============ KAP 12: RAG ============
  (() => {
    const DOCS = L_([
      ["🏖️", "Semester", "Alla anställda har 30 semesterdagar per år. Semester söks i HR-portalen senast två månader innan."],
      ["🏠", "Distansarbete", "Du får arbeta hemifrån upp till 3 dagar i veckan, efter överenskommelse med din chef."],
      ["🚲", "Friskvård", "Friskvårdsbidraget är 5 000 kr per år och kan användas till gym, simning eller massage."],
      ["💻", "IT", "Ny dator beställs via IT-portalen. Datorer byts ut vart tredje år."],
      ["🍰", "Fika", "Gemensam fika varje fredag kl. 15 i köket på plan 2."],
      ["🧾", "Utlägg", "Kvitton för utlägg laddas upp i appen Utlägg inom 30 dagar."],
    ], [
      ["🏖️", "Holiday", "All employees get 30 days of annual leave per year. Apply for leave in the HR portal at least two months in advance."],
      ["🏠", "Remote work", "You may work from home up to 3 days a week, by agreement with your manager."],
      ["🚲", "Wellness", "The wellness allowance is SEK 5,000 per year and can be used for the gym, swimming or massage."],
      ["💻", "IT", "Order a new computer through the IT portal. Computers are replaced every three years."],
      ["🍰", "Fika", "Team fika (coffee and cake) every Friday at 3 pm in the kitchen on floor 2."],
      ["🧾", "Expenses", "Receipts for expenses are uploaded in the Expenses app within 30 days."],
    ]);
    const QS = L_([
      { q: "Hur många semesterdagar har jag?", s: [.91, .38, .29, .12, .21, .26], no: "Enligt semesterlagen har du rätt till 25 semesterdagar per år.", yes: "Du har <b>30 semesterdagar</b> per år. Sök semester i HR-portalen senast två månader innan. <span class='src'>Semester</span>", why: "Låter rätt, men gäller inte Nordljus, där det är 30 dagar." },
      { q: "Får jag jobba hemma på fredagar?", s: [.33, .88, .21, .18, .47, .14], no: "Det beror på din arbetsgivare. Många företag tillåter distansarbete 1–2 dagar i veckan.", yes: "Ja, om din chef godkänner det. Du får arbeta hemifrån <b>upp till 3 dagar</b> i veckan. <span class='src'>Distansarbete</span> Men missa inte fredagsfikan kl. 15! <span class='src'>Fika</span>", why: "Ett vagt svar. Modellen känner inte era regler." },
      { q: "Vad kan jag använda friskvårdsbidraget till?", s: [.22, .17, .93, .11, .19, .41], no: "Friskvårdsbidraget kan användas till de flesta motionsaktiviteter, till exempel golf, padel och ridning.", yes: "Du får <b>5 000 kr per år</b> till gym, simning eller massage. <span class='src'>Friskvård</span>", why: "Självsäkert, men det står inget om golf eller padel i er handbok." },
      { q: "När byts min dator ut?", s: [.14, .21, .1, .9, .12, .35], no: "Datorer byts vanligtvis ut vart fjärde till femte år.", yes: "Datorer byts ut <b>vart tredje år</b>. Ny dator beställs via IT-portalen. <span class='src'>IT</span>", why: "En gissning. Er policy säger vart tredje år." },
    ], [
      { q: "How many days of holiday do I get?", s: [.91, .38, .29, .12, .21, .26], no: "Under Swedish law (the Annual Leave Act) you are entitled to 25 days of annual leave per year.", yes: "You get <b>30 days of annual leave</b> per year. Apply in the HR portal at least two months in advance. <span class='src'>Holiday</span>", why: "Sounds right, but it doesn’t apply at Nordljus, where it’s 30 days." },
      { q: "Can I work from home on Fridays?", s: [.33, .88, .21, .18, .47, .14], no: "It depends on your employer. Many companies allow remote work 1–2 days a week.", yes: "Yes, if your manager agrees. You may work from home <b>up to 3 days</b> a week. <span class='src'>Remote work</span> But don’t miss Friday fika at 3 pm! <span class='src'>Fika</span>", why: "A vague answer. The model doesn’t know your rules." },
      { q: "What can I use the wellness allowance for?", s: [.22, .17, .93, .11, .19, .41], no: "The wellness allowance can be used for most kinds of exercise, such as golf, padel and horse riding.", yes: "You get <b>SEK 5,000 per year</b> for the gym, swimming or massage. <span class='src'>Wellness</span>", why: "Confident, but your handbook says nothing about golf or padel." },
      { q: "When will my computer be replaced?", s: [.14, .21, .1, .9, .12, .35], no: "Computers are usually replaced every four to five years.", yes: "Computers are replaced <b>every three years</b>. Order a new one through the IT portal. <span class='src'>IT</span>", why: "A guess. Your policy says every three years." },
    ]);
    $("#ragQs").innerHTML = QS.map((q, i) => `<button data-i="${i}">❓ ${q.q}</button>`).join("");
    const drawDocs = () => { $("#ragDocs").innerHTML = DOCS.map(([e, t, d]) => `<div class="doc"><span style="font-size:1.2rem">${e}</span><span><b>${t}:</b> ${d}</span><span><span class="s"><i></i></span><span class="sc">–</span></span></div>`).join(""); };
    drawDocs();
    $("#ragAns").innerHTML = `<div class="box dim">${T_("Välj en fråga till vänster. Vi jämför ett svar <b>utan</b> RAG med ett svar <b>med</b> RAG.")}</div>`;
    let tok = 0;
    const steps = $$("#ragFlow .rag-step");
    const at = (k) => steps.forEach((s, i) => { s.classList.toggle("on", i === k); s.classList.toggle("done", i < k); });
    $("#ragQs").addEventListener("click", async (e) => {
      const b = e.target.closest("button"); if (!b) return;
      const t = ++tok, Q = QS[+b.dataset.i];
      $$("#ragQs button").forEach((x) => x.classList.toggle("on", x === b));
      drawDocs();
      const A = $("#ragAns");
      at(0); A.innerHTML = `<div class="bubble user" style="justify-self:end"><span class="who">${T_("MEDARBETARE")}</span>${Q.q}</div>`;
      await pause(900); if (t !== tok) return;
      at(1); A.innerHTML += `<div class="vec-out">${T_("🔢 [ 0.12, −0.48, 0.91, 0.03, −0.27, … 1 536 siffror ]")}</div>`;
      await pause(1000); if (t !== tok) return;
      at(2);
      const order = Q.s.map((s, i) => [s, i]).sort((a, b) => b[0] - a[0]);
      const top = new Set(order.slice(0, 2).filter(([s]) => s > .4).map(([, i]) => i));
      $$("#ragDocs .doc").forEach((d, i) => { d.querySelector(".s i").style.width = Q.s[i] * 100 + "%"; d.querySelector(".sc").textContent = Q.s[i].toFixed(2); });
      await pause(1200); if (t !== tok) return;
      $$("#ragDocs .doc").forEach((d, i) => { d.classList.toggle("hit", top.has(i)); d.classList.toggle("miss", !top.has(i)); });
      at(3);
      A.innerHTML += L_(`<div class="aug">Svara på frågan med HJÄLP AV UTDRAGEN NEDAN.\nSäg om svaret inte finns där.\n\n${[...top].map((i) => `[${DOCS[i][1]}] ${DOCS[i][2]}`).join("\n")}\n\nFråga: ${Q.q}</div>`,
        `<div class="aug">Answer the question USING THE EXCERPTS BELOW.\nSay so if the answer isn’t there.\n\n${[...top].map((i) => `[${DOCS[i][1]}] ${DOCS[i][2]}`).join("\n")}\n\nQuestion: ${Q.q}</div>`);
      await pause(1300); if (t !== tok) return;
      at(4);
      A.innerHTML += `<div><div class="lbl" style="color:var(--red)">${T_("❌ UTAN RAG")}</div><div class="bubble ai bad">${Q.no}<br /><small class="dim">${Q.why}</small></div></div><div><div class="lbl" style="color:var(--green)">${T_("✅ MED RAG")}</div><div class="bubble ai good">${Q.yes}</div></div>`;
    });
  })();

  // ============ KAP 13: agenter ============
  (() => {
    const el = $("#loopSvg");
    const cx = 200, cy = 200, R = 135;
    svg("circle", { class: "ring", cx, cy, r: R }, el);
    const LN = [["think", "🤔", T_("Tänk"), -90], ["act", "🛠️", T_("Agera"), 30], ["obs", "👀", T_("Observera"), 150]];
    const pos = {};
    const ln = LN.map(([id, e, t, a]) => {
      const x = cx + R * Math.cos((a * Math.PI) / 180), y = cy + R * Math.sin((a * Math.PI) / 180);
      pos[id] = [x, y];
      const g = svg("g", { class: "lnode" }, el);
      svg("circle", { cx: x, cy: y, r: 44 }, g);
      svg("text", { x, y: y - 4, "font-size": 26 }, g).textContent = e;
      svg("text", { x, y: y + 22, "font-size": 13, "font-weight": 700 }, g).textContent = t;
      return [id, g];
    });
    const center = svg("g", { class: "lnode" }, el);
    svg("circle", { cx, cy, r: 50 }, center);
    svg("text", { x: cx, y: cy + 2, "font-size": 34 }, center).textContent = "🤖";
    svg("text", { x: cx, y: cy + 28, "font-size": 11, "font-weight": 700 }, center).textContent = T_("LLM + MÅL");
    pos.done = pos.human = [cx, cy];
    const spark = svg("circle", { class: "spark", r: 8, cx: 0, cy: 0 }, el);
    spark.style.transition = "transform .6s cubic-bezier(.4,0,.2,1)";
    const setNode = (k) => {
      ln.forEach(([id, g]) => g.classList.toggle("on", id === k));
      center.classList.toggle("on", k === "done" || k === "human");
      const [x, y] = pos[k] || [cx, cy];
      spark.style.transform = `translate(${x}px, ${y - (k === "done" || k === "human" ? 58 : 52)}px)`;
    };
    setNode("think");
    const TOOLS = { kal: T_("📅 Kalender"), mejl: T_("✉️ Mejl"), webb: T_("🌐 Webbsök"), bok: T_("🎟️ Bokning"), dok: T_("📄 Dokument"), vad: T_("🌦️ Väder") };
    $("#aTools").innerHTML = Object.entries(TOOLS).map(([k, v]) => `<span data-t="${k}">${v}</span>`).join("");
    const MISSIONS = L_([
      { n: "🍽️ Boka teamlunch på fredag", s: [
        ["think", "Jag behöver veta vilka i teamet som är lediga på fredag lunch."],
        ["act", "<code>kalender.sök(team=\"Marknad\", dag=\"fredag\", tid=\"11:30–13:00\")</code>", "kal"],
        ["obs", "5 av 6 är lediga. Erik har kundmöte."],
        ["think", "Fem personer. Jag letar efter en restaurang nära kontoret med plats för fem."],
        ["act", "<code>webb.sök(\"lunch nära kontoret, bord för 5, vegetariskt\")</code>", "webb"],
        ["obs", "Tre förslag. ”Bistro Norr” har vegetariska rätter och betyget 4,6."],
        ["act", "<code>bokning.reservera(\"Bistro Norr\", \"fredag 12:00\", 5)</code>", "bok"],
        ["obs", "Bord bokat ✔ Bekräftelse #4471."],
        ["human", "Ska jag skicka en inbjudan till de fem i teamet?"],
        ["act", "<code>mejl.skicka(till=\"team\", ämne=\"Teamlunch fredag 12:00\")</code>", "mejl"],
        ["obs", "Inbjudan skickad till 5 personer."],
        ["done", "Klart! Lunch på Bistro Norr på fredag kl. 12:00 för fem personer."],
      ] },
      { n: "🚆 Planera resa till Göteborg", s: [
        ["think", "Mötet i Göteborg är på tisdag. Jag kollar tiden i kalendern först."],
        ["act", "<code>kalender.hämta(\"tisdag\")</code>", "kal"],
        ["obs", "Kundmöte 10:00–15:00 på Lindholmen."],
        ["think", "Ett tidigt tåg är bäst. Jag kollar också vädret, för packningens skull."],
        ["act", "<code>webb.sök(\"tåg Stockholm–Göteborg tisdag före 07:00\")</code>", "webb"],
        ["obs", "Avgång 06:10, framme 09:15. Pris 1 290 kr."],
        ["act", "<code>väder.prognos(\"Göteborg\", \"tisdag\")</code>", "vad"],
        ["obs", "12 °C och regn 🌧️"],
        ["human", "Tåget kostar 1 290 kr. Ska jag boka det?"],
        ["act", "<code>bokning.tåg(\"06:10\", \"tisdag\")</code>", "bok"],
        ["act", "<code>dokument.skapa(\"Resplan Göteborg\")</code>", "dok"],
        ["obs", "Biljett bokad ✔ Resplan sparad."],
        ["done", "Klart! Tåg 06:10, framme 09:15. Ta med paraply, det blir regn i Göteborg."],
      ] },
      { n: "📊 Sammanfatta veckans kundmejl", s: [
        ["think", "Jag börjar med att hämta veckans mejl från kundinkorgen."],
        ["act", "<code>mejl.sök(mapp=\"Kunder\", period=\"denna vecka\")</code>", "mejl"],
        ["obs", "42 mejl hittade."],
        ["think", "Jag grupperar dem efter ämne och känsla: 18 om fakturor, 12 om leveranser, 8 beröm, 4 klagomål. Klagomålen är viktigast att lyfta."],
        ["act", "<code>dokument.skapa(\"Veckorapport kundmejl\", diagram=true)</code>", "dok"],
        ["obs", "Rapport skapad med diagram."],
        ["human", "Ska jag skicka rapporten till kundtjänstchefen?"],
        ["act", "<code>mejl.skicka(till=\"kundtjänstchef\", bilaga=\"Veckorapport\")</code>", "mejl"],
        ["obs", "Skickat ✔"],
        ["done", "Klart! 42 mejl sammanfattade. Viktigast: 4 klagomål om sena leveranser."],
      ] },
    ], [
      { n: "🍽️ Book a team lunch on Friday", s: [
        ["think", "I need to find out who in the team is free for lunch on Friday."],
        ["act", "<code>calendar.search(team=\"Marketing\", day=\"Friday\", time=\"11:30–13:00\")</code>", "kal"],
        ["obs", "5 out of 6 are free. Erik has a client meeting."],
        ["think", "Five people. I'll look for a restaurant near the office with room for five."],
        ["act", "<code>web.search(\"lunch near the office, table for 5, vegetarian\")</code>", "webb"],
        ["obs", "Three suggestions. “Bistro Norr” has vegetarian dishes and a rating of 4.6."],
        ["act", "<code>booking.reserve(\"Bistro Norr\", \"Friday 12:00\", 5)</code>", "bok"],
        ["obs", "Table booked ✔ Confirmation #4471."],
        ["human", "Shall I send an invitation to the five people in the team?"],
        ["act", "<code>email.send(to=\"team\", subject=\"Team lunch Friday 12:00\")</code>", "mejl"],
        ["obs", "Invitation sent to 5 people."],
        ["done", "Done! Lunch at Bistro Norr on Friday at 12:00 for five people."],
      ] },
      { n: "🚆 Plan a trip to Gothenburg", s: [
        ["think", "The meeting in Gothenburg is on Tuesday. I'll check the time in the calendar first."],
        ["act", "<code>calendar.get(\"Tuesday\")</code>", "kal"],
        ["obs", "Client meeting 10:00–15:00 at Lindholmen."],
        ["think", "An early train is best. I'll also check the weather, so you know what to pack."],
        ["act", "<code>web.search(\"train Stockholm–Gothenburg Tuesday before 07:00\")</code>", "webb"],
        ["obs", "Departs 06:10, arrives 09:15. Price SEK 1,290."],
        ["act", "<code>weather.forecast(\"Gothenburg\", \"Tuesday\")</code>", "vad"],
        ["obs", "12 °C and rain 🌧️"],
        ["human", "The train costs SEK 1,290. Shall I book it?"],
        ["act", "<code>booking.train(\"06:10\", \"Tuesday\")</code>", "bok"],
        ["act", "<code>document.create(\"Itinerary Gothenburg\")</code>", "dok"],
        ["obs", "Ticket booked ✔ Itinerary saved."],
        ["done", "Done! Train at 06:10, arriving 09:15. Take an umbrella, it's going to rain in Gothenburg."],
      ] },
      { n: "📊 Summarise this week's customer emails", s: [
        ["think", "I'll start by fetching this week's emails from the customer inbox."],
        ["act", "<code>email.search(folder=\"Customers\", period=\"this week\")</code>", "mejl"],
        ["obs", "42 emails found."],
        ["think", "I'll group them by topic and tone: 18 about invoices, 12 about deliveries, 8 compliments, 4 complaints. The complaints are the most important to flag."],
        ["act", "<code>document.create(\"Weekly report customer emails\", chart=true)</code>", "dok"],
        ["obs", "Report created with a chart."],
        ["human", "Shall I send the report to the customer service manager?"],
        ["act", "<code>email.send(to=\"customer service manager\", attachment=\"Weekly report\")</code>", "mejl"],
        ["obs", "Sent ✔"],
        ["done", "Done! 42 emails summarised. Most important: 4 complaints about late deliveries."],
      ] },
    ]);
    const K = { think: T_("🤔 TÄNKER"), act: T_("🛠️ AGERAR"), obs: T_("👀 SER"), human: T_("🙋 FRÅGAR DIG"), done: T_("🏁 KLART") };
    $("#aMissions").innerHTML = MISSIONS.map((m, i) => `<button data-i="${i}">${m.n}</button>`).join("");
    let tok = 0;
    const log = $("#aLog");
    const add = (k, html) => { const d = document.createElement("div"); d.className = "row " + k; d.innerHTML = `<span class="k">${K[k]}</span><span>${html}</span>`; log.appendChild(d); log.scrollTop = log.scrollHeight; return d; };
    // MCP-navet under agentloopen: anrop (tools/call) skickas som paket ut till verktygsraden,
    // och resultatet skickas tillbaka när agenten observerar. Raderna motsvarar agentens verktyg.
    const mcp = (() => {
      const hub = $("#mcpHub"), msg = $("#mcpMsg");
      const row = (t) => $(`.mcp-side span[data-t="${t}"]`);
      let pending = [];
      const fire = (r, cls) => { const p = r.querySelector(".pkt"); p.className = "pkt"; void p.offsetWidth; p.className = "pkt " + cls + (r.parentElement.classList.contains("left") ? "-l" : "-r"); };
      return {
        call(t, text) {
          const r = row(t); if (!r) return;
          $$(".mcp-side span").forEach((x) => x.classList.remove("reply"));
          r.classList.add("call"); hub.classList.add("busy"); fire(r, "req");
          pending.push(t);
          msg.innerHTML = `<span class="k-req">→ tools/call</span> <code>${text}</code>`;
        },
        result(text) {
          if (!pending.length) return;
          // Raden lyser grönt medan svaret åker tillbaka till navet, och släcks när det har kommit fram.
          pending.forEach((t) => { const r = row(t); r.classList.remove("call"); r.classList.add("reply"); fire(r, "res"); clearTimeout(r._off); r._off = setTimeout(() => r.classList.remove("reply"), 1100); });
          pending = []; hub.classList.remove("busy");
          msg.innerHTML = `<span class="k-res">${T_("← resultat")}</span> ${text}`;
        },
        idle() {
          pending = []; hub.classList.remove("busy");
          $$(".mcp-side span").forEach((x) => x.classList.remove("call", "reply"));
          msg.innerHTML = '<span class="dim">' + T_("MCP väntar på att agenten ska använda ett verktyg …") + '</span>';
        },
      };
    })();
    $("#aMissions").addEventListener("click", async (e) => {
      const b = e.target.closest("button"); if (!b) return;
      const t = ++tok, M = MISSIONS[+b.dataset.i];
      $$("#aMissions button").forEach((x) => x.classList.toggle("on", x === b));
      mcp.idle();
      log.innerHTML = ""; add("done", L_(`<b>Mål:</b> ${M.n.slice(M.n.indexOf(" ") + 1)}`, `<b>Goal:</b> ${M.n.slice(M.n.indexOf(" ") + 1)}`)).className = "row think";
      log.lastChild.querySelector(".k").textContent = T_("🎯 MÅL");
      for (const [k, html, tool] of M.s) {
        await pause(1300); if (t !== tok) return;
        setNode(k);
        $$("#aTools span").forEach((s) => s.classList.toggle("on", s.dataset.t === tool));
        if (k === "act" && tool) { const tmp = document.createElement("div"); tmp.innerHTML = html; mcp.call(tool, tmp.textContent); }
        if (k === "obs") mcp.result(html);
        if (k === "done") mcp.idle();
        if (k === "human") {
          const row = add("human", `${html}<div class="approve"><button class="primary" data-a="y">${T_("✔ Godkänn")}</button><button data-a="n">${T_("✖ Avbryt")}</button></div>`);
          const ans = await new Promise((res) => row.addEventListener("click", (ev) => { const a = ev.target.closest("button")?.dataset.a; if (a) res(a); }));
          if (t !== tok) return;
          row.querySelector(".approve").innerHTML = ans === "y" ? `<span style="color:var(--green);font-weight:700">${T_("✔ Godkänt av dig")}</span>` : `<span style="color:var(--red);font-weight:700">${T_("✖ Avbrutet")}</span>`;
          if (ans === "n") { setNode("done"); add("done", T_("Uppdraget stoppades av en människa. Inget skickades eller bokades. Det är <b>human in the loop</b>.")); $$("#aTools span").forEach((s) => s.classList.remove("on")); mcp.idle(); return; }
          continue;
        }
        add(k, html);
      }
      $$("#aTools span").forEach((s) => s.classList.remove("on"));
    });
  })();

  // ============ KAP 14: automatisering ============
  (() => {
    const R = L_([
      ["💬", "Chatta", "Fråga en AI", "Du klistrar in text, AI:n svarar och du kopierar tillbaka. Bra för att skriva om, sammanfatta, översätta och brainstorma. <b>Börja här.</b>"],
      ["🧩", "AI i verktygen", "Copilot, Gemini …", "AI inbyggd där du redan jobbar: Copilot i Word, Outlook och Teams, Gemini i Gmail, automatiska mötesanteckningar. Ingen ny app att lära sig."],
      ["🔗", "Arbetsflöden", "Workflows", "Verktyg som <span class='en'>Power Automate, Zapier, Make</span> eller <span class='en'>n8n</span>: ”När X händer, låt AI göra Y och skicka till Z.” Fasta steg, med AI i mitten."],
      ["🤖", "Agenter", "AI agents", "Du ger ett mål, inte steg. Agenten väljer själv verktyg och ordning. Kräver tydliga behörigheter och att människan godkänner viktiga beslut."],
      ["🕸️", "Flera agenter", "Multi-agent", "Specialiserade agenter samarbetar: en researchar, en skriver, en granskar. Kraftfullt, men ännu i ett tidigt skede för de flesta organisationer."],
    ], [
      ["💬", "Chat", "Ask an AI", "You paste in text, the AI replies and you copy it back. Great for rewriting, summarising, translating and brainstorming. <b>Start here.</b>"],
      ["🧩", "AI in your tools", "Copilot, Gemini …", "AI built into the places you already work: Copilot in Word, Outlook and Teams, Gemini in Gmail, automatic meeting notes. No new app to learn."],
      ["🔗", "Workflows", "Automated flows", "Tools such as <span class='en'>Power Automate, Zapier, Make</span> or <span class='en'>n8n</span>: “When X happens, let AI do Y and send it to Z.” Fixed steps, with AI in the middle."],
      ["🤖", "Agents", "AI agents", "You give a goal, not steps. The agent chooses its own tools and order. Needs clear permissions, and a human who approves important decisions."],
      ["🕸️", "Multiple agents", "Multi-agent", "Specialised agents work together: one researches, one writes, one reviews. Powerful, but still at an early stage for most organisations."],
    ]);
    $("#ladder").innerHTML = R.map(([e, t, s], i) => `<div class="rung" data-i="${i}"><span class="n">${L_(`NIVÅ ${i + 1}`, `LEVEL ${i + 1}`)}</span><span class="e">${e}</span><b>${t}</b><small>${s}</small></div>`).join("");
    const pickR = (i) => { $$("#ladder .rung").forEach((r, k) => r.classList.toggle("on", k === i)); $("#rungInfo").innerHTML = L_(`<b>${R[i][0]} Nivå ${i + 1}: ${R[i][1]}.</b> ${R[i][3]}`, `<b>${R[i][0]} Level ${i + 1}: ${R[i][1]}.</b> ${R[i][3]}`); };
    // Exempel per nivå: [knapp, minuter manuellt, minuter med AI, flöde]. Flödets noder: [klass, etikett, rubrik, detalj].
    // Klasser: trig = utlösare, ai = AI/agent, act = åtgärd, hum = du/människa.
    const LV = L_([
      [
        { n: "✍️ Skriva om ett mejl", m: 15, a: 4, f: [["hum", "DU", "Klistra in utkastet", "i ChatGPT, Claude eller Copilot"], ["ai", "AI", "Skriver om det", "tydligare och vänligare"], ["hum", "DU", "Läser och justerar", "du äger texten"], ["act", "DU", "Kopierar tillbaka", "och skickar"]] },
        { n: "📑 Sammanfatta en rapport", m: 40, a: 8, f: [["hum", "DU", "Laddar upp rapporten", "PDF, 30 sidor"], ["ai", "AI", "Sammanfattar", "de fem viktigaste punkterna"], ["hum", "DU", "Ställer följdfrågor", "”Vad betyder det för oss?”"], ["act", "DU", "Klistrar in", "i ditt eget dokument"]] },
      ],
      [
        { n: "📧 Lång mejltråd", m: 10, a: 1, f: [["trig", "I OUTLOOK", "Du öppnar tråden", "23 mejl"], ["ai", "COPILOT", "Sammanfattar tråden", "vem vill vad, vad är öppet"], ["ai", "COPILOT", "Föreslår ett svar", "utkast i din ton"], ["hum", "DU", "Justerar och skickar", "ett klick"]] },
        { n: "🎙️ Mötesanteckningar i Teams", m: 25, a: 2, f: [["trig", "I TEAMS", "Mötet spelas in", "med transkribering påslagen"], ["ai", "COPILOT", "Anteckningar och att-göra", "direkt efter mötet"], ["hum", "DU", "Kontrollerar", "stämmer besluten?"], ["act", "DU", "Delar i chatten", "med deltagarna"]] },
      ],
      [
        { n: "📥 Inkommande mejl", m: 12, a: 2, f: [["trig", "UTLÖSARE", "Nytt mejl i supportinkorgen", "t.ex. Outlook"], ["ai", "AI", "Sortera och sammanfatta", "Faktura · brådskande · kund: Bygg AB"], ["ai", "AI", "Skriv ett svarsutkast", "utifrån er FAQ"], ["hum", "MÄNNISKA", "Granska och skicka", "ett klick"], ["act", "ÅTGÄRD", "Logga ärendet", "i CRM-systemet"]] },
        { n: "🎙️ Mötesanteckningar", m: 30, a: 3, f: [["trig", "UTLÖSARE", "Teams-mötet avslutas", "inspelning klar"], ["ai", "AI", "Transkribera", "tal blir text"], ["ai", "AI", "Sammanfatta", "beslut och att-göra-punkter"], ["act", "ÅTGÄRD", "Skapa uppgifter", "i Planner med ansvarig"], ["act", "ÅTGÄRD", "Mejla deltagarna", "sammanfattning + länk"]] },
        { n: "🧾 Leverantörsfakturor", m: 8, a: 1, f: [["trig", "UTLÖSARE", "PDF-faktura kommer in", "till fakturainkorgen"], ["ai", "AI", "Läs ut uppgifterna", "leverantör, belopp, förfallodag"], ["act", "ÅTGÄRD", "Matcha mot inköpsorder", "regler i systemet"], ["hum", "MÄNNISKA", "Godkänn avvikelser", "bara när något inte stämmer"], ["act", "ÅTGÄRD", "Bokför", "i ekonomisystemet"]] },
        { n: "🎧 Kundtjänstchatt", m: 10, a: 1, f: [["trig", "UTLÖSARE", "Kund frågar på webben", "dygnet runt"], ["ai", "AI · RAG", "Sök i hjälpartiklarna", "era egna texter"], ["ai", "AI", "Svara med källa", "länk till artikeln"], ["hum", "MÄNNISKA", "Svårt ärende?", "lämnas över till en kollega"], ["act", "ÅTGÄRD", "Spara konversationen", "för uppföljning"]] },
      ],
      [
        { n: "🤝 Förbered kundmötet", m: 45, a: 5, f: [["hum", "DU", "Ger ett mål", "”Förbered mötet med Bygg AB i morgon”"], ["ai", "AGENT", "Hämtar historik", "CRM: avtal, ärenden, kontakter"], ["ai", "AGENT", "Läser senaste mejlen", "och tidigare mötesanteckningar"], ["ai", "AGENT", "Skriver agenda och frågor", "väljer själv ordning och verktyg"], ["hum", "DU", "Granskar", "innan något skickas"]] },
        { n: "🧳 Planera tjänsteresa", m: 30, a: 4, f: [["hum", "DU", "Ger ett mål", "”Resa till Göteborg på tisdag”"], ["ai", "AGENT", "Kollar kalendern", "mötet är 10–15"], ["ai", "AGENT", "Söker tåg och hotell", "jämför tider och pris"], ["hum", "DU", "Godkänner kostnaden", "human in the loop"], ["act", "AGENT", "Bokar", "och lägger allt i kalendern"]] },
      ],
      [
        { n: "🔍 Konkurrentanalys", m: 240, a: 20, f: [["hum", "DU", "Ger ett uppdrag", "”Jämför oss med tre konkurrenter”"], ["ai", "AGENT 1 · RESEARCH", "Samlar fakta", "webb, rapporter, prislistor"], ["ai", "AGENT 2 · ANALYS", "Jämför", "styrkor, svagheter, priser"], ["ai", "AGENT 3 · SKRIVARE", "Skriver rapporten", "med diagram"], ["ai", "AGENT 4 · GRANSKARE", "Kollar fakta och källor", "skickar tillbaka om något saknas"], ["hum", "DU", "Läser och beslutar", ""]] },
        { n: "💻 Bygga en ny funktion", m: 480, a: 60, f: [["hum", "DU", "Beskriver funktionen", "”Lägg till export till Excel”"], ["ai", "AGENT 1 · PLANERARE", "Delar upp jobbet", "i små steg"], ["ai", "AGENT 2 · UTVECKLARE", "Skriver koden", ""], ["ai", "AGENT 3 · TESTARE", "Kör tester", "rapporterar fel tillbaka"], ["hum", "DU · UTVECKLARE", "Granskar och godkänner", "innan det går live"]] },
      ],
    ], [
      [
        { n: "✍️ Rewrite an email", m: 15, a: 4, f: [["hum", "YOU", "Paste in the draft", "into ChatGPT, Claude or Copilot"], ["ai", "AI", "Rewrites it", "clearer and friendlier"], ["hum", "YOU", "Read and adjust", "you own the text"], ["act", "YOU", "Copy it back", "and send"]] },
        { n: "📑 Summarise a report", m: 40, a: 8, f: [["hum", "YOU", "Upload the report", "PDF, 30 pages"], ["ai", "AI", "Summarises", "the five key points"], ["hum", "YOU", "Ask follow-up questions", "“What does this mean for us?”"], ["act", "YOU", "Paste it", "into your own document"]] },
      ],
      [
        { n: "📧 Long email thread", m: 10, a: 1, f: [["trig", "IN OUTLOOK", "You open the thread", "23 emails"], ["ai", "COPILOT", "Summarises the thread", "who wants what, what's still open"], ["ai", "COPILOT", "Suggests a reply", "a draft in your tone"], ["hum", "YOU", "Adjust and send", "one click"]] },
        { n: "🎙️ Meeting notes in Teams", m: 25, a: 2, f: [["trig", "IN TEAMS", "The meeting is recorded", "with transcription switched on"], ["ai", "COPILOT", "Notes and to-dos", "straight after the meeting"], ["hum", "YOU", "Check them", "are the decisions right?"], ["act", "YOU", "Share in the chat", "with the participants"]] },
      ],
      [
        { n: "📥 Incoming email", m: 12, a: 2, f: [["trig", "TRIGGER", "New email in the support inbox", "e.g. Outlook"], ["ai", "AI", "Sort and summarise", "Invoice · urgent · customer: Bygg AB"], ["ai", "AI", "Write a draft reply", "based on your FAQ"], ["hum", "HUMAN", "Review and send", "one click"], ["act", "ACTION", "Log the case", "in the CRM system"]] },
        { n: "🎙️ Meeting notes", m: 30, a: 3, f: [["trig", "TRIGGER", "The Teams meeting ends", "recording ready"], ["ai", "AI", "Transcribe", "speech becomes text"], ["ai", "AI", "Summarise", "decisions and to-do items"], ["act", "ACTION", "Create tasks", "in Planner with an owner"], ["act", "ACTION", "Email the participants", "summary + link"]] },
        { n: "🧾 Supplier invoices", m: 8, a: 1, f: [["trig", "TRIGGER", "A PDF invoice arrives", "in the invoice inbox"], ["ai", "AI", "Extract the details", "supplier, amount, due date"], ["act", "ACTION", "Match against the purchase order", "rules in the system"], ["hum", "HUMAN", "Approve exceptions", "only when something doesn't match"], ["act", "ACTION", "Post it", "in the finance system"]] },
        { n: "🎧 Customer service chat", m: 10, a: 1, f: [["trig", "TRIGGER", "A customer asks on the website", "around the clock"], ["ai", "AI · RAG", "Search the help articles", "your own texts"], ["ai", "AI", "Answer with a source", "link to the article"], ["hum", "HUMAN", "Tricky case?", "handed over to a colleague"], ["act", "ACTION", "Save the conversation", "for follow-up"]] },
      ],
      [
        { n: "🤝 Prepare the client meeting", m: 45, a: 5, f: [["hum", "YOU", "Give a goal", "“Prepare tomorrow's meeting with Bygg AB”"], ["ai", "AGENT", "Fetches the history", "CRM: contracts, cases, contacts"], ["ai", "AGENT", "Reads the latest emails", "and earlier meeting notes"], ["ai", "AGENT", "Writes an agenda and questions", "chooses its own order and tools"], ["hum", "YOU", "Review", "before anything is sent"]] },
        { n: "🧳 Plan a business trip", m: 30, a: 4, f: [["hum", "YOU", "Give a goal", "“Trip to Gothenburg on Tuesday”"], ["ai", "AGENT", "Checks the calendar", "the meeting is 10–15"], ["ai", "AGENT", "Searches for trains and hotels", "compares times and prices"], ["hum", "YOU", "Approve the cost", "human in the loop"], ["act", "AGENT", "Books", "and puts everything in the calendar"]] },
      ],
      [
        { n: "🔍 Competitor analysis", m: 240, a: 20, f: [["hum", "YOU", "Give a task", "“Compare us with three competitors”"], ["ai", "AGENT 1 · RESEARCH", "Gathers facts", "web, reports, price lists"], ["ai", "AGENT 2 · ANALYSIS", "Compares", "strengths, weaknesses, prices"], ["ai", "AGENT 3 · WRITER", "Writes the report", "with charts"], ["ai", "AGENT 4 · REVIEWER", "Checks facts and sources", "sends it back if anything is missing"], ["hum", "YOU", "Read and decide", ""]] },
        { n: "💻 Build a new feature", m: 480, a: 60, f: [["hum", "YOU", "Describe the feature", "“Add export to Excel”"], ["ai", "AGENT 1 · PLANNER", "Breaks the job down", "into small steps"], ["ai", "AGENT 2 · DEVELOPER", "Writes the code", ""], ["ai", "AGENT 3 · TESTER", "Runs tests", "reports bugs back"], ["hum", "YOU · DEVELOPER", "Review and approve", "before it goes live"]] },
      ],
    ]);
    const tid = (m) => (m >= 60 ? (m % 60 ? L_(`${Math.floor(m / 60)} tim ${m % 60} min`, `${Math.floor(m / 60)} h ${m % 60} min`) : L_(`${m / 60} tim`, `${m / 60} h`)) : `${m} min`);
    let tok = 0, level = 0;
    const clearFlow = () => { tok++; $("#wf").innerHTML = ""; $("#timeCmp").innerHTML = ""; };
    function renderScen(i) {
      $("#scen").innerHTML = L_(`<span class="dim" style="align-self:center;font-size:.85rem;margin-right:.3rem">Exempel på nivå ${i + 1}:</span>`, `<span class="dim" style="align-self:center;font-size:.85rem;margin-right:.3rem">Examples at level ${i + 1}:</span>`) + LV[i].map((s, k) => `<button data-k="${k}">${s.n}</button>`).join("");
    }
    async function runScen(k) {
      const t = ++tok, S = LV[level][k];
      $$("#scen button").forEach((x) => x.classList.toggle("on", +x.dataset.k === k));
      $("#wf").innerHTML = S.f.map(([c, lab, t2, sm], i) => `${i ? '<span class="arr">→</span>' : ""}<div class="node ${c}"><span class="k">${lab}</span><b>${t2}</b>${sm ? `<small>${sm}</small>` : ""}</div>`).join("");
      const max = Math.max(S.m, S.a);
      $("#timeCmp").innerHTML = `<div class="r"><span>${T_("✋ Utan AI")}</span><span class="t"><i style="background:var(--red)"></i></span><span class="v">${tid(S.m)}</span></div><div class="r"><span>${T_("⚡ Med AI")}</span><span class="t"><i style="background:var(--green)"></i></span><span class="v">${tid(S.a)}</span></div><small class="dim">${T_("Illustrativt exempel per gång. Mät alltid på era egna flöden.")}</small>`;
      for (const n of $$("#wf .node, #wf .arr")) { await pause(280); if (t !== tok) return; n.classList.add("in"); }
      await pause(200); if (t !== tok) return;
      const bars = $$("#timeCmp .t i"); bars[0].style.width = (S.m / max) * 100 + "%"; bars[1].style.width = (S.a / max) * 100 + "%";
    }
    const setLevel = (i, run) => { level = i; pickR(i); renderScen(i); clearFlow(); if (run) runScen(0); };
    $("#ladder").addEventListener("click", (e) => { const r = e.target.closest(".rung"); if (r) setLevel(+r.dataset.i, true); });
    $("#scen").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) runScen(+b.dataset.k); });
    setLevel(0, false);
  })();

  // ============ KAP 15: riskpyramid ============
  (() => {
    const L = L_([
      ["Oacceptabel risk", "--red", "🚫 Förbjudet", "Social poängsättning av medborgare, manipulation som utnyttjar sårbara grupper, och viss ansiktsigenkänning i realtid på allmän plats. Förbjudet sedan februari 2025."],
      ["Hög risk", "--orange", "📋 Strikta krav", "AI i rekrytering, kreditbedömning, utbildning, vård och kritisk infrastruktur. Kräver riskhantering, dokumentation, datakvalitet och mänsklig tillsyn."],
      ["Begränsad risk", "--yellow", "👁️ Krav på öppenhet", "Chatbotar och AI-genererat innehåll. Man ska veta att man pratar med en AI, och deepfakes ska märkas."],
      ["Minimal risk", "--green", "✅ Inga särskilda krav", "Spamfilter, AI i datorspel, rekommendationer. Den allra största delen av all AI som används i dag."],
    ], [
      ["Unacceptable risk", "--red", "🚫 Prohibited", "Social scoring of citizens, manipulation that exploits vulnerable groups, and some real-time facial recognition in public places. Prohibited since February 2025."],
      ["High risk", "--orange", "📋 Strict requirements", "AI in recruitment, credit scoring, education, healthcare and critical infrastructure. Requires risk management, documentation, data quality and human oversight."],
      ["Limited risk", "--yellow", "👁️ Transparency required", "Chatbots and AI-generated content. People must know they are talking to an AI, and deepfakes must be labelled."],
      ["Minimal risk", "--green", "✅ No special requirements", "Spam filters, AI in video games, recommendations. By far the largest share of all AI in use today."],
    ]);
    const el = $("#pyrSvg");
    const top = 10, h = 90, half = (y) => (230 * (y - top)) / 360;
    const lv = L.map(([n, c], i) => {
      const y0 = top + i * h, y1 = y0 + h;
      const g = svg("g", { class: "lvl" }, el);
      const pts = i === 0 ? `240,${y0} ${240 + half(y1)},${y1} ${240 - half(y1)},${y1}` : `${240 - half(y0)},${y0} ${240 + half(y0)},${y0} ${240 + half(y1)},${y1} ${240 - half(y1)},${y1}`;
      svg("polygon", { points: pts, fill: `var(${c})` }, g);
      svg("text", { x: 240, y: y0 + (i === 0 ? 80 : 52), "font-size": i === 0 ? 11 : 15 }, g).textContent = i === 0 ? T_("Förbjudet") : n;
      g.addEventListener("click", () => pick(i));
      return g;
    });
    function pick(i) {
      lv.forEach((g, k) => { g.classList.toggle("on", k === i); g.classList.toggle("off", k !== i); });
      const [n, c, tag, d] = L[i];
      $("#pyrInfo").innerHTML = `<h4 style="color:var(${c})">${tag}</h4><h3>${n}</h3><p style="margin:0">${d}</p><p class="foot" style="margin-bottom:0">${T_("Allmänna AI-modeller (som GPT, Claude och Gemini) har egna krav på dokumentation och öppenhet sedan augusti 2025.")}</p>`;
    }
    pick(1);
  })();

  // ============ KAP 16: energi + miljö ============
  (() => {
    // Energi per aktivitet i Wh. Uppskattningar, se talk track (Bakom kulisserna) för källor.
    const ACT = [
      { k: "chat", n: T_("💬 En chattfråga"), wh: 0.3, src: T_("Google mätte 0,24 Wh för en typisk Gemini-fråga (2025); OpenAI har uppgett ~0,34 Wh för ChatGPT.") },
      { k: "img", n: T_("🖼️ En AI-bild"), wh: 2.9, src: T_("Snitt för bildmodeller i en forskningsstudie (Luccioni m.fl., 2023).") },
      { k: "vid", n: T_("🎬 5 sekunder AI-video"), wh: 944, src: T_("Uppskattning för en öppen videomodell (MIT Technology Review, 2025).") },
      { k: "train", n: T_("🏋️ Träna GPT-4"), wh: 50e9, src: T_("Uppskattning: cirka 50 GWh (MIT Technology Review, 2025).") },
    ];
    const SCALE = 2.5e9;
    // Jämförelser i Wh per enhet
    const CMP = [
      ["💡", T_("LED-lampa (8 W) lyser"), 8, "tim"],
      ["📱", T_("mobilladdning (≈ 15 Wh)"), 15, "laddningar"],
      ["🚗", T_("köra elbil (≈ 0,2 kWh/km)"), 200, "km"],
      ["🏠", T_("el till en svensk lägenhet (≈ 2 000 kWh/år)"), 2e6 / 365, "dagar"],
    ];
    let cur = 0, scaled = false;
    const fmtE = (wh) => wh >= 1e9 ? [wh / 1e9, "GWh"] : wh >= 1e6 ? [wh / 1e6, "MWh"] : wh >= 1e3 ? [wh / 1e3, "kWh"] : [wh, "Wh"];
    const DEC = L_(",", ".");
    const nice = (v) => v >= 1e9 ? (v / 1e9).toFixed(1).replace(".", DEC) + L_(" miljarder", " billion") : v >= 1e6 ? (v / 1e6).toFixed(1).replace(".", DEC) + L_(" miljoner", " million") : v >= 100 ? fmt(v) : v >= 10 ? v.toFixed(0) : v >= 1 ? v.toFixed(1).replace(".", DEC) : v.toFixed(2).replace(".", DEC);
    // Byt till en enhet där talet blir läsbart (inte 0,00 och inte astronomiskt)
    const human = (v, unit) => {
      if (unit === "tim") { if (v < 1 / 60) return [nice(v * 3600), T_("sek")]; if (v < 1) return [nice(v * 60), T_("min")]; if (v > 24 * 365 * 2) return [nice(v / 24 / 365), T_("år")]; if (v > 72) return [nice(v / 24), T_("dygn")]; return [nice(v), T_("tim")]; }
      if (unit === "dagar" && scaled && ACT[cur].k === "chat") return [nice(v), T_("lägenheter")];
      if (unit === "dagar" && v > 365) return [nice(v / 365), T_("lägenheter i ett år")];
      if (unit === "km" && v > 40075) return [nice(v / 40075), T_("varv runt jorden")];
      if (unit === "dagar") { if (v < 1 / 1440) return [nice(v * 86400), T_("sek")]; if (v < 1 / 24) return [nice(v * 1440), T_("min")]; if (v < 1) return [nice(v * 24), T_("tim")]; if (v > 365 * 2) return [nice(v / 365), T_("år")]; return [nice(v), T_("dagar")]; }
      if (unit === "km" && v < 1) return [nice(v * 1000), T_("meter")];
      if (unit === "laddningar" && v < 1) return [nice(v * 100), T_("% av en")];
      return [nice(v), T_(unit)];
    };
    let tok = 0;
    async function render() {
      const a = ACT[cur], wh = a.wh * (scaled && a.k === "chat" ? SCALE : 1);
      $$("#enAct button").forEach((b, i) => b.classList.toggle("on", i === cur));
      $("#enScale").closest("label").style.visibility = a.k === "chat" ? "visible" : "hidden";
      const [v, u] = fmtE(wh), t = ++tok;
      $("#enUnit").textContent = " " + u + (scaled && a.k === "chat" ? L_(" per dag", " per day") : "");
      // räkna upp siffran
      const steps = calm() ? 1 : 24;
      for (let i = 1; i <= steps && t === tok; i++) { $("#enVal").textContent = nice((v * i) / steps); if (i < steps) await sleep(18); }
      $("#enCmp").innerHTML = CMP.map(([e, txt, per, unit]) => { const [n, uu] = human(wh / per, unit); return `<div><span>${e}</span><b>${n} ${uu}</b><small>${txt}</small></div>`; }).join("");
      $("#enSrc").textContent = a.src + (scaled && a.k === "chat" ? L_(" Antal frågor: OpenAI, juli 2025.", " Number of questions: OpenAI, July 2025.") : "");
    }
    $("#enAct").innerHTML = ACT.map((a, i) => `<button data-i="${i}">${a.n}</button>`).join("");
    $("#enAct").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { cur = +b.dataset.i; render(); } });
    $("#enScale").addEventListener("change", (e) => { scaled = e.target.checked; render(); });
    render();

    // Rack: vanligt rack (~8 kW) jämfört med AI-rack (NVIDIA GB200 NVL72, ~120–130 kW)
    const rk = $("#rackSvg");
    const RACKS = [[T_("Vanligt serverrack"), 8, "--blue", T_("luftkylt")], [T_("AI-rack (NVIDIA GB200 NVL72)"), 125, "--orange", T_("vätskekylt")]];
    const bars = RACKS.map(([n, kw, col, cool], i) => {
      const y = 18 + i * 52;
      svg("text", { class: "rk-l", x: 0, y: y - 6 }, rk).textContent = n;
      svg("rect", { class: "rk-bg", x: 0, y, width: 420, height: 24, rx: 7 }, rk);
      const r = svg("rect", { class: "rk-bar", x: 0, y, width: 0, height: 24, rx: 7, style: `fill:var(${col})` }, rk);
      const t = svg("text", { class: "rk-v", x: 66, y: y + 16.5 }, rk);
      t.textContent = `≈ ${kw} kW · ${cool}`;
      return { r, w: Math.max(56, (kw / 130) * 420), t, kw };
    });
    const grow = () => bars.forEach((b, i) => setTimeout(() => { b.r.setAttribute("width", b.w); if (b.w > 200) { b.t.setAttribute("x", 12); b.t.classList.add("in"); } }, calm() ? 0 : 300 + i * 500));
    const shrink = () => bars.forEach((b) => b.r.setAttribute("width", 0));

    // Världen: datacenter 2024 och 2030 (IEA) jämfört med Sveriges hela elanvändning
    const wd = $("#worldSvg");
    const W = [[T_("Sveriges hela elanvändning"), 135, "--blue", T_("≈ 135 TWh/år")], [T_("Datacenter i världen 2024"), 415, "--accent", T_("≈ 415 TWh (1,5 % av världens el)")], [T_("Datacenter 2030 (prognos)"), 945, "--pink", T_("≈ 945 TWh, som Japans elanvändning")]];
    const wbars = W.map(([n, twh, col, lab], i) => {
      const y = 8 + i * 48;
      svg("text", { class: "rk-l", x: 0, y: y + 10 }, wd).textContent = n;
      const r = svg("rect", { class: "rk-bar", x: 0, y: y + 16, width: 0, height: 20, rx: 6, style: `fill:var(${col})` }, wd);
      const t = svg("text", { class: "w-v", x: 0, y: y + 31 }, wd); t.textContent = lab;
      return { r, w: (twh / 945) * 420, t };
    });
    const growW = () => wbars.forEach((b, i) => setTimeout(() => { b.r.setAttribute("width", b.w); b.t.setAttribute("x", b.w > 260 ? 8 : b.w + 8); b.t.classList.toggle("in", b.w > 260); }, calm() ? 0 : 900 + i * 450));
    window.Deck.onEnter("energi", () => { grow(); growW(); });
    window.Deck.onLeave("energi", () => { shrink(); wbars.forEach((b) => b.r.setAttribute("width", 0)); });
  })();

  // ============ KAP 17: kapplöpningen + Sverige ============
  (() => {
    const CH = [
      ["🔬", "ASML", T_("Nederländerna"), T_("Enda tillverkaren i världen av de EUV-maskiner som behövs för att tillverka de mest avancerade chippen. En maskin kostar miljarder kronor.")],
      ["🏭", "TSMC", "Taiwan", T_("Tillverkar nästan alla avancerade AI-chip, åt NVIDIA, Google, Apple och andra. <b>Flaskhals:</b> fabrikerna och den avancerade kapslingen av chippen räcker inte till.")],
      ["🧠", T_("NVIDIA m.fl."), T_("USA"), T_("NVIDIA designar GPU:erna och har runt 80 % av marknaden för AI-chip. Bolaget har blivit ett av världens mest värdefulla. Google har egna chip (TPU), och AMD och andra försöker komma ikapp.")],
      ["☁️", T_("Molnjättarna"), T_("USA"), T_("Microsoft, Google, Amazon och Meta köper chippen och bygger datacenter. Tillsammans investerar de över 700 miljarder dollar under 2026, nästan dubbelt så mycket som året innan.")],
      ["🏢", T_("Datacentret"), T_("överallt"), T_("Tusentals AI-rack, vätskekylning och reservkraft. <b>Flaskhals:</b> minneschip (HBM) och byggtid.")],
      ["⚡", T_("Elnätet"), T_("lokalt"), T_("Ett AI-datacenter kan behöva hundratals megawatt. <b>Den största flaskhalsen just nu:</b> elnät och kraftverk tar många år att bygga.")],
    ];
    const BOTTLE = [1, 4, 5];
    $("#chain").innerHTML = CH.map(([e, n, w], i) => `<button class="ch-node${BOTTLE.includes(i) ? " bottle" : ""}" data-i="${i}"><span class="e">${e}</span><b>${n}</b><small>${w}</small></button>`).join('<span class="ch-arrow"><i></i></span>');
    const pickC = (i) => {
      $$("#chain .ch-node").forEach((b, k) => b.classList.toggle("on", k === i));
      const [e, n, w, t] = CH[i];
      $("#chainInfo").innerHTML = `<b>${e} ${n}</b> <span class="dim">· ${w}</span><p>${t}</p>`;
    };
    $("#chain").addEventListener("click", (e) => { const b = e.target.closest(".ch-node"); if (b) pickC(+b.dataset.i); });
    pickC(2);

    // Capex 2025 och 2026 (guidning efter Q3 2026; Microsoft exkl. vissa leasingavtal)
    const cx = $("#capexSvg");
    const CAP = [["Amazon", 131, 220], ["Alphabet", 91, 200], ["Microsoft", 115, 170], ["Meta", 72, 140]];   // ungefärliga, se talk track
    const MAX = 230, X0 = 90, WW = 480;
    svg("text", { class: "cx-leg", x: X0, y: 10 }, cx).textContent = "▬ 2025";
    svg("text", { class: "cx-leg b", x: X0 + 70, y: 10 }, cx).textContent = T_("▬ 2026 (prognos)");
    const cbars = CAP.map(([n, a, b], i) => {
      const y = 24 + i * 36;
      svg("text", { class: "rk-l", x: 0, y: y + 17 }, cx).textContent = n;
      const r1 = svg("rect", { class: "cx-a", x: X0, y, width: 0, height: 12, rx: 3 }, cx);
      const r2 = svg("rect", { class: "cx-b", x: X0, y: y + 14, width: 0, height: 12, rx: 3 }, cx);
      const t = svg("text", { class: "cx-v", x: X0 + 4, y: y + 24 }, cx); t.textContent = `≈ ${b}`;
      return { r1, r2, t, wa: (a / MAX) * WW, wb: (b / MAX) * WW };
    });
    const growC = () => cbars.forEach((c, i) => setTimeout(() => { c.r1.setAttribute("width", c.wa); c.r2.setAttribute("width", c.wb); c.t.setAttribute("x", X0 + c.wb + 6); }, calm() ? 0 : 200 + i * 220));

    // Schematisk Sverigekarta (lon, lat) → x, y
    const px = (lon, lat) => [((lon - 10.6) * 0.4617 * 28.5 + 6).toFixed(1), ((69.3 - lat) * 28.5 + 6).toFixed(1)];
    const path = (pts) => "M" + pts.map(([a, b]) => px(a, b).join(" ")).join("L") + "Z";
    const SE = [[20.55,69.06],[21.6,68.75],[22.48,68.44],[23.15,68.1],[23.65,67.6],[23.5,67.2],[23.6,66.8],[23.9,66.3],[24.15,65.83],[23.2,65.75],[22.15,65.58],[21.5,65.32],[21.4,64.9],[21.0,64.7],[20.9,64.2],[20.3,63.82],[19.6,63.55],[18.8,63.3],[18.4,62.95],[17.9,62.63],[17.35,62.4],[17.4,61.9],[17.15,61.7],[17.1,61.3],[17.2,60.75],[17.6,60.55],[18.45,60.34],[18.8,60.05],[19.0,59.8],[18.6,59.45],[18.35,59.25],[18.0,58.95],[17.3,58.75],[16.8,58.6],[16.65,58.2],[16.6,57.75],[16.5,57.25],[16.35,56.65],[16.0,56.25],[15.6,56.15],[14.9,56.15],[14.6,56.05],[14.3,55.95],[14.35,55.55],[13.8,55.42],[13.35,55.34],[12.85,55.38],[13.0,55.6],[12.85,55.87],[12.68,56.05],[12.45,56.3],[12.75,56.45],[12.85,56.67],[12.25,57.1],[11.95,57.5],[11.85,57.7],[11.65,58.0],[11.4,58.3],[11.2,58.7],[11.15,59.0],[11.4,59.05],[11.7,59.5],[11.85,59.85],[12.3,60.15],[12.55,60.55],[12.3,61.0],[12.15,61.7],[12.3,62.25],[12.05,62.6],[12.15,63.0],[12.0,63.4],[12.9,64.1],[13.6,64.5],[14.15,64.6],[14.0,65.1],[14.5,65.6],[15.4,66.1],[15.6,66.6],[16.4,67.5],[17.3,68.0],[18.1,68.5],[19.0,68.4],[20.0,68.85]];
    const GOT = [[18.1,57.25],[18.3,57.0],[18.7,57.15],[18.95,57.5],[19.05,57.85],[18.75,57.95],[18.45,57.65],[18.15,57.45]];
    const OLA = [[16.4,56.2],[16.6,56.3],[17.05,57.35],[16.9,57.35],[16.45,56.65]];
    const map = $("#seMap");
    [SE, GOT, OLA].forEach((p) => svg("path", { class: "se-land", d: path(p) }, map));
    const SITES = [
      ["Luleå", 22.15, 65.58, "--blue", "Meta", T_("Metas första datacenter utanför USA, sedan 2013. Drivs med vattenkraft och kyls av den kalla luften."), T_("I drift")],
      ["Horndal (Avesta)", 16.42, 60.3, "--green", "Google", T_("Googles första egna datacenter i Sverige. Byggstart juni 2026, planerat klart 2028. Byggt för att kunna leverera spillvärme."), T_("Byggs")],
      ["Borlänge", 15.43, 60.48, "--accent", "EcoDataCenter + Mistral AI", T_("Franska Mistral AI investerar 1,2 miljarder euro i AI-kapacitet på en gammal pappersbruksplats. 250 MW i första steget, öppnar 2027."), T_("Byggs")],
      ["Gävle · Sandviken", 16.95, 60.65, "--cyan", "Microsoft", T_("Microsoft bygger ut sina datacenter i Gävle, Sandviken och Staffanstorp för 33,7 miljarder kronor."), T_("Byggs ut")],
      ["Staffanstorp", 13.2, 55.64, "--cyan", "Microsoft", T_("Del av Microsofts utbyggnad för 33,7 miljarder kronor (tillsammans med Gävle och Sandviken)."), T_("Byggs ut")],
      ["Strängnäs", 17.03, 59.38, "--orange", "Brookfield", T_("Planerat AI-datacenter för upp till 95 miljarder kronor och över 1 000 jobb. Elförsörjningen var ännu inte löst i mars 2026."), T_("Planeras")],
      ["Linköping", 15.62, 58.41, "--pink", "Sferical AI", T_("Sferical One: svensk AI-superdator med 1 152 NVIDIA-GPU:er, ägd av AstraZeneca, Ericsson, Saab, SEB och Wallenberg Investments. I drift sedan 2026."), T_("I drift")],
    ];
    const LAB = { "Luleå": [true, 0], "Borlänge": [true, 0], "Horndal (Avesta)": [false, 8], "Gävle · Sandviken": [false, -5], "Strängnäs": [false, 2], "Linköping": [false, 0], "Staffanstorp": [false, 0] };
    const pins = SITES.map((s, i) => {
      const [x, y] = px(s[1], s[2]);
      const g = svg("g", { class: "se-pin", style: `color:var(${s[3]})`, tabindex: 0 }, map);
      svg("circle", { class: "halo", cx: x, cy: y, r: 9 }, g);
      svg("circle", { class: "dot", cx: x, cy: y, r: 4.5 }, g);
      // etikettens placering: [vänster?, förskjutning i höjdled] så att närliggande orter inte krockar
      const [left, dy] = LAB[s[0]] || [false, 0];
      svg("text", { class: "se-l", x: left ? +x - 7 : +x + 7, y: +y + 3.5 + dy, "text-anchor": left ? "end" : "start" }, g).textContent = s[0].split(" ")[0];
      g.addEventListener("click", () => pickS(i));
      g.addEventListener("keydown", (e) => { if (e.key === "Enter") pickS(i); });
      return g;
    });
    function pickS(i) {
      pins.forEach((g, k) => g.classList.toggle("on", k === i));
      const s = SITES[i];
      $("#seInfo").innerHTML = `<div class="tag" style="color:var(${s[3]})">${s[6]}</div><b>${s[0]}</b><div class="who">${s[4]}</div><p>${s[5]}</p>`;
    }
    $("#seInfo").innerHTML = L_(`<b>Varför Sverige?</b><p>Fossilfri el, kallt klimat som ger gratis kylning och fjärrvärmenät som kan ta hand om spillvärmen. Men elnätet i södra Sverige är redan ansträngt.</p><p class="dim">Datacenter använder i dag ≈ 4 TWh, ungefär 3 % av Sveriges el. Om alla planer blir av kan det bli 3–4 gånger mer till 2030.</p>`,
      `<b>Why Sweden?</b><p>Fossil-free electricity, a cold climate that gives free cooling, and district heating networks that can make use of the waste heat. But the power grid in southern Sweden is already under strain.</p><p class="dim">Data centres use ≈ 4 TWh today, roughly 3% of Sweden's electricity. If all the plans go ahead, that could be 3–4 times more by 2030.</p>`);
    window.Deck.onEnter("kapplopning", growC);
  })();

  // ============ KAP 18: ordlista + bingo ============
  (() => {
    const G = [
      ["🤖", "AI", "Artificiell intelligens", "Datorer som gör saker vi trodde krävde mänsklig intelligens."],
      ["📊", "Machine Learning", "Maskininlärning", "Datorn lär sig mönster från exempel i stället för att följa handskrivna regler."],
      ["🧠", "Deep Learning", "Djupinlärning", "Maskininlärning med neurala nätverk i många lager."],
      ["🕸️", "Neural network", "Neuralt nätverk", "Lager av enkla, sammankopplade ”neuroner” med justerbara vikter."],
      ["💬", "LLM", "Stor språkmodell", "Large Language Model. Tränad på enorma mängder text för att gissa nästa token. T.ex. GPT, Claude, Gemini."],
      ["✨", "Generative AI", "Generativ AI", "AI som skapar nytt innehåll: text, bild, ljud, video, kod."],
      ["🧩", "Token", "Ordbit", "Den minsta biten text en modell läser och skriver. Ungefär ¾ ord på engelska, ofta mindre på svenska."],
      ["✍️", "Prompt", "Instruktion", "Det du skriver till AI:n: fråga, instruktion och sammanhang."],
      ["🛠️", "Prompt engineering", "Promptteknik", "Konsten att formulera prompts så att svaren blir bra: roll, kontext, format, exempel."],
      ["🪟", "Context window", "Arbetsminne", "Hur många tokens modellen kan hålla i huvudet samtidigt: din fråga, dokument och svaret."],
      ["🌡️", "Temperature", "Slumpgrad", "Styr hur förutsägbar eller kreativ modellen är när den väljer nästa token."],
      ["🎛️", "Parameters", "Parametrar / vikter", "Modellens ”rattar”. De största modellerna har hundratals miljarder."],
      ["🏋️", "Training", "Träning", "Processen där modellen justerar sina vikter för att göra färre fel."],
      ["🎓", "Fine-tuning", "Finjustering", "Extra träning på en mindre, specifik datamängd för att anpassa modellen."],
      ["👍", "RLHF", "Mänsklig feedback", "Reinforcement Learning from Human Feedback: människor betygsätter svar så att modellen blir mer hjälpsam och säker."],
      ["⚡", "Inference", "Körning", "När en färdigtränad modell används för att svara. Den lär sig inget nytt då."],
      ["🦜", "Hallucination", "Påhitt", "När AI:n självsäkert hittar på fakta, källor eller siffror."],
      ["📅", "Knowledge cutoff", "Kunskapsgräns", "Datumet då träningsdatan tar slut. Modellen vet inget om det som hänt efter."],
      ["🔢", "Embedding", "Betydelsevektor", "En text omgjord till en lista med siffror, så att liknande betydelser hamnar nära varandra."],
      ["🗄️", "Vector database", "Vektordatabas", "En databas som snabbt hittar de texter vars embeddings liknar din fråga."],
      ["📚", "RAG", "Sök först, svara sen", "Retrieval-Augmented Generation: hämta relevanta stycken ur dina dokument och ge dem till modellen innan den svarar."],
      ["🦾", "Agent", "AI-agent", "AI som får ett mål, planerar, använder verktyg och arbetar tills uppgiften är klar."],
      ["🔧", "Tool use", "Verktygsanrop", "När modellen anropar ett verktyg: söker, räknar, bokar, läser filer. Kallas också function calling."],
      ["🔌", "MCP", "Model Context Protocol", "Öppen standard för att koppla AI till verktyg och data. ”USB-C för AI.”"],
      ["👁️", "Multimodal", "Flera sinnen", "Modeller som förstår och skapar text, bild, ljud och video."],
      ["🤔", "Reasoning model", "Tänkande modell", "Modell som resonerar i flera steg innan den svarar. Långsammare, men bättre på svåra uppgifter."],
      ["🔓", "Open weights", "Öppna vikter", "Modellens vikter går att ladda ner och köra själv, t.ex. Llama, Mistral, DeepSeek."],
      ["🎮", "GPU", "Grafikprocessor", "Chippet som gör tusentals beräkningar parallellt. Motorn i all modern AI."],
      ["⚙️", "Transformer", "Transformer", "Arkitekturen från 2017 bakom alla moderna språkmodeller. Bygger på ”attention”."],
      ["🛡️", "Guardrails", "Skyddsräcken", "Regler och filter som hindrar AI:n från att göra eller säga olämpliga saker."],
      ["💉", "Prompt injection", "Promptinjektion", "Ett angrepp där dold text lurar AI:n att strunta i sina instruktioner."],
      ["🙋", "Human in the loop", "Människan i loopen", "En människa granskar eller godkänner innan AI:n utför viktiga steg."],
      ["👩‍✈️", "Copilot", "Andrepilot", "AI-assistent inbyggd i ett verktyg som hjälper dig medan du arbetar. Även Microsofts produktnamn."],
      ["🌌", "AGI", "Generell AI", "Artificial General Intelligence: hypotetisk AI som klarar alla intellektuella uppgifter en människa klarar. Finns inte ännu, och definitionen är omdebatterad."],
    ];
    // Svensk benämning och förklaring översätts via T_ (site/en/ordlista.js), så att sökningen fungerar på valt språk.
    $("#gloss").innerHTML = G.map(([e, en, sv0, d0]) => [e, en, T_(sv0), T_(d0)]).map(([e, en, sv, d]) => `<div class="gcard" data-k="${(en + " " + sv + " " + d).toLowerCase()}"><div class="in"><div class="f"><span class="e">${e}</span><b>${en}</b><small>${sv}</small></div><div class="b"><b>${en}</b>${d}</div></div></div>`).join("");
    let bingo = false;
    $("#gloss").addEventListener("click", (e) => {
      const c = e.target.closest(".gcard"); if (!c) return;
      if (!bingo) return c.classList.toggle("flip");
      c.classList.toggle("marked");
      $("#bingoBanner").classList.toggle("show", $$("#gloss .gcard.marked").length >= 5);
    });
    $("#glSearch").addEventListener("input", (e) => { const q = e.target.value.trim().toLowerCase(); $$("#gloss .gcard").forEach((c) => c.classList.toggle("hide", !!q && !c.dataset.k.includes(q))); });
    $("#bingoBtn").onclick = () => {
      bingo = !bingo; $("#bingoBtn").classList.toggle("on", bingo);
      $("#bingoBtn").textContent = bingo ? T_("🎲 Bingoläge: kryssa 5 ord") : T_("🎲 Bingoläge");
      $$("#gloss .gcard").forEach((c) => { c.classList.remove("flip"); if (!bingo) c.classList.remove("marked"); });
      $("#bingoBanner").classList.remove("show");
    };
  })();

  window.Deck.ready();
})();
