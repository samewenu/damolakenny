/* ==========================================================================
   DAMOLAKENNY PORTFOLIO — CORE LOGIC
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {
    initAuditLogs();
    initTheme();
    initMenu();
    initStickyNav();
    initGallery();
    initLightbox();
});

/* --- Safe storage (degrades in private browsing) --- */
function storageGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
}
function storageSet(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* storage unavailable */ }
}

/* --- Audit log core (ported from previous app.js, storage-guarded) --- */
function initAuditLogs() {
    if (storageGet('system-audit-logs')) return;
    const initialLogs = [{
        timestamp: new Date().toISOString(),
        actionType: 'App Mount',
        targetEntity: 'Main DOM Loaded',
        actor: 'Portfolio App',
        status: 'SUCCESS'
    }];
    storageSet('system-audit-logs', JSON.stringify(initialLogs));
}

function logAuditEvent(actionType, targetEntity, actor, status) {
    let logs = [];
    try { logs = JSON.parse(storageGet('system-audit-logs')) || []; } catch (e) { logs = []; }
    logs.unshift({
        timestamp: new Date().toISOString(),
        actionType: actionType,
        targetEntity: targetEntity,
        actor: actor,
        status: status
    });
    storageSet('system-audit-logs', JSON.stringify(logs));
}

/* --- Theme (dark default) --- */
function initTheme() {
    const toggle = document.getElementById('themeToggle');
    const saved = storageGet('portfolio-theme');
    const initial = saved === 'light-theme' ? 'light-theme' : 'dark-theme';
    document.body.classList.remove('dark-theme', 'light-theme');
    document.body.classList.add(initial);
    logAuditEvent('Theme Loaded', 'Theme initialized to: ' + initial, 'System', 'SUCCESS');
    if (!toggle) return;
    toggle.addEventListener('click', () => {
        const next = document.body.classList.contains('dark-theme') ? 'light-theme' : 'dark-theme';
        document.body.classList.remove('dark-theme', 'light-theme');
        document.body.classList.add(next);
        storageSet('portfolio-theme', next);
        logAuditEvent('Theme Toggle', 'Changed theme to: ' + next, 'User', 'SUCCESS');
    });
}

/* --- Mobile overlay menu --- */
function initMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    menuToggle.addEventListener('click', () => {
        const open = navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open', open);
        menuToggle.setAttribute('aria-expanded', String(open));
    });
    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

/* --- Sticky nav hairline --- */
function initStickyNav() {
    const header = document.getElementById('siteHeader');
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

/* --- Work gallery filters --- */
function initGallery() {
    const chips = document.querySelectorAll('.filter-chip');
    const tiles = Array.from(document.querySelectorAll('.work-tile'));
    tiles.forEach(tile => {
        const img = tile.querySelector('img');
        if (img) img.addEventListener('error', () => img.remove());
    });
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.toggle('active', c === chip));
            const filter = chip.dataset.filter;
            tiles.forEach(tile => {
                tile.hidden = filter !== 'all' && tile.dataset.category !== filter;
            });
            logAuditEvent('Gallery Filtered', 'Filter applied: ' + filter, 'User', 'SUCCESS');
        });
    });
}

/* --- Lightbox (on-site work preview) --- */
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const media = document.getElementById('lightboxMedia');
    const caption = document.getElementById('lightboxCaption');
    const closeBtn = document.getElementById('lightboxClose');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');
    const tiles = Array.from(document.querySelectorAll('.work-tile'));
    let current = 0;
    let lastFocus = null;

    function visibleTiles() { return tiles.filter(t => !t.hidden); }

    function makePlaceholder() {
        const ph = document.createElement('div');
        ph.className = 'lightbox-placeholder';
        ph.textContent = 'Sample coming soon';
        return ph;
    }

    function render(index) {
        const pool = visibleTiles();
        if (!pool.length) return;
        current = (index + pool.length) % pool.length;
        const tile = pool[current];
        const img = tile.querySelector('img');
        media.innerHTML = '';
        if (img) {
            const clone = img.cloneNode();
            clone.addEventListener('error', () => {
                if (clone.parentNode === media) media.replaceChild(makePlaceholder(), clone);
            });
            media.appendChild(clone);
        } else {
            media.appendChild(makePlaceholder());
        }
        caption.textContent = tile.dataset.title + ' — ' + tile.dataset.categoryLabel;
    }

    function open(tile) {
        lastFocus = document.activeElement;
        render(visibleTiles().indexOf(tile));
        lightbox.hidden = false;
        document.body.classList.add('no-scroll');
        closeBtn.focus();
        logAuditEvent('Lightbox Opened', 'Viewing: ' + tile.dataset.title, 'User', 'SUCCESS');
    }

    function close() {
        lightbox.hidden = true;
        document.body.classList.remove('no-scroll');
        if (lastFocus) lastFocus.focus();
    }

    tiles.forEach(tile => {
        tile.querySelector('.tile-btn').addEventListener('click', () => open(tile));
    });
    closeBtn.addEventListener('click', close);
    prevBtn.addEventListener('click', () => render(current - 1));
    nextBtn.addEventListener('click', () => render(current + 1));
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
    document.addEventListener('keydown', (e) => {
        if (lightbox.hidden) return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowLeft') render(current - 1);
        if (e.key === 'ArrowRight') render(current + 1);
        if (e.key === 'Tab') {
            const focusables = lightbox.querySelectorAll('button');
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
            else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
        }
    });
}
