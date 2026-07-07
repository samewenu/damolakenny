/* ==========================================================================
   DAMOLAKENNY PORTFOLIO — CORE LOGIC
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {
    initAuditLogs();
    initTheme();
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
    document.body.className = saved === 'light-theme' ? 'light-theme' : 'dark-theme';
    logAuditEvent('Theme Loaded', 'Theme initialized to: ' + document.body.className, 'System', 'SUCCESS');
    if (!toggle) return;
    toggle.addEventListener('click', () => {
        const next = document.body.classList.contains('dark-theme') ? 'light-theme' : 'dark-theme';
        document.body.className = next;
        storageSet('portfolio-theme', next);
        logAuditEvent('Theme Toggle', 'Changed theme to: ' + next, 'User', 'SUCCESS');
    });
}
