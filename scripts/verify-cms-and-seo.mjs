import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
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

const SUPABASE_URL = env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY;
const OWNER_EMAIL = 'spathan1862@gmail.com';
const OWNER_PASSWORD = env.ADMIN_SEED_PASSWORD || '00260400';

const clientOptions = {
  auth: { persistSession: false },
  realtime: { transport: class DummyWebSocket {} }
};

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passed++;
  } else {
    console.error(`[FAIL] ${message}`);
    failed++;
  }
}

async function run() {
  console.log('==============================================================================');
  console.log('KHAN ELECTRICS — CMS, RELEASES, WHATSAPP & SEO VERIFICATION SUITE');
  console.log('==============================================================================\n');

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, clientOptions);

  // 1. Verify service_pages records exist
  const { data: servicePages, error: spErr } = await supabase
    .from('service_pages')
    .select('id, page_name, title, is_published, sections, faqs');

  assert(!spErr && servicePages && servicePages.length >= 3,
    `service_pages table contains ${servicePages?.length || 0} service records (expected >= 3)`);

  const pageIds = (servicePages || []).map(p => p.id);
  assert(pageIds.includes('web-development'), 'web-development page record exists');
  assert(pageIds.includes('electrician'), 'electrician page record exists');
  assert(pageIds.includes('tour-travel'), 'tour-travel page record exists');

  // 2. Verify site_settings has extended WhatsApp and Service Areas fields
  const { data: settingsRow, error: setErr } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 'company')
    .single();

  assert(!setErr && settingsRow, 'site_settings company record loaded');
  assert(settingsRow?.whatsapp === '+91 7822886909' || settingsRow?.whatsapp?.includes('7822886909'),
    `site_settings WhatsApp number is configured (${settingsRow?.whatsapp})`);
  assert(settingsRow?.service_areas?.includes('Badnapur') || settingsRow?.service_areas?.includes('Jalna'),
    `site_settings service_areas includes Badnapur/Jalna (${settingsRow?.service_areas})`);

  // 3. Authenticate Admin and Test site-media Storage Bucket Upload
  const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
    email: OWNER_EMAIL,
    password: OWNER_PASSWORD
  });

  assert(!authErr && authData?.session, `Admin authenticated successfully as ${OWNER_EMAIL}`);

  const adminClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    ...clientOptions,
    global: { headers: { Authorization: `Bearer ${authData?.session?.access_token}` } }
  });

  // Test image upload to site-media bucket
  const testImagePath = `test/test-hero-${Date.now()}.png`;
  // 1x1 transparent PNG buffer
  const samplePngBuffer = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64'
  );

  const { data: uploadImg, error: upImgErr } = await adminClient.storage
    .from('site-media')
    .upload(testImagePath, samplePngBuffer, { contentType: 'image/png', upsert: true });

  assert(!upImgErr && uploadImg, 'Admin uploaded test image to site-media storage bucket');

  const { data: imgUrlData } = adminClient.storage.from('site-media').getPublicUrl(testImagePath);
  assert(imgUrlData?.publicUrl?.includes('site-media'), `Public image URL generated (${imgUrlData?.publicUrl})`);

  // Cleanup test image
  await adminClient.storage.from('site-media').remove([testImagePath]);

  // 4. Test service_pages CMS update
  const { error: updateErr } = await adminClient
    .from('service_pages')
    .update({
      badge: 'CYBER & TECH NEON ENVIRONMENT',
      updated_at: new Date().toISOString()
    })
    .eq('id', 'web-development');

  assert(!updateErr, 'Admin updated web-development CMS page record');

  // 5. Verify local files: sitemap.xml, robots.txt, index.html schema
  const sitemapPath = path.join(rootDir, 'public', 'sitemap.xml');
  const sitemapContent = fs.existsSync(sitemapPath) ? fs.readFileSync(sitemapPath, 'utf8') : '';
  assert(sitemapContent.includes('https://khanelectrics.in/') &&
         sitemapContent.includes('/services/web-development') &&
         sitemapContent.includes('/services/electrician') &&
         sitemapContent.includes('/services/tour-travel'),
    'public/sitemap.xml includes all public service pages');

  const robotsPath = path.join(rootDir, 'public', 'robots.txt');
  const robotsContent = fs.existsSync(robotsPath) ? fs.readFileSync(robotsPath, 'utf8') : '';
  assert(robotsContent.includes('Allow: /') && robotsContent.includes('Disallow: /admin') && robotsContent.includes('sitemap.xml'),
    'public/robots.txt allows public crawling, disallows /admin, and references sitemap.xml');

  const indexHtmlPath = path.join(rootDir, 'index.html');
  const indexHtmlContent = fs.existsSync(indexHtmlPath) ? fs.readFileSync(indexHtmlPath, 'utf8') : '';
  assert(indexHtmlContent.includes('application/ld+json') && indexHtmlContent.includes('LocalBusiness'),
    'index.html contains Schema.org LocalBusiness structured data');
  assert(indexHtmlContent.includes('rel="canonical" href="https://khanelectrics.in/"'),
    'index.html contains valid canonical link');

  // 6. Verify WhatsApp component configuration
  const waPath = path.join(rootDir, 'src', 'components', 'WhatsAppButton.jsx');
  const waContent = fs.existsSync(waPath) ? fs.readFileSync(waPath, 'utf8') : '';
  assert(waContent.includes('7822886909') && waContent.includes('https://wa.me/'),
    'WhatsAppButton uses international format https://wa.me/917822886909');
  assert(waContent.includes('location.pathname.startsWith(\'/admin\')'),
    'WhatsAppButton is hidden inside /admin pages');

  console.log('\n==============================================================================');
  console.log(`VERIFICATION SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('==============================================================================\n');

  if (failed > 0) process.exit(1);
}

run().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
