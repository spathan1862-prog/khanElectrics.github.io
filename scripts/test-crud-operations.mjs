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
const client = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: false },
  realtime: { transport: class WebSocket {} }
});

console.log('==============================================================================');
console.log('KHAN ELECTRICS — DATABASE CRUD AND RLS VERIFICATION SUITE');
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

// First authenticate as admin
const { data: authData, error: authError } = await client.auth.signInWithPassword({
  email: 'spathan1862@gmail.com',
  password: '00260400'
});

if (authError) {
  console.error('Admin authentication failed:', authError.message);
  process.exit(1);
}

const adminClient = client;

// 1. Web Projects CRUD
await runTest('Web Projects: Add, Edit, Toggle Publish, and Delete', async () => {
  // Add
  const { data: inserted, error: addErr } = await adminClient
    .from('web_projects')
    .insert([{
      title: 'QA Automated Test Web Project',
      category: 'Testing',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
      short_description: 'Automated test project',
      detailed_description: 'Detailed description for test project',
      photos: ['https://images.unsplash.com/photo-1555066931-4365d14bab8c'],
      video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      link: 'https://test.khanelectrics.in',
      github_url: 'https://github.com/spathan1862-prog/test',
      is_featured: true,
      is_published: true,
      sort_order: 99
    }])
    .select()
    .single();

  if (addErr || !inserted?.id) throw new Error(`Add failed: ${addErr?.message}`);

  // Edit
  const { error: editErr } = await adminClient
    .from('web_projects')
    .update({ title: 'QA Automated Test Web Project (Edited)' })
    .eq('id', inserted.id);

  if (editErr) throw new Error(`Edit failed: ${editErr.message}`);

  // Delete
  const { error: delErr } = await adminClient
    .from('web_projects')
    .delete()
    .eq('id', inserted.id);

  if (delErr) throw new Error(`Delete failed: ${delErr.message}`);
});

// 2. Electrician Gallery CRUD
await runTest('Electrician Gallery: Add, Edit, and Delete', async () => {
  // Add
  const { data: inserted, error: addErr } = await adminClient
    .from('electrician_gallery')
    .insert([{
      title: 'QA Automated Test Electrician Work',
      category: 'House Wiring',
      location: 'Badnapur',
      type: 'photo',
      url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e',
      description: 'Test wiring job in Badnapur',
      before_image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e',
      after_image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31',
      is_published: true,
      sort_order: 99
    }])
    .select()
    .single();

  if (addErr || !inserted?.id) throw new Error(`Add failed: ${addErr?.message}`);

  // Edit
  const { error: editErr } = await adminClient
    .from('electrician_gallery')
    .update({ description: 'Updated test description' })
    .eq('id', inserted.id);

  if (editErr) throw new Error(`Edit failed: ${editErr.message}`);

  // Delete
  const { error: delErr } = await adminClient
    .from('electrician_gallery')
    .delete()
    .eq('id', inserted.id);

  if (delErr) throw new Error(`Delete failed: ${delErr.message}`);
});

// 3. Tour Destinations CRUD
await runTest('Tour Destinations: Add, Edit, and Delete', async () => {
  // Add
  const { data: inserted, error: addErr } = await adminClient
    .from('tour_destinations')
    .insert([{
      name: 'QA Automated Test Destination',
      starting_city: 'Jalna',
      destination_city: 'Ooty',
      cover_image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d',
      photos: ['https://images.unsplash.com/photo-1595815771614-ade9d652a65d'],
      description: 'Hill station tour',
      highlights: ['Botanical Gardens', 'Tea Estates'],
      price: '₹12,000 per person',
      is_price_on_request: false,
      duration: '4 Days / 3 Nights',
      is_published: true,
      sort_order: 99
    }])
    .select()
    .single();

  if (addErr || !inserted?.id) throw new Error(`Add failed: ${addErr?.message}`);

  // Edit
  const { error: editErr } = await adminClient
    .from('tour_destinations')
    .update({ price: '₹13,500 per person' })
    .eq('id', inserted.id);

  if (editErr) throw new Error(`Edit failed: ${editErr.message}`);

  // Delete
  const { error: delErr } = await adminClient
    .from('tour_destinations')
    .delete()
    .eq('id', inserted.id);

  if (delErr) throw new Error(`Delete failed: ${delErr.message}`);
});

// 4. Inquiries CRUD & Status
await runTest('Customer Inquiries: Submit, Read by Admin, Status Update, and Delete', async () => {
  // Public insert (anon)
  const anonClient = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: false },
    realtime: { transport: class WebSocket {} }
  });

  const { error: pubErr } = await anonClient
    .from('inquiries')
    .insert([{
      service_type: 'Web Development',
      name: 'QA Test Customer',
      phone: '+91 9999999999',
      email: 'qatest@example.com',
      details: 'Automated test inquiry',
      status: 'New'
    }]);

  if (pubErr) throw new Error(`Public insert failed: ${pubErr.message}`);

  // Read as admin
  const { data: inqRows, error: readErr } = await adminClient
    .from('inquiries')
    .select('*')
    .eq('name', 'QA Test Customer')
    .limit(1);

  if (readErr || !inqRows || inqRows.length === 0) throw new Error(`Admin read failed: ${readErr?.message}`);
  const inqId = inqRows[0].id;

  // Status Update
  const { error: statErr } = await adminClient
    .from('inquiries')
    .update({ status: 'Contacted' })
    .eq('id', inqId);

  if (statErr) throw new Error(`Status update failed: ${statErr.message}`);

  // Delete
  const { error: delErr } = await adminClient
    .from('inquiries')
    .delete()
    .eq('id', inqId);

  if (delErr) throw new Error(`Delete failed: ${delErr.message}`);
});

// 5. Website Appearance Update
await runTest('Website Appearance: JSONB Settings Update', async () => {
  const { data: before } = await adminClient
    .from('site_settings')
    .select('appearance')
    .eq('id', 'company')
    .single();

  const currentAppearance = before?.appearance || {};
  const updatedAppearance = {
    ...currentAppearance,
    featured_projects_visible: true,
    featured_destinations_visible: true
  };

  const { error: appErr } = await adminClient
    .from('site_settings')
    .update({ appearance: updatedAppearance })
    .eq('id', 'company');

  if (appErr) throw new Error(`Appearance update failed: ${appErr.message}`);
});

console.log('\n==============================================================================');
console.log(`CRUD VERIFICATION SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log('==============================================================================');
