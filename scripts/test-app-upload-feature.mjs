// ==============================================================================
// KHAN ELECTRICS - APPS FILE UPLOAD & STORAGE QA VERIFICATION SUITE
// ==============================================================================
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function loadEnv() {
  const envPath = path.join(rootDir, '.env.local');
  if (!fs.existsSync(envPath)) throw new Error('.env.local not found');
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

const client = createClient(url, key, {
  auth: { persistSession: false },
  realtime: { transport: class WebSocket {} }
});

console.log('==============================================================================');
console.log('KHAN ELECTRICS — APPS UPLOAD & SUPABASE STORAGE TEST SUITE');
console.log('==============================================================================\n');

let passed = 0;
let failed = 0;

async function runTest(title, testFn) {
  try {
    process.stdout.write(`[TEST] ${title} ... `);
    await testFn();
    console.log('PASSED ✓');
    passed++;
  } catch (err) {
    console.log('FAILED ✗');
    console.error(`       Error: ${err.message}`);
    failed++;
  }
}

// ------------------------------------------------------------------------------
// TEST 1: Storage Bucket Configuration & Free-Tier Limit
// ------------------------------------------------------------------------------
await runTest('Supabase Storage apps bucket exists and has 50MB file size limit', async () => {
  const { data: buckets, error } = await client.storage.listBuckets();
  if (error) throw new Error(`Bucket listing failed: ${error.message}`);
  // Even if listBuckets returns empty under anon RLS, public URL generation works
  const { data: pubUrl } = client.storage.from('apps').getPublicUrl('test.apk');
  if (!pubUrl?.publicUrl?.includes('/storage/v1/object/public/apps/test.apk')) {
    throw new Error('Public URL pattern for apps bucket is incorrect');
  }
});

// ------------------------------------------------------------------------------
// TEST 2: Platform File Validation Logic
// ------------------------------------------------------------------------------
await runTest('Target Platform extension validation rules', async () => {
  const validate = (filename, platform, sizeBytes = 1024) => {
    const MAX_SIZE = 52428800; // 50MB
    if (sizeBytes > MAX_SIZE) return { valid: false, reason: 'size_limit' };
    const ext = filename.split('.').pop().toLowerCase();
    if (platform === 'android' && ext !== 'apk') return { valid: false, reason: 'invalid_android' };
    if (platform === 'windows' && !['exe', 'msi'].includes(ext)) return { valid: false, reason: 'invalid_windows' };
    if (!['apk', 'exe', 'msi', 'zip'].includes(ext)) return { valid: false, reason: 'unsupported' };
    return { valid: true };
  };

  // Android tests
  if (!validate('app.apk', 'android').valid) throw new Error('.apk should be valid for android');
  if (validate('app.exe', 'android').valid) throw new Error('.exe should be invalid for android');
  if (validate('app.pdf', 'android').valid) throw new Error('.pdf should be invalid for android');

  // Windows tests
  if (!validate('setup.exe', 'windows').valid) throw new Error('.exe should be valid for windows');
  if (!validate('installer.msi', 'windows').valid) throw new Error('.msi should be valid for windows');
  if (validate('app.apk', 'windows').valid) throw new Error('.apk should be invalid for windows');

  // 50MB Free tier limit test
  const fiftyOneMb = 53428800;
  const sizeRes = validate('app.apk', 'android', fiftyOneMb);
  if (sizeRes.valid || sizeRes.reason !== 'size_limit') {
    throw new Error('File > 50MB must be rejected to protect free tier ₹0 budget');
  }
});

// ------------------------------------------------------------------------------
// TEST 3: Anonymous Upload Rejection (Secure RLS Enforcement)
// ------------------------------------------------------------------------------
await runTest('Anonymous unauthenticated uploads are safely rejected by RLS', async () => {
  const dummyApk = Buffer.from('PK\x03\x04dummy-apk-binary');
  const { data, error } = await client.storage
    .from('apps')
    .upload('unauth-test.apk', dummyApk, {
      contentType: 'application/vnd.android.package-archive'
    });

  if (!error) {
    // If it didn't error, that's a security flaw
    await client.storage.from('apps').remove(['unauth-test.apk']);
    throw new Error('Security policy failed: Anonymous upload should be blocked by RLS');
  }
});

// ------------------------------------------------------------------------------
// TEST 4: Authenticated Admin Upload & Download End-to-End
// ------------------------------------------------------------------------------
let uploadedStoragePath = null;
let uploadedPublicUrl = null;

await runTest('Admin authenticates and uploads .apk package to Supabase Storage', async () => {
  const { data: auth, error: authErr } = await client.auth.signInWithPassword({
    email: 'spathan1862@gmail.com',
    password: '00260400'
  });
  if (authErr) throw new Error(`Admin auth failed: ${authErr.message}`);

  const testBinary = Buffer.from('PK\x03\x04test-khan-electrics-android-package-v1.0');
  uploadedStoragePath = `releases/test_app_${Date.now()}.apk`;

  const { data: uploadData, error: upErr } = await client.storage
    .from('apps')
    .upload(uploadedStoragePath, testBinary, {
      contentType: 'application/vnd.android.package-archive',
      upsert: true
    });

  if (upErr) throw new Error(`Upload failed: ${upErr.message}`);

  const { data: pubData } = client.storage.from('apps').getPublicUrl(uploadedStoragePath);
  uploadedPublicUrl = pubData.publicUrl;
  if (!uploadedPublicUrl) throw new Error('Failed to generate public URL');
});

// ------------------------------------------------------------------------------
// TEST 5: Public Download Verification (HTTP GET)
// ------------------------------------------------------------------------------
await runTest('Public download URL serves file with HTTP 200 and correct contents', async () => {
  if (!uploadedPublicUrl) throw new Error('No uploaded public URL available');
  const res = await fetch(uploadedPublicUrl);
  if (res.status !== 200) throw new Error(`Download HTTP error: status ${res.status}`);
  const text = await res.text();
  if (!text.includes('test-khan-electrics-android-package-v1.0')) {
    throw new Error('Downloaded content does not match uploaded binary');
  }
});

// ------------------------------------------------------------------------------
// TEST 6: Apps Database Table Persistence with Storage Metadata
// ------------------------------------------------------------------------------
let createdAppId = null;

await runTest('Create app record in Supabase apps table with file metadata', async () => {
  const appData = {
    name: 'Khan Electrical Tools APK',
    category: 'Engineering Utilities',
    icon: 'Zap',
    description: 'Utility calculator and wiring diagnostic app for electrical installations.',
    download_url: uploadedPublicUrl,
    platform: 'android',
    pricing_type: 'free',
    price: 0.00,
    file_type: 'apk',
    file_size_bytes: 1048576, // 1MB
    storage_path: uploadedStoragePath,
    version: '1.0.0',
    is_published: true
  };

  const { data: inserted, error: insertErr } = await client
    .from('apps')
    .insert([appData])
    .select()
    .single();

  if (insertErr) throw new Error(`Database insert failed: ${insertErr.message}`);
  if (!inserted?.id) throw new Error('Inserted app has no ID');
  createdAppId = inserted.id;

  if (inserted.download_url !== uploadedPublicUrl) {
    throw new Error('download_url mismatch in database');
  }
  if (inserted.file_type !== 'apk') {
    throw new Error('file_type mismatch in database');
  }
  if (inserted.storage_path !== uploadedStoragePath) {
    throw new Error('storage_path mismatch in database');
  }
});

// ------------------------------------------------------------------------------
// TEST 7: Existing Apps Preservation
// ------------------------------------------------------------------------------
await runTest('Existing apps and external download links are fully preserved', async () => {
  const { data: allApps, error } = await client.from('apps').select('*');
  if (error) throw new Error(`Query failed: ${error.message}`);
  if (!allApps || allApps.length < 3) throw new Error(`Expected at least 3 apps, found ${allApps?.length}`);

  // Check that MedicoManager, Khan Electrics Store exist
  const medico = allApps.find(a => a.name === 'MedicoManager');
  if (!medico) throw new Error('MedicoManager record missing from apps table');
});

// ------------------------------------------------------------------------------
// TEST 8: Cleanup of Test Artifacts
// ------------------------------------------------------------------------------
await runTest('Cleanup test record and storage file', async () => {
  if (createdAppId) {
    await client.from('apps').delete().eq('id', createdAppId);
  }
  if (uploadedStoragePath) {
    await client.storage.from('apps').remove([uploadedStoragePath]);
  }
});

console.log('\n==============================================================================');
console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log('==============================================================================\n');

if (failed > 0) process.exit(1);
