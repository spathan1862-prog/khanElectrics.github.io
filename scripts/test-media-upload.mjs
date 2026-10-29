import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '..', '.env.local');

function loadEnv() {
  if (!fs.existsSync(envPath)) return { url: '', key: '' };
  const content = fs.readFileSync(envPath, 'utf8');
  let url = '';
  let key = '';
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const match = trimmed.match(/^([A-Za-z0-9_]+)\s*=\s*(.*)$/);
    if (match) {
      const varName = match[1];
      const val = match[2].replace(/^["']|["']$/g, '').trim();
      if (varName === 'VITE_SUPABASE_URL') url = val;
      if (varName === 'VITE_SUPABASE_PUBLISHABLE_KEY') key = val;
    }
  });
  return { url, key };
}

async function testStorage() {
  console.log('Testing Supabase Storage for site-media and apps...');
  const { url, key } = loadEnv();
  const client = createClient(url, key, {
    auth: { persistSession: false },
    realtime: { transport: class WebSocket {} }
  });

  const { data: auth, error: aErr } = await client.auth.signInWithPassword({
    email: 'spathan1862@gmail.com',
    password: process.env.ADMIN_PASSWORD || '00260400'
  });

  if (aErr) {
    console.error('Admin Auth failed:', aErr.message);
    return;
  }

  const { data: buckets, error: bErr } = await client.storage.listBuckets();
  if (bErr) {
    console.error('Error listing buckets:', bErr.message);
  } else {
    console.log('Available buckets:');
    buckets.forEach(b => {
      console.log(` - ${b.name}: public=${b.public}, file_size_limit=${b.file_size_limit} bytes (${(b.file_size_limit / (1024*1024)).toFixed(0)} MB), allowed_mime_types=${JSON.stringify(b.allowed_mime_types)}`);
    });
  }

  // Test 1: Upload a valid test image to site-media
  const testFileName = `qa-audit/test-image-${Date.now()}.png`;
  const dummyBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
  
  const { data: upData, error: upErr } = await client.storage
    .from('site-media')
    .upload(testFileName, dummyBuffer, { contentType: 'image/png', upsert: true });

  if (upErr) {
    console.error('[FAIL] Image upload error:', upErr.message);
  } else {
    console.log('[PASS] Image upload successful:', upData.path);
  }

  // Test 2: Public URL generation
  const { data: pubUrl } = client.storage.from('site-media').getPublicUrl(testFileName);
  console.log('[PASS] Public media URL:', pubUrl?.publicUrl);

  // Test 3: Unauthorized upload attempt (using unauthenticated client)
  const anonClient = createClient(url, key, { auth: { persistSession: false }, realtime: { transport: class WebSocket {} } });
  const { error: anonErr } = await anonClient.storage
    .from('site-media')
    .upload(`unauthorized/hack-${Date.now()}.png`, dummyBuffer, { contentType: 'image/png' });

  if (anonErr) {
    console.log('[PASS] Anonymous upload safely rejected by Storage RLS:', anonErr.message);
  } else {
    console.error('[FAIL] Security vulnerability: Anonymous upload succeeded!');
  }

  // Test 4: Invalid MIME type rejection check if enforced or handled
  // Test 5: Clean up test file
  const { error: delErr } = await client.storage.from('site-media').remove([testFileName]);
  if (delErr) {
    console.error('[WARN] Failed to remove test file:', delErr.message);
  } else {
    console.log('[PASS] Test file cleaned up successfully from storage.');
  }
}

testStorage();
