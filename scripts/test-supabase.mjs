import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '..', '.env.local');

// Safely parse .env.local without exposing values to stdout
function loadEnv() {
  if (!fs.existsSync(envPath)) {
    return { url: '', key: '' };
  }
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

async function runTest() {
  console.log('--- SUPABASE CONNECTION TEST ---');
  const { url, key } = loadEnv();

  console.log('Checking .env.local:');
  console.log('  - .env.local exists:', fs.existsSync(envPath));
  console.log('  - VITE_SUPABASE_URL configured:', Boolean(url));
  console.log('  - VITE_SUPABASE_PUBLISHABLE_KEY configured:', Boolean(key && key !== 'your_supabase_publishable_anon_key_here'));

  if (!url || !key || key === 'your_supabase_publishable_anon_key_here') {
    console.log('\n[STATUS: PENDING CREDENTIALS]');
    console.log('Please add your actual Supabase publishable key into .env.local to complete verification.');
    return;
  }

  console.log('\nTesting connection to Supabase project...');
  try {
    const client = createClient(url, key, {
      auth: { persistSession: false },
      realtime: { transport: class WebSocket {} },
    });

    // Make lightweight request to verify Auth service reachability
    const { data, error } = await client.auth.getSession();

    if (error) {
      console.log('\n[STATUS: FAILED]');
      console.log('Supabase API error:', error.message);
    } else {
      console.log('\n[STATUS: SUCCESS]');
      console.log('Successfully reached Supabase project endpoint!');
      console.log('Session verification completed.');
    }
  } catch (err) {
    console.log('\n[STATUS: NETWORK ERROR]');
    console.log('Error reaching Supabase:', err.message);
  }
}

runTest();
