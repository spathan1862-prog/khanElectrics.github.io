/**
 * KhanElectricsStore — Cart Manager
 * FIX BUG-03: cart.js is a regular script. Firestore is accessed via
 *             window._firebaseDb (set by firebase-config.js module).
 * FIX BUG-05: Price is always converted to Number on addToCart.
 */

const CartManager = (() => {
    const CART_KEY = 'khan_cart';

    // Safe price parser — handles "₹299", "299.00", 299, undefined
    function toNumber(val) {
        if (typeof val === 'number') return isNaN(val) ? 0 : val;
        if (typeof val === 'string') return parseFloat(val.replace(/[^0-9.-]+/g, '')) || 0;
        return 0;
    }

    // Load from localStorage, normalizing all prices to Number (FIX BUG-05)
    let cart = (JSON.parse(localStorage.getItem(CART_KEY)) || []).map(item => ({
        ...item,
        price: toNumber(item.price),
        quantity: parseInt(item.quantity) || 1
    }));

    let firestoreFunctions = null;

    // ─── Firestore Access ────────────────────────────────────────────────────

    function getDb() {
        return window._firebaseDb || null;
    }

    async function getFs() {
        if (firestoreFunctions) return firestoreFunctions;
        try {
            const fs = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js");
            firestoreFunctions = fs;
            return fs;
        } catch (e) {
            console.warn('Firestore not available for cart sync:', e);
            return null;
        }
    }

    function getCurrentUserId() {
        const user = window._currentUser || (window.AuthManager && window.AuthManager.getUser());
        return user ? user.uid : null;
    }

    // ─── Firestore Sync ──────────────────────────────────────────────────────

    async function syncToFirestore(item, quantity) {
        const db = getDb();
        const userId = getCurrentUserId();
        if (!db || !userId) return;

        const fs = await getFs();
        if (!fs) return;

        const productId = String(item.id || item.name).replace(/[^a-zA-Z0-9_-]/g, '_');
        const docId = `${userId}_${productId}`;

        try {
            if (quantity <= 0) {
                await fs.deleteDoc(fs.doc(db, 'carts', docId));
            } else {
                await fs.setDoc(fs.doc(db, 'carts', docId), {
                    userId,
                    productId,
                    productName: item.name,
                    quantity,
                    price: toNumber(item.price),
                    image: item.image || '',
                    category: item.category || 'General',
                    createdAt: fs.serverTimestamp()
                });
            }
        } catch (err) {
            console.error('Cart Firestore sync error:', err);
        }
    }

    async function removeFromFirestore(productName) {
        const db = getDb();
        const userId = getCurrentUserId();
        if (!db || !userId) return;

        const fs = await getFs();
        if (!fs) return;

        const productId = productName.replace(/[^a-zA-Z0-9_-]/g, '_');
        const docId = `${userId}_${productId}`;

        try {
            await fs.deleteDoc(fs.doc(db, 'carts', docId));
        } catch (err) {
            console.error('Cart remove Firestore error:', err);
        }
    }

    async function loadFromFirestore() {
        const db = getDb();
        const userId = getCurrentUserId();
        if (!db || !userId) return;

        const fs = await getFs();
        if (!fs) return;

        try {
            const q = fs.query(fs.collection(db, 'carts'), fs.where('userId', '==', userId));
            const snapshot = await fs.getDocs(q);

            if (!snapshot.empty) {
                const firestoreCart = [];
                snapshot.forEach(d => {
                    const data = d.data();
                    firestoreCart.push({
                        id: data.productId,
                        name: data.productName,
                        price: toNumber(data.price),
                        image: data.image || '',
                        category: data.category || 'General',
                        quantity: parseInt(data.quantity) || 1
                    });
                });

                // Merge: Firestore takes priority
                const merged = [...firestoreCart];
                cart.forEach(localItem => {
                    if (!merged.find(fi => fi.name === localItem.name)) {
                        merged.push(localItem);
                        syncToFirestore(localItem, localItem.quantity);
                    }
                });

                cart = merged;
                saveLocal();
                console.log(`✅ Cart loaded from Firestore: ${cart.length} items`);
            }
        } catch (err) {
            console.error('Load cart from Firestore error:', err);
        }
    }

    async function clearFirestoreCart() {
        const db = getDb();
        const userId = getCurrentUserId();
        if (!db || !userId) return;

        const fs = await getFs();
        if (!fs) return;

        try {
            const q = fs.query(fs.collection(db, 'carts'), fs.where('userId', '==', userId));
            const snapshot = await fs.getDocs(q);
            await Promise.all([...snapshot.docs].map(d => fs.deleteDoc(d.ref)));
        } catch (err) {
            console.error('Clear Firestore cart error:', err);
        }
    }

    // ─── Local Storage ────────────────────────────────────────────────────────

    function saveLocal() {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        window.dispatchEvent(new CustomEvent('cart-updated', {
            detail: { count: getCartCount() }
        }));
    }

    // ─── Public API ───────────────────────────────────────────────────────────

    /**
     * FIX BUG-05: Price always normalized to Number on add.
     */
    function addToCart(product, quantity = 1) {
        if (window.AuthManager && !window.AuthManager.isLoggedIn()) {
            window.AuthManager.requireAuth({
                noticeText: 'Please login to add items to your cart.',
                pendingAction: { type: 'cart', product }
            });
            return;
        }

        const price = toNumber(product.price);
        const existing = cart.find(item => item.name === product.name);

        if (existing) {
            existing.quantity += quantity;
            syncToFirestore(existing, existing.quantity);
        } else {
            const newItem = { ...product, price, quantity };
            cart.push(newItem);
            syncToFirestore(newItem, quantity);
        }

        saveLocal();
        showToast(product.name);
    }

    function removeFromCart(productName) {
        cart = cart.filter(item => item.name !== productName);
        removeFromFirestore(productName);
        saveLocal();
    }

    function updateQuantity(productName, quantity) {
        const qty = parseInt(quantity);
        if (qty <= 0) {
            removeFromCart(productName);
            return;
        }
        const item = cart.find(i => i.name === productName);
        if (item) {
            item.quantity = qty;
            syncToFirestore(item, qty);
            saveLocal();
        }
    }

    function getCart() { return cart.map(i => ({ ...i, price: toNumber(i.price) })); }

    function getCartCount() {
        return cart.reduce((t, i) => t + (parseInt(i.quantity) || 0), 0);
    }

    function getCartTotal() {
        return cart.reduce((t, i) => t + (toNumber(i.price) * (parseInt(i.quantity) || 1)), 0);
    }

    async function clearCart() {
        cart = [];
        saveLocal();
        await clearFirestoreCart();
    }

    // ─── Toast ────────────────────────────────────────────────────────────────

    function showToast(productName) {
        const old = document.getElementById('cart-toast');
        if (old) old.remove();

        const toast = document.createElement('div');
        toast.id = 'cart-toast';
        toast.style.cssText = `
            position:fixed;bottom:24px;right:16px;z-index:9999;
            background:var(--primary,#f59e0b);color:#000;
            padding:12px 20px;border-radius:50px;
            font-weight:600;font-size:0.9rem;
            box-shadow:0 4px 20px rgba(0,0,0,0.3);
            display:flex;align-items:center;gap:8px;
            animation:slideInUp 0.3s ease;
            max-width:calc(100vw - 32px);
        `;
        toast.textContent = '🛒 Added to cart!';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2500);
    }

    // ─── Auth State Listeners ─────────────────────────────────────────────────

    window.addEventListener('auth-state-changed', async (e) => {
        if (e.detail.user) await loadFromFirestore();
    });

    window.addEventListener('user-logged-out', () => {
        cart = [];
        saveLocal();
    });

    return { addToCart, removeFromCart, updateQuantity, getCart, getCartCount, getCartTotal, clearCart };

})();

window.CartManager = CartManager;

// Dispatch initial count (FIX BUG-01: use setTimeout to ensure listeners are set up first)
setTimeout(() => {
    window.dispatchEvent(new CustomEvent('cart-updated', {
        detail: { count: CartManager.getCartCount() }
    }));
}, 0);
