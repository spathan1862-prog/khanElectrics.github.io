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

async function verifyTables() {
  console.log('--- SUPABASE SCHEMA VERIFICATION ---\n');
  const { url, key } = loadEnv();

  if (!url || !key) {
    console.log('Error: Missing Supabase credentials in .env.local');
    return;
  }

  const client = createClient(url, key, {
    auth: { persistSession: false },
    realtime: { transport: class WebSocket {} },
  });

  const tables = [
    'site_settings',
    'inquiries',
    'web_projects',
    'electrician_gallery',
    'tour_destinations',
    'apps'
  ];

  console.log('Checking database tables in Supabase schema:');
  let allExist = true;

  for (const table of tables) {
    try {
      const { data, error, status } = await client
        .from(table)
        .select('*')
        .limit(1);

      if (error) {
        if (error.code === 'PGRST205' || error.message.includes('Could not find the table')) {
          console.log(`  ❌ [MISSING] Table 'public.${table}' does not exist in schema yet.`);
          allExist = false;
        } else {
          // If RLS blocks head count or requires auth, but table exists:
          console.log(`  🔒 [RLS PROTECTED] Table 'public.${table}' exists. (${error.message})`);
        }
      } else {
        console.log(`  ✅ [FOUND] Table 'public.${table}' exists and is reachable.`);
      }
    } catch (err) {
      console.log(`  ⚠️ [ERROR] Exception testing '${table}':`, err.message);
      allExist = false;
    }
  }

  console.log('\n--- VERIFICATION RESULT ---');
  if (allExist) {
    console.log('STATUS: ALL TABLES EXIST AND ARE ACTIVE IN SUPABASE!');
  } else {
    console.log('STATUS: TABLES PENDING EXECUTION IN SUPABASE SQL EDITOR.');
    console.log('Action: Run the SQL in supabase/migrations/20261025000000_initial_schema.sql via Supabase Dashboard SQL Editor.');
  }
}

verifyTables();
