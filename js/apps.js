/**
 * Khan Services — Apps Page Logic
 * ─────────────────────────────────
 * All application data lives in the `apps` array below.
 * To add a new app: push a new object into the array.
 *
 * Object schema:
 * {
 *   id        : string  – unique kebab-case identifier
 *   name      : string  – display name
 *   description: string – short description shown on the card
 *   version   : string  – e.g. "1.0.0"
 *   platform  : string  – "Windows" | "Android" | "iOS" | "Web"
 *   size      : string  – e.g. "96 MB"
 *   updated   : string  – e.g. "June 2026"
 *   icon      : string  – path relative to apps.html, e.g. "images/apps/medical.png"
 *                         Set to "" to use the default platform icon.
 *   download  : string  – path to installer, e.g. "downloads/MedicalSetup.exe"
 *                         Ignored when available === false.
 *   available : boolean – false → shows "Coming Soon" badge instead of Download button
 * }
 */

const apps = [
    {
        id: "medical-management",
        name: "MedicoManager",
        description: "Complete medical store management solution with inventory tracking, billing, and patient records.",
        version: "2.0.0",
        platform: "Windows",
        size: "77.5 MB",
        updated: "June 2026",
        icon: "",
        download: "downloads/MedicoManager Setup 2.0.0.exe",
        available: true
    },
    {
        id: "medical-management-android",
        name: "MedicoManager",
        description: "Complete medical store management solution with inventory tracking, billing, and patient records optimized for Android devices.",
        version: "1.0.0",
        platform: "Android",
        size: "15.4 MB",
        updated: "June 2026",
        icon: "",
        download: "downloads/MedicoManager.apk",
        available: true
    },
    {
        id: "shayari-world-android",
        name: "Shayari World",
        description: "Feel Poetry, Feel Emotion. Read beautiful shayaris, generate poetry using AI, and browse premium ebooks.",
        version: "1.0.0",
        platform: "Android",
        size: "1.0 MB",
        updated: "June 2026",
        icon: "images/apps/shayari.png",
        download: "downloads/ShayariWorld.apk",
        available: true
    }
    // ── Add more apps below this line ────────────────────────────────────────
    // Example:
    // {
    //     id: "billing-software",
    //     name: "Billing Software",
    //     description: "Fast and reliable billing solution for small shops.",
    //     version: "2.1.0",
    //     platform: "Windows",
    //     size: "48 MB",
    //     updated: "July 2026",
    //     icon: "images/apps/billing.png",
    //     download: "downloads/BillingSetup.exe",
    //     available: true
    // },
    // {
    //     id: "field-tracker",
    //     name: "Field Tracker",
    //     description: "Track field workers and job status in real-time.",
    //     version: "0.9.0",
    //     platform: "Android",
    //     size: "22 MB",
    //     updated: "August 2026",
    //     icon: "images/apps/tracker.png",
    //     download: "downloads/FieldTracker.apk",
    //     available: false
    // }
];

// ─── Platform Icon Map ────────────────────────────────────────────────────────
const platformIcons = {
    "Windows": "monitor",
    "Android": "smartphone",
    "iOS":     "smartphone",
    "Web":     "globe"
};

// ─── Platform Color Map ───────────────────────────────────────────────────────
const platformColors = {
    "Windows": "#3b82f6",
    "Android": "#22c55e",
    "iOS":     "#a855f7",
    "Web":     "#f59e0b"
};

// ─── Build a single app card ──────────────────────────────────────────────────
function buildAppCard(app) {
    const icon     = platformIcons[app.platform]  || "package";
    const color    = platformColors[app.platform] || "var(--primary)";
    const hasIcon  = app.icon && app.icon.trim() !== "";

    const iconHTML = hasIcon
        ? `<img src="${app.icon}" alt="${app.name} icon" class="app-card__icon-img" loading="lazy">`
        : `<span class="app-card__icon-placeholder" style="color:${color}">
               <i data-lucide="${icon}"></i>
           </span>`;

    const downloadHTML = app.available
        ? `<a href="${app.download}"
              class="app-card__btn"
              download
              id="download-${app.id}"
              aria-label="Download ${app.name}">
               <i data-lucide="download"></i>
               Download
           </a>`
        : `<span class="app-card__coming-soon" aria-label="Coming Soon">
               <i data-lucide="clock"></i>
               Coming Soon
           </span>`;

    return `
    <article class="app-card fade-up" id="app-${app.id}" aria-label="${app.name}">
        <div class="app-card__icon-wrap" style="--accent:${color}">
            ${iconHTML}
        </div>

        <div class="app-card__body">
            <span class="app-card__platform" style="color:${color}">
                <i data-lucide="${icon}"></i>
                ${app.platform}
            </span>
            <h2 class="app-card__name">${app.name}</h2>
            <p class="app-card__desc">${app.description}</p>

            <ul class="app-card__meta" aria-label="App details">
                <li>
                    <span class="app-card__meta-label">Version</span>
                    <span class="app-card__meta-value">${app.version}</span>
                </li>
                <li>
                    <span class="app-card__meta-label">Size</span>
                    <span class="app-card__meta-value">${app.size}</span>
                </li>
                <li>
                    <span class="app-card__meta-label">Updated</span>
                    <span class="app-card__meta-value">${app.updated}</span>
                </li>
            </ul>
        </div>

        <div class="app-card__footer">
            ${downloadHTML}
        </div>
    </article>`;
}

// ─── Render all app cards ─────────────────────────────────────────────────────
function renderApps() {
    const grid = document.getElementById('apps-grid');
    if (!grid) return;

    if (apps.length === 0) {
        grid.innerHTML = `
        <div class="apps-empty" role="status">
            <i data-lucide="package" aria-hidden="true"></i>
            <h3>No Apps Yet</h3>
            <p>Check back soon — we're working on something great!</p>
        </div>`;
    } else {
        grid.innerHTML = apps.map(buildAppCard).join('');
    }

    // Update count label
    const countEl = document.getElementById('apps-count');
    if (countEl) {
        const available = apps.filter(a => a.available).length;
        const total     = apps.length;
        countEl.innerHTML = total === 0
            ? ''
            : `<strong>${total}</strong> application${total !== 1 ? 's' : ''} &mdash; <strong>${available}</strong> available for download`;
    }

    // Re-initialise Lucide icons for newly-inserted elements
    if (window.lucide) lucide.createIcons();
}

// ─── Theme Management (mirrors app.js logic) ──────────────────────────────────
function initTheme() {
    // Read saved theme from localStorage (same key as main site)
    const saved = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    updateThemeIcon(saved);

    const btn = document.getElementById('theme-toggle');
    if (btn) {
        btn.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const next    = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
            updateThemeIcon(next);
        });
    }
}

function updateThemeIcon(theme) {
    const icon = document.getElementById('theme-icon');
    if (icon) {
        icon.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
        if (window.lucide) lucide.createIcons();
    }
}

// ─── Scroll Fade Animations ───────────────────────────────────────────────────
function initScrollObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}

// ─── Mobile Menu ──────────────────────────────────────────────────────────────
function initMobileMenu() {
    const hamburger  = document.getElementById('hamburger');
    const navLinks   = document.getElementById('nav-links');
    const navOverlay = document.getElementById('nav-overlay');

    const open  = () => { navLinks?.classList.add('active');    navOverlay?.classList.add('active'); };
    const close = () => { navLinks?.classList.remove('active'); navOverlay?.classList.remove('active'); };

    hamburger?.addEventListener('click', () =>
        navLinks?.classList.contains('active') ? close() : open()
    );
    navOverlay?.addEventListener('click', close);
    document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', close));
}

// ─── Header Scroll Effect ─────────────────────────────────────────────────────
function initHeaderScroll() {
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () =>
            header.classList.toggle('scrolled', window.scrollY > 50)
        );
    }
}

// ─── Footer Year ──────────────────────────────────────────────────────────────
function initFooterYear() {
    const y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
}

// ─── Boot ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileMenu();
    initHeaderScroll();
    initFooterYear();
    renderApps();
    // Observe after render so dynamically-added .fade-up elements are captured
    setTimeout(initScrollObserver, 50);
});
