// Gus&Co — main script. No dependencies; every block checks that its elements exist.
(() => {
    // 1. Header: solid background once the page is scrolled (always solid with data-solid)
    const header = document.querySelector('.site-header');
    if (header) {
        const alwaysSolid = header.hasAttribute('data-solid');
        const update = () => header.classList.toggle('is-solid', alwaysSolid || window.scrollY > 40);
        update();
        window.addEventListener('scroll', update, { passive: true });
    }

    // 0. Stand-by screen before the drop (drop.js sets GUS_DROP_AT and the is-standby class).
    //    Counts down, then reveals the site in place at the drop time, without a reload.
    const root = document.documentElement;
    const standby = document.querySelector('.standby');
    if (standby && root.classList.contains('is-standby')) {
        const video = standby.querySelector('.standby-video');
        if (video && video.dataset.src) {
            video.src = video.dataset.src; // loaded only while the stand-by screen is shown
            video.play().catch(() => {});
        }
        const fields = ['d', 'h', 'm', 's'].map((k) => standby.querySelector(`[data-${k}]`));
        const pad = (n) => String(n).padStart(2, '0');
        let timer = null;
        const tick = () => {
            let left = Math.ceil((window.GUS_DROP_AT - Date.now()) / 1000); // reaches 0 exactly at the drop
            if (left <= 0) {
                if (timer) clearInterval(timer);
                root.classList.remove('is-standby');
                document.dispatchEvent(new Event('gus:drop')); // lets the announcement bar switch too
                if (video) { video.pause(); video.removeAttribute('src'); video.load(); }
                window.scrollTo(0, 0);
                return;
            }
            const d = Math.floor(left / 86400); left -= d * 86400;
            const h = Math.floor(left / 3600); left -= h * 3600;
            const m = Math.floor(left / 60);
            const values = [d, h, m, left - m * 60];
            fields.forEach((el, i) => { el.textContent = pad(values[i]); });
        };
        tick();
        if (root.classList.contains('is-standby')) timer = setInterval(tick, 1000);
    }

    // 1b. Drop announcement: switch from "coming soon" to "available" at the drop time
    const announce = document.querySelector('[data-drop]');
    if (announce) {
        const dropAt = window.GUS_DROP_AT;
        const before = announce.querySelector('[data-drop-before]');
        const after = announce.querySelector('[data-drop-after]');
        const update = () => {
            const isLive = Date.now() >= window.GUS_DROP_AT;
            before.hidden = isLive;
            after.hidden = !isLive;
            return isLive;
        };
        document.addEventListener('gus:drop', update);
        if (!update()) {
            const wait = dropAt - Date.now();
            if (wait < 2 ** 31 - 1) setTimeout(update, wait); // setTimeout limit is ~24.8 days
        }
    }

    // 2. Reveal elements as they enter the viewport
    const reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -10% 0px' });
        reveals.forEach((el) => observer.observe(el));
    } else {
        reveals.forEach((el) => el.classList.add('is-visible'));
    }

    // 3. Hero video: retry playback on first touch (iOS low-power mode blocks autoplay)
    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo) {
        document.addEventListener('touchstart', () => heroVideo.play().catch(() => {}), { once: true, passive: true });
    }

    // 4. Colorway picker (product page): updates the buy link and the first photo
    const picker = document.querySelector('[data-colorway-picker]');
    if (picker) {
        const swatches = picker.querySelectorAll('[data-colorway]');
        const buyLink = document.getElementById('buy-link');
        const buyLabel = buyLink.querySelector('[data-buy-label]');
        const nameEl = document.getElementById('colorway-name');
        const gallery = document.querySelector('.product-gallery');

        const select = (id, updateHash) => {
            const swatch = picker.querySelector(`[data-colorway="${id}"]`);
            if (!swatch) return;
            swatches.forEach((s) => s.setAttribute('aria-pressed', String(s === swatch)));
            nameEl.textContent = swatch.dataset.name;
            buyLabel.textContent = swatch.dataset.name;
            buyLink.href = swatch.dataset.url;
            const photo = gallery && gallery.querySelector(`[data-photo-colorway="${id}"]`);
            if (photo) gallery.prepend(photo);
            if (updateHash) history.replaceState(null, '', `#${id}`);
        };

        swatches.forEach((s) => s.addEventListener('click', () => select(s.dataset.colorway, true)));
        if (location.hash) select(location.hash.slice(1), false);
    }

    // 5. Lightbox for the gallery marked with data-lightbox
    const galleryEl = document.querySelector('[data-lightbox]');
    const lightbox = document.getElementById('lightbox');
    if (galleryEl && lightbox) {
        const img = lightbox.querySelector('.lightbox-stage img');
        const counter = lightbox.querySelector('[data-counter]');
        const closeBtn = lightbox.querySelector('[data-close]');
        let items = [];
        let index = 0;
        let opener = null;

        const show = (i) => {
            index = (i + items.length) % items.length;
            const source = items[index].querySelector('img');
            img.src = source.currentSrc || source.src;
            img.alt = source.alt;
            counter.textContent = `${index + 1} / ${items.length}`;
        };
        const open = (button) => {
            items = [...galleryEl.querySelectorAll('button')]; // read at open time: order can change
            opener = button;
            show(items.indexOf(button));
            lightbox.hidden = false;
            document.body.style.overflow = 'hidden';
            closeBtn.focus();
        };
        const close = () => {
            lightbox.hidden = true;
            document.body.style.overflow = '';
            if (opener) opener.focus();
        };

        galleryEl.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (button) open(button);
        });
        closeBtn.addEventListener('click', close);
        lightbox.querySelector('[data-prev]').addEventListener('click', () => show(index - 1));
        lightbox.querySelector('[data-next]').addEventListener('click', () => show(index + 1));
        lightbox.querySelector('.lightbox-stage').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) close();
        });
        document.addEventListener('keydown', (e) => {
            if (lightbox.hidden) return;
            if (e.key === 'Escape') close();
            if (e.key === 'ArrowRight') show(index + 1);
            if (e.key === 'ArrowLeft') show(index - 1);
        });

        let touchX = null;
        lightbox.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
        lightbox.addEventListener('touchend', (e) => {
            if (touchX === null) return;
            const dx = e.changedTouches[0].clientX - touchX;
            if (Math.abs(dx) > 40) show(index + (dx < 0 ? 1 : -1));
            touchX = null;
        }, { passive: true });
    }
})();
