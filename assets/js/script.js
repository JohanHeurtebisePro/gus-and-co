// ============================================
// 1. PRELOADER
// ============================================
const preloader = document.querySelector('.preloader');
const loaderLine = document.querySelector('.loader-line');

if (preloader && loaderLine) {
    let progress = 0;
    const interval = setInterval(() => {
        progress += 5;
        if (progress > 100) progress = 100;
        loaderLine.style.width = `${progress}%`;

        if (progress === 100) {
            clearInterval(interval);
            gsap.to(preloader, {
                y: '-100%',
                duration: 0.6,
                ease: 'power4.inOut',
                delay: 0.1,
                onComplete: () => {
                    preloader.style.display = 'none';
                    initSiteAnimations();
                }
            });
        }
    }, 20);
} else {
    // Pas de preloader sur cette page — on initialise après chargement DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            if (typeof gsap !== 'undefined') initSiteAnimations();
        });
    } else {
        if (typeof gsap !== 'undefined') initSiteAnimations();
    }
}


// ============================================
// 2. BACKGROUND CONSTELLATION (THREE.JS)
// ============================================
const canvasBg = document.querySelector('#webgl-canvas');

if (canvasBg && typeof THREE !== 'undefined') {
    const sceneBg = new THREE.Scene();
    sceneBg.fog = new THREE.FogExp2(0xf0f0f0, 0.03);

    const cameraBg = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    cameraBg.position.z = 40;

    const rendererBg = new THREE.WebGLRenderer({ canvas: canvasBg, alpha: true, antialias: true });
    rendererBg.setSize(window.innerWidth, window.innerHeight);
    rendererBg.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Réduire la densité sur mobile pour les performances
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 120 : 250;
    const maxDistance = isMobile ? 12 : 15;

    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3]     = (Math.random() - 0.5) * 100;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 80;
        velocities.push({
            x: (Math.random() - 0.5) * 0.05,
            y: (Math.random() - 0.5) * 0.05,
            z: (Math.random() - 0.5) * 0.05
        });
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        color: 0x111111, size: 0.6, transparent: true, opacity: 0.8, sizeAttenuation: true
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    sceneBg.add(particlesMesh);

    const linesGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(particleCount * particleCount * 3);
    const lineColors = new Float32Array(particleCount * particleCount * 3);
    linesGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    linesGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));
    const linesMaterial = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.4 });
    const linesMesh = new THREE.LineSegments(linesGeometry, linesMaterial);
    sceneBg.add(linesMesh);

    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    }, { passive: true });

    // Sur mobile, rotation légère automatique
    let autoRotate = isMobile;

    function tickBg() {
        const nodePositions = particlesGeometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
            nodePositions[i * 3]     += velocities[i].x;
            nodePositions[i * 3 + 1] += velocities[i].y;
            nodePositions[i * 3 + 2] += velocities[i].z;
            if (Math.abs(nodePositions[i * 3])     > 50) velocities[i].x *= -1;
            if (Math.abs(nodePositions[i * 3 + 1]) > 50) velocities[i].y *= -1;
            if (Math.abs(nodePositions[i * 3 + 2]) > 40) velocities[i].z *= -1;
        }
        particlesGeometry.attributes.position.needsUpdate = true;

        let vertexIndex = 0, colorIndex = 0;
        for (let i = 0; i < particleCount; i++) {
            const x1 = nodePositions[i * 3], y1 = nodePositions[i * 3 + 1], z1 = nodePositions[i * 3 + 2];
            for (let j = i + 1; j < particleCount; j++) {
                const x2 = nodePositions[j * 3], y2 = nodePositions[j * 3 + 1], z2 = nodePositions[j * 3 + 2];
                const dx = x1 - x2, dy = y1 - y2, dz = z1 - z2;
                const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
                if (distance < maxDistance) {
                    linePositions[vertexIndex++] = x1; linePositions[vertexIndex++] = y1; linePositions[vertexIndex++] = z1;
                    linePositions[vertexIndex++] = x2; linePositions[vertexIndex++] = y2; linePositions[vertexIndex++] = z2;
                    const colorVal = 0.1;
                    for (let k = 0; k < 6; k++) lineColors[colorIndex++] = colorVal;
                }
            }
        }
        linesMesh.geometry.setDrawRange(0, vertexIndex / 3);
        linesGeometry.attributes.position.needsUpdate = true;
        linesGeometry.attributes.color.needsUpdate = true;

        if (autoRotate) {
            sceneBg.rotation.y += 0.001;
        } else {
            sceneBg.rotation.x += (mouseY * 0.3 - sceneBg.rotation.x) * 0.05;
            sceneBg.rotation.y += (mouseX * 0.3 - sceneBg.rotation.y) * 0.05;
        }

        rendererBg.render(sceneBg, cameraBg);
        requestAnimationFrame(tickBg);
    }
    tickBg();

    window.addEventListener('resize', () => {
        cameraBg.aspect = window.innerWidth / window.innerHeight;
        cameraBg.updateProjectionMatrix();
        rendererBg.setSize(window.innerWidth, window.innerHeight);
    }, { passive: true });
}


// ============================================
// 3. SMOOTH SCROLL (LENIS)
// ============================================
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.5,
    infinite: false
});

// Boucle RAF principale — utilisée SEULEMENT si GSAP n'est pas dispo
// (évite la double RAF quand initSiteAnimations connecte gsap.ticker)
function lenisRaf(time) { lenis.raf(time); requestAnimationFrame(lenisRaf); }
requestAnimationFrame(lenisRaf);

// Connecter Lenis à ScrollTrigger pour éviter les conflits de scroll
lenis.on('scroll', () => {
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.update();
});


// ============================================
// 4. ANIMATIONS SITE
// ============================================
function initSiteAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Synchroniser ScrollTrigger avec Lenis via le ticker GSAP
    // On arrête la boucle lenisRaf indépendante et on laisse GSAP piloter
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // Init galerie (lightbox + animations scroll)
    initGallery();

    // Animations Page Produit (seulement si les éléments existent)
    const galleryImgs = document.querySelectorAll('.p-gallery-grid img');
    if (galleryImgs.length) {
        gsap.from(galleryImgs, { opacity: 0, y: 40, duration: 0.9, stagger: 0.1, ease: "power3.out" });
    }

    const infoEls = document.querySelectorAll('.p-info-sticky > *');
    if (infoEls.length) {
        gsap.from(infoEls, { opacity: 0, x: 25, duration: 0.9, stagger: 0.06, delay: 0.2, ease: "power3.out" });
    }

    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
        gsap.from(el, {
            opacity: 0, y: 40, duration: 0.9,
            scrollTrigger: { trigger: el, start: "top 88%" }
        });
    });

    // Animation Texte Hero (index.html uniquement)
    const revealTexts = document.querySelectorAll('.reveal-text');
    if (revealTexts.length) {
        gsap.from(revealTexts, { y: 80, opacity: 0, duration: 1.2, stagger: 0.1, ease: "power3.out", delay: 1 });
    }

    // Animation Produits avec parallaxe douce (index.html uniquement)
    document.querySelectorAll('.showcase-item').forEach(item => {
        const img = item.querySelector('img');
        if (img) {
            gsap.fromTo(img,
                { scale: 1.1, y: -30 },
                { scale: 1, y: 30, scrollTrigger: { trigger: item, start: "top bottom", end: "bottom top", scrub: true } }
            );
        }
        const info = item.querySelector('.showcase-info');
        if (info) {
            gsap.from(info, { y: 40, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: item, start: "top 78%" } });
        }
    });
}


// ============================================
// 5. EFFET "NEGATIVE FLASH" (logo hover)
// ============================================
const triggerLogo = document.getElementById('trigger-logo');
if (triggerLogo) {
    triggerLogo.addEventListener('mouseenter', () => {
        document.body.classList.add('mode-inverse');
        if (typeof particlesMaterial !== 'undefined') {
            particlesMaterial.color.setHex(0xffffff);
        }
    });
    triggerLogo.addEventListener('mouseleave', () => {
        document.body.classList.remove('mode-inverse');
        if (typeof particlesMaterial !== 'undefined') {
            particlesMaterial.color.setHex(0x111111);
        }
    });
}


// ============================================
// 6. MENU MOBILE
// ============================================
const hamburger = document.querySelector('.hamburger-btn');
const drawerClose = document.getElementById('drawer-close');
const menuOverlay = document.getElementById('menu-overlay');
const mobileLinks = document.querySelectorAll('.m-link');

function openMenu() { document.body.classList.add('menu-open'); }
function closeMenu() { document.body.classList.remove('menu-open'); }

if (hamburger) hamburger.addEventListener('click', openMenu);
if (drawerClose) drawerClose.addEventListener('click', closeMenu);
if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);
mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

// Fermer avec Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
});

// ============================================
// 7. PAGE PRODUIT — ACCORDÉONS + RETOUR + STICKY
// ============================================
document.querySelectorAll('.accordion-header').forEach(acc => {
    acc.addEventListener('click', function() {
        this.parentElement.classList.toggle('active');
    });
});

const dynamicBack = document.getElementById('dynamic-back');
if (dynamicBack) {
    dynamicBack.addEventListener('click', function(e) {
        if (window.history.length > 1) {
            e.preventDefault();
            window.history.back();
        } else {
            window.location.href = "produits.html";
        }
    });
}

window.addEventListener('scroll', () => {
    document.body.classList.toggle('scrolled', window.scrollY > 500);
}, { passive: true });


function initGallery() {

    const galleryItems = document.querySelectorAll('.gallery-item');
    if (!galleryItems.length) return;

    // Construire la liste des images depuis les items de la galerie
    const images = Array.from(galleryItems).map(item => ({
        src: item.querySelector('img').src,
        alt: item.querySelector('img').alt || ''
    }));

    // ---- Créer la lightbox dans le DOM ----
    const lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Galerie photo');
    lb.innerHTML = `
        <div class="lightbox-backdrop"></div>
        <div class="lightbox-inner">
            <button class="lightbox-close" aria-label="Fermer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
            <button class="lightbox-prev" aria-label="Image précédente">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="15 18 9 12 15 6"/>
                </svg>
            </button>
            <button class="lightbox-next" aria-label="Image suivante">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                </svg>
            </button>
            <div class="lightbox-img-wrap">
                <img class="lightbox-img" src="" alt="" draggable="false">
            </div>
            <div class="lightbox-footer">
                <div class="lightbox-thumbs"></div>
                <div class="lightbox-counter"></div>
            </div>
        </div>
        <div class="lightbox-drag-hint">← Swipe pour naviguer →</div>
    `;
    document.body.appendChild(lb);

    const lbImg       = lb.querySelector('.lightbox-img');
    const lbCounter   = lb.querySelector('.lightbox-counter');
    const lbThumbs    = lb.querySelector('.lightbox-thumbs');
    const lbDragHint  = lb.querySelector('.lightbox-drag-hint');
    const lbClose     = lb.querySelector('.lightbox-close');
    const lbPrev      = lb.querySelector('.lightbox-prev');
    const lbNext      = lb.querySelector('.lightbox-next');
    const lbBackdrop  = lb.querySelector('.lightbox-backdrop');

    let currentIndex = 0;
    let isTransitioning = false;

    // Générer les thumbnails
    images.forEach((img, i) => {
        const t = document.createElement('img');
        t.src = img.src;
        t.alt = img.alt;
        t.className = 'lb-thumb';
        t.addEventListener('click', () => goTo(i));
        lbThumbs.appendChild(t);
    });

    const thumbEls = lbThumbs.querySelectorAll('.lb-thumb');

    function updateCounter() {
        lbCounter.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(images.length).padStart(2, '0')}`;
    }

    function updateThumbs() {
        thumbEls.forEach((t, i) => t.classList.toggle('is-active', i === currentIndex));
        // Scroll thumb into view
        thumbEls[currentIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }

    function setImage(index, direction) {
        if (isTransitioning) return;
        isTransitioning = true;

        const exitClass = direction === 'next' ? 'lb-exit-left' : 'lb-exit-right';
        const enterClass = direction === 'next' ? 'lb-enter-left' : 'lb-enter-right';

        lbImg.classList.add(exitClass);

        setTimeout(() => {
            lbImg.classList.remove(exitClass);
            lbImg.src = images[index].src;
            lbImg.alt = images[index].alt;
            lbImg.classList.add(enterClass);
            currentIndex = index;
            updateCounter();
            updateThumbs();

            lbImg.addEventListener('animationend', () => {
                lbImg.classList.remove(enterClass);
                isTransitioning = false;
            }, { once: true });
        }, 280);
    }

    function open(index) {
        currentIndex = index;
        lbImg.src = images[index].src;
        lbImg.alt = images[index].alt;
        lb.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        updateCounter();
        updateThumbs();
        lbImg.style.opacity = '';
        lbImg.style.transform = '';

        // Cacher le hint après 2.5s
        setTimeout(() => lbDragHint.classList.add('hidden'), 2500);
    }

    function close() {
        lb.classList.remove('is-open');
        document.body.style.overflow = '';
        setTimeout(() => { lbDragHint.classList.remove('hidden'); }, 400);
    }

    function goTo(index, direction) {
        const dir = direction || (index > currentIndex ? 'next' : 'prev');
        const wrapped = (index + images.length) % images.length;
        setImage(wrapped, dir);
    }

    function next() { goTo(currentIndex + 1, 'next'); }
    function prev() { goTo(currentIndex - 1, 'prev'); }

    // Ouvrir depuis la galerie
    galleryItems.forEach((item, i) => {
        item.addEventListener('click', () => open(i));
    });

    // Boutons
    lbClose.addEventListener('click', close);
    lbPrev.addEventListener('click', prev);
    lbNext.addEventListener('click', next);
    lbBackdrop.addEventListener('click', close);

    // Clavier
    document.addEventListener('keydown', (e) => {
        if (!lb.classList.contains('is-open')) return;
        if (e.key === 'Escape')       close();
        if (e.key === 'ArrowRight')   next();
        if (e.key === 'ArrowLeft')    prev();
    });

    // Touch / Swipe
    let touchStartX = 0;
    let touchStartY = 0;

    lb.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    lb.addEventListener('touchend', (e) => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
            dx < 0 ? next() : prev();
        }
    }, { passive: true });

    // Drag souris (desktop)
    let mouseDownX = 0;
    let isDragging = false;

    lbImg.addEventListener('mousedown', (e) => {
        mouseDownX = e.clientX;
        isDragging = true;
    });

    window.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        isDragging = false;
        const dx = e.clientX - mouseDownX;
        if (Math.abs(dx) > 50) dx < 0 ? next() : prev();
    });

    // GSAP reveal scroll pour la galerie
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        gsap.from('.gallery-header', {
            opacity: 0, y: 30, duration: 0.9,
            scrollTrigger: { trigger: '.gallery-section', start: 'top 85%' }
        });

        const gItems = document.querySelectorAll('.gallery-item');
        gItems.forEach((item, i) => {
            gsap.from(item, {
                opacity: 0, y: 20, duration: 0.7,
                delay: (i % 6) * 0.07,
                scrollTrigger: { trigger: '.gallery-grid', start: 'top 85%' }
            });
        });
    } else {
        // ScrollTrigger non disponible : s'assurer que les items sont visibles
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.style.opacity = '1';
        });
    }

}