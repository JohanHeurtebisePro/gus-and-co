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
