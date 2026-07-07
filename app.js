/* ==========================================================================
   DAMOLAKENNY PORTFOLIO — CORE LOGIC
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {
    initAuditLogs();
    initTheme();
    initMenu();
    initStickyNav();
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
