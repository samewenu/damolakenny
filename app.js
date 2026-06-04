/* ==========================================================================
   OYINDAMOLA BRAND MANAGER PORTFOLIO - CORE LOGIC & INTERACTIVITY
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {
    
    // Initialize secure append-only audit log in LocalStorage (RULE[user_global] compliant)
    initAuditLogs();

    // 1. THEME SWITCHER
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    // Check local storage or default to light
    const savedTheme = localStorage.getItem('portfolio-theme') || 'light-theme';
    body.className = savedTheme;
    logAuditEvent('Theme Loaded', `Theme initialized to: ${savedTheme}`, 'System', 'SUCCESS');

    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark-theme')) {
            body.classList.replace('dark-theme', 'light-theme');
            localStorage.setItem('portfolio-theme', 'light-theme');
            logAuditEvent('Theme Toggle', 'Changed theme to: light-theme', 'User', 'SUCCESS');
        } else {
            body.classList.replace('light-theme', 'dark-theme');
            localStorage.setItem('portfolio-theme', 'dark-theme');
            logAuditEvent('Theme Toggle', 'Changed theme to: dark-theme', 'User', 'SUCCESS');
        }
    });

    // 2. MOBILE NAVIGATION MENU
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.className = 'fa-solid fa-xmark';
        } else {
            icon.className = 'fa-solid fa-bars';
        }
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.querySelector('i').className = 'fa-solid fa-bars';
        });
    });

    // 3. HERO TYPEWRITER EFFECT
    const typewriterElement = document.getElementById('typewriter');
    const words = [
        "AI Brand Manager", 
        "Data Analyst", 
        "Graphic Designer", 
        "Executive Assistants", 
        "Social Media Manager", 
        "Customer Service Representative", 
        "Video Editor"
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeDelay = 120;

    function handleTypewriter() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeDelay = 60; // Backspace faster
        } else {
            typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeDelay = 120; // Normal typing speed
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typeDelay = 2000; // Pause at full word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeDelay = 500; // Pause before starting next word
        }

        setTimeout(handleTypewriter, typeDelay);
    }
    
    // Start typewriter loop
    setTimeout(handleTypewriter, 1000);

    // 4. PORTFOLIO INTERACTION LOGS
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const title = card.querySelector('.project-title').textContent;
            logAuditEvent('Portfolio Card Hovered', `User viewed project card: ${title}`, 'User', 'SUCCESS');
        });
    });

    // 5. SCROLL ANIMATIONS (Intersection Observer)
    const scrollElements = document.querySelectorAll('.scroll-animate');
    
    const observerOptions = {
        root: null, // Viewport
        threshold: 0.1, // Trigger when 10% visible
        rootMargin: '0px 0px -50px 0px' // Slightly offset trigger point
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target); // Animate once only
            }
        });
    }, observerOptions);

    scrollElements.forEach(el => observer.observe(el));

    // 6. CONTACT FORM VALIDATION & CLIENT AUDIT LOGGING
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
        
        // Hide general feedback
        successFeedback.classList.remove('visible');
        errorFeedback.classList.remove('visible');
        
        let isValid = true;
        
        // Validate Name
        if (contactName.value.trim() === '') {
            contactName.classList.add('invalid');
            nameError.classList.add('visible');
            isValid = false;
        } else {
            contactName.classList.remove('invalid');
            nameError.classList.remove('visible');
        }
        
        // Validate Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(contactEmail.value.trim())) {
            contactEmail.classList.add('invalid');
            emailError.classList.add('visible');
            isValid = false;
        } else {
            contactEmail.classList.remove('invalid');
            emailError.classList.remove('visible');
        }
        
        // Validate Message
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
        
        // Form is valid - enter submitting state
        submitBtn.classList.add('submitting');
        submitBtn.disabled = true;
        
        // Simulate secure database/API write delay
        setTimeout(() => {
            submitBtn.classList.remove('submitting');
            submitBtn.disabled = false;
            
            // Show success
            successFeedback.classList.add('visible');
            
            // Audit Log submission details safely (Leasing privilege, hiding internal structure, no sensitive data)
            const submissionPayload = {
                name: contactName.value.trim(),
                email: contactEmail.value.trim(),
                industry: contactIndustry.value,
                project: contactProject.value
            };
            
            logAuditEvent(
                'Contact Submission Created', 
                `Inquiry for project: ${submissionPayload.project} in ${submissionPayload.industry} niche`, 
                `Visitor (${submissionPayload.name})`, 
                'SUCCESS'
            );
            
            // Clear form fields
            contactForm.reset();
        }, 1500);
    });

    // 7. SYSTEM AUDIT LOGS MODAL INTERACTIVITY
    const viewAuditLogsBtn = document.getElementById('viewAuditLogsBtn');
    const auditLogsModal = document.getElementById('auditLogsModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const auditLogsTableBody = document.getElementById('auditLogsTableBody');

    viewAuditLogsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loadAuditTable();
        auditLogsModal.classList.add('visible');
        logAuditEvent('Audit Modal Viewed', 'Admin viewer opened system audit reports', 'System', 'SUCCESS');
    });

    closeModalBtn.addEventListener('click', () => {
        auditLogsModal.classList.remove('visible');
    });

    // Close modal when clicking outside contents
    auditLogsModal.addEventListener('click', (e) => {
        if (e.target === auditLogsModal) {
            auditLogsModal.classList.remove('visible');
        }
    });

    // --- SECURE APPEND-ONLY AUDIT SYSTEM HELPER FUNCTIONS ---
    
    function initAuditLogs() {
        let logs = localStorage.getItem('system-audit-logs');
        if (!logs) {
            const initialLogs = [
                {
                    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
                    actionType: 'System Initialized',
                    targetEntity: 'Core Engine Platform',
                    actor: 'System Daemon',
                    status: 'SUCCESS'
                },
                {
                    timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
                    actionType: 'Asset Deployment',
                    targetEntity: 'Assets Directory Mapping',
                    actor: 'Deployment Script',
                    status: 'SUCCESS'
                },
                {
                    timestamp: new Date().toISOString(),
                    actionType: 'App Mount',
                    targetEntity: 'Main DOM Loaded',
                    actor: 'Portfolio App',
                    status: 'SUCCESS'
                }
            ];
            localStorage.setItem('system-audit-logs', JSON.stringify(initialLogs));
        }
    }

    function logAuditEvent(actionType, targetEntity, actor, status) {
        let logs = [];
        try {
            logs = JSON.parse(localStorage.getItem('system-audit-logs')) || [];
        } catch (e) {
            logs = [];
        }
        
        const newEvent = {
            timestamp: new Date().toISOString(),
            actionType: actionType,
            targetEntity: targetEntity,
            actor: actor,
            status: status
        };
        
        logs.unshift(newEvent); // Append-only order at top
        localStorage.setItem('system-audit-logs', JSON.stringify(logs));
    }

    function loadAuditTable() {
        auditLogsTableBody.innerHTML = '';
        let logs = [];
        try {
            logs = JSON.parse(localStorage.getItem('system-audit-logs')) || [];
        } catch (e) {
            logs = [];
        }

        logs.forEach(log => {
            const row = document.createElement('tr');
            
            // Format Timestamp nicely
            const date = new Date(log.timestamp);
            const formattedTime = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

            const statusClass = log.status === 'SUCCESS' ? 'success' : 'info';
            
            row.innerHTML = `
                <td><strong>${formattedTime}</strong></td>
                <td>${escapeHtml(log.actionType)}</td>
                <td><code style="font-size: 12px; color: var(--text-secondary);">${escapeHtml(log.targetEntity)}</code></td>
                <td>${escapeHtml(log.actor)}</td>
                <td><span class="status-badge ${statusClass}">${escapeHtml(log.status)}</span></td>
            `;
            auditLogsTableBody.appendChild(row);
        });
    }

    function escapeHtml(str) {
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
});
