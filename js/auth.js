/**
 * KhanElectricsStore — Auth Manager v2
 * Full authentication system with:
 *   - Email/Password Login + Signup
 *   - Google Sign-In
 *   - Forgot Password
 *   - Auth Guard (blocks cart/wishlist/checkout for guests)
 *   - Pending action: executes queued action after login
 *   - Session persistence across page refresh
 *   - Full UI state management
 */

import { auth, db } from './firebase-config.js';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import {
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const AuthManager = (() => {

    let currentUser = null;
    let isLoginMode = true;
    let isForgotMode = false;

    // ─── Pending Action System ──────────────────────────────────────────────
    // When a guest clicks "Add to Cart" or "Wishlist", we store the action
    // and execute it automatically after login.
    let pendingAction = null; // { type: 'cart'|'wishlist', product: Object }

    function setPendingAction(type, product) {
        pendingAction = { type, product };
    }

    function executePendingAction() {
        if (!pendingAction) return;
        const { type, product } = pendingAction;
        pendingAction = null;

        if (type === 'cart' && window.CartManager) {
            window.CartManager.addToCart(product);
            showGlobalToast(`✅ "${product.name}" added to cart!`, 'success');
        } else if (type === 'wishlist' && window.WishlistManager) {
            window.WishlistManager.addToWishlist(product);
            showGlobalToast(`❤️ "${product.name}" added to wishlist!`, 'success');
        }
    }

    // ─── Initialize ──────────────────────────────────────────────────────────

    function init() {
        injectAuthUI();

        onAuthStateChanged(auth, (user) => {
            currentUser = user;
            window._currentUser = user;
            updateUI(user);
            window.dispatchEvent(new CustomEvent('auth-state-changed', { detail: { user } }));

            if (user) {
                // Execute any pending action (e.g. Add to Cart after login)
                setTimeout(executePendingAction, 800);
                
                // If we were on a protected page with a forced modal, close it
                const modal = document.getElementById('auth-modal');
                if (modal && modal.classList.contains('forced')) {
                    closeModal();
                }
            } else {
                checkProtectedPages();
            }
        });

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupListeners);
        } else {
            setupListeners();
        }
    }

    // ─── Inject Auth Modal HTML ────────────────────────────────────────────

    function injectAuthUI() {
        // 1. Inject nav auth button (before theme toggle)
        const navActions = document.querySelector('.nav-actions');
        if (navActions && !document.getElementById('auth-nav-btn')) {
            const authBtn = document.createElement('button');
            authBtn.id = 'auth-nav-btn';
            authBtn.className = 'nav-icon-btn auth-nav-btn-el';
            authBtn.setAttribute('aria-label', 'Account');
            authBtn.setAttribute('title', 'Login / Sign Up');
            authBtn.innerHTML = '<i data-lucide="user"></i>';
            authBtn.style.background = 'none';
            authBtn.style.border = 'none';
            authBtn.style.cursor = 'pointer';

            const themeToggle = document.getElementById('theme-toggle');
            if (themeToggle) {
                navActions.insertBefore(authBtn, themeToggle);
            } else {
                navActions.appendChild(authBtn);
            }
        }

        // 2. Inject Auth Modal
        if (!document.getElementById('auth-modal')) {
            document.body.insertAdjacentHTML('beforeend', `
            <div class="modal" id="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
                <div class="modal-content" id="auth-modal-box" style="max-width:420px;width:100%;margin:0 16px;">

                    <!-- Header -->
                    <div class="modal-header">
                        <div>
                            <h2 id="auth-modal-title" style="font-size:1.4rem;font-weight:700;">Welcome Back</h2>
                            <p id="auth-modal-sub" style="color:var(--text-muted);font-size:0.85rem;margin-top:4px;">Sign in to continue</p>
                        </div>
                        <button class="close-btn" id="close-auth-modal" aria-label="Close" style="flex-shrink:0;">
                            <i data-lucide="x"></i>
                        </button>
                    </div>

                    <!-- Auth Required Notice (shown when triggered by a protected action) -->
                    <div id="auth-required-notice" style="display:none;background:rgba(245,158,11,0.12);border:1px solid rgba(245,158,11,0.3);border-radius:12px;padding:12px 16px;margin-bottom:16px;font-size:0.875rem;color:var(--primary);display:none;align-items:center;gap:10px;">
                        <i data-lucide="lock" style="width:16px;height:16px;flex-shrink:0;"></i>
                        <span id="auth-required-text">Please login to continue.</span>
                    </div>

                    <!-- Google Sign-In -->
                    <button id="google-signin-btn" class="btn-outline" style="width:100%;justify-content:center;gap:10px;margin-bottom:16px;padding:13px;font-size:0.95rem;">
                        <svg width="18" height="18" viewBox="0 0 18 18" style="flex-shrink:0;">
                            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
                            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
                            <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/>
                            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"/>
                        </svg>
                        Continue with Google
                    </button>

                    <!-- Divider -->
                    <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
                        <div style="flex:1;height:1px;background:var(--border);"></div>
                        <span style="font-size:0.8rem;color:var(--text-muted);">or</span>
                        <div style="flex:1;height:1px;background:var(--border);"></div>
                    </div>

                    <!-- Email Form -->
                    <form id="auth-form" novalidate>

                        <!-- Name (signup only) -->
                        <div class="form-group" id="auth-name-group" style="display:none;margin-bottom:16px;">
                            <label for="auth-name" class="form-label">Full Name</label>
                            <input type="text" id="auth-name" name="auth-name" class="form-input"
                                placeholder="Enter your full name" autocomplete="name">
                        </div>

                        <!-- Email -->
                        <div class="form-group" style="margin-bottom:16px;">
                            <label for="auth-email" class="form-label">Email Address</label>
                            <input type="email" id="auth-email" name="auth-email" class="form-input"
                                required placeholder="Enter your email" autocomplete="email">
                        </div>

                        <!-- Password (hidden in forgot mode) -->
                        <div class="form-group" id="auth-password-group" style="margin-bottom:8px;">
                            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                                <label for="auth-password" class="form-label" style="margin:0;">Password</label>
                                <button type="button" id="forgot-pw-btn" style="background:none;border:none;color:var(--primary);font-size:0.8rem;cursor:pointer;padding:0;font-family:inherit;">Forgot password?</button>
                            </div>
                            <input type="password" id="auth-password" name="auth-password" class="form-input"
                                required placeholder="Min 6 characters" autocomplete="current-password">
                        </div>

                        <!-- Error / Success messages -->
                        <div id="auth-error" style="display:none;color:#ef4444;font-size:0.85rem;margin-bottom:12px;padding:10px 14px;background:rgba(239,68,68,0.1);border-radius:10px;border-left:3px solid #ef4444;"></div>
                        <div id="auth-success" style="display:none;color:#22c55e;font-size:0.85rem;margin-bottom:12px;padding:10px 14px;background:rgba(34,197,94,0.1);border-radius:10px;border-left:3px solid #22c55e;"></div>

                        <!-- Submit -->
                        <button type="submit" class="btn-primary" id="auth-submit-btn"
                            style="width:100%;justify-content:center;margin-top:16px;padding:14px;font-size:1rem;">
                            Login
                        </button>
                    </form>

                    <!-- Toggle Login/Signup -->
                    <p id="auth-toggle-row" style="text-align:center;margin-top:20px;font-size:0.875rem;color:var(--text-muted);">
                        Don't have an account?
                        <button id="auth-toggle-btn" style="background:none;border:none;color:var(--primary);font-weight:600;cursor:pointer;font-family:inherit;font-size:inherit;padding:0 4px;">Sign up</button>
                    </p>
                </div>
            </div>`);
        }

        if (window.lucide) window.lucide.createIcons();
    }

    // ─── Event Listeners ───────────────────────────────────────────────────

    function setupListeners() {
        const authNavBtn     = document.getElementById('auth-nav-btn');
        const authModal      = document.getElementById('auth-modal');
        const closeBtn       = document.getElementById('close-auth-modal');
        const authToggleBtn  = document.getElementById('auth-toggle-btn');
        const authForm       = document.getElementById('auth-form');
        const googleBtn      = document.getElementById('google-signin-btn');
        const forgotBtn      = document.getElementById('forgot-pw-btn');

        // Nav button: open modal or show user menu
        if (authNavBtn) {
            authNavBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (currentUser) {
                    showUserMenu(authNavBtn);
                } else {
                    openModal();
                }
            });
        }

        // Close button
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                // Only closeable if it wasn't forced open for a protected page
                const isForced = authModal && authModal.classList.contains('forced');
                if (!isForced) closeModal();
            });
        }

        // Backdrop click — same rule
        if (authModal) {
            authModal.addEventListener('click', (e) => {
                if (e.target === authModal && !authModal.classList.contains('forced')) {
                    closeModal();
                }
            });
        }

        // Toggle login/signup
        if (authToggleBtn) {
            authToggleBtn.addEventListener('click', () => {
                isForgotMode = false;
                isLoginMode = !isLoginMode;
                switchMode();
            });
        }

        // Forgot password
        if (forgotBtn) {
            forgotBtn.addEventListener('click', () => {
                isForgotMode = true;
                switchMode();
            });
        }

        // Google sign-in
        if (googleBtn) {
            googleBtn.addEventListener('click', handleGoogleSignIn);
        }

        // Email form submit
        if (authForm) {
            authForm.addEventListener('submit', handleFormSubmit);
        }

        // ESC key to close modal (only if not forced)
        document.addEventListener('keydown', (e) => {
            const modal = document.getElementById('auth-modal');
            if (e.key === 'Escape' && modal && modal.classList.contains('active') && !modal.classList.contains('forced')) {
                closeModal();
            }
        });
    }

    // ─── Modal Open/Close ──────────────────────────────────────────────────

    function openModal(options = {}) {
        const modal = document.getElementById('auth-modal');
        if (!modal) return;
        modal.classList.add('active');

        if (options.forced) {
            // Cannot be closed — protected page
            modal.classList.add('forced');
            const closeBtn = document.getElementById('close-auth-modal');
            if (closeBtn) closeBtn.style.display = 'none';
        } else {
            modal.classList.remove('forced');
            const closeBtn = document.getElementById('close-auth-modal');
            if (closeBtn) closeBtn.style.display = '';
        }

        if (options.noticeText) {
            const notice = document.getElementById('auth-required-notice');
            const noticeText = document.getElementById('auth-required-text');
            if (notice && noticeText) {
                noticeText.textContent = options.noticeText;
                notice.style.display = 'flex';
            }
        } else {
            const notice = document.getElementById('auth-required-notice');
            if (notice) notice.style.display = 'none';
        }

        clearMessages();
        // Focus email field
        setTimeout(() => {
            const emailInput = document.getElementById('auth-email');
            if (emailInput) emailInput.focus();
        }, 100);

        if (window.lucide) window.lucide.createIcons();
    }

    function closeModal() {
        const modal = document.getElementById('auth-modal');
        if (!modal) return;
        modal.classList.remove('active', 'forced');
        const form = document.getElementById('auth-form');
        if (form) form.reset();
        const notice = document.getElementById('auth-required-notice');
        if (notice) notice.style.display = 'none';
        const closeBtn = document.getElementById('close-auth-modal');
        if (closeBtn) closeBtn.style.display = '';
        clearMessages();
        // Reset to login mode
        isForgotMode = false;
        if (!isLoginMode) { isLoginMode = true; switchMode(); }
    }

    function switchMode() {
        const title    = document.getElementById('auth-modal-title');
        const sub      = document.getElementById('auth-modal-sub');
        const nameGrp  = document.getElementById('auth-name-group');
        const pwGrp    = document.getElementById('auth-password-group');
        const submitBtn= document.getElementById('auth-submit-btn');
        const toggleRow= document.getElementById('auth-toggle-row');
        const toggleBtn= document.getElementById('auth-toggle-btn');
        const googleBtn= document.getElementById('google-signin-btn');
        const forgotBtn= document.getElementById('forgot-pw-btn');

        clearMessages();

        if (isForgotMode) {
            if (title)    title.textContent  = 'Reset Password';
            if (sub)      sub.textContent    = 'Enter your email to receive a reset link';
            if (nameGrp)  nameGrp.style.display  = 'none';
            if (pwGrp)    pwGrp.style.display     = 'none';
            if (submitBtn)submitBtn.textContent  = 'Send Reset Email';
            if (toggleRow)toggleRow.innerHTML = `Remember your password? <button id="auth-toggle-btn" style="background:none;border:none;color:var(--primary);font-weight:600;cursor:pointer;font-family:inherit;font-size:inherit;padding:0 4px;">Back to Login</button>`;
            if (googleBtn)googleBtn.style.display = 'none';
            // Re-attach toggle listener
            document.getElementById('auth-toggle-btn')?.addEventListener('click', () => {
                isForgotMode = false; isLoginMode = true; switchMode();
            });
        } else if (isLoginMode) {
            if (title)    title.textContent  = 'Welcome Back';
            if (sub)      sub.textContent    = 'Sign in to your account';
            if (nameGrp)  nameGrp.style.display  = 'none';
            if (pwGrp)    pwGrp.style.display     = 'block';
            if (submitBtn)submitBtn.textContent  = 'Login';
            if (toggleRow)toggleRow.innerHTML = `Don't have an account? <button id="auth-toggle-btn" style="background:none;border:none;color:var(--primary);font-weight:600;cursor:pointer;font-family:inherit;font-size:inherit;padding:0 4px;">Sign up</button>`;
            if (googleBtn)googleBtn.style.display = '';
            if (forgotBtn)forgotBtn.style.display = '';
            document.getElementById('auth-toggle-btn')?.addEventListener('click', () => {
                isForgotMode = false; isLoginMode = false; switchMode();
            });
        } else {
            // Signup mode
            if (title)    title.textContent  = 'Create Account';
            if (sub)      sub.textContent    = 'Join Khan Services today';
            if (nameGrp)  nameGrp.style.display  = 'block';
            if (pwGrp)    pwGrp.style.display     = 'block';
            if (submitBtn)submitBtn.textContent  = 'Create Account';
            if (toggleRow)toggleRow.innerHTML = `Already have an account? <button id="auth-toggle-btn" style="background:none;border:none;color:var(--primary);font-weight:600;cursor:pointer;font-family:inherit;font-size:inherit;padding:0 4px;">Login</button>`;
            if (googleBtn)googleBtn.style.display = '';
            if (forgotBtn)forgotBtn.style.display = 'none';
            document.getElementById('auth-toggle-btn')?.addEventListener('click', () => {
                isForgotMode = false; isLoginMode = true; switchMode();
            });
        }

        // Update name field required
        const nameInput = document.getElementById('auth-name');
        if (nameInput) nameInput.required = !isLoginMode && !isForgotMode;

        if (window.lucide) window.lucide.createIcons();
    }

    // ─── Google Sign-In ───────────────────────────────────────────────────

    async function handleGoogleSignIn() {
        const btn = document.getElementById('google-signin-btn');
        if (btn) { btn.disabled = true; btn.textContent = 'Signing in...'; }
        clearMessages();

        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Save to Firestore (merge so existing users aren't overwritten)
            await saveUserToFirestore(user, user.displayName || 'User', user.email);

            showSuccess('✅ Signed in with Google!');
            setTimeout(closeModal, 900);
        } catch (error) {
            console.error('Google sign-in error:', error);
            if (error.code !== 'auth/popup-closed-by-user') {
                showError(getFriendlyErrorMessage(error.code));
            }
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 18 18" style="flex-shrink:0;"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"/></svg> Continue with Google`;
                if (window.lucide) window.lucide.createIcons();
            }
        }
    }

    // ─── Email Form Submit ─────────────────────────────────────────────────

    async function handleFormSubmit(e) {
        e.preventDefault();
        clearMessages();

        const email     = document.getElementById('auth-email').value.trim();
        const submitBtn = document.getElementById('auth-submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Please wait...';

        try {
            if (isForgotMode) {
                // ── FORGOT PASSWORD ──
                await sendPasswordResetEmail(auth, email);
                showSuccess(`✅ Password reset email sent to ${email}. Check your inbox.`);
                return;
            }

            const password = document.getElementById('auth-password').value;

            if (isLoginMode) {
                // ── LOGIN ──
                await signInWithEmailAndPassword(auth, email, password);
                showSuccess('✅ Logged in successfully!');
                setTimeout(closeModal, 900);

            } else {
                // ── SIGNUP ──
                const name = document.getElementById('auth-name').value.trim();
                if (!name) { showError('Please enter your full name.'); return; }

                const cred = await createUserWithEmailAndPassword(auth, email, password);
                const user = cred.user;
                await updateProfile(user, { displayName: name });
                await saveUserToFirestore(user, name, email);
                await saveCustomerToFirestore(name, null, email, null);

                showSuccess('✅ Account created! Welcome to Khan Services!');
                setTimeout(closeModal, 1100);
            }

        } catch (error) {
            console.error('Auth error:', error);
            showError(getFriendlyErrorMessage(error.code));
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = isForgotMode ? 'Send Reset Email' : (isLoginMode ? 'Login' : 'Create Account');
        }
    }

    // ─── Logout ───────────────────────────────────────────────────────────

    async function handleLogout() {
        try {
            await signOut(auth);
            window.dispatchEvent(new CustomEvent('user-logged-out'));
            showGlobalToast('👋 Logged out successfully.', 'info');
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    // ─── User Menu Dropdown (shown when clicking nav btn while logged in) ──

    function showUserMenu(anchor) {
        // Remove existing menu
        const existing = document.getElementById('user-dropdown');
        if (existing) { existing.remove(); return; }

        const name  = currentUser.displayName || currentUser.email.split('@')[0];
        const email = currentUser.email;

        const menu = document.createElement('div');
        menu.id = 'user-dropdown';
        menu.style.cssText = `
            position:absolute;top:calc(100% + 12px);right:0;
            background:var(--bg-card);border:1px solid var(--border);
            border-radius:16px;padding:8px;min-width:220px;z-index:1200;
            box-shadow:0 8px 32px rgba(0,0,0,0.3);
        `;
        menu.innerHTML = `
            <div style="padding:12px 16px;border-bottom:1px solid var(--border);margin-bottom:4px;">
                <div style="font-weight:700;font-size:0.95rem;">${name}</div>
                <div style="font-size:0.8rem;color:var(--text-muted);margin-top:2px;">${email}</div>
            </div>
            <a href="orders.html" style="display:flex;align-items:center;gap:10px;padding:10px 16px;border-radius:10px;color:var(--text-main);text-decoration:none;font-size:0.9rem;transition:0.2s;" 
               onmouseover="this.style.background='rgba(245,158,11,0.08)'" onmouseout="this.style.background='none'">
                <i data-lucide="package" style="width:16px;height:16px;"></i> My Orders
            </a>
            <a href="wishlist.html" style="display:flex;align-items:center;gap:10px;padding:10px 16px;border-radius:10px;color:var(--text-main);text-decoration:none;font-size:0.9rem;transition:0.2s;"
               onmouseover="this.style.background='rgba(245,158,11,0.08)'" onmouseout="this.style.background='none'">
                <i data-lucide="heart" style="width:16px;height:16px;"></i> Wishlist
            </a>
            <button onclick="window.AuthManager && window.AuthManager.logout()" style="display:flex;align-items:center;gap:10px;padding:10px 16px;border-radius:10px;color:#ef4444;background:none;border:none;cursor:pointer;font-family:inherit;font-size:0.9rem;width:100%;margin-top:4px;border-top:1px solid var(--border);">
                <i data-lucide="log-out" style="width:16px;height:16px;"></i> Logout
            </button>
        `;

        // Position relative to anchor's parent
        anchor.style.position = 'relative';
        anchor.appendChild(menu);

        if (window.lucide) window.lucide.createIcons();

        // Close on outside click
        setTimeout(() => {
            document.addEventListener('click', function handler(e) {
                if (!menu.contains(e.target) && e.target !== anchor) {
                    menu.remove();
                    document.removeEventListener('click', handler);
                }
            });
        }, 0);
    }

    // ─── UI Update ────────────────────────────────────────────────────────

    function updateUI(user) {
        const authNavBtn = document.getElementById('auth-nav-btn');
        if (!authNavBtn) return;

        if (user) {
            const name   = user.displayName || user.email.split('@')[0];
            const initials = name.charAt(0).toUpperCase();

            // Show avatar circle with first letter
            authNavBtn.innerHTML = `
                <div style="width:32px;height:32px;background:var(--primary);color:#000;
                     border-radius:50%;display:flex;align-items:center;justify-content:center;
                     font-weight:700;font-size:0.9rem;line-height:1;">
                    ${initials}
                </div>`;
            authNavBtn.setAttribute('title', `${name} — click for menu`);
        } else {
            authNavBtn.innerHTML = '<i data-lucide="user"></i>';
            authNavBtn.setAttribute('title', 'Login / Sign Up');
            if (window.lucide) window.lucide.createIcons();
        }
    }

    // ─── Firestore Saves ──────────────────────────────────────────────────

    async function saveUserToFirestore(user, name, email) {
        try {
            await setDoc(doc(db, 'users', user.uid), {
                uid:       user.uid,
                name:      name || '',
                email:     email || '',
                createdAt: serverTimestamp()
            }, { merge: true });
        } catch (err) {
            console.error('Error saving user:', err);
        }
    }

    async function saveCustomerToFirestore(name, phone, email, city) {
        if (!email) return;
        try {
            await setDoc(doc(db, 'customers', email.replace(/[@.]/g, '_')), {
                name: name || '', phone: phone || '',
                email: email || '', city: city || '',
                createdAt: serverTimestamp()
            }, { merge: true });
        } catch (err) {
            console.error('Error saving customer:', err);
        }
    }

    // ─── Message Helpers ──────────────────────────────────────────────────

    function clearMessages() {
        const e = document.getElementById('auth-error');
        const s = document.getElementById('auth-success');
        if (e) e.style.display = 'none';
        if (s) s.style.display = 'none';
    }

    function showError(msg) {
        const el = document.getElementById('auth-error');
        if (el) { el.textContent = msg; el.style.display = 'block'; }
    }

    function showSuccess(msg) {
        const el = document.getElementById('auth-success');
        if (el) { el.textContent = msg; el.style.display = 'block'; }
    }

    // ─── Auth Guard ────────────────────────────────────────────────────────
    // Call this before any protected action. If not logged in, shows login
    // modal with optional pending action to execute after login.

    function requireAuth(options = {}) {
        if (currentUser) return true; // Already logged in

        const noticeText = options.noticeText || 'Please login to continue.';
        if (options.pendingAction) {
            setPendingAction(options.pendingAction.type, options.pendingAction.product);
        }

        openModal({ noticeText });
        return false;
    }

    // ─── Global Error Codes ────────────────────────────────────────────────

    function getFriendlyErrorMessage(code) {
        const map = {
            'auth/user-not-found':       'No account found with this email. Please sign up.',
            'auth/wrong-password':        'Incorrect password. Please try again.',
            'auth/invalid-credential':    'Invalid email or password. Please check and try again.',
            'auth/email-already-in-use':  'This email is already registered. Please login instead.',
            'auth/weak-password':         'Password must be at least 6 characters.',
            'auth/invalid-email':         'Please enter a valid email address.',
            'auth/too-many-requests':     'Too many failed attempts. Try again later.',
            'auth/network-request-failed':'Network error. Check your internet connection.',
            'auth/popup-blocked':         'Popup was blocked. Please allow popups for this site.',
            'auth/cancelled-popup-request':'Sign-in cancelled.',
        };
        return map[code] || `Error: ${code}. Please try again.`;
    }

    // ─── Global Toast ─────────────────────────────────────────────────────

    function showGlobalToast(msg, type = 'info') {
        const old = document.getElementById('global-toast');
        if (old) old.remove();

        const colors = {
            success: { bg: 'var(--primary)', color: '#000' },
            error:   { bg: '#ef4444',        color: '#fff' },
            info:    { bg: 'var(--bg-card)', color: 'var(--text-main)' },
        };
        const c = colors[type] || colors.info;

        const toast = document.createElement('div');
        toast.id = 'global-toast';
        toast.style.cssText = `
            position:fixed;bottom:24px;right:16px;z-index:9999;
            background:${c.bg};color:${c.color};
            padding:12px 20px;border-radius:50px;
            font-weight:600;font-size:0.9rem;
            box-shadow:0 4px 20px rgba(0,0,0,0.3);
            display:flex;align-items:center;gap:8px;
            animation:slideInUp 0.3s ease;
            max-width:calc(100vw - 32px);
            border:1px solid var(--border);
        `;
        toast.textContent = msg;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    // ─── Protected Pages Guard ─────────────────────────────────────────────

    function checkProtectedPages() {
        const protectedPages = ['cart.html', 'checkout.html', 'orders.html', 'wishlist.html'];
        const path = window.location.pathname;
        const pageName = path.split('/').pop() || 'index.html';

        if (protectedPages.includes(pageName)) {
            // Block access by showing forced modal
            openModal({
                noticeText: 'Authentication required to access this page.',
                forced: true
            });
        } else if (pageName === 'index.html' || pageName === '') {
            // Requirement 1: Show popup on website open if not logged in
            if (!sessionStorage.getItem('initial_login_prompted')) {
                sessionStorage.setItem('initial_login_prompted', 'true');
                // Use a short delay so it doesn't jarringly block the initial paint
                setTimeout(() => {
                    openModal({ noticeText: 'Welcome! Please log in to unlock all features.' });
                }, 1000);
            }
        }
    }

    // ─── Public API ────────────────────────────────────────────────────────

    return {
        init,
        getUser:       () => currentUser,
        isLoggedIn:    () => !!currentUser,
        openModal,
        closeModal,
        requireAuth,
        logout:        handleLogout,
        setPendingAction,
        saveCustomerToFirestore
    };

})();

// Boot
AuthManager.init();
window.AuthManager = AuthManager;
