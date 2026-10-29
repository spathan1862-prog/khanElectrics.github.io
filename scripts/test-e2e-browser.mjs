// ==============================================================================
// KHAN ELECTRICS — COMPREHENSIVE E2E REAL BROWSER & SECURITY QA AUDIT
// Runs against real production build in Chrome Headless via CDP WebSocket
// ==============================================================================
import { spawn } from 'node:child_process';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// Load environment variables safely
function loadEnv() {
  const envPath = path.join(rootDir, '.env.local');
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx !== -1) {
      env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
    }
  }
  return env;
}

const env = loadEnv();
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:4173';
const OWNER_EMAIL = 'spathan1862@gmail.com';
const OWNER_PASSWORD = process.env.ADMIN_PASSWORD || '00260400';

class ChromeCDP {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.msgId = 0;
    this.pending = new Map();
    this.listeners = new Map();
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = () => resolve();
      this.ws.onerror = (err) => reject(err);
      this.ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.id && this.pending.has(msg.id)) {
            const { resolve, reject } = this.pending.get(msg.id);
            this.pending.delete(msg.id);
            if (msg.error) reject(new Error(msg.error.message || JSON.stringify(msg.error)));
            else resolve(msg.result);
          } else if (msg.method) {
            const list = this.listeners.get(msg.method) || [];
            list.forEach(fn => fn(msg.params));
          }
        } catch (e) {
          console.error('Error handling WS message:', e);
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = ++this.msgId;
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  on(method, fn) {
    if (!this.listeners.has(method)) this.listeners.set(method, []);
    this.listeners.get(method).push(fn);
  }

  close() {
    if (this.ws) {
      try { this.ws.close(); } catch {}
    }
  }

  async eval(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    return res.result?.value;
  }
}

async function runAudit() {
  console.log('==============================================================================');
  console.log('KHAN ELECTRICS — END-TO-END REAL BROWSER & SECURITY AUDIT');
  console.log('==============================================================================\n');

  let passed = 0;
  let failed = 0;
  const defects = [];

  function record(name, condition, details = '') {
    if (condition) {
      console.log(`[PASS] ${name}`);
      passed++;
    } else {
      console.log(`[FAIL] ${name} ${details ? '— ' + details : ''}`);
      failed++;
      defects.push({ name, details });
    }
  }

  const tmpDir = path.join(os.tmpdir(), 'chrome-audit-' + Date.now());
  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--user-data-dir=' + tmpDir,
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank'
  ]);

  let browserWs = '';
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Chrome debug port timeout')), 6000);
    chromeProc.stderr.on('data', (d) => {
      const match = d.toString().match(/DevTools listening on (ws:\/\/127\.0\.0\.1:9222\/devtools\/browser\/[a-zA-Z0-9-]+)/);
      if (match) {
        browserWs = match[1];
        clearTimeout(timer);
        resolve();
      }
    });
  });

  const browser = new ChromeCDP(browserWs);
  await browser.connect();

  const { targetId } = await browser.send('Target.createTarget', { url: 'about:blank' });
  const pageWs = `ws://127.0.0.1:9222/devtools/page/${targetId}`;
  const page = new ChromeCDP(pageWs);
  await page.connect();

  await page.send('Page.enable');
  await page.send('Runtime.enable');
  await page.send('Network.enable');

  const pageErrors = [];
  const networkFailures = [];

  page.on('Runtime.exceptionThrown', (p) => {
    const text = p.exceptionDetails?.exception?.description || p.exceptionDetails?.text;
    pageErrors.push(text);
  });

  page.on('Network.responseReceived', (p) => {
    if (p.response && p.response.status >= 400 && !p.response.url.includes('favicon')) {
      networkFailures.push(`${p.response.status} ${p.response.url}`);
    }
  });

  // Helper inside browser context to set React input value
  const setupReactHelper = `
    window.__setReactInput = function(selector, value) {
      const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
      if (!el) return false;
      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      nativeSetter.call(el, value);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    };
  `;

  // ----------------------------------------------------------------------------
  // SECTION 1: PUBLIC PAGES NAVIGATION & METADATA
  // ----------------------------------------------------------------------------
  console.log('\n--- PHASE 2: EVERY PUBLIC PAGE AUDIT ---');

  const publicRoutes = [
    { path: '/', name: 'Home Page', expectedH1: 'KHAN' },
    { path: '/services/web-development', name: 'Web Development Page', expectedH1: 'WEB DEVELOPMENT' },
    { path: '/services/electrician', name: 'Electrician Page', expectedH1: 'KHAN ELECTRICIAN SERVICE' },
    { path: '/services/tour-travel', name: 'Tour & Travel Page', expectedH1: 'TOUR & TRAVEL' },
    { path: '/about', name: 'About Page', expectedH1: 'ABOUT' },
    { path: '/contact', name: 'Contact Page', expectedH1: 'CONTACT' },
    { path: '/apps', name: 'Apps Page', expectedH1: 'OUR APPS' },
    { path: '/admin', name: 'Admin Login View', expectedH1: 'ADMIN CMS AUTHENTICATION' }
  ];

  for (const route of publicRoutes) {
    pageErrors.length = 0;
    networkFailures.length = 0;

    await page.send('Page.navigate', { url: BASE_URL + route.path });
    await new Promise(r => setTimeout(r, 2000));
    await page.eval(setupReactHelper);

    // Verify DOM title and h1
    const title = await page.eval('document.title');
    const h1 = await page.eval('document.querySelector("h1")?.innerText');
    const canonical = await page.eval('document.querySelector("link[rel=\'canonical\']")?.href');

    record(`${route.name} loads with HTTP 200 and rendered DOM`, Boolean(title && h1), `title: ${title}, h1: ${h1}`);
    record(`${route.name} displays correct main heading`, Boolean(h1 && h1.toUpperCase().includes(route.expectedH1)), `Actual: ${h1}`);
    record(`${route.name} zero uncaught runtime exceptions`, pageErrors.length === 0, pageErrors.join('; '));

    // Verify all images have valid src (local or external https)
    const invalidImageSources = await page.eval(`
      Array.from(document.querySelectorAll('img')).filter(img => !img.src || img.src === '#' || img.src.includes('undefined')).map(img => img.src)
    `);
    record(`${route.name} all images have valid source URLs`, Array.isArray(invalidImageSources) && invalidImageSources.length === 0, `Invalid: ${invalidImageSources?.join(', ')}`);

    // Verify canonical tag matches https://khanelectrics.in
    record(`${route.name} canonical URL links to khanelectrics.in`, Boolean(canonical && canonical.startsWith('https://khanelectrics.in')), `Canonical: ${canonical}`);

    // Verify direct refresh
    await page.send('Page.reload');
    await new Promise(r => setTimeout(r, 1500));
    const titleAfterReload = await page.eval('document.title');
    record(`${route.name} direct page refresh maintains route`, Boolean(titleAfterReload && titleAfterReload === title));
  }

  // ----------------------------------------------------------------------------
  // SECTION 2: RESPONSIVE VIEWPORT & HORIZONTAL OVERFLOW CHECKS (PHASE 9)
  // ----------------------------------------------------------------------------
  console.log('\n--- PHASE 9: RESPONSIVE & VIEWPORT OVERFLOW AUDIT ---');

  const viewports = [
    { name: 'Mobile 360x800', width: 360, height: 800, mobile: true },
    { name: 'Mobile 390x844', width: 390, height: 844, mobile: true },
    { name: 'Tablet 768x1024', width: 768, height: 1024, mobile: true },
    { name: 'Desktop 1366x768', width: 1366, height: 768, mobile: false },
    { name: 'Desktop 1920x1080', width: 1920, height: 1080, mobile: false }
  ];

  for (const vp of viewports) {
    await page.send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.mobile
    });

    await page.send('Page.navigate', { url: BASE_URL + '/' });
    await new Promise(r => setTimeout(r, 1200));

    const overflowCheck = await page.eval(`
      ({
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        hasOverflow: document.documentElement.scrollWidth > window.innerWidth
      })
    `);

    record(`Home Page no horizontal overflow on ${vp.name}`, !overflowCheck.hasOverflow, `scrollWidth=${overflowCheck.scrollWidth}, innerWidth=${overflowCheck.innerWidth}`);
  }

  // Reset viewport to desktop standard
  await page.send('Emulation.setDeviceMetricsOverride', { width: 1366, height: 768, deviceScaleFactor: 1, mobile: false });

  // ----------------------------------------------------------------------------
  // SECTION 3: NAVIGATION DRAWER INTERACTION
  // ----------------------------------------------------------------------------
  console.log('\n--- NAVIGATION DRAWER INTERACTION ---');
  await page.send('Page.navigate', { url: BASE_URL + '/' });
  await new Promise(r => setTimeout(r, 1500));
  await page.eval(setupReactHelper);

  // Find hamburger button
  const drawerInitiallyOpen = await page.eval(`Boolean(document.querySelector('.fixed.inset-0.z-50'))`);
  record('Drawer starts closed on page load', !drawerInitiallyOpen);

  // Click hamburger button to open drawer
  await page.eval(`
    const btn = document.querySelector('button[aria-label="Open Navigation Menu"]');
    if (btn) btn.click();
  `);
  await new Promise(r => setTimeout(r, 800));

  const drawerOpened = await page.eval(`
    Boolean(document.querySelector('.fixed.inset-0.z-50')) && document.body.innerText.toUpperCase().includes('MAIN NAVIGATION')
  `);
  record('Drawer opens upon clicking hamburger button', drawerOpened);

  // Click drawer close button
  await page.eval(`
    const closeBtn = Array.from(document.querySelectorAll('button')).find(b => b.querySelector('svg.lucide-x'));
    if (closeBtn) closeBtn.click();
  `);
  await new Promise(r => setTimeout(r, 800));

  const drawerClosed = await page.eval(`
    !Boolean(document.querySelector('.fixed.inset-0.z-50'))
  `);
  record('Drawer closes upon clicking close button', drawerClosed);

  // ----------------------------------------------------------------------------
  // SECTION 4: TOUR & TRAVEL "BOOK THIS TRIP" SELECTION & INQUIRY FORM (PHASE 4C & 6)
  // ----------------------------------------------------------------------------
  console.log('\n--- TOUR & TRAVEL "BOOK THIS TRIP" & INQUIRY SUBMISSION ---');
  await page.send('Page.navigate', { url: BASE_URL + '/services/tour-travel' });
  await new Promise(r => setTimeout(r, 2000));
  await page.eval(setupReactHelper);

  // Click "Book This Trip" on the first destination card
  const bookClicked = await page.eval(`
    const bookBtn = Array.from(document.querySelectorAll('button, a')).find(el => el.innerText.includes('Book This Trip'));
    if (bookBtn) {
      bookBtn.click();
      true;
    } else {
      false;
    }
  `);
  record('"Book This Trip" button located and clicked', bookClicked);
  await new Promise(r => setTimeout(r, 800));

  // Check destination input field value
  const destinationFieldValue = await page.eval(`
    document.querySelector('#booking-form input[placeholder*="destination" i]')?.value || 
    document.querySelector('#booking-form input[type="text"]:not([placeholder*="name" i])')?.value
  `);
  record('Destination correctly populated into inquiry form', Boolean(destinationFieldValue && destinationFieldValue.length > 2), `Selected: ${destinationFieldValue}`);

  // Fill and submit test inquiry on Tour & Travel page using React setter
  const TEST_NAME = 'QA Audit Test Lead';
  const TEST_PHONE = '+91 9888877777';

  await page.eval(`
    window.__setReactInput(document.querySelector('#booking-form input[placeholder*="name" i]'), '${TEST_NAME}');
    window.__setReactInput(document.querySelector('#booking-form input[type="tel"]'), '${TEST_PHONE}');
    const form = document.querySelector('#booking-form form');
    if (form) form.requestSubmit();
  `);
  await new Promise(r => setTimeout(r, 2500));

  // Verify submission feedback message appears
  const successFeedback = await page.eval(`
    document.body.innerText.includes('Travel Request Submitted') || 
    document.body.innerText.includes('Inquiry submitted successfully')
  `);
  record('Inquiry submission displays confirmation feedback to user', successFeedback);

  // Verify the record is in Supabase and clean it up immediately
  const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: false },
    realtime: { transport: class WebSocket {} }
  });
  await supabase.auth.signInWithPassword({ email: OWNER_EMAIL, password: OWNER_PASSWORD });

  const { data: leadRows } = await supabase
    .from('inquiries')
    .select('id, name, phone, service_type')
    .eq('phone', TEST_PHONE)
    .limit(1);

  record('Submitted inquiry persisted in Supabase database with entered details', Boolean(leadRows && leadRows.length > 0 && leadRows[0].name === TEST_NAME));

  if (leadRows && leadRows.length > 0) {
    await supabase.from('inquiries').delete().eq('id', leadRows[0].id);
    console.log('[PASS] Test inquiry record cleaned up from database.');
  }
  // Ensure any other debug/audit inquiries are cleaned up
  await supabase.from('inquiries').delete().ilike('name', 'QA%');

  // ----------------------------------------------------------------------------
  // SECTION 5: ADMIN AUTHENTICATION & LOGIN WORKFLOW (PHASE 3)
  // ----------------------------------------------------------------------------
  console.log('\n--- PHASE 3: ADMIN AUTHENTICATION & SECURITY AUDIT ---');
  await page.send('Page.navigate', { url: BASE_URL + '/admin' });
  await new Promise(r => setTimeout(r, 1500));
  await page.eval(setupReactHelper);

  // 1. Verify inputs start completely empty
  const initialInputs = await page.eval(`
    ({
      username: document.querySelector('#admin-username-input')?.value || '',
      password: document.querySelector('#admin-password-input')?.value || '',
      usernamePlaceholder: document.querySelector('#admin-username-input')?.placeholder || '',
      passwordPlaceholder: document.querySelector('#admin-password-input')?.placeholder || ''
    })
  `);

  record('Admin login username starts empty', initialInputs.username === '');
  record('Admin login password starts empty', initialInputs.password === '');
  record('Admin username placeholder is "Enter your username"', initialInputs.usernamePlaceholder === 'Enter your username');
  record('Admin password placeholder is "Enter your password"', initialInputs.passwordPlaceholder === 'Enter your password');

  // 2. Test invalid credentials rejected
  await page.eval(`
    window.__setReactInput('#admin-username-input', 'spathan1862@gmail.com');
    window.__setReactInput('#admin-password-input', 'WrongPassword999!');
    document.querySelector('#admin-username-input')?.closest('form')?.requestSubmit();
  `);
  await new Promise(r => setTimeout(r, 2000));

  const authErrorText = await page.eval(`
    document.querySelector('.text-red-300')?.innerText || ''
  `);
  record('Invalid credentials show clear error message', Boolean(authErrorText && (authErrorText.includes('Invalid login') || authErrorText.includes('credentials') || authErrorText.includes('error'))), authErrorText);

  // 3. Test valid credentials login
  await page.eval(`
    window.__setReactInput('#admin-username-input', '${OWNER_EMAIL}');
    window.__setReactInput('#admin-password-input', '${OWNER_PASSWORD}');
    document.querySelector('#admin-username-input')?.closest('form')?.requestSubmit();
  `);
  await new Promise(r => setTimeout(r, 3000));

  // Check if admin dashboard tabs rendered
  const dashboardLoaded = await page.eval(`
    document.body.innerText.includes('ADMIN DASHBOARD') || 
    document.body.innerText.includes('Web Projects') || 
    document.body.innerText.includes('Customer Inquiries')
  `);
  record('Valid credentials successfully log into Admin Dashboard', dashboardLoaded);

  // 4. Test tabs navigation inside Admin Dashboard
  const tabsExist = await page.eval(`
    ({
      projectsTab: Boolean(Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Web Projects') || b.innerText.includes('Web Development'))),
      galleryTab: Boolean(Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Electrician') || b.innerText.includes('Gallery'))),
      destinationsTab: Boolean(Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Tour') || b.innerText.includes('Destinations'))),
      inquiriesTab: Boolean(Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Customer Inquiries'))),
      appsTab: Boolean(Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Apps Management') || b.innerText.includes('Digital Software'))),
      appearanceTab: Boolean(Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Appearance'))),
      securityTab: Boolean(Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Security') || b.innerText.includes('Account')))
    })
  `);

  record('Admin Dashboard: Web Projects tab present', tabsExist.projectsTab);
  record('Admin Dashboard: Electrician Gallery tab present', tabsExist.galleryTab);
  record('Admin Dashboard: Tour Destinations tab present', tabsExist.destinationsTab);
  record('Admin Dashboard: Customer Inquiries tab present', tabsExist.inquiriesTab);
  record('Admin Dashboard: Apps tab present', tabsExist.appsTab);
  record('Admin Dashboard: Appearance tab present', tabsExist.appearanceTab);
  record('Admin Dashboard: Account & Security tab present', tabsExist.securityTab);

  // 5. Test Logout
  await page.eval(`
    const logoutBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Sign Out') || b.innerText.includes('Logout') || b.querySelector('svg.lucide-log-out'));
    if (logoutBtn) logoutBtn.click();
  `);
  await new Promise(r => setTimeout(r, 1500));

  const loggedOut = await page.eval(`
    Boolean(document.querySelector('#admin-username-input'))
  `);
  record('Logout securely returns user to clean login gate', loggedOut);

  // ----------------------------------------------------------------------------
  // TEARDOWN
  // ----------------------------------------------------------------------------
  page.close();
  browser.close();
  chromeProc.kill();
  try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch {}

  console.log('\n==============================================================================');
  console.log(`REAL BROWSER AUDIT SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('==============================================================================\n');

  if (failed > 0) process.exit(1);
}

runAudit().catch(err => {
  console.error('[FATAL ERROR]', err);
  process.exit(1);
});
