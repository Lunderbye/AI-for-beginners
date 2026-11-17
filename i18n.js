// Språk: svenska (originalet) eller engelska. Laddas först i <head> på båda sidorna.
//
// Den svenska texten i index.html, widgets.js och talk.js är originalet och ändras aldrig.
// Engelskan ligger i site/en/<kapitel-id>.js (en fil per kapitel + ui.js för menyer och knappar):
//   units   – statisk HTML: svensk innerHTML (normaliserad) → engelsk innerHTML, samt attributvärden
//             (title, placeholder, aria-label, alt, data-title)
//   strings – texter som widgets.js/deck.js/talk.html skriver ut via T_("svensk text")
//   talk    – hela talk track-avsnittet på engelska (samma fält som i talk.js)
// Kod som behöver olika innehåll per språk (t.ex. tokenizerns exempel) använder L_(svenska, engelska).
//
// Valet sparas i localStorage ("ai.lang"), kan sättas med ?lang=en|sv och delas mellan decket och
// talk track (storage-händelse + kanalen "ai-lang").
// Byte = sidan laddas om på samma kapitel. ?i18ncheck visar engelska texter som saknas.
(() => {
  const KEY = "ai.lang", LANGS = ["sv", "en"];
  const qs = new URLSearchParams(location.search);
  const stored = () => { try { return localStorage.getItem(KEY); } catch (e) { return null; } };
  let lang = qs.get("lang");
  if (LANGS.includes(lang)) { try { localStorage.setItem(KEY, lang); } catch (e) { /* ingen lagring */ } }
  else lang = LANGS.includes(stored()) ? stored() : "sv";
  const en = lang === "en";
  document.documentElement.lang = lang;

  const units = Object.create(null), strings = Object.create(null), talk = Object.create(null);
  const missing = new Set();
  const miss = (s) => { if (en && !missing.has(s)) { missing.add(s); if (qs.has("i18ncheck")) console.warn("[i18n] saknar engelska:", s); } };
  const norm = (s) => s.replace(/\s+/g, " ").trim();
  const LETTER = /\p{L}/u;
  const ATTRS = ["title", "placeholder", "aria-label", "alt", "data-title"];
  const SKIP = "script, style, canvas, [data-theme-btn], [data-lang-btn], [data-i18n-skip]";

  // Element som har egen text (en textnod med bokstäver) är en "unit"; deras barn översätts som en del av den.
  const collect = (root) => {
    const out = [];
    const walk = (el) => {
      if (el.matches && el.matches(SKIP)) return;
      if ([...el.childNodes].some((n) => n.nodeType === 3 && LETTER.test(n.data))) { out.push(el); return; }
      for (const c of el.children) walk(c);
    };
    walk(root);
    return out;
  };
  const attrEls = (root) => [...root.querySelectorAll(ATTRS.map((a) => `[${a}]`).join(","))].filter((el) => !el.closest(SKIP));
  const chapterOf = (el) => { const c = el.closest && el.closest("section.chapter"); return c ? c.id : "ui"; };

  const I18N = {
    lang, en, locale: en ? "en-GB" : "sv-SE",
    // Kapitelfilerna i site/en/ registrerar sin engelska här.
    add(id, d = {}) {
      Object.assign(units, d.units || {});
      Object.assign(strings, d.strings || {});
      if (d.talk) talk[id] = d.talk;
    },
    // Svensk text → engelsk (om engelska är valt och finns), annars den svenska.
    t(sv) {
      if (!en || sv == null) return sv;
      const k = norm(String(sv));
      if (k in strings) return strings[k];
      if (k in units) return units[k];
      miss(k); return sv;
    },
    // Olika innehåll per språk direkt i koden.
    pick(sv, enVal) { if (!en) return sv; if (enVal === undefined) { miss(String(sv).slice(0, 80)); return sv; } return enVal; },
    // Översätt den statiska HTML:en (körs en gång innan deck.js och widgets.js).
    applyStatic(root = document.body) {
      if (qs.has("i18ndump")) return I18N.dump(root);
      if (!en) return;
      for (const el of collect(root)) {
        const k = norm(el.innerHTML);
        if (k in units) el.innerHTML = units[k]; else miss(k);
      }
      for (const el of attrEls(root)) for (const a of ATTRS) {
        const v = el.getAttribute(a);
        if (v == null || !LETTER.test(v)) continue;
        const k = norm(v);
        if (k in units) el.setAttribute(a, units[k]); else miss(k);
      }
      document.title = I18N.t(document.title);
      const md = document.querySelector('meta[name="description"]');
      if (md) md.content = I18N.t(md.content);
    },
    // Talk track på valt språk (avsnitt utan engelska behåller svenskan).
    talk(list) { return !en ? list : (list || []).map((s) => talk[s.id] ? { ...s, ...talk[s.id], id: s.id, num: s.num } : (miss("talk:" + s.id), s)); },
    // Utvecklarhjälp: alla svenska units per kapitel som JSON (?i18ndump), läses av tools/i18n-check.mjs.
    dump(root) {
      const out = {};
      const put = (ch, k) => { (out[ch] = out[ch] || []).includes(k) || out[ch].push(k); };
      for (const el of collect(root)) put(chapterOf(el), norm(el.innerHTML));
      for (const el of attrEls(root)) for (const a of ATTRS) { const v = el.getAttribute(a); if (v != null && LETTER.test(v)) put(chapterOf(el), norm(v)); }
      put("ui", norm(document.title));
      const md = document.querySelector('meta[name="description"]'); if (md) put("ui", norm(md.content));
      const pre = document.createElement("script"); pre.type = "application/json"; pre.id = "i18n-dump";
      pre.textContent = JSON.stringify(out).replace(/</g, "\\u003c");
      document.body.appendChild(pre);
    },
    // Text på sidan som ser svensk ut fast engelska är valt (för felsökning: I18N.scan() i konsolen).
    scan(root = document.body) {
      const hits = [], tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      for (let n; (n = tw.nextNode());) {
        if (n.parentElement.closest("script, style, [data-lang-btn], .notes:not(.show)")) continue;
        if (/[åäöÅÄÖ]|\b(och|att|det|som|för|inte|med|är)\b/.test(n.data)) hits.push(norm(n.data));
      }
      return [...new Set(hits)];
    },
    missing: () => [...missing],
    set(next) {
      if (!LANGS.includes(next) || next === lang) return;
      try { localStorage.setItem(KEY, next); } catch (e) { /* ingen lagring */ }
      try { chan && chan.postMessage({ type: "lang", lang: next }); } catch (e) { /* ingen synk */ }
      reload(next);
    },
    toggle() { I18N.set(en ? "sv" : "en"); },
  };

  // Ladda om på samma ställe (hash) och med rätt ?lang om parametern används i adressen.
  let reloading = false;
  const reload = (next) => {
    if (reloading) return; reloading = true;
    const u = new URL(location.href);
    if (u.searchParams.has("lang")) { u.searchParams.set("lang", next); location.replace(u.href); }
    else setTimeout(() => location.reload(), 60);   // låt kanalmeddelandet hinna iväg
  };
  let chan = null;
  try { chan = new BroadcastChannel("ai-lang"); chan.onmessage = (e) => { const m = e.data || {}; if (m.type === "lang" && LANGS.includes(m.lang) && m.lang !== lang) { try { localStorage.setItem(KEY, m.lang); } catch (x) { /* */ } reload(m.lang); } }; } catch (e) { /* ingen synk */ }
  addEventListener("storage", (e) => { if (e.key === KEY && LANGS.includes(e.newValue) && e.newValue !== lang && !qs.has("lang")) reload(e.newValue); });

  // Språkknappen: [data-lang-btn] i menyn på båda sidorna. Tangent L.
  const paintBtn = () => document.querySelectorAll("[data-lang-btn]").forEach((b) => {
    b.innerHTML = `<span class="lang-opt${en ? "" : " on"}" lang="sv"><span aria-hidden="true">🇸🇪</span> SV</span><span class="lang-opt${en ? " on" : ""}" lang="en"><span aria-hidden="true">🇬🇧</span> EN</span>`;
    b.title = en ? "Language: English. Click for Swedish (L)." : "Språk: svenska. Klicka för engelska (L).";
    b.setAttribute("aria-label", en ? "Switch language to Swedish" : "Byt språk till engelska");
  });
  document.addEventListener("click", (e) => { if (e.target.closest("[data-lang-btn]")) I18N.toggle(); });
  addEventListener("keydown", (e) => {
    if ((e.key === "l" || e.key === "L") && !e.metaKey && !e.ctrlKey && !e.altKey && !(e.target.closest && e.target.closest("input, textarea, select, [contenteditable]"))) I18N.toggle();
  });
  document.addEventListener("DOMContentLoaded", () => {
    paintBtn();
    if (qs.has("i18ncheck") && en) setTimeout(() => console.info("[i18n] saknas:", I18N.missing().length, I18N.missing(), "\nSvensk text på sidan:", I18N.scan()), 1500);
  });

  window.I18N = I18N;
  window.T_ = I18N.t;
  window.L_ = I18N.pick;
})();
