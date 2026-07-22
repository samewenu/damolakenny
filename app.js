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
    initContactForm();
    initAuditModal();
    initReveal();
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
    const initial = saved === 'dark-theme' ? 'dark-theme' : 'light-theme';
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
        if (!img) return;
        img.addEventListener('error', () => img.remove());
        if (img.complete && img.naturalWidth === 0) img.remove();
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
        if (tile.dataset.video) {
            const frame = document.createElement('iframe');
            frame.className = 'lightbox-video';
            frame.src = 'https://www.youtube-nocookie.com/embed/' + tile.dataset.video + '?rel=0';
            frame.title = tile.dataset.title;
            frame.setAttribute('allow', 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
            frame.setAttribute('allowfullscreen', '');
            media.appendChild(frame);
        } else if (img) {
            const clone = img.cloneNode();
            clone.addEventListener('error', () => {
                if (clone.parentNode === media) media.replaceChild(makePlaceholder(), clone);
            });
            media.appendChild(clone);
        } else {
            media.appendChild(makePlaceholder());
        }
        caption.textContent = tile.dataset.title + ' · ' + tile.dataset.categoryLabel;
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

/* --- Contact form validation (ported) --- */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const contactName = document.getElementById('contactName');
    const contactEmail = document.getElementById('contactEmail');
    const contactIndustry = document.getElementById('contactIndustry');
    const contactProject = document.getElementById('contactProject');
    const contactMessage = document.getElementById('contactMessage');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');
    const successFeedback = document.getElementById('formSuccessFeedback');
    const errorFeedback = document.getElementById('formErrorFeedback');
    const submitBtn = document.getElementById('contactSubmitBtn');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        successFeedback.classList.remove('visible');
        errorFeedback.classList.remove('visible');
        let isValid = true;

        if (contactName.value.trim() === '') {
            contactName.classList.add('invalid');
            nameError.classList.add('visible');
            isValid = false;
        } else {
            contactName.classList.remove('invalid');
            nameError.classList.remove('visible');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(contactEmail.value.trim())) {
            contactEmail.classList.add('invalid');
            emailError.classList.add('visible');
            isValid = false;
        } else {
            contactEmail.classList.remove('invalid');
            emailError.classList.remove('visible');
        }

        if (contactMessage.value.trim() === '') {
            contactMessage.classList.add('invalid');
            messageError.classList.add('visible');
            isValid = false;
        } else {
            contactMessage.classList.remove('invalid');
            messageError.classList.remove('visible');
        }

        if (!isValid) {
            errorFeedback.classList.add('visible');
            logAuditEvent('Contact Submission Rejected', 'Validation failed on inputs', 'User', 'VALIDATION_FAILED');
            return;
        }

        submitBtn.classList.add('submitting');
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.classList.remove('submitting');
            submitBtn.disabled = false;
            successFeedback.classList.add('visible');
            logAuditEvent(
                'Contact Submission Created',
                'Inquiry for project: ' + contactProject.value + ' in ' + contactIndustry.value + ' niche',
                'Visitor (' + contactName.value.trim() + ')',
                'SUCCESS'
            );
            contactForm.reset();
        }, 1500);
    });
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/* --- Audit log modal (ported) --- */
function initAuditModal() {
    const viewAuditLogsBtn = document.getElementById('viewAuditLogsBtn');
    const auditLogsModal = document.getElementById('auditLogsModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const auditLogsTableBody = document.getElementById('auditLogsTableBody');

    let lastFocus = null;

    function openModal() {
        lastFocus = document.activeElement;
        loadAuditTable();
        auditLogsModal.classList.add('visible');
        closeModalBtn.focus();
        logAuditEvent('Audit Modal Viewed', 'Admin viewer opened system audit reports', 'System', 'SUCCESS');
    }

    function closeModal() {
        auditLogsModal.classList.remove('visible');
        if (lastFocus) lastFocus.focus();
    }

    viewAuditLogsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
    });
    closeModalBtn.addEventListener('click', closeModal);
    auditLogsModal.addEventListener('click', (e) => {
        if (e.target === auditLogsModal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (!auditLogsModal.classList.contains('visible')) return;
        if (e.key === 'Escape') closeModal();
        if (e.key === 'Tab') {
            const focusables = auditLogsModal.querySelectorAll('button, [tabindex="0"]');
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
            else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
        }
    });

    function loadAuditTable() {
        auditLogsTableBody.innerHTML = '';
        let logs = [];
        try { logs = JSON.parse(storageGet('system-audit-logs')) || []; } catch (err) { logs = []; }
        logs.forEach(log => {
            const row = document.createElement('tr');
            const date = new Date(log.timestamp);
            const formattedTime = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const statusClass = log.status === 'SUCCESS' ? 'success' : 'info';
            row.innerHTML =
                '<td><strong>' + escapeHtml(formattedTime) + '</strong></td>' +
                '<td>' + escapeHtml(log.actionType) + '</td>' +
                '<td>' + escapeHtml(log.targetEntity) + '</td>' +
                '<td>' + escapeHtml(log.actor) + '</td>' +
                '<td><span class="status-badge ' + statusClass + '">' + escapeHtml(log.status) + '</span></td>';
            auditLogsTableBody.appendChild(row);
        });
    }
}

/* --- Scroll reveal --- */
function initReveal() {
    const els = document.querySelectorAll('.reveal');
    const reveal = el => el.classList.add('in-view');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
        els.forEach(reveal);
        return;
    }
    const inViewport = el => {
        const r = el.getBoundingClientRect();
        return r.top < window.innerHeight && r.bottom > 0;
    };
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                reveal(entry.target);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => {
        if (inViewport(el)) reveal(el);   // show above-the-fold content immediately
        else observer.observe(el);
    });
    // Failsafe: never leave content permanently hidden if the observer never fires.
    setTimeout(() => els.forEach(reveal), 3000);
}
