const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(__dirname));

// DATA SETUP
const DATA_DIR = process.env.RENDER_DISK_PATH || path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'data.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// ============================================================
// API ROUTES
// ============================================================

app.get('/api/applications', (req, res) => {
  res.json(readData());
});

// CRITICAL: POST route must be defined
app.post('/api/applications', (req, res) => {
  console.log('✅ POST received');
  console.log('Body:', req.body);
  
  const apps = readData();
  const newApp = req.body;
  
  // Validate
  if (!newApp.referenceNumber) {
    return res.status(400).json({ error: 'Reference number required' });
  }
  
  apps.push(newApp);
  writeData(apps);
  
  console.log('✅ Saved:', newApp.referenceNumber);
  res.status(201).json(newApp);
});

app.put('/api/applications/:id', (req, res) => {
  const apps = readData();
  const id = req.params.id;
  const index = apps.findIndex(a => a.referenceNumber === id || a.certificateNumber === id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  apps[index] = { ...apps[index], ...req.body };
  writeData(apps);
  res.json(apps[index]);
});

app.delete('/api/applications/:id', (req, res) => {
  const apps = readData();
  const id = req.params.id;
  const filtered = apps.filter(a => a.referenceNumber !== id && a.certificateNumber !== id);
  if (filtered.length === apps.length) return res.status(404).json({ error: 'Not found' });
  writeData(filtered);
  res.json({ success: true });
});

// ============================================================
// CATCH-ALL – MUST BE LAST
// ============================================================
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// START
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Data: ${DATA_DIR}`);
});
