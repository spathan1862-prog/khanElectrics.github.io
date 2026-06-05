/**
 * SK Electrical Services - App Logic
 * Coordination, Event Listeners, and Theme Management.
 */

const ScrollObserver = (() => {
    const options = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, options);

    return {
        observe: () => {
            document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
        }
    };
})();

document.addEventListener('DOMContentLoaded', async () => {

    // ─── Theme Management ───
    const currentTheme = localStorage.getItem('theme') || CONFIG.defaultTheme;
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    UIManager.elements.themeToggle.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        updateThemeIcon(theme);
    });

    function updateThemeIcon(theme) {
        const iconName = theme === 'dark' ? 'sun' : 'moon';
        UIManager.elements.themeIcon.setAttribute('data-lucide', iconName);
        lucide.createIcons();
    }

    // ─── Mobile Menu ───
    UIManager.elements.hamburger.addEventListener('click', () => {
        UIManager.elements.navLinks.classList.toggle('active');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            UIManager.elements.navLinks.classList.remove('active');
        });
    });

    // ─── Navbar Scroll Effect ───
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            UIManager.elements.header.classList.add('scrolled');
        } else {
            UIManager.elements.header.classList.remove('scrolled');
        }
    });

    // ─── Dynamic Data Loading ───

    // Populate simple info from config
    document.getElementById('footer-address').textContent = CONFIG.address;
    document.getElementById('footer-phone').textContent = CONFIG.phoneNumber;
    document.getElementById('footer-email').textContent = CONFIG.email;
    document.getElementById('year').textContent = new Date().getFullYear();
    document.getElementById('google-map').src = CONFIG.mapsEmbedUrl;

    const whatsappLink = `https://wa.me/${CONFIG.whatsappNumber}`;
    document.getElementById('hero-whatsapp').href = `${whatsappLink}?text=Hi, I'm looking for professional electrical services.`;
    document.getElementById('contact-whatsapp').href = `${whatsappLink}?text=Hi, I'd like to discuss a project.`;

    // Fetch and render sections
    const services = DataManager.getServices();
    UIManager.renderServices(services);

    const products = await DataManager.getProducts();
    UIManager.renderProducts(products);

    const projects = await DataManager.getProjects();
    UIManager.renderProjects(projects);

    const testimonials = await DataManager.getTestimonials();
    UIManager.renderTestimonials(testimonials);

    // ─── Filters & Search Listeners ───
    let activeCategory = 'All';
    let searchQuery = '';

    UIManager.elements.pillContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('pill')) {
            document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
            e.target.classList.add('active');
            activeCategory = e.target.dataset.category;
            UIManager.updateProducts(products, activeCategory, searchQuery);
        }
    });

    UIManager.elements.searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        UIManager.updateProducts(products, activeCategory, searchQuery);
    });

    // Initial Observation
    ScrollObserver.observe();
});
