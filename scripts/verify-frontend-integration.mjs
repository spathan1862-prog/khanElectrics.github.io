// ==============================================================================
// KHAN ELECTRICS - FRONTEND SUPABASE INTEGRATION VERIFICATION SCRIPT
// ==============================================================================
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Load environment variables manually from .env.local without external dotenv dependency
function loadEnv() {
  const envPath = path.join(rootDir, '.env.local');
  if (!fs.existsSync(envPath)) {
    throw new Error('.env.local file not found at project root.');
  }
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
      env[key] = val;
    }
  }
  return env;
}

const env = loadEnv();
const url = env.VITE_SUPABASE_URL;
const key = env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  console.error('[FAIL] Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY');
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false },
  realtime: { transport: class WebSocket {} }
});

console.log('==============================================================================');
console.log('TESTING REACT FRONTEND SUPABASE INTEGRATION');
console.log('==============================================================================\n');

let failedTests = 0;

async function runTest(testName, fn) {
  try {
    process.stdout.write(`Testing: ${testName} ... `);
    await fn();
    console.log('[PASSED]');
  } catch (err) {
    console.log('[FAILED]');
    console.error(`  Error: ${err.message}`);
    failedTests++;
  }
}

// TEST 1: Load Company Site Settings
await runTest('Load Company Site Settings (site_settings)', async () => {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 'company')
    .single();

  if (error) throw new Error(`Query error: ${error.message}`);
  if (!data || data.company_name !== 'KHAN') {
    throw new Error(`Unexpected site_settings data: ${JSON.stringify(data)}`);
  }
  if (!data.domain || !data.phone) {
    throw new Error('Required company fields (domain, phone) missing');
  }
});

// TEST 2: Load Published Web Projects
await runTest('Load Published Web Projects (web_projects)', async () => {
  const { data, error } = await supabase
    .from('web_projects')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) throw new Error(`Query error: ${error.message}`);
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('No web projects returned.');
  }
  const first = data[0];
  if (!first.title || !first.image) {
    throw new Error(`Invalid project structure: ${JSON.stringify(first)}`);
  }
});

// TEST 3: Load Electrician Gallery Items
await runTest('Load Electrician Gallery Items (electrician_gallery)', async () => {
  const { data, error } = await supabase
    .from('electrician_gallery')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) throw new Error(`Query error: ${error.message}`);
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('No gallery items returned.');
  }
  const first = data[0];
  if (!first.title || !first.url || !first.type) {
    throw new Error(`Invalid gallery structure: ${JSON.stringify(first)}`);
  }
});

// TEST 4: Load Apps Marketplace Catalog & Metadata
await runTest('Load Apps Catalog with Marketplace Metadata (apps)', async () => {
  const { data, error } = await supabase
    .from('apps')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) throw new Error(`Query error: ${error.message}`);
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('No apps returned.');
  }
  const first = data[0];
  if (!first.name || !first.platform || !first.pricing_type) {
    throw new Error(`Invalid app metadata: ${JSON.stringify(first)}`);
  }
});

// TEST 5: Anonymous Inquiry Submission (Public Insert Without .select())
await runTest('Public Customer Inquiry Submission (inquiries INSERT)', async () => {
  const testInquiry = {
    service_type: 'General Contact',
    name: 'Frontend Integration Test Runner',
    email: 'test-runner@khan-verification.local',
    phone: '+91 99999 00000',
    details: 'Automated integration verification lead submission',
    status: 'New'
  };

  // Must NOT append .select() because RLS forbids public SELECT on inquiries
  const { error } = await supabase
    .from('inquiries')
    .insert([testInquiry]);

  if (error) {
    throw new Error(`Inquiry insert failed: ${error.message}`);
  }
});

// TEST 6: Customer Inquiry Privacy Under RLS (Zero PII Leakage)
await runTest('Customer Lead Privacy Under RLS (Zero PII Leakage on SELECT)', async () => {
  const { data, error } = await supabase
    .from('inquiries')
    .select('*');

  // Under RLS, unauthenticated SELECT returns empty array or permission error, NEVER customer records
  if (data && data.length > 0) {
    throw new Error(`SECURITY VULNERABILITY: Public query returned ${data.length} customer inquiry records!`);
  }
});

// TEST 7: Unauthorized Write Prevention Under RLS
await runTest('Block Unauthorized Content Modification Under RLS', async () => {
  // Attempt to maliciously modify company name without admin JWT
  const { data, error } = await supabase
    .from('site_settings')
    .update({ company_name: 'HACKED' })
    .eq('id', 'company')
    .select();

  // If RLS works, 0 rows are updated and data is empty
  if (data && data.length > 0) {
    throw new Error('SECURITY VULNERABILITY: Anonymous user was able to modify site_settings!');
  }
});

console.log('\n==============================================================================');
if (failedTests === 0) {
  console.log('[SUCCESS] All 7 frontend Supabase integration tests PASSED successfully!');
  console.log('==============================================================================');
  process.exit(0);
} else {
  console.error(`[FAILURE] ${failedTests} test(s) failed.`);
  console.log('==============================================================================');
  process.exit(1);
}
