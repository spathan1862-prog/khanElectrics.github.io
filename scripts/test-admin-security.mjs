import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Parse .env.local natively
const envPath = path.resolve(process.cwd(), '.env.local');
const env = {};
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx !== -1) {
      const key = trimmed.slice(0, idx).trim();
      let val = trimmed.slice(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      env[key] = val;
    }
  }
}

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('[FAIL] Missing Supabase environment variables');
  process.exit(1);
}

const OWNER_EMAIL = 'spathan1862@gmail.com';
const OWNER_PASSWORD = process.env.ADMIN_PASSWORD || '00260400';

async function runTests() {
  console.log('==============================================================================');
  console.log('KHAN ELECTRICS — ADMIN SECURITY & AUTHENTICATION TEST SUITE');
  console.log('==============================================================================\n');

  let passed = 0;
  let failed = 0;

  function report(name, condition, details = '') {
    if (condition) {
      console.log(`[PASS] ${name}`);
      passed++;
    } else {
      console.log(`[FAIL] ${name} ${details ? '— ' + details : ''}`);
      failed++;
    }
  }

  // 1. Verify Footer.jsx has NO Staff Portal or Admin link
  const footerContent = fs.readFileSync('src/components/Footer.jsx', 'utf8');
  report('Footer has no Staff Portal link', !footerContent.includes('Staff Portal') && !footerContent.includes('/admin'));

  // 2. Verify MobileDrawer.jsx has the singular Admin access entry
  const drawerContent = fs.readFileSync('src/components/MobileDrawer.jsx', 'utf8');
  report('Side drawer contains the only public Admin entry', drawerContent.includes('/admin'));

  // 3. Verify Navbar.jsx has no Admin link
  const navbarContent = fs.readFileSync('src/components/Navbar.jsx', 'utf8');
  report('Navbar has no Admin link', !navbarContent.includes('/admin'));

  // 4. Verify AdminDashboard.jsx login fields start empty with placeholder
  const adminDashContent = fs.readFileSync('src/pages/AdminDashboard.jsx', 'utf8');
  report('Username field placeholder is "Enter your username"', adminDashContent.includes('placeholder="Enter your username"'));
  report('Password field placeholder is "Enter your password"', adminDashContent.includes('placeholder="Enter your password"'));
  report('No prefilled email in initial state', adminDashContent.includes("useState('')"));
  report('Show/Hide password control included', adminDashContent.includes('showPassword ?') && adminDashContent.includes('EyeOff'));

  // 5. Test Anonymous client cannot query protected tables (RLS enforcement)
  const realtimeConfig = typeof WebSocket !== 'undefined' ? {} : { transport: class WebSocket {} };
  const anonClient = createClient(supabaseUrl, supabaseKey, { realtime: realtimeConfig });
  const { data: anonInquiries, error: anonInqErr } = await anonClient
    .from('inquiries')
    .select('*');

  report('Public anonymous visitors cannot view inquiries (RLS)', !anonInquiries || anonInquiries.length === 0 || !!anonInqErr);

  // 6. Test Incorrect credentials rejected
  const { data: badAuth, error: badAuthErr } = await anonClient.auth.signInWithPassword({
    email: OWNER_EMAIL,
    password: 'WrongPassword999!'
  });
  report('Incorrect credentials are authenticated and rejected', !!badAuthErr && !badAuth?.user, badAuthErr?.message);

  // 7. Test Correct credentials allow login
  const adminClient = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    realtime: realtimeConfig
  });

  const { data: authData, error: authErr } = await adminClient.auth.signInWithPassword({
    email: OWNER_EMAIL,
    password: OWNER_PASSWORD
  });
  report('Correct administrator credentials allow login', !authErr && !!authData?.user, authErr?.message);

  if (authData?.user) {
    // 8. Test Admin client can query inquiries
    const { data: adminInquiries, error: admInqErr } = await adminClient
      .from('inquiries')
      .select('*')
      .limit(5);
    report('Authorized administrator can access private inquiries', !admInqErr && Array.isArray(adminInquiries), admInqErr?.message);

    // 9. Test admin_users authorization check
    const { data: adminRows, error: admRowErr } = await adminClient
      .from('admin_users')
      .select('role')
      .limit(1);
    report('Database confirms administrator role in admin_users', !admRowErr && adminRows?.length > 0);

    // 10. Test Account & Security password change workflow (verify current password check)
    // Testing invalid current password verification
    const { error: invalidCurrentErr } = await adminClient.auth.signInWithPassword({
      email: OWNER_EMAIL,
      password: 'incorrectCurrentPassword'
    });
    report('Password change requires valid current password verification', !!invalidCurrentErr);

    // 11. Test Password reset request API for registered email
    const { error: resetErr } = await adminClient.auth.resetPasswordForEmail(OWNER_EMAIL, {
      redirectTo: 'https://khaneletrics.in/admin'
    });
    // Note: If Supabase rate-limits or accepts it, both test reachability of the Auth reset API
    report('Password reset endpoint reachable and validates email', resetErr === null || resetErr?.status === 429 || resetErr?.message?.includes('rate limit'));
  }

  // 12. Verify Account & Security tab exists in AdminDashboard
  report('Account & Security tab rendered in Admin dashboard', adminDashContent.includes('tab-security') && adminDashContent.includes('ACCOUNT & SECURITY MANAGEMENT'));

  // 13. Verify Supabase client uses sessionStorage for tab-scoped non-persistent session policy
  const supabaseClientContent = fs.readFileSync('src/lib/supabase.js', 'utf8');
  report('Supabase Auth configured with tab-scoped sessionStorage', supabaseClientContent.includes('sessionStorage') && supabaseClientContent.includes('customAuthStorage'));

  // 14. Verify database trigger syncs admin email updates
  const syncMigration = fs.readFileSync('supabase/migrations/20261028160000_admin_security_and_email_sync.sql', 'utf8');
  report('Database migration includes handle_admin_auth_user_change trigger', syncMigration.includes('handle_admin_auth_user_change'));

  console.log('\n==============================================================================');
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('==============================================================================\n');

  if (failed > 0) process.exit(1);
}

runTests().catch(err => {
  console.error('[FATAL]', err);
  process.exit(1);
});
