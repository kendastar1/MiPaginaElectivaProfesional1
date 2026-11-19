document.addEventListener('DOMContentLoaded', function() {

    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');

            const isOpen = mobileMenu.classList.contains('active');
            menuToggle.innerHTML = isOpen
                ? '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>'
                : '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>';
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                menuToggle.innerHTML = '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>';
            });
        });
    }

    const words = [
        'TRANSFORMACIÓN EMPRESARIAL',
        'DIGITAL VS. DIGITALIZACIÓN',
        'ESTRATEGIA EMPRESARIAL',
        'CAPACIDADES DIGITALES',
        'MODELOS DE NEGOCIO DIGITAL'
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingElement = document.getElementById('typingText');

    let typedSpan = null;
    let restSpan = null;
    if (typingElement) {
        typingElement.textContent = '';
        typedSpan = document.createElement('span');
        typedSpan.className = 'tt-typed';
        restSpan = document.createElement('span');
        restSpan.className = 'tt-rest';
        typingElement.appendChild(typedSpan);
        typingElement.appendChild(restSpan);
    }

    function setTyping(word, count) {
        typedSpan.textContent = word.substring(0, count);
        restSpan.textContent = word.substring(count);
    }

    function typeEffect() {
        const currentWord = words[wordIndex];
        const typeSpeed = isDeleting ? 40 : 80;

        if (!isDeleting && charIndex < currentWord.length) {
            charIndex++;
            setTyping(currentWord, charIndex);
            setTimeout(typeEffect, typeSpeed);
        } else if (isDeleting && charIndex > 0) {
            charIndex--;
            setTyping(currentWord, charIndex);
            setTimeout(typeEffect, typeSpeed);
        } else if (!isDeleting && charIndex === currentWord.length) {
            setTimeout(() => {
                isDeleting = true;
                typeEffect();
            }, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            setTyping(words[wordIndex], 0);
            setTimeout(typeEffect, 500);
        }
    }

    function reserveHeroHeight() {
        if (!typingElement) return;
        const h1 = typingElement.closest('h1');
        if (!h1) return;
        h1.style.minHeight = '';
        let max = 0;
        words.forEach(w => {
            setTyping(w, 0);
            max = Math.max(max, h1.offsetHeight);
        });
        setTyping(words[wordIndex], charIndex);
        h1.style.minHeight = max + 'px';
    }

    if (typingElement) {
        setTyping(words[0], 0);
        reserveHeroHeight();
        window.addEventListener('resize', reserveHeroHeight);
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(reserveHeroHeight);
        }
        typeEffect();
    }

    const tabButtons = document.querySelectorAll('.tab-btn');
    const codePanels = document.querySelectorAll('.code-panel');
    const tabLabel = document.querySelector('.tab-label');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.dataset.tab;

            tabButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            codePanels.forEach(p => p.classList.remove('active'));
            document.getElementById('code' + tab.charAt(0).toUpperCase() + tab.slice(1)).classList.add('active');

            if (tabLabel) {
                tabLabel.textContent = tab.toUpperCase();
            }
        });
    });

    const copyBtn = document.getElementById('copyBtn');

    if (copyBtn) {
        copyBtn.addEventListener('click', function() {
            const activePanel = document.querySelector('.code-panel.active');
            if (activePanel) {
                navigator.clipboard.writeText(activePanel.textContent).then(() => {

                    const originalHTML = this.innerHTML;
                    this.innerHTML = '<svg width="16" height="16" fill="none" stroke="#4ade80" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>';
                    setTimeout(() => {
                        this.innerHTML = originalHTML;
                    }, 2000);
                });
            }
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            if (targetId === '#inicio') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    const ddItem = document.querySelector('.nav-dropdown');
    const ddToggle = document.querySelector('.nav-dd-toggle');
    function closeDropdown() {
        if (!ddItem) return;
        ddItem.classList.remove('open');
        ddToggle.setAttribute('aria-expanded', 'false');
    }
    if (ddItem && ddToggle) {
        ddToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const open = ddItem.classList.toggle('open');
            ddToggle.setAttribute('aria-expanded', open);
        });
        ddItem.querySelectorAll('.nav-dd-menu a').forEach(a => a.addEventListener('click', closeDropdown));
        document.addEventListener('click', (e) => { if (!ddItem.contains(e.target)) closeDropdown(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeDropdown(); ddToggle.blur(); } });
        window.addEventListener('scroll', closeDropdown, { passive: true });
    }

    const mmGroup = document.querySelector('.mm-group');
    const mmToggle = document.querySelector('.mm-toggle');
    if (mmGroup && mmToggle) {
        mmToggle.addEventListener('click', () => {
            const open = mmGroup.classList.toggle('open');
            mmToggle.setAttribute('aria-expanded', open);
        });
    }

    const navAnchors = Array.from(document.querySelectorAll('.nav-links a[href^="#"], .mobile-menu a[href^="#"]'));

    const navTargets = [...new Set(navAnchors.map(a => a.getAttribute('href')))].filter(h => h.length > 1);
    let navLockUntil = 0;

    function setActiveNav(href) {
        navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === href));
        document.querySelectorAll('.nav-dd-toggle, .mm-toggle').forEach(t => {
            t.classList.toggle('active', (t.dataset.children || '').split(',').includes(href));
        });
    }

    function updateActiveNav() {
        if (Date.now() < navLockUntil) return;
        const y = window.scrollY + 140;
        let current = '#inicio';
        navTargets.forEach(id => {
            const el = document.querySelector(id);
            if (el && !el.classList.contains('ova-locked') && el.getBoundingClientRect().top + window.scrollY <= y) current = id;
        });
        const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
        const footerEl = document.querySelector('#contacto');
        if (atBottom && footerEl && !footerEl.classList.contains('ova-locked')) current = '#contacto';
        setActiveNav(current);
    }

    navAnchors.forEach(anchor => {
        anchor.addEventListener('click', function() {
            const href = this.getAttribute('href');
            setActiveNav(href);
            navLockUntil = Date.now() + 900;
            if (href === '#inicio') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            setTimeout(updateActiveNav, 950);
        });
    });

    let navTick = false;
    window.addEventListener('scroll', function() {
        if (navTick) return;
        navTick = true;
        requestAnimationFrame(function() { navTick = false; updateActiveNav(); });
    }, { passive: true });
    window.addEventListener('resize', updateActiveNav);
    updateActiveNav();

    const docFloat = document.getElementById('docFloat');
    const docLabel = document.getElementById('docFloatLabel');
    const docIcon = document.getElementById('docFloatIcon');
    const heroDownload = document.getElementById('heroDownload');
    const navEl = document.getElementById('mainNav');

    if (docFloat && docLabel && docIcon && heroDownload) {
        const DOCK_SIZE = 56;
        const DOCK_MARGIN = 24;
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const DURATION = reduceMotion ? 1 : 1000;
        const clamp01 = v => Math.min(1, Math.max(0, v));
        const lerp = (a, b, t) => a + (b - a) * t;
        const easeInOut = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
        const mix = (c1, c2, t) => 'rgb(' + c1.map((v, i) => Math.round(lerp(v, c2[i], t))).join(',') + ')';

        let u = 0;
        let target = 0;
        let raf = 0;
        let last = 0;
        let fullW = 0;

        const navBottom = () => Math.max(0, navEl ? navEl.getBoundingClientRect().bottom : 0);

        function measureLabel() {
            docLabel.style.maxWidth = 'none';
            fullW = docLabel.scrollWidth;
        }

        function draw() {
            const isDocked = docFloat.classList.contains('docked');
            const nb = navBottom();
            const a = heroDownload.getBoundingClientRect();

            const heroInView = a.top >= nb;
            const ax = a.left;
            const startY = heroInView ? a.top : nb - a.height - 6;
            const base = heroInView ? 0 : a.height + 16;
            const rise = heroInView ? 0 : easeOutCubic(clamp01(u / 0.16)) * base;
            const vw = document.documentElement.clientWidth;
            const toX = vw - DOCK_MARGIN - DOCK_SIZE;
            const toY = window.innerHeight - DOCK_MARGIN - DOCK_SIZE;

            const t = easeInOut(u);

            const x = ax + (toX - ax) * (1 - Math.pow(1 - t, 2));
            let y = startY + rise + (toY - startY - base) * Math.pow(t, 1.35);

            y += Math.sin(Math.PI * clamp01((u - 0.74) / 0.26)) * 12;

            const fly = Math.sin(Math.PI * u);
            const w = lerp(a.width, DOCK_SIZE, t);
            const h = lerp(a.height, DOCK_SIZE, t);

            docFloat.style.width = w.toFixed(1) + 'px';
            docFloat.style.height = h.toFixed(1) + 'px';
            docFloat.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0) rotate(' + (-7 * fly).toFixed(2) + 'deg) scale(' + (1 + 0.07 * fly).toFixed(3) + ')';

            const q = clamp01(t * 1.8);
            docLabel.style.maxWidth = (fullW * (1 - q)).toFixed(1) + 'px';
            docLabel.style.opacity = (1 - clamp01(q * 2.2)).toFixed(2);
            docFloat.style.gap = (8 * (1 - q)).toFixed(1) + 'px';

            const s = lerp(18, 26, t).toFixed(1);
            docIcon.setAttribute('width', s);
            docIcon.setAttribute('height', s);

            if (!isDocked) {

                const bgT = clamp01(t / 0.55);
                const fgT = clamp01((bgT - 0.45) / 0.2);
                docFloat.style.background = mix([255, 255, 255], [8, 135, 50], bgT);
                docFloat.style.color = mix([26, 29, 36], [255, 255, 255], fgT);

                docFloat.style.boxShadow = '0 ' + (10 + 14 * fly).toFixed(0) + 'px ' + (22 + 20 * fly).toFixed(0) + 'px -6px rgba(0,0,0,0.32)';
            }

            const shown = u > 0;
            docFloat.classList.toggle('visible', shown);
            docFloat.setAttribute('aria-hidden', shown ? 'false' : 'true');
            docFloat.tabIndex = shown ? 0 : -1;

            heroDownload.style.visibility = shown ? 'hidden' : '';
        }

        function settle() {
            if (u >= 1) {
                docFloat.classList.add('docked');
                docFloat.style.background = '';
                docFloat.style.color = '';
                docFloat.style.boxShadow = '';
                docFloat.classList.remove('landed');
                void docFloat.offsetWidth;
                docFloat.classList.add('landed');
            }
        }

        function frame(ts) {
            const dt = Math.min(50, ts - (last || ts));
            last = ts;
            const step = dt / (target > u ? DURATION : DURATION * 0.8);
            u = target > u ? Math.min(target, u + step) : Math.max(target, u - step);
            draw();
            if (u !== target) {
                raf = requestAnimationFrame(frame);
            } else {
                raf = 0;
                last = 0;
                settle();
            }
        }

        function go(newTarget, instant) {
            if (newTarget === target && !instant) return;
            target = newTarget;
            if (target === 0 || u < 1) {
                docFloat.classList.remove('docked', 'landed');
                if (u >= 1) { docFloat.style.background = '#088732'; docFloat.style.color = '#fff'; }
            }
            if (instant) {
                u = target;
                draw();
                settle();
                return;
            }
            if (!raf) { last = 0; raf = requestAnimationFrame(frame); }
        }

        function checkHero() {
            const a = heroDownload.getBoundingClientRect();
            const nb = navBottom();
            if (target === 0 && a.bottom < nb) go(1);
            else if (target === 1 && a.top > nb + 8) go(0);
        }

        let heroTick = false;
        window.addEventListener('scroll', function() {
            if (heroTick) return;
            heroTick = true;
            requestAnimationFrame(function() { heroTick = false; checkHero(); });
        }, { passive: true });
        window.addEventListener('resize', () => {
            measureLabel();
            if (!raf) draw();
            checkHero();
        });

        measureLabel();
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { measureLabel(); if (!raf) draw(); });

        if (heroDownload.getBoundingClientRect().bottom < navBottom()) go(1, true);
    }

    let lastScroll = 0;
    const mainNav = document.getElementById('mainNav');

    let navScrolled = false;
    window.addEventListener('scroll', function() {
        const now = window.pageYOffset > 10;
        if (now !== navScrolled) {
            navScrolled = now;
            mainNav.classList.toggle('scrolled', now);
        }
    }, { passive: true });

    const intVideo = document.getElementById('intVideo');
    const intSection = document.getElementById('integracion');
    if (intVideo && intSection) {
        const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!reduce && 'IntersectionObserver' in window) {
            new IntersectionObserver(function(entries) {
                entries.forEach(function(e) {
                    if (e.isIntersecting) {
                        if (intVideo.preload === 'none') intVideo.preload = 'auto';
                        const pr = intVideo.play();
                        if (pr && pr.catch) pr.catch(function() {});
                    } else {
                        intVideo.pause();
                    }
                });
            }, { rootMargin: '150px 0px', threshold: 0 }).observe(intSection);
        }
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) intVideo.pause();
        });
    }

});

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

    function addRevealClasses() {

        document.querySelectorAll('.section-header').forEach((el, i) => {
            el.classList.add('reveal');
        });

        document.querySelectorAll('.service-card').forEach((el, i) => {
            el.classList.add('reveal', `reveal-delay-${Math.min(i + 1, 6)}`);
        });

        document.querySelectorAll('.benefit-item').forEach((el, i) => {
            el.classList.add('reveal', i % 2 === 0 ? 'reveal-left' : 'reveal-right', `reveal-delay-${Math.min(i + 1, 4)}`);
        });

        document.querySelectorAll('.stat-item, .counter-item').forEach((el, i) => {
            el.classList.add('reveal', 'reveal-scale', `reveal-delay-${Math.min(i + 1, 4)}`);
        });

        document.querySelectorAll('.code-grid, .headers-table, .code-block').forEach(el => {
            el.classList.add('reveal');
        });

        document.querySelectorAll('.step-item, .step-card, .how-step, .hiw-card').forEach((el, i) => {
            el.classList.add('reveal', `reveal-delay-${Math.min(i + 1, 6)}`);
        });

        document.querySelectorAll('.int-card').forEach((el, i) => {
            el.classList.add('reveal', 'reveal-scale', `reveal-delay-${Math.min(i + 1, 6)}`);
        });

        document.querySelectorAll('.reveal').forEach(el => {
            revealObserver.observe(el);
        });
    }

    addRevealClasses();

    console.log('✨ Animaciones scroll-reveal activadas!');

(function () {
    const section = document.querySelector('.quick-cards');
    if (!section) return;

    section.querySelectorAll('.quick-card').forEach((card, i) => card.style.setProperty('--i', i));
    section.classList.add('qc-js');

    const play = () => {
        if (section.classList.contains('qc-in')) return;
        section.classList.add('qc-in');

        const lastIcon = section.querySelector('.quick-card:last-child .quick-card-icon');
        const finish = () => section.classList.add('qc-done');
        if (lastIcon) lastIcon.addEventListener('animationend', finish, { once: true });
        setTimeout(finish, 3500);
    };

    if (!('IntersectionObserver' in window)) { play(); return; }

    const io = new IntersectionObserver((entries) => {
        if (entries.some(e => e.isIntersecting)) { play(); io.disconnect(); }
    }, { threshold: 0.2 });
    io.observe(section);

    setTimeout(play, 4000);
})();


/* ===== Secciones por etapas + botón "Siguiente" =====
   Cada etapa se muestra completa; la siguiente permanece oculta (y por lo tanto
   no se puede bajar a ella) hasta que se pulsa "Siguiente" al llegar al final. */
(function () {
    const STAGES = [
        ['#inicio', '.quick-cards'],
        ['#caracteristicas'],
        ['#beneficios'],
        ['#como-funciona'],
        ['#integracion'],
        ['#para-empresas'],
        ['#conceptos'],
        ['#estrategia'],
        ['#modelos-negocio'],
        ['#actividad-ova'],
        ['#desarrolladores', '#contacto']
    ];
    // true: los enlaces del menú / tarjetas rápidas desbloquean hasta su destino.
    // false: solo se avanza con el botón "Siguiente".
    const ALLOW_MENU_JUMPS = true;

    const btn = document.getElementById('nextSectionBtn');
    if (!btn) return;

    const stages = STAGES
        .map(sels => sels.map(s => document.querySelector(s)).filter(Boolean))
        .filter(els => els.length);
    const last = stages.length - 1;
    let unlocked = 0;
    let suppressUntil = 0;   // durante un salto desde el menú no se evalúa el progreso (no suma secciones intermedias)

    function applyLocks() {
        stages.forEach((els, i) => els.forEach(el => el.classList.toggle('ova-locked', i > unlocked)));
    }

    function stageIndexOf(selector) {
        const target = document.querySelector(selector);
        if (!target) return -1;
        return stages.findIndex(els => els.some(el => el === target || el.contains(target)));
    }

    function unlockTo(i) {
        if (i > unlocked) { unlocked = Math.min(i, last); applyLocks(); }
    }

    function stageBounds(i) {
        const els = stages[i];
        const first = els[0].getBoundingClientRect();
        const lastR = els[els.length - 1].getBoundingClientRect();
        return { top: first.top + window.scrollY, bottom: lastR.bottom + window.scrollY };
    }

    function setBtn(show) {
        btn.classList.toggle('show', show);
        btn.setAttribute('aria-hidden', show ? 'false' : 'true');
        btn.tabIndex = show ? 0 : -1;
    }

    function update() {
        updateProgress();
        const vb = window.scrollY + window.innerHeight;     // borde inferior de la pantalla
        let show = false;
        for (let i = 0; i < last; i++) {
            if (i > unlocked) break;
            const b = stageBounds(i);
            // Se muestra solo cuando el final de la etapa está en el borde inferior de la pantalla.
            if (vb >= b.bottom - 8 && vb <= b.bottom + 8 && window.scrollY + 1 < b.bottom) { show = true; break; }
        }
        setBtn(show);
    }

    let tick = false;
    function schedule() {
        if (tick) return;
        tick = true;
        requestAnimationFrame(() => { tick = false; update(); });
    }

    function goNext() {
        const vb = window.scrollY + window.innerHeight;
        let cur = 0;
        for (let i = 0; i < last; i++) {
            if (i > unlocked) break;
            if (vb >= stageBounds(i).bottom - 8) cur = i;
        }
        const next = Math.min(cur + 1, last);
        unlockTo(next);
        setBtn(false);
        stages[next][0].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    btn.addEventListener('click', goNext);

    // Enlaces internos (menú, tarjetas rápidas): desbloquean hasta su destino antes de desplazarse.
    document.addEventListener('click', function (e) {
        const a = e.target.closest && e.target.closest('a[href^="#"]');
        if (!a || !ALLOW_MENU_JUMPS) return;
        const href = a.getAttribute('href');
        if (!href || href.length < 2) return;
        const i = stageIndexOf(href);
        if (i > -1) {
            unlockTo(i);
            suppressUntil = Date.now() + 1300;
            setTimeout(update, 1350);
        }
    }, true);

    // Si se abre la página con un #hash, desbloquea hasta ese punto.
    if (ALLOW_MENU_JUMPS && location.hash.length > 1) {
        const i = stageIndexOf(location.hash);
        if (i > 0) unlocked = i;
    }
    applyLocks();

    // ----- Barra de progreso (debajo del menú) -----
    // La barra no se muestra mientras se desplaza: aparece solo cuando se completa
    // una sección y se oculta sola pasado este tiempo (en milisegundos).
    const PROGRESS_VISIBLE_MS = 3000;
    // true: también se muestra al entrar (bajar) a cada sección nueva, además de al terminarla.
    const SHOW_PROGRESS_ON_ENTER = true;
    const STAGE_NAMES = ['Inicio', 'Introducción', 'Metodologías', 'Objetivos',
        '¿Qué es la transformación?', '¿Por qué se transforman?', 'Digital vs. Digitalización',
        'Estrategia', 'Modelos de negocio', 'Actividad OVA', 'Desarrolladores'];
    const navEl = document.getElementById('mainNav');
    let bar = null, fill = null, countEl = null, hideTimer = 0, manualOpen = false;
    const completed = new Set();   // secciones terminadas (se llega al final de la sección)

    let wrap = null;

    if (navEl) {
        wrap = document.createElement('div');
        wrap.className = 'ova-progress-wrap';
        wrap.innerHTML =
            '<button type="button" class="ova-toggle" aria-label="Ver progreso" aria-expanded="false" title="Ver progreso">' +
                '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M6 9l6 6 6-6"/></svg>' +
            '</button>' +
            '<div class="ova-progress-panel">' +
                '<button type="button" class="ova-close" aria-label="Cerrar progreso" title="Cerrar">' +
                    '<svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M18 6L6 18"/></svg>' +
                '</button>' +
                '<div class="ova-progress" role="progressbar" aria-valuemin="0" aria-valuemax="' + stages.length + '">' +
                    '<span class="ova-progress-track"><span class="ova-progress-fill"></span></span>' +
                    '<span class="ova-progress-count"></span>' +
                '</div>' +
            '</div>';
        bar = wrap.querySelector('.ova-progress');
        fill = wrap.querySelector('.ova-progress-fill');
        countEl = wrap.querySelector('.ova-progress-count');
        navEl.appendChild(wrap);

        const toggleBtn = wrap.querySelector('.ova-toggle');
        const closeBtn = wrap.querySelector('.ova-close');
        // La flechita muestra el progreso y lo deja abierto hasta que se pulse la X.
        toggleBtn.addEventListener('click', () => openProgress(false));
        closeBtn.addEventListener('click', closeProgress);
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeProgress(); });
    }

    function renderProgress(animate) {
        const n = completed.size;
        fill.style.setProperty('--p', (n / stages.length).toFixed(3));
        countEl.textContent = n + '/' + stages.length;
        bar.setAttribute('aria-valuenow', n);
        const txt = 'Progreso: ' + n + ' de ' + stages.length + ' secciones completadas';
        bar.setAttribute('aria-label', txt);
        bar.title = txt;
        if (animate) {
            countEl.classList.remove('bump');
            void countEl.offsetWidth;
            countEl.classList.add('bump');
        }
    }

    // Se muestra el progreso (3 s) solo la primera vez que se llega al final de cada sección.
    // Una sección solo suma al progreso la primera vez que se llega a su final.
    let lastEndIdx = -2;
    let lastCurIdx = -1;
    const enterShown = new Set();   // secciones cuyo progreso ya se mostró al entrar

    function updateProgress() {
        if (!bar) return;
        if (!countEl.textContent) renderProgress(false);
        if (Date.now() < suppressUntil) return;
        const vb = window.scrollY + window.innerHeight;

        // Al bajar por primera vez a una sección nueva se muestra el progreso (3 s).
        if (SHOW_PROGRESS_ON_ENTER) {
            const anchor = window.scrollY + 140;
            let cur = 0;
            for (let i = 0; i <= unlocked; i++) { if (stageBounds(i).top <= anchor) cur = i; }
            if (lastCurIdx < 0) lastCurIdx = cur;
            else if (cur > lastCurIdx) {
                lastCurIdx = cur;
                if (!enterShown.has(cur)) { enterShown.add(cur); flashProgress(); }   // solo la primera vez
            }
            else if (cur < lastCurIdx) lastCurIdx = cur;
        }

        let endIdx = -1;
        for (let i = 0; i <= unlocked; i++) {
            const bt = stageBounds(i).bottom;
            if (vb >= bt - 8 && vb <= bt + 8) { endIdx = i; break; }
        }
        if (endIdx === lastEndIdx) return;
        lastEndIdx = endIdx;
        if (endIdx < 0) return;
        const isNew = !completed.has(endIdx);
        completed.add(endIdx);
        if (!isNew) return;          // ya se mostró al terminar esta sección: no repetir
        renderProgress(true);
        flashProgress();
    }

    function openProgress(autoHide) {
        if (!wrap) return;
        renderProgress(false);
        wrap.classList.add('open');
        wrap.querySelector('.ova-toggle').setAttribute('aria-expanded', 'true');
        clearTimeout(hideTimer);
        if (!autoHide) { manualOpen = true; return; }
        // Si el usuario la abrió con la flechita, se queda abierta hasta que pulse la X.
        if (!manualOpen) hideTimer = setTimeout(closeProgress, PROGRESS_VISIBLE_MS);
    }

    function closeProgress() {
        if (!wrap) return;
        clearTimeout(hideTimer);
        manualOpen = false;
        wrap.classList.remove('open');
        wrap.querySelector('.ova-toggle').setAttribute('aria-expanded', 'false');
    }

    function flashProgress() { openProgress(true); }

    // Deja espacio libre al final de cada etapa (menos la última) para el botón flotante.
    function reserveButtonSpace() {
        const space = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--next-btn-space')) || 96;
        stages.forEach((els, i) => {
            if (i === last) return;
            const el = els[els.length - 1];
            el.style.paddingBottom = '';
            // Metodologías: la tarjeta verde debe quedar pegada al borde inferior de la sección,
            // así que el espacio para el botón se suma dentro de la tarjeta (más verde), no fuera.
            const box = el.classList.contains('video-hero') ? el.querySelector('.video-hero-box') : null;
            if (box) {
                box.style.paddingBottom = '';
                const bBase = parseFloat(getComputedStyle(box).paddingBottom) || 0;
                box.style.paddingBottom = Math.max(bBase, space) + 'px';
                return;
            }
            const base = parseFloat(getComputedStyle(el).paddingBottom) || 0;
            el.style.paddingBottom = (base + space) + 'px';
        });
        schedule();
    }
    reserveButtonSpace();
    window.addEventListener('resize', reserveButtonSpace);

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('load', update);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(update);
    if ('ResizeObserver' in window) new ResizeObserver(schedule).observe(document.body);
    update();
})();
