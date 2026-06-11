/**
 * KhanElectricsStore — Checkout Manager
 * Handles order submission to Firestore 'orders' and 'customers' collections.
 * Order Schema: { userId, customerName, phone, address, products, totalAmount, status, createdAt }
 */

import { db } from './firebase-config.js';
import {
    collection,
    addDoc,
    setDoc,
    doc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const CheckoutManager = (() => {

    /**
     * Submit an order to Firestore.
     * Also writes/updates customer in 'customers' collection.
     * @param {Object} orderData
     * @returns {Promise<string>} Generated order ID
     */
    async function submitOrder(orderData) {
        try {
            // Build final order matching the schema
            const finalOrder = {
                userId: orderData.userId || null,
                customerName: orderData.customerName || '',
                phone: orderData.phone || '',
                address: orderData.address || '',
                products: orderData.items || [],
                totalAmount: orderData.total || 0,
                status: 'Pending',
                paymentMethod: orderData.paymentMethod || 'cod',
                subtotal: orderData.subtotal || 0,
                tax: orderData.tax || 0,
                shipping: orderData.shipping || 0,
                email: orderData.email || '',
                createdAt: serverTimestamp()
            };

            // Write to 'orders' collection
            const docRef = await addDoc(collection(db, 'orders'), finalOrder);
            console.log('✅ Order saved with ID:', docRef.id);

            // Write/update to 'customers' collection
            await saveCustomer(orderData);

            // Clear cart after successful order
            if (typeof window.CartManager !== 'undefined') {
                await window.CartManager.clearCart();
            }

            return docRef.id;
        } catch (e) {
            console.error('❌ Error submitting order:', e);
            throw e;
        }
    }

    /**
     * Save customer info to Firestore 'customers' collection.
     * Schema: { name, phone, email, city, createdAt }
     */
    async function saveCustomer(orderData) {
        try {
            const email = orderData.email || 'unknown';
            const customerId = email.replace(/[@.]/g, '_');

            await setDoc(doc(db, 'customers', customerId), {
                name: orderData.customerName || '',
                phone: orderData.phone || '',
                email: email,
                city: (orderData.address && orderData.address.city) ? orderData.address.city : '',
                address: orderData.address || {},
                lastOrderId: null, // Will be updated after order is placed
                createdAt: serverTimestamp()
            }, { merge: true }); // merge: true = update if exists, create if not

            console.log('✅ Customer saved to Firestore customers collection.');
        } catch (error) {
            console.error('❌ Error saving customer:', error);
            // Non-fatal — order still goes through
        }
    }

    /**
     * Process checkout form and submit order.
     * @param {HTMLFormElement} formElement
     * @param {string} paymentMethod - 'upi', 'bank', or 'cod'
     * @returns {Promise<string>} Order ID
     */
    async function processCheckout(formElement, paymentMethod) {
        if (typeof window.CartManager === 'undefined') {
            throw new Error('Cart system is not loaded. Please refresh the page.');
        }

        const cartItems = window.CartManager.getCart();
        if (cartItems.length === 0) {
            throw new Error('Your cart is empty. Please add products before checkout.');
        }

        const formData = new FormData(formElement);

        // Build address object
        const address = {
            line1: formData.get('address1') || '',
            line2: formData.get('address2') || '',
            city: formData.get('city') || '',
            state: formData.get('state') || '',
            pincode: formData.get('pincode') || ''
        };

        // Calculate totals
        const subtotal = window.CartManager.getCartTotal();
        const tax = Math.round(subtotal * 0.18 * 100) / 100; // 18% GST
        const shipping = subtotal > 500 ? 0 : 50; // Free shipping above ₹500
        const total = subtotal + tax + shipping;

        // Get current logged-in user (if any)
        const user = window._currentUser || (window.AuthManager && window.AuthManager.getUser());

        const orderData = {
            userId: user ? user.uid : null,
            customerName: formData.get('fullName') || '',
            phone: formData.get('phone') || '',
            email: formData.get('email') || (user ? user.email : ''),
            address: address,
            items: cartItems.map(item => ({
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                category: item.category || 'General',
                image: item.image || ''
            })),
            subtotal: subtotal,
            tax: tax,
            shipping: shipping,
            total: total,
            paymentMethod: paymentMethod
        };

        return await submitOrder(orderData);
    }

    return {
        submitOrder,
        processCheckout,
        saveCustomer
    };

})();

// Export globally for inline script access
window.CheckoutManager = CheckoutManager;

// Signal that CheckoutManager is ready
window.dispatchEvent(new CustomEvent('checkout-manager-ready'));
console.log('✅ CheckoutManager loaded.');
