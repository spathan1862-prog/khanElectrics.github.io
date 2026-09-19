/**
 * KhanElectricsStore — Checkout Manager
 * Handles order submission to Firestore 'orders' and 'customers' collections.
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
     */
    async function submitOrder(orderData) {
        try {
            // Build final order matching the schema
            const finalOrder = {
                userId: orderData.userId || null,
                customerName: orderData.customerName || '',
                phone: orderData.phone || '',
                address: orderData.address || {},
                products: orderData.items || [],
                totalAmount: orderData.total || 0,
                status: 'Confirmed', // Set to confirmed immediately upon submission (COD or successful online)
                orderStatus: 'Confirmed',
                paymentMethod: orderData.paymentMethod || 'COD',
                paymentStatus: orderData.paymentStatus || 'Pending',
                razorpayOrderId: orderData.razorpayOrderId || null,
                razorpayPaymentId: orderData.razorpayPaymentId || null,
                subtotal: orderData.subtotal || 0,
                codCharge: orderData.codCharge || 0,
                deliveryCharge: orderData.deliveryCharge || 0,
                email: orderData.email || '',
                packingToken: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
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

            // Clear cart after successful order (if it was cart) or session storage
            sessionStorage.removeItem('khan_direct_order');

            return docRef.id;
        } catch (e) {
            console.error('❌ Error submitting order:', e);
            throw e;
        }
    }

    /**
     * Save customer info to Firestore 'customers' collection.
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
                lastOrderId: null,
                createdAt: serverTimestamp()
            }, { merge: true });

            console.log('✅ Customer saved to Firestore customers collection.');
        } catch (error) {
            console.error('❌ Error saving customer:', error);
        }
    }

    /**
     * Process checkout form and handle COD or Razorpay directly
     */
    async function processCheckout(formElement) {
        let orderItem = null;
        try {
            orderItem = JSON.parse(sessionStorage.getItem('khan_direct_order'));
        } catch(e) {}
        
        if (!orderItem) {
            throw new Error('Your order is empty. Please select a product to buy.');
        }
        
        const cartItems = [orderItem];

        const formData = new FormData(formElement);

        // Validate required fields
        const fullName = (formData.get('fullName') || '').trim();
        const email    = (formData.get('email')    || '').trim();
        const phone    = (formData.get('phone')    || '').trim();
        const address1 = (formData.get('address1') || '').trim();
        const city     = (formData.get('city')     || '').trim();
        const state    = (formData.get('state')    || '').trim();
        const pincode  = (formData.get('pincode')  || '').trim();
        const paymentMethod = formData.get('paymentMethod');

        if (!fullName)  throw new Error('Please enter your full name.');
        if (!email)     throw new Error('Please enter a valid email address.');
        if (!phone)     throw new Error('Please enter your phone number.');
        if (!address1)  throw new Error('Please enter your address.');
        if (!city)      throw new Error('Please enter your city.');
        if (!state)     throw new Error('Please enter your state.');
        if (!pincode)   throw new Error('Please enter your pincode.');
        if (!paymentMethod) throw new Error('Please select a payment method.');

        const phoneDigits = phone.replace(/\D/g, '');
        if (phoneDigits.length < 10) throw new Error('Please enter a valid 10-digit phone number.');

        const address = {
            line1: address1,
            line2: (formData.get('address2') || '').trim(),
            city:  city,
            state: state,
            pincode: pincode
        };

        const subtotal = orderItem.price * (orderItem.quantity || 1);
        const deliveryCharge = 0;
        const codCharge = paymentMethod === 'cod' ? 149 : 0;
        const total = subtotal + deliveryCharge + codCharge;

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
            codCharge: codCharge,
            deliveryCharge: deliveryCharge,
            total: total,
            paymentMethod: paymentMethod === 'cod' ? 'COD' : 'Online',
            paymentStatus: 'Pending'
        };

        if (paymentMethod === 'cod') {
            const orderId = await submitOrder(orderData);
            window.showSuccess(orderId);
            return;
        }

        if (paymentMethod === 'online') {
            if (typeof Razorpay === 'undefined') {
                throw new Error('Payment system failed to load. Please check your connection.');
            }

            return new Promise((resolve, reject) => {
                const options = {
                    key: 'rzp_test_YOUR_KEY_HERE', // Keep placeholder as requested by user
                    amount: Math.round(total * 100), // Amount in paise
                    currency: 'INR',
                    name: 'Khan Electrics',
                    description: 'Order Payment',
                    handler: async function (response) {
                        try {
                            orderData.paymentStatus = 'Paid';
                            orderData.razorpayPaymentId = response.razorpay_payment_id;
                            orderData.razorpayOrderId = response.razorpay_order_id || null;
                            const orderId = await submitOrder(orderData);
                            window.showSuccess(orderId);
                            resolve();
                        } catch (err) {
                            reject(new Error('Payment successful but order creation failed. Please contact support.'));
                        }
                    },
                    prefill: {
                        name: fullName,
                        email: email,
                        contact: phone
                    },
                    theme: {
                        color: '#f59e0b'
                    },
                    modal: {
                        ondismiss: function() {
                            reject(new Error('Payment cancelled.'));
                        }
                    }
                };
                const rzp = new Razorpay(options);
                rzp.on('payment.failed', function (response){
                    reject(new Error(response.error.description || 'Payment failed.'));
                });
                rzp.open();
            });
        }
    }

    return {
        submitOrder,
        processCheckout,
        saveCustomer
    };

})();

window.CheckoutManager = CheckoutManager;
window.dispatchEvent(new CustomEvent('checkout-manager-ready'));
console.log('✅ CheckoutManager loaded.');
