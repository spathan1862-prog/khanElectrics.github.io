/**
 * KhanElectricsStore — Products Module (Firestore)
 * Fetches products from Firestore 'products' collection.
 * Falls back to DataManager (Google Sheets CSV) if Firestore has no products.
 * Product Schema: { name, price, category, image, stock, details, status }
 */

import { db } from './firebase-config.js';
import {
    collection,
    getDocs,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const ProductsFirebase = (() => {

    /**
     * Fetch products from Firestore 'products' collection.
     * If collection is empty or an error occurs, falls back to DataManager CSV.
     * @returns {Promise<Array>} Array of product objects
     */
    async function getProducts() {
        try {
            // No orderBy to avoid requiring a Firestore index (BUG-17 fix)
            const q = query(collection(db, "products"));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const products = [];
                querySnapshot.forEach((docSnap) => {
                    const data = docSnap.data();
                    products.push({
                        id: docSnap.id,
                        name: data.name || '',
                        price: data.price || 0,
                        category: data.category || 'General',
                        image: data.image || '',
                        stock: data.stock || 0,
                        description: data.details || data.description || '',
                        details: data.details || data.description || '',
                        status: data.status || 'Available'
                    });
                });
                // Sort client-side
                products.sort((a, b) => a.name.localeCompare(b.name));
                console.log(`✅ Loaded ${products.length} products from Firestore.`);
                return products;
            }

            // Firestore is empty — fall back to Google Sheets CSV
            console.warn('⚠️ Firestore products collection is empty. Falling back to CSV data.');
            return await getFallbackProducts();

        } catch (error) {
            console.error('❌ Error fetching products from Firestore:', error);
            // Fall back to CSV on any error
            return await getFallbackProducts();
        }
    }

    /**
     * Fallback: fetch products from Google Sheets CSV via DataManager
     */
    async function getFallbackProducts() {
        if (typeof DataManager !== 'undefined') {
            const csvProducts = await DataManager.getProducts();
            // Normalize description field
            return csvProducts.map(p => ({
                ...p,
                description: p.description || p.details || '',
                details: p.details || p.description || ''
            }));
        }
        return [];
    }

    return { getProducts };

})();

// Export globally so app.js (non-module) can access it
window.ProductsFirebase = ProductsFirebase;
