const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

// Data file path (use RENDER_DISK_PATH if provided)
const DATA_DIR = process.env.RENDER_DISK_PATH || path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'data.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helper: read/write data
function readData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return []; // file doesn't exist or empty
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// API endpoints
app.get('/api/applications', (req, res) => {
  const apps = readData();
  res.json(apps);
});

app.post('/api/applications', (req, res) => {
  const apps = readData();
  const newApp = req.body;
  // Ensure reference number and other fields
  if (!newApp.referenceNumber) {
    return res.status(400).json({ error: 'Reference number required' });
  }
  apps.push(newApp);
  writeData(apps);
  res.status(201).json(newApp);
});

app.put('/api/applications/:id', (req, res) => {
  const apps = readData();
  const id = req.params.id;
  const updated = req.body;
  const index = apps.findIndex(app => app.referenceNumber === id || app.certificateNumber === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Application not found' });
  }
  apps[index] = { ...apps[index], ...updated };
  writeData(apps);
  res.json(apps[index]);
});

app.delete('/api/applications/:id', (req, res) => {
  const apps = readData();
  const id = req.params.id;
  const filtered = apps.filter(app => app.referenceNumber !== id && app.certificateNumber !== id);
  if (filtered.length === apps.length) {
    return res.status(404).json({ error: 'Application not found' });
  }
  writeData(filtered);
  res.json({ success: true });
});

// Catch‑all: serve index.html for client‑side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
