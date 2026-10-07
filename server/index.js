import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'data.json');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Helper to read DB
const readData = () => {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return {};
    }
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading DB:', err);
    return {};
  }
};

// Helper to write DB
const writeData = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing DB:', err);
    return false;
  }
};

// --- GET ALL DATA ---
app.get('/api/initial-data', (req, res) => {
  const db = readData();
  res.json(db);
});

// --- SETTINGS ---
app.get('/api/settings', (req, res) => {
  const db = readData();
  res.json(db.settings || {});
});

app.put('/api/settings', (req, res) => {
  const db = readData();
  db.settings = { ...db.settings, ...req.body };
  writeData(db);
  res.json({ success: true, settings: db.settings });
});

// --- INQUIRIES / LEADS ---
app.get('/api/inquiries', (req, res) => {
  const db = readData();
  res.json(db.inquiries || []);
});

app.post('/api/inquiries', (req, res) => {
  const db = readData();
  const newInquiry = {
    id: 'inq-' + Date.now(),
    createdAt: new Date().toISOString(),
    status: 'New',
    ...req.body
  };
  db.inquiries = [newInquiry, ...(db.inquiries || [])];
  writeData(db);
  res.json({ success: true, inquiry: newInquiry });
});

app.put('/api/inquiries/:id', (req, res) => {
  const db = readData();
  const { id } = req.params;
  const index = (db.inquiries || []).findIndex(item => item.id === id);
  if (index !== -1) {
    db.inquiries[index] = { ...db.inquiries[index], ...req.body };
    writeData(db);
    res.json({ success: true, inquiry: db.inquiries[index] });
  } else {
    res.status(404).json({ error: 'Inquiry not found' });
  }
});

app.delete('/api/inquiries/:id', (req, res) => {
  const db = readData();
  const { id } = req.params;
  db.inquiries = (db.inquiries || []).filter(item => item.id !== id);
  writeData(db);
  res.json({ success: true });
});

// --- WEB PROJECTS ---
app.get('/api/projects', (req, res) => {
  const db = readData();
  res.json(db.webProjects || []);
});

app.post('/api/projects', (req, res) => {
  const db = readData();
  const newItem = { id: 'proj-' + Date.now(), ...req.body };
  db.webProjects = [newItem, ...(db.webProjects || [])];
  writeData(db);
  res.json({ success: true, project: newItem });
});

app.delete('/api/projects/:id', (req, res) => {
  const db = readData();
  db.webProjects = (db.webProjects || []).filter(item => item.id !== req.params.id);
  writeData(db);
  res.json({ success: true });
});

// --- ELECTRICIAN SERVICES & GALLERY ---
app.get('/api/electrician-gallery', (req, res) => {
  const db = readData();
  res.json(db.electricianGallery || []);
});

app.post('/api/electrician-gallery', (req, res) => {
  const db = readData();
  const newItem = { id: 'gal-' + Date.now(), ...req.body };
  db.electricianGallery = [newItem, ...(db.electricianGallery || [])];
  writeData(db);
  res.json({ success: true, item: newItem });
});

app.delete('/api/electrician-gallery/:id', (req, res) => {
  const db = readData();
  db.electricianGallery = (db.electricianGallery || []).filter(item => item.id !== req.params.id);
  writeData(db);
  res.json({ success: true });
});

// --- TRAVEL PACKAGES & DESTINATIONS ---
app.get('/api/travel-destinations', (req, res) => {
  const db = readData();
  res.json(db.travelDestinations || []);
});

app.post('/api/travel-destinations', (req, res) => {
  const db = readData();
  const newItem = { id: 'dest-' + Date.now(), ...req.body };
  db.travelDestinations = [newItem, ...(db.travelDestinations || [])];
  writeData(db);
  res.json({ success: true, destination: newItem });
});

app.delete('/api/travel-destinations/:id', (req, res) => {
  const db = readData();
  db.travelDestinations = (db.travelDestinations || []).filter(item => item.id !== req.params.id);
  writeData(db);
  res.json({ success: true });
});

// --- APPS CATALOG ---
app.get('/api/apps', (req, res) => {
  const db = readData();
  res.json(db.apps || []);
});

app.post('/api/apps', (req, res) => {
  const db = readData();
  const newItem = { id: 'app-' + Date.now(), ...req.body };
  db.apps = [newItem, ...(db.apps || [])];
  writeData(db);
  res.json({ success: true, app: newItem });
});

app.delete('/api/apps/:id', (req, res) => {
  const db = readData();
  db.apps = (db.apps || []).filter(item => item.id !== req.params.id);
  writeData(db);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`🚀 KHAN Express API Server running on http://localhost:${PORT}`);
});
