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

async function seed() {
  const { data: existing, error } = await client.from('web_projects').select('id');
  if (existing && existing.length > 0) {
    console.log(`web_projects already contains ${existing.length} records. No seed needed.`);
    return;
  }

  // Sign in as admin to insert
  const { data: authData, error: authError } = await client.auth.signInWithPassword({
    email: 'spathan1862@gmail.com',
    password: '00260400'
  });

  const adminClient = client;

  const initialProjects = [
    {
      title: 'Khan Electrics Website',
      category: 'Multi-Service Web Portal',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
      short_description: 'Official multi-service portal for Khan Electrics with Admin CMS.',
      detailed_description: 'Full-stack responsive web application featuring custom CMS, PostgreSQL database, storage uploads, and mobile-friendly service inquiries.',
      description: 'Official multi-service portal for Khan Electrics with Admin CMS.',
      link: 'https://khanelectrics.in',
      is_featured: true,
      is_published: true,
      sort_order: 1
    },
    {
      title: 'MedicoManager',
      category: 'Electron Desktop App',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
      short_description: 'Medical shop management desktop application with inventory & billing.',
      detailed_description: 'Offline-capable Electron desktop system built for pharmacies and medical shops with inventory tracking, invoicing, and prescription printing.',
      description: 'Medical shop management desktop application with inventory & billing.',
      link: '#',
      is_featured: true,
      is_published: true,
      sort_order: 2
    },
    {
      title: 'Tour & Travel Booking Platform',
      category: 'Booking & Tours',
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
      short_description: 'Custom domestic travel & holiday tour package booking portal.',
      detailed_description: 'Online booking flow, interactive itinerary display, and instant WhatsApp inquiry generation.',
      description: 'Custom domestic travel & holiday tour package booking portal.',
      link: '#',
      is_featured: true,
      is_published: true,
      sort_order: 3
    }
  ];

  const { data: inserted, error: inErr } = await adminClient
    .from('web_projects')
    .insert(initialProjects)
    .select();

  if (inErr) {
    console.error('Seed error:', inErr.message);
  } else {
    console.log(`Successfully seeded ${inserted.length} initial web projects into Supabase!`);
  }
}

seed();
