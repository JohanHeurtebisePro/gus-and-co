// Gus&Co — stand-by page: countdown to the drop, then "drop is open" with direct buy links.
(() => {
    const countdown = document.querySelector('[data-countdown]');
    if (!countdown) return;

    const target = new Date(countdown.dataset.target).getTime();
    const fields = ['d', 'h', 'm', 's'].map((k) => countdown.querySelector(`[data-${k}]`));
    const title = document.querySelector('[data-title]');
    const stateLabel = document.querySelector('[data-state-label]');
    const live = document.querySelector('[data-live]');
    const pad = (n) => String(n).padStart(2, '0');
    let timer = null;

    const openDrop = () => {
        countdown.hidden = true;
        live.hidden = false;
        title.textContent = 'Le drop est ouvert.';
        if (stateLabel) stateLabel.textContent = 'Disponible maintenant';
        document.title = 'Gus&Co · Le drop est ouvert';
        if (timer) clearInterval(timer);
    };

    const tick = () => {
        let left = Math.floor((target - Date.now()) / 1000);
        if (left <= 0) { openDrop(); return; }
        const d = Math.floor(left / 86400); left -= d * 86400;
        const h = Math.floor(left / 3600); left -= h * 3600;
        const m = Math.floor(left / 60);
        const s = left - m * 60;
        [d, h, m, s].forEach((value, i) => { fields[i].textContent = pad(value); });
    };

    tick();
    if (live.hidden) timer = setInterval(tick, 1000);

    // iOS low-power mode can block autoplay: retry on first touch
    const video = document.querySelector('.film-video');
    if (video) document.addEventListener('touchstart', () => video.play().catch(() => {}), { once: true, passive: true });
})();
