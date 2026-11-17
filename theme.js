// Tema för presentationen (index.html) och talk track (talk.html): System, Ljust eller Mörkt.
// "System" följer macOS-inställningen och ändras med den. Valet delas mellan sidorna (samma origin)
// och slår igenom direkt i alla öppna fönster. Laddas i <head> för att undvika blink.
(() => {
  const KEY = "ai.theme";
  const ORDER = ["system", "light", "dark"];
  const LABEL = { system: "System", light: "Ljust", dark: "Mörkt" };
  const ICON = { system: "◐", light: "☀", dark: "☾" };
  const mq = matchMedia("(prefers-color-scheme: light)");
  const pref = () => { try { const v = localStorage.getItem(KEY); return ORDER.includes(v) ? v : "system"; } catch (e) { return "system"; } };

  const apply = () => {
    const p = pref();
    const root = document.documentElement;
    root.dataset.theme = p === "system" ? (mq.matches ? "light" : "dark") : p;
    root.dataset.themePref = p;
    document.querySelectorAll("[data-theme-btn]").forEach((b) => {
      const tr = window.T_ || ((s) => s), lab = (q) => tr(LABEL[q]);
      b.innerHTML = `<span aria-hidden="true">${ICON[p]}</span> ${lab(p)}`;
      b.title = `${tr("Tema")}: ${lab(p)}${p === "system" ? " (" + tr("följer macOS") + ")" : ""}. ${tr("Klicka för")} ${lab(ORDER[(ORDER.indexOf(p) + 1) % 3])}.`;
    });
    document.dispatchEvent(new CustomEvent("themechange"));
  };

  window.cycleTheme = () => {
    const next = ORDER[(ORDER.indexOf(pref()) + 1) % ORDER.length];
    try { localStorage.setItem(KEY, next); } catch (e) { document.documentElement.dataset.theme = next === "system" ? (mq.matches ? "light" : "dark") : next; return; }
    apply();
  };

  mq.addEventListener("change", apply);
  addEventListener("storage", (e) => { if (e.key === KEY) apply(); });
  document.addEventListener("click", (e) => { if (e.target.closest("[data-theme-btn]")) window.cycleTheme(); });
  apply();
  document.addEventListener("DOMContentLoaded", apply);
})();
