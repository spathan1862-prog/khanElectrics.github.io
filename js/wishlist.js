/**
 * KhanElectricsStore — Wishlist Manager
 * Dual-layer: localStorage (instant) + Firestore sync (when logged in).
 * Wishlist Schema: { userId, productId, productName, price, image, category, details, status, createdAt }
 */

const WishlistManager = (() => {
    const WISHLIST_KEY = 'khan_wishlist';

    // Local in-memory wishlist
    let wishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];

    let db = null;
    let firestoreFunctions = null;

    // ─── Initialize Firestore Connection ────────────────────────────────────

    function initFirestore() {
        if (window._firebaseDb && !db) {
            db = window._firebaseDb;
        }
    }

    async function loadFirestoreFunctions() {
        if (firestoreFunctions) return firestoreFunctions;
        try {
            const fs = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js");
            firestoreFunctions = {
                collection: fs.collection,
                doc: fs.doc,
                setDoc: fs.setDoc,
                deleteDoc: fs.deleteDoc,
                getDocs: fs.getDocs,
                query: fs.query,
                where: fs.where,
                serverTimestamp: fs.serverTimestamp
            };
            return firestoreFunctions;
        } catch (e) {
            console.warn('Firestore not available for wishlist sync:', e);
            return null;
        }
    }

    // ─── Local Storage ───────────────────────────────────────────────────────

    function saveLocal() {
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
        window.dispatchEvent(new CustomEvent('wishlist-updated', {
            detail: { count: getWishlistCount() }
        }));
    }

    // ─── Firestore Helpers ───────────────────────────────────────────────────

    function getCurrentUserId() {
        const user = window._currentUser || (window.AuthManager && window.AuthManager.getUser());
        return user ? user.uid : null;
    }

    function getWishlistDocId(userId, productId) {
        const safeProductId = String(productId).replace(/[^a-zA-Z0-9_-]/g, '_');
        return `${userId}_${safeProductId}`;
    }

    async function syncWishlistItemToFirestore(item) {
        initFirestore();
        const userId = getCurrentUserId();
        if (!userId || !db) return;

        const fs = await loadFirestoreFunctions();
        if (!fs) return;

        try {
            const productId = item.id || item.name.replace(/[^a-zA-Z0-9_-]/g, '_');
            const docId = getWishlistDocId(userId, productId);
            await fs.setDoc(fs.doc(db, 'wishlists', docId), {
                userId: userId,
                productId: productId,
                productName: item.name,
                price: item.price || 0,
                image: item.image || '',
                category: item.category || 'General',
                details: item.details || item.description || '',
                status: item.status || 'Available',
                createdAt: fs.serverTimestamp()
            });
        } catch (error) {
            console.error('❌ Wishlist Firestore sync error:', error);
        }
    }

    async function removeWishlistItemFromFirestore(productName) {
        initFirestore();
        const userId = getCurrentUserId();
        if (!userId || !db) return;

        const fs = await loadFirestoreFunctions();
        if (!fs) return;

        try {
            const productId = productName.replace(/[^a-zA-Z0-9_-]/g, '_');
            const docId = getWishlistDocId(userId, productId);
            await fs.deleteDoc(fs.doc(db, 'wishlists', docId));
        } catch (error) {
            console.error('❌ Wishlist remove Firestore error:', error);
        }
    }

    /**
     * Load wishlist from Firestore and merge with localStorage.
     * Called when user logs in.
     */
    async function loadWishlistFromFirestore() {
        initFirestore();
        const userId = getCurrentUserId();
        if (!userId || !db) return;

        const fs = await loadFirestoreFunctions();
        if (!fs) return;

        try {
            const q = fs.query(fs.collection(db, 'wishlists'), fs.where('userId', '==', userId));
            const snapshot = await fs.getDocs(q);

            if (!snapshot.empty) {
                const firestoreWishlist = [];
                snapshot.forEach(docSnap => {
                    const data = docSnap.data();
                    firestoreWishlist.push({
                        id: data.productId,
                        name: data.productName,
                        price: data.price,
                        image: data.image,
                        category: data.category,
                        description: data.details,
                        details: data.details,
                        status: data.status
                    });
                });

                // Merge: Firestore takes priority
                const merged = [...firestoreWishlist];
                wishlist.forEach(localItem => {
                    const exists = merged.find(fi => fi.name === localItem.name);
                    if (!exists) {
                        merged.push(localItem);
                        syncWishlistItemToFirestore(localItem);
                    }
                });

                wishlist = merged;
                saveLocal();
                console.log(`✅ Wishlist loaded from Firestore: ${wishlist.length} items`);
            }
        } catch (error) {
            console.error('❌ Load wishlist from Firestore error:', error);
        }
    }

    // ─── Public Wishlist Operations ──────────────────────────────────────────

    /**
     * Add a product to the wishlist.
     * @param {Object} product
     */
    function addToWishlist(product) {
        if (window.AuthManager && !window.AuthManager.isLoggedIn()) {
            window.AuthManager.requireAuth({
                noticeText: 'Please login to add items to your wishlist.',
                pendingAction: { type: 'wishlist', product }
            });
            return;
        }

        if (isInWishlist(product.name)) return;

        const price = typeof product.price === 'string'
            ? parseFloat(product.price.replace(/[^0-9.-]+/g, ''))
            : (product.price || 0);

        const newItem = { ...product, price };
        wishlist.push(newItem);
        syncWishlistItemToFirestore(newItem);
        saveLocal();
    }

    /**
     * Remove a product from the wishlist by name.
     * @param {string} productName
     */
    function removeFromWishlist(productName) {
        wishlist = wishlist.filter(item => item.name !== productName);
        removeWishlistItemFromFirestore(productName);
        saveLocal();
    }

    /**
     * Toggle item in wishlist.
     * @param {Object} product
     * @returns {boolean} true if added, false if removed
     */
    function toggleWishlist(product) {
        if (window.AuthManager && !window.AuthManager.isLoggedIn()) {
            window.AuthManager.requireAuth({
                noticeText: 'Please login to use your wishlist.',
                pendingAction: { type: 'wishlist', product }
            });
            return false;
        }

        if (isInWishlist(product.name)) {
            removeFromWishlist(product.name);
            return false;
        } else {
            addToWishlist(product);
            return true;
        }
    }

    /**
     * Check if a product is in the wishlist.
     * @param {string} productName
     * @returns {boolean}
     */
    function isInWishlist(productName) {
        return wishlist.some(item => item.name === productName);
    }

    /** Get copy of wishlist array */
    function getWishlist() { return [...wishlist]; }

    /** Get total number of items */
    function getWishlistCount() { return wishlist.length; }

    /**
     * Move item from wishlist to cart.
     * @param {string} productName
     */
    function moveToCart(productName) {
        const item = wishlist.find(i => i.name === productName);
        if (!item) return;

        if (typeof window.CartManager !== 'undefined') {
            // Only remove from wishlist AFTER confirming cart add (auth check inside addToCart)
            // addToCart will show auth modal if user not logged in — if that happens,
            // we should NOT remove from wishlist. Check auth first.
            if (window.AuthManager && !window.AuthManager.isLoggedIn()) {
                // Not logged in — let CartManager handle the auth modal, don't remove from wishlist
                window.CartManager.addToCart(item);
                return;
            }
            window.CartManager.addToCart(item);
            removeFromWishlist(productName);
        } else {
            console.warn('CartManager not available, cannot move item to cart.');
        }
    }

    // ─── Auth State Listener ─────────────────────────────────────────────────

    window.addEventListener('auth-state-changed', async (e) => {
        if (e.detail.user) {
            await loadWishlistFromFirestore();
        }
    });

    window.addEventListener('user-logged-out', () => {
        wishlist = [];
        saveLocal();
    });

    // ─── Return Public API ───────────────────────────────────────────────────

    return {
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        getWishlist,
        getWishlistCount,
        moveToCart
    };

})();

// Export globally
window.WishlistManager = WishlistManager;

// Trigger initial badge count
window.dispatchEvent(new CustomEvent('wishlist-updated', {
    detail: { count: WishlistManager.getWishlistCount() }
}));
