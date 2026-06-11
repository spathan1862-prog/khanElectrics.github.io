/**
 * KhanElectricsStore — App Logic
 * Coordinates data loading, event listeners, theme management, and navigation.
 */

// ─── Scroll Observer for Fade-In Animations ──────────────────────────────────

const ScrollObserver = (() => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    return {
        observe: () => {
            document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
        }
    };
})();

// ─── Main App Init ────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', async () => {

    // ── Theme Management ───────────────────────────────────────────────────────
    const savedTheme = localStorage.getItem('theme') || CONFIG.defaultTheme;
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    const themeToggleEl = document.getElementById('theme-toggle');
    if (themeToggleEl) {
        themeToggleEl.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
            updateThemeIcon(next);
        });
    }

    function updateThemeIcon(theme) {
        const icon = document.getElementById('theme-icon');
        if (icon) {
            icon.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
            if (window.lucide) lucide.createIcons();
        }
    }

    // ── Mobile Menu ────────────────────────────────────────────────────────────
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    const navOverlay = document.getElementById('nav-overlay');

    function openNav()  { navLinks && navLinks.classList.add('active');    navOverlay && navOverlay.classList.add('active'); }
    function closeNav() { navLinks && navLinks.classList.remove('active'); navOverlay && navOverlay.classList.remove('active'); }

    if (hamburger) hamburger.addEventListener('click', () => navLinks.classList.contains('active') ? closeNav() : openNav());
    if (navOverlay) navOverlay.addEventListener('click', closeNav);
    document.querySelectorAll('.nav-links a').forEach(link => link.addEventListener('click', closeNav));

    // ── Navbar Scroll Effect ───────────────────────────────────────────────────
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // ── Populate Config Data ───────────────────────────────────────────────────
    const footerAddress = document.getElementById('footer-address');
    const footerPhone = document.getElementById('footer-phone');
    const footerEmail = document.getElementById('footer-email');
    const yearSpan = document.getElementById('year');
    const googleMap = document.getElementById('google-map');

    if (footerAddress) footerAddress.textContent = CONFIG.address;
    if (footerPhone) footerPhone.textContent = CONFIG.phoneNumber;
    if (footerEmail) footerEmail.textContent = CONFIG.email;
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
    if (googleMap) googleMap.src = CONFIG.mapsEmbedUrl;

    const whatsappBase = `https://wa.me/${CONFIG.whatsappNumber}`;
    const heroWhatsapp = document.getElementById('hero-whatsapp');
    const contactWhatsapp = document.getElementById('contact-whatsapp');
    if (heroWhatsapp) heroWhatsapp.href = `${whatsappBase}?text=Hi, I'm looking for professional electrical services.`;
    if (contactWhatsapp) contactWhatsapp.href = `${whatsappBase}?text=Hi, I'd like to discuss a project.`;

    // ── Render Services ────────────────────────────────────────────────────────
    const services = DataManager.getServices();
    if (UIManager && UIManager.renderServices) {
        UIManager.renderServices(services);
    }

    // ── Load Products from Firestore (with CSV fallback) ──────────────────────
    let products = [];
    try {
        // ProductsFirebase is loaded as type="module" — it may not be ready yet.
        // We wait up to 3 seconds for it.
        products = await waitForProducts();
        if (UIManager && UIManager.renderProducts) {
            UIManager.renderProducts(products);
        }
    } catch (err) {
        console.error('Failed to load products:', err);
        const grid = document.getElementById('products-grid');
        if (grid) grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;">Unable to load products. Please refresh the page.</div>';
    }

    // ── Projects ───────────────────────────────────────────────────────────────
    const projects = await DataManager.getProjects();
    if (UIManager && UIManager.renderProjects) {
        UIManager.renderProjects(projects);
    }

    // ── Testimonials ───────────────────────────────────────────────────────────
    const testimonials = await DataManager.getTestimonials();
    if (UIManager && UIManager.renderTestimonials) {
        UIManager.renderTestimonials(testimonials);
    }

    // ── Category Filter Pills ──────────────────────────────────────────────────
    let activeCategory = 'All';
    let searchQuery = '';

    const pillContainer = document.getElementById('category-pills');
    if (pillContainer) {
        pillContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('pill')) {
                document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
                e.target.classList.add('active');
                activeCategory = e.target.dataset.category;
                if (UIManager) UIManager.updateProducts(products, activeCategory, searchQuery);
            }
        });
    }

    // ── Search ─────────────────────────────────────────────────────────────────
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            if (UIManager) UIManager.updateProducts(products, activeCategory, searchQuery);
        });
    }

    // ── Badge Listeners (cart + wishlist counts) ───────────────────────────────
    window.addEventListener('cart-updated', (e) => {
        const badge = document.getElementById('nav-cart-count');
        if (badge) {
            badge.textContent = e.detail.count;
            badge.style.display = e.detail.count > 0 ? 'flex' : 'none';
        }
    });

    window.addEventListener('wishlist-updated', (e) => {
        const badge = document.getElementById('nav-wishlist-count');
        if (badge) {
            badge.textContent = e.detail.count;
            badge.style.display = e.detail.count > 0 ? 'flex' : 'none';
        }
    });

    // ── Initial Scroll Observation ─────────────────────────────────────────────
    ScrollObserver.observe();
});

// ─── Helper: Wait for ProductsFirebase Module to Load ────────────────────────
// ES modules load asynchronously; poll briefly before giving up.
function waitForProducts(timeoutMs = 5000) {
    return new Promise((resolve, reject) => {
        if (window.ProductsFirebase) {
            resolve(window.ProductsFirebase.getProducts());
            return;
        }
        const interval = 100;
        let elapsed = 0;
        const timer = setInterval(async () => {
            elapsed += interval;
            if (window.ProductsFirebase) {
                clearInterval(timer);
                resolve(await window.ProductsFirebase.getProducts());
            } else if (elapsed >= timeoutMs) {
                clearInterval(timer);
                // Last resort: try DataManager CSV fallback
                console.warn('ProductsFirebase module not available, using CSV fallback.');
                resolve(typeof DataManager !== 'undefined' ? await DataManager.getProducts() : []);
            }
        }, interval);
    });
}
