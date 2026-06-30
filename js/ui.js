/**
 * SK Electrical Services - UI Rendering
 * Handles creating HTML for cards and grids.
 */

const UIManager = (() => {

    // Product map: used to safely pass product objects without inline JSON in HTML
    const _productMap = {};
    let _cardSeq = 0;

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
        const isTour = service.name === "Tour & Travels";
        const linkHref = isTour ? "tour.html" : `https://wa.me/${CONFIG.whatsappNumber}?text=Hi, I want to book a ${service.name} service.`;
        const linkTarget = isTour ? "" : 'target="_blank"';
        const buttonText = isTour ? "View Places" : "Contact";
        const buttonIcon = isTour ? "map" : "message-circle";
        
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
                        <a href="${linkHref}" ${linkTarget} class="btn-outline">
                            <i data-lucide="${buttonIcon}"></i> ${buttonText}
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
        // Assign a unique card id and store the product object safely (no JSON-in-HTML)
        const cardId = 'pcard-' + (++_cardSeq);
        _productMap[cardId] = product;

        // Ensure price formatting
        const formattedPrice = product.price ? product.price : 'N/A';

        // Determine out-of-stock from the STATUS STRING (admin saves status, not a numeric stock field)
        const statusRaw = (product.status || 'Available').trim();
        const isOutOfStock = statusRaw.toLowerCase() === 'out of stock';
        const statusText = statusRaw;
        const statusColor = isOutOfStock ? '#ef4444' : 'var(--primary)';
        const textColor = isOutOfStock ? '#fff' : '#000';

        const addBtnText = isOutOfStock ? 'Out of Stock' : '<i data-lucide="shopping-cart"></i> Add';
        const addBtnDisabled = isOutOfStock ? 'disabled' : '';

        return `
            <div class="card fade-up" id="${cardId}" style="cursor: pointer;">
                <div class="card-img">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    <div style="position: absolute; top: 12px; right: 12px; padding: 4px 12px; background: ${statusColor}; color: ${textColor}; border-radius: 50px; font-size: 0.7rem; font-weight: 700;">
                        ${statusText}
                    </div>
                </div>
                <div class="card-body">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div class="card-category">${product.category}</div>
                        <button class="card-wishlist-btn" data-card="${cardId}" style="background: none; border: none; cursor: pointer; color: var(--primary);" aria-label="Toggle Wishlist">
                            <i data-lucide="heart" style="fill: none; transition: fill 0.2s;"></i>
                        </button>
                    </div>
                    <h3 class="card-name">${product.name}</h3>
                    <p class="card-text">${product.description || product.details || ''}</p>
                    <div class="card-footer">
                        <div class="card-price">₹${formattedPrice}</div>
                        <button class="btn-outline card-add-btn" data-card="${cardId}" style="padding: 8px 16px; cursor: pointer;" ${addBtnDisabled}>
                            ${addBtnText}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Attach event listeners to all rendered product cards.
     * Called after innerHTML is set so elements exist in DOM.
     */
    function attachCardListeners(container) {
        // Card click → open product details modal
        container.querySelectorAll('.card.fade-up[id^="pcard-"]').forEach(card => {
            card.addEventListener('click', () => {
                const product = _productMap[card.id];
                if (product) UIManager.showProductDetails(product);
            });
        });

        // Add-to-cart buttons
        container.querySelectorAll('.card-add-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const product = _productMap[btn.dataset.card];
                if (product && window.CartManager) window.CartManager.addToCart(product);
            });
        });

        // Wishlist buttons
        container.querySelectorAll('.card-wishlist-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const product = _productMap[btn.dataset.card];
                if (product && window.WishlistManager) {
                    const isAdded = window.WishlistManager.toggleWishlist(product);
                    const icon = btn.querySelector('i');
                    if (icon) icon.style.fill = isAdded ? 'currentColor' : 'none';
                }
            });
        });
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
        attachCardListeners(elements.productsGrid); // wire up safe event listeners
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
        showProductDetails: (product) => {
            // Remove existing modal if any
            const existingModal = document.getElementById('product-details-modal');
            if (existingModal) existingModal.remove();

            // Use the status string field — same field admin saves
            const isOutOfStock = (product.status || '').trim().toLowerCase() === 'out of stock';
            const price = parseFloat(product.price) || 0;
            const deliveryCharge = 49;
            const tax = 18;
            const totalAmount = price + deliveryCharge + tax;

            const modalHtml = `
            <div id="product-details-modal" class="modal active" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); backdrop-filter:blur(10px); display:flex; align-items:center; justify-content:center; z-index:9999; animation:fadeIn 0.3s ease;">
                <div class="modal-content" style="max-width:550px; width:90%; background:var(--bg-card); border:1px solid var(--border); border-radius:24px; padding:30px; position:relative; box-shadow:var(--shadow); animation:slideInUp 0.3s ease;">
                    <button onclick="document.getElementById('product-details-modal').remove()" style="position:absolute; top:20px; right:20px; background:none; border:none; color:var(--text-muted); cursor:pointer; font-size:1.5rem;" aria-label="Close">
                        <i data-lucide="x"></i>
                    </button>
                    <div style="display:flex; flex-direction:column; gap:20px; align-items:center;">
                        <img src="${product.image}" alt="${product.name}" style="width:100%; max-height:260px; object-fit:cover; border-radius:16px;">
                        <div style="width:100%;">
                            <span style="background:var(--primary-glow); color:var(--primary); padding:4px 12px; border-radius:50px; font-size:0.75rem; font-weight:700; text-transform:uppercase;">${product.category}</span>
                            <h2 style="font-size:1.6rem; margin-top:10px; color:var(--text-main);">${product.name}</h2>
                            <p style="color:var(--text-muted); margin-top:10px; font-size:0.95rem; line-height:1.6;">${product.description || product.details || 'No description available.'}</p>
                            
                            <div style="margin-top:20px; border-top:1px solid var(--border); border-bottom:1px solid var(--border); padding:16px 0;">
                                <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                                    <span>Product Price</span>
                                    <span style="font-weight:600;">₹${price.toFixed(2)}</span>
                                </div>
                                <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                                    <span>Delivery Charge</span>
                                    <span style="font-weight:600;">₹${deliveryCharge.toFixed(2)}</span>
                                </div>
                                <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                                    <span>Tax</span>
                                    <span style="font-weight:600;">₹${tax.toFixed(2)}</span>
                                </div>
                                <div style="display:flex; justify-content:space-between; font-size:1.2rem; font-weight:700; color:var(--primary); margin-top:12px; border-top:1px dashed var(--border); padding-top:12px;">
                                    <span>Total Amount</span>
                                    <span>₹${totalAmount.toFixed(2)}</span>
                                </div>
                            </div>

                            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:20px;">
                                <button id="modal-add-to-cart-btn" class="btn-primary" style="justify-content:center; padding:12px;" ${isOutOfStock ? 'disabled' : ''}>
                                    <i data-lucide="shopping-cart"></i> Add to Cart
                                </button>
                                <button id="modal-wishlist-btn" class="btn-outline" style="justify-content:center; padding:12px;">
                                    <i data-lucide="heart"></i> Wishlist
                                </button>
                            </div>
                            <button id="modal-order-now-btn" class="btn-primary btn-full" style="justify-content:center; margin-top:12px; padding:14px; background:#22c55e; color:#fff; border-color:#22c55e;" ${isOutOfStock ? 'disabled style="opacity:0.6; cursor:not-allowed;"' : ''}>
                                <i data-lucide="check-circle"></i> Order Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>`;

            document.body.insertAdjacentHTML('beforeend', modalHtml);
            if (window.lucide) window.lucide.createIcons();

            // Wire up modal buttons safely (avoids inline-onclick HTML-escaping issues)
            const addToCartBtn  = document.getElementById('modal-add-to-cart-btn');
            const wishlistBtn   = document.getElementById('modal-wishlist-btn');
            const orderNowBtn   = document.getElementById('modal-order-now-btn');

            if (addToCartBtn && !isOutOfStock) {
                addToCartBtn.addEventListener('click', () => {
                    document.getElementById('product-details-modal').remove();
                    if (window.CartManager) window.CartManager.addToCart(product);
                });
            }

            if (wishlistBtn) {
                wishlistBtn.addEventListener('click', () => {
                    document.getElementById('product-details-modal').remove();
                    if (window.WishlistManager) window.WishlistManager.toggleWishlist(product);
                });
            }

            if (orderNowBtn && !isOutOfStock) {
                orderNowBtn.addEventListener('click', () => {
                    UIManager.orderNow(product);
                });
            }
        },
        /**
         * "Order Now" — add a single product as a cart and go to checkout.
         */
        orderNow: (product) => {
            // Close the modal if open
            const modal = document.getElementById('product-details-modal');
            if (modal) modal.remove();

            // Add the product to cart (quantity 1) then go straight to checkout
            if (window.CartManager) {
                window.CartManager.addToCart(product);
            }

            // Redirect to checkout
            window.location.href = 'checkout.html';
        },
        updateProducts,
        elements
    };

})();
