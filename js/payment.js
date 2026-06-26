// payment.js

document.addEventListener('DOMContentLoaded', () => {
    
    // Retrieve pending order from session storage
    const pendingOrderStr = sessionStorage.getItem('khan_pending_order');
    if (!pendingOrderStr) {
        // No pending order, redirect to checkout
        window.location.href = 'checkout.html';
        return;
    }

    const orderData = JSON.parse(pendingOrderStr);

    // Ensure total is defined to avoid TypeErrors
    if (orderData && typeof orderData.total === 'undefined') {
        orderData.total = (orderData.subtotal || 0) + (orderData.tax || 0) + (orderData.shipping || 0);
    }

    // Render Order Summary
    renderPaymentSummary(orderData);

    // Payment Method Selection Logic
    let selectedPaymentMethod = 'razorpay';
    document.querySelectorAll('.payment-method').forEach(method => {
        method.addEventListener('click', () => {
            document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('active'));
            method.classList.add('active');
            selectedPaymentMethod = method.getAttribute('data-method');
        });
    });

    // Form Submission Logic
    const btn = document.getElementById('place-order-btn');
    const errorDiv = document.getElementById('checkout-error');

    btn.addEventListener('click', async () => {
        btn.disabled = true;
        btn.innerHTML = 'Processing... <i data-lucide="loader" class="spin"></i>';
        lucide.createIcons();
        errorDiv.style.display = 'none';

        try {
            await waitForCheckoutManager();
            
            orderData.paymentMethod = selectedPaymentMethod;

            if (selectedPaymentMethod === 'razorpay') {
                const options = {
                    key: "rzp_test_YOUR_KEY_HERE", // UPDATE THIS WITH YOUR ACTUAL RAZORPAY KEY
                    amount: Math.round(orderData.total * 100),
                    currency: "INR",
                    name: "Khan Services",
                    description: "Order Payment",
                    prefill: {
                        name: orderData.customerName,
                        email: orderData.email,
                        contact: orderData.phone
                    },
                    theme: { color: "#f59e0b" },
                    handler: async function (response) {
                        try {
                            orderData.paymentStatus = 'Paid';
                            orderData.razorpayPaymentId = response.razorpay_payment_id;
                            const orderId = await window.CheckoutManager.submitOrder(orderData);
                            showSuccess(orderId);
                        } catch (err) {
                            handleError(err);
                        }
                    },
                    modal: {
                        ondismiss: function() {
                            handleError(new Error('Payment Cancelled. You can try again.'));
                        }
                    }
                };
                const rzp = new window.Razorpay(options);
                rzp.on('payment.failed', function (response) {
                    handleError(new Error('Payment Failed: ' + response.error.description));
                });
                rzp.open();
            } else {
                // COD
                orderData.paymentStatus = 'Pending';
                const orderId = await window.CheckoutManager.submitOrder(orderData);
                showSuccess(orderId);
            }

        } catch (error) {
            handleError(error);
        }
    });

    function handleError(error) {
        btn.disabled = false;
        btn.innerHTML = 'Place Order <i data-lucide="check"></i>';
        lucide.createIcons();
        errorDiv.textContent = error.message || 'An error occurred. Please try again.';
        errorDiv.style.display = 'block';
    }
});

function renderPaymentSummary(orderData) {
    const summaryArea = document.getElementById('checkout-summary');
    
    let html = '<h3 style="margin-bottom:24px;font-size:1.25rem;">Order Summary</h3>';
    html += '<div style="margin-bottom:24px;display:flex;flex-direction:column;gap:12px;">';

    orderData.items.forEach(item => {
        html += `
            <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--border);padding-bottom:12px;">
                <div style="display:flex;gap:12px;align-items:center;">
                    <img src="${item.image || ''}" alt="${item.name}" style="width:50px;height:50px;object-fit:cover;border-radius:8px;" onerror="this.style.display='none'">
                    <div>
                        <div style="font-size:0.9rem;font-weight:500;">${item.name}</div>
                        <div style="font-size:0.8rem;color:var(--text-muted);">Qty: ${item.quantity}</div>
                    </div>
                </div>
                <div style="font-weight:600;">₹${(item.price * item.quantity).toFixed(2)}</div>
            </div>
        `;
    });

    html += '</div>';
    html += `
        <div class="summary-row"><span>Subtotal</span><span>₹${orderData.subtotal.toFixed(2)}</span></div>
        <div class="summary-row"><span>Tax</span><span>₹${orderData.tax.toFixed(2)}</span></div>
        <div class="summary-row"><span>Delivery Charge</span><span>₹${orderData.shipping.toFixed(2)}</span></div>
        <div class="summary-row total"><span>Total</span><span>₹${orderData.total.toFixed(2)}</span></div>
    `;

    summaryArea.innerHTML = html;
}

function waitForCheckoutManager(timeout = 10000) {
    return new Promise((resolve, reject) => {
        if (window.CheckoutManager) { resolve(); return; }

        const handler = () => { clearInterval(timer); resolve(); };
        window.addEventListener('checkout-manager-ready', handler, { once: true });

        const interval = 100;
        let elapsed = 0;
        const timer = setInterval(() => {
            elapsed += interval;
            if (window.CheckoutManager) {
                clearInterval(timer);
                window.removeEventListener('checkout-manager-ready', handler);
                resolve();
            } else if (elapsed >= timeout) {
                clearInterval(timer);
                window.removeEventListener('checkout-manager-ready', handler);
                reject(new Error('Checkout system failed to load. Please refresh the page and try again.'));
            }
        }, interval);
    });
}

function showSuccess(orderId) {
    document.getElementById('checkout-flow').style.display = 'none';
    document.getElementById('checkout-header').style.display = 'none';

    const successDiv = document.getElementById('order-success');
    document.getElementById('generated-order-id').textContent = '#' + orderId.substring(0, 8).toUpperCase();
    successDiv.classList.add('active');
    lucide.createIcons();

    window.dispatchEvent(new CustomEvent('cart-updated', { detail: { count: 0 } }));
    
    // Clear pending order
    sessionStorage.removeItem('khan_pending_order');
}
