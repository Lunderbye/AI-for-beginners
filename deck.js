// Deck-motor: kapitelmeny (döljs automatiskt, H fäster), ←/→, presentatörsanteckningar (N), lugnt läge (M), reveal-on-scroll
// och synk med talk track (talk.html) över en BroadcastChannel.
// Meddelanden: {type:"at", id} från decket, {type:"goto", id} och {type:"where"} från talk track.
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const TALK = window.I18N ? I18N.talk(window.TALK || []) : (window.TALK || []);

  // ---------- lugnt läge: ?calm i URL:en, eller tryck M ----------
  const qs = new URLSearchParams(location.search);
  const toast = (text) => {
    let t = document.getElementById("motionToast");
    if (!t) { t = document.createElement("div"); t.id = "motionToast"; document.body.appendChild(t); }
    t.textContent = text;
    t.classList.add("show"); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 2600);
  };
  const setCalm = (on, announce) => {
    document.documentElement.classList.toggle("calm", on);
    document.dispatchEvent(new CustomEvent("calmchange"));
    if (announce) toast(T_(on ? "Animationer av · tryck M för att slå på" : "Animationer på · tryck M för att stänga av"));
  };
  setCalm(qs.has("calm"), false);

  // ---------- meny + progress ----------
  const chapters = $$("section.chapter");
  const nav = $("#chapterNav");
  chapters.forEach((ch) => {
    const a = document.createElement("a");
    a.href = "#" + ch.id;
    a.textContent = ch.dataset.title;
    nav.appendChild(a);
  });
  // Startkapitel: det i adressens #hash (så att decket svarar rätt på "where" direkt efter en omladdning)
  const fromHash = location.hash && document.getElementById(location.hash.slice(1));
  let current = (fromHash && fromHash.closest && fromHash.closest("section.chapter")) || chapters[0];
  const navFades = () => {
    nav.classList.toggle("more-left", nav.scrollLeft > 2);
    nav.classList.toggle("more-right", nav.scrollLeft + nav.clientWidth < nav.scrollWidth - 2);
  };
  const centreNav = () => {
    const a = $("a.active", nav);
    if (!a) return navFades();
    const left = a.offsetLeft - nav.offsetLeft - (nav.clientWidth - a.offsetWidth) / 2;
    nav.scrollTo({ left: Math.max(0, left), behavior: document.documentElement.classList.contains("calm") ? "auto" : "smooth" });
  };
  nav.addEventListener("scroll", navFades, { passive: true });
  addEventListener("resize", centreNav);
  requestAnimationFrame(navFades);
  nav.addEventListener("wheel", (e) => { if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) { nav.scrollLeft += e.deltaY; e.preventDefault(); } }, { passive: false });

  const onEnter = new Map();   // id -> [fn] som körs varje gång kapitlet blir aktuellt
  const onLeave = new Map();   // id -> [fn] som körs när man lämnar kapitlet
  const add = (m, id, fn) => m.set(id, [...(m.get(id) || []), fn]);
  const run = (m, id) => (m.get(id) || []).forEach((fn) => fn());
  const io = new IntersectionObserver((entries) => { for (const e of entries) if (e.isIntersecting) e.target.classList.add("in"); }, { threshold: 0.12 });
  const observeReveal = () => $$(".reveal").forEach((el) => io.observe(el));

  // ---------- menyn döljs automatiskt och glider ner när muspekaren närmar sig överkanten ----------
  // Bara på enheter med mus (på touch syns menyn alltid). H fäster menyn så att den alltid syns.
  const root = document.documentElement;
  const canHover = matchMedia("(hover: hover) and (pointer: fine)").matches;
  let pinned = false;
  try { pinned = localStorage.getItem("ai.navpin") === "1"; } catch (e) { /* ingen lagring */ }
  let hideT = 0, nearTop = false;
  // nav-auto: menyn döljs automatiskt, så kapitlen kan använda ytan ända upp till kanten
  const setAuto = () => root.classList.toggle("nav-auto", canHover && !pinned);
  setAuto();
  const showNav = () => { clearTimeout(hideT); root.classList.remove("nav-hidden"); };
  const hideSoon = (ms = 900) => {
    clearTimeout(hideT);
    if (!canHover || pinned) return;
    hideT = setTimeout(() => { if (!nearTop && !$(".nav").matches(":hover, :focus-within")) root.classList.add("nav-hidden"); }, ms);
  };
  if (canHover) {
    addEventListener("mousemove", (e) => {
      const near = e.clientY < (root.classList.contains("nav-hidden") ? 48 : 84);
      if (near === nearTop) return;
      nearTop = near;
      near ? showNav() : hideSoon();
    }, { passive: true });
    document.addEventListener("mouseleave", () => { nearTop = false; hideSoon(400); });
    $(".nav").addEventListener("focusin", showNav);
    $(".nav").addEventListener("focusout", () => hideSoon());
    hideSoon(2500);   // visa menyn en stund när sidan laddas, sedan glider den upp
  }
  const setPinned = (on) => {
    pinned = on;
    setAuto();
    try { localStorage.setItem("ai.navpin", on ? "1" : "0"); } catch (e) { /* ingen lagring */ }
    on ? showNav() : hideSoon(1200);
    toast(T_(on ? "Menyn är fäst · tryck H för att dölja den automatiskt" : "Menyn döljs automatiskt · för musen till överkanten, eller tryck H"));
  };

  // ---------- synk med talk track ----------
  let chan = null, jumpTo = null, jumpUntil = 0;
  try { chan = new BroadcastChannel("ai-deck"); } catch (e) { /* ingen synk i gamla webbläsare */ }
  const announce = () => chan && chan.postMessage({ type: "at", id: current.id });

  const chIo = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting || e.target === current) continue;
      const prev = current;
      current = e.target;
      $$("a", nav).forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + current.id));
      centreNav();
      run(onLeave, prev.id);
      run(onEnter, current.id);
      renderNotes();
      if (history.replaceState) history.replaceState(null, "", "#" + current.id);
      if (jumpTo) { if (current.id === jumpTo || Date.now() > jumpUntil) jumpTo = null; }
      else announce();
    }
  }, { rootMargin: "-45% 0px -54% 0px", threshold: 0 });
  chapters.forEach((c) => chIo.observe(c));

  if (chan) chan.onmessage = (e) => {
    const m = e.data || {};
    if (m.type === "where") return announce();
    if (m.type !== "goto") return;
    const ch = document.getElementById(m.id);
    if (!ch || !ch.matches("section.chapter") || ch === current) return;
    jumpTo = ch.id; jumpUntil = Date.now() + 4000;
    ch.scrollIntoView({ behavior: document.hidden ? "instant" : "smooth" });
  };

  addEventListener("scroll", () => {
    const h = document.documentElement;
    $("#progress").style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 + "%";
  }, { passive: true });

  addEventListener("keydown", (e) => {
    if ((e.target.closest && e.target.closest("input, textarea, select")) || e.metaKey || e.ctrlKey || e.altKey) return;
    const i = chapters.indexOf(current);
    if (e.key === "ArrowRight" || e.key === "PageDown") { e.preventDefault(); chapters[Math.min(i + 1, chapters.length - 1)].scrollIntoView(); }
    if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); chapters[Math.max(i - 1, 0)].scrollIntoView(); }
    if (e.key === "n" || e.key === "N") toggleNotes();
    if ((e.key === "h" || e.key === "H") && canHover) setPinned(!pinned);
    if (e.key === "m" || e.key === "M") setCalm(!document.documentElement.classList.contains("calm"), true);
  });

  // ---------- presentatörsanteckningar (från talk.js) ----------
  const notesEl = $("#notes");
  const toggleNotes = () => { notesEl.classList.toggle("show"); renderNotes(); };
  $("#notesBtn").addEventListener("click", toggleNotes);
  function renderNotes() {
    if (!notesEl.classList.contains("show")) return;
    const s = TALK.find((x) => x.id === current.id);
    $("#notesBody").innerHTML = s
      ? `<div class="dim mono" style="font-size:.72rem;margin-bottom:.3rem">${current.dataset.title} · ${s.time}</div><ul>${s.say.map((x) => `<li>${x}</li>`).join("")}</ul>`
      : `<div class="dim">${T_("Inga anteckningar för")} ${current.dataset.title}.</div>`;
  }

  const calm = () => document.documentElement.classList.contains("calm");
  const css = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  window.Deck = {
    $, $$, sleep, calm, css, chapters,
    current: () => current,
    onEnter: (id, fn) => add(onEnter, id, fn),
    onLeave: (id, fn) => add(onLeave, id, fn),
    ready() {
      observeReveal();
      if (location.hash) { const t = document.getElementById(location.hash.slice(1)); if (t) t.scrollIntoView(); }
      $$("a", nav).forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + current.id));
      centreNav();
      run(onEnter, current.id);
    },
  };
})();
