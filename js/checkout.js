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
    serverTimestamp,
    runTransaction
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
                paymentStatus: orderData.paymentStatus || 'Pending',
                razorpayPaymentId: orderData.razorpayPaymentId || null,
                subtotal: orderData.subtotal || 0,
                tax: orderData.tax || 0,
                shipping: orderData.shipping || 0,
                email: orderData.email || '',
                createdAt: serverTimestamp()
            };

            // Write to 'orders' collection
            const docRef = await addDoc(collection(db, 'orders'), finalOrder);
            console.log('✅ Order saved with ID:', docRef.id);

            // Deduct Stock
            for (const item of finalOrder.products) {
                if (item.id) {
                    const productRef = doc(db, 'products', item.id);
                    try {
                        await runTransaction(db, async (transaction) => {
                            const sfDoc = await transaction.get(productRef);
                            if (!sfDoc.exists()) return;
                            const newStock = Math.max(0, (sfDoc.data().stock || 0) - item.quantity);
                            transaction.update(productRef, { stock: newStock });
                        });
                    } catch(e) {
                        console.error('Failed to update stock for', item.name, e);
                    }
                }
            }

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
     * Process checkout form and save pending order.
     * @param {HTMLFormElement} formElement
     * @returns {Promise} Pending promise for redirect
     */
    async function processCheckout(formElement) {
        if (typeof window.CartManager === 'undefined') {
            throw new Error('Cart system is not loaded. Please refresh the page.');
        }

        const cartItems = window.CartManager.getCart();
        if (cartItems.length === 0) {
            throw new Error('Your cart is empty. Please add products before checkout.');
        }

        const formData = new FormData(formElement);

        // ── Validate required fields ──────────────────────────────────────────
        const fullName = (formData.get('fullName') || '').trim();
        const email    = (formData.get('email')    || '').trim();
        const phone    = (formData.get('phone')    || '').trim();
        const address1 = (formData.get('address1') || '').trim();
        const city     = (formData.get('city')     || '').trim();
        const state    = (formData.get('state')    || '').trim();
        const pincode  = (formData.get('pincode')  || '').trim();

        if (!fullName)  throw new Error('Please enter your full name.');
        if (!email)     throw new Error('Please enter a valid email address.');
        if (!phone)     throw new Error('Please enter your phone number.');
        if (!address1)  throw new Error('Please enter your address.');
        if (!city)      throw new Error('Please enter your city.');
        if (!state)     throw new Error('Please enter your state.');
        if (!pincode)   throw new Error('Please enter your pincode.');

        // Validate phone (must be at least 10 digits)
        const phoneDigits = phone.replace(/\D/g, '');
        if (phoneDigits.length < 10) throw new Error('Please enter a valid 10-digit phone number.');

        // Build address object
        const address = {
            line1: address1,
            line2: (formData.get('address2') || '').trim(),
            city:  city,
            state: state,
            pincode: pincode
        };

        // Calculate totals
        const subtotal = window.CartManager.getCartTotal();
        const tax = 18; // flat 18 rupees
        const shipping = 49; // flat 49 rupees
        const total = subtotal + tax + shipping;

        // Get current logged-in user (if any)
        const user = window._currentUser || (window.AuthManager && window.AuthManager.getUser());

        const orderData = {
            userId: user ? user.uid : null,
            customerName: fullName,
            phone: phone,
            email: email || (user ? user.email : ''),
            address: address,
            items: cartItems.map(item => ({
                id: item.id || '',
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
            // We don't have paymentMethod yet, it's selected on the next page
            paymentMethod: null
        };

        // Save pending order
        sessionStorage.setItem('khan_pending_order', JSON.stringify(orderData));
        
        // Redirect to payment page
        window.location.href = 'payment.html';
        
        return new Promise(() => {}); // Keep button in loading state during redirect
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
