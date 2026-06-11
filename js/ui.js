/**
 * SK Electrical Services - UI Rendering
 * Handles creating HTML for cards and grids.
 */

const UIManager = (() => {

    const elements = {
        servicesGrid: document.getElementById('services-grid'),
        productsGrid: document.getElementById('products-grid'),
        projectsGrid: document.getElementById('projects-grid'),
        testimonialsGrid: document.getElementById('testimonials-grid'),
        pillContainer: document.getElementById('category-pills'),
        searchInput: document.getElementById('search-input'),
        header: document.getElementById('header'),
        themeToggle: document.getElementById('theme-toggle'),
        themeIcon: document.getElementById('theme-icon'),
        hamburger: document.getElementById('hamburger'),
        navLinks: document.getElementById('nav-links'),
        googleMap: document.getElementById('google-map'),
        yearSpan: document.getElementById('year')
    };

    /**
     * Render a service card
     */
    function createServiceCard(service) {
        return `
            <div class="card fade-up">
                <div class="card-img">
                    <img src="${service.image}" alt="${service.name}" loading="lazy">
                </div>
                <div class="card-body">
                    <div class="card-category">Service</div>
                    <h3 class="card-name">${service.name}</h3>
                    <p class="card-text">${service.description}</p>
                    <div class="card-footer">
                        <a href="https://wa.me/${CONFIG.whatsappNumber}?text=Hi, I want to book a ${service.name} service." target="_blank" class="btn-outline">
                            <i data-lucide="message-circle"></i> Contact
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Render a product card
     */
    function createProductCard(product) {
        // Stringify the product object to pass it to inline onclick handlers safely
        const productJson = JSON.stringify(product).replace(/"/g, '&quot;');
        
        // Ensure price formatting
        const formattedPrice = product.price ? product.price : 'N/A';
        
        return `
            <div class="card fade-up">
                <div class="card-img">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    <div style="position: absolute; top: 12px; right: 12px; padding: 4px 12px; background: ${product.status?.toLowerCase() === 'available' ? 'var(--primary)' : '#64748b'}; color: #000; border-radius: 50px; font-size: 0.7rem; font-weight: 700;">
                        ${product.status || 'Available'}
                    </div>
                </div>
                <div class="card-body">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div class="card-category">${product.category}</div>
                        <button onclick="if(window.WishlistManager) { const isAdded = window.WishlistManager.toggleWishlist(${productJson}); this.querySelector('i').style.fill = isAdded ? 'currentColor' : 'none'; }" style="background: none; border: none; cursor: pointer; color: var(--primary);" aria-label="Toggle Wishlist">
                            <i data-lucide="heart" style="fill: none; transition: fill 0.2s;"></i>
                        </button>
                    </div>
                    <h3 class="card-name">${product.name}</h3>
                    <p class="card-text">${product.description || product.details || ''}</p>
                    <div class="card-footer">
                        <div class="card-price">₹${formattedPrice}</div>
                        <button onclick="if(window.CartManager) { window.CartManager.addToCart(${productJson}); }" class="btn-outline" style="padding: 8px 16px; cursor: pointer;">
                            <i data-lucide="shopping-cart"></i> Add
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Render a project card
     */
    function createProjectCard(project) {
        return `
            <div class="card fade-up" style="border-radius: 24px;">
                <div class="card-img" style="height: 250px;">
                    <img src="${project.image}" alt="${project.name}" loading="lazy">
                </div>
                <div style="padding: 20px;">
                    <h3 class="card-name">${project.name}</h3>
                    <p class="card-text">${project.description}</p>
                </div>
            </div>
        `;
    }

    /**
     * Render a testimonial card
     */
    function createTestimonialCard(t) {
        const stars = Array(5).fill('').map((_, i) =>
            `<i data-lucide="star" style="fill: ${i < t.rating ? '#fbbf24' : 'none'}; width: 14px; height: 14px;"></i>`
        ).join('');

        return `
            <div class="testimonial-card fade-up">
                <div class="stars">${stars}</div>
                <p class="card-text" style="font-style: italic; font-size: 1rem; color: var(--text-main); margin-bottom: 24px;">"${t.review}"</p>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 40px; height: 40px; background: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; color: #000;">
                        ${t.name.charAt(0)}
                    </div>
                    <div style="font-weight: 600;">${t.name}</div>
                </div>
            </div>
        `;
    }

    /**
     * Update product UI with filters and search
     */
    function updateProducts(products, category = 'All', search = '') {
        let filtered = products;

        if (category !== 'All') {
            filtered = filtered.filter(p => p.category === category);
        }

        if (search) {
            filtered = filtered.filter(p =>
                (p.name || '').toLowerCase().includes(search.toLowerCase()) ||
                (p.description || p.details || '').toLowerCase().includes(search.toLowerCase())
            );
        }

        elements.productsGrid.innerHTML = filtered.length > 0
            ? filtered.map(p => createProductCard(p)).join('')
            : `<div style="grid-column: 1/-1; text-align: center; padding: 40px;">No products found for "${search}" in ${category}.</div>`;

        lucide.createIcons();
        ScrollObserver.observe(); // Re-observe new elements
    }

    return {
        renderServices: (services) => {
            elements.servicesGrid.innerHTML = services.map(s => createServiceCard(s)).join('');
            lucide.createIcons();
        },
        renderProducts: (products) => {
            // Get unique categories for pills
            const categories = ['All', ...new Set(products.map(p => p.category))];
            elements.pillContainer.innerHTML = categories.map(cat =>
                `<div class="pill ${cat === 'All' ? 'active' : ''}" data-category="${cat}">${cat}</div>`
            ).join('');

            updateProducts(products);
        },
        renderProjects: (projects) => {
            if (projects.length === 0) {
                elements.projectsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center;">Coming soon...</div>';
                return;
            }
            elements.projectsGrid.innerHTML = projects.map(p => createProjectCard(p)).join('');
            lucide.createIcons();
        },
        renderTestimonials: (testimonials) => {
            if (testimonials.length === 0) {
                elements.testimonialsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center;">Our customers love our work! Reviews appear here soon.</div>';
                return;
            }
            elements.testimonialsGrid.innerHTML = testimonials.map(t => createTestimonialCard(t)).join('');
            lucide.createIcons();
        },
        updateProducts,
        elements
    };

})();
