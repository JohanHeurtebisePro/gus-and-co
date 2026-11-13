// Gus&Co — drop gate, loaded in <head> on every page (before the page is drawn).
// Single source of truth for the drop time: change DROP_AT here only.
//
// Before the drop, depending on <html data-standby="…">:
//   "screen"   → show the stand-by screen instead of the page (home page)
//   "redirect" → go to the home page (shop and product pages)
//   (absent)   → page shown normally (legal notice)
// Preview the real site before the drop: add ?apercu to the URL (kept for the browser tab session).
(function () {
    var DROP_AT = Date.parse('2026-12-01T20:00:00+01:00'); // Paris time
    var html = document.documentElement;
    html.classList.add('js');
    window.GUS_DROP_AT = DROP_AT;

    try {
        if (/[?&]apercu\b/.test(location.search)) sessionStorage.setItem('gus-apercu', '1');
        if (sessionStorage.getItem('gus-apercu') === '1') return;
    } catch (e) { /* storage blocked: no preview mode */ }

    if (Date.now() >= DROP_AT) return;
    var mode = html.getAttribute('data-standby');
    if (mode === 'redirect') location.replace('index.html');
    else if (mode === 'screen') html.classList.add('is-standby');
})();
