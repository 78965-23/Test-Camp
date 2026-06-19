const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname)); // serve static files from root

// Data file path
const DATA_DIR = process.env.RENDER_DISK_PATH || path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'data.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helper functions
function readData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// API: GET all applications
app.get('/api/applications', (req, res) => {
  try {
    const apps = readData();
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read data' });
  }
});

// API: POST new application
app.post('/api/applications', (req, res) => {
  try {
    const apps = readData();
    const newApp = req.body;

    // Validate required fields
    if (!newApp.referenceNumber) {
      return res.status(400).json({ error: 'Reference number is required' });
    }
    if (!newApp.fullName) {
      return res.status(400).json({ error: 'Full name is required' });
    }
    if (!newApp.type) {
      return res.status(400).json({ error: 'Certificate type is required' });
    }

    // Check for duplicate reference number (just in case)
    if (apps.some(a => a.referenceNumber === newApp.referenceNumber)) {
      return res.status(409).json({ error: 'Duplicate reference number' });
    }

    apps.push(newApp);
    writeData(apps);
    res.status(201).json(newApp);
  } catch (err) {
    console.error('POST /api/applications error:', err);
    res.status(500).json({ error: 'Internal server error: ' + err.message });
  }
});

// API: PUT update by reference or certificate number
app.put('/api/applications/:id', (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).json({ error: 'Failed to update' });
  }
});

// API: DELETE
app.delete('/api/applications/:id', (req, res) => {
  try {
    const apps = readData();
    const id = req.params.id;
    const filtered = apps.filter(app => app.referenceNumber !== id && app.certificateNumber !== id);
    if (filtered.length === apps.length) {
      return res.status(404).json({ error: 'Not found' });
    }
    writeData(filtered);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete' });
  }
});

// Catch‑all: serve index.html for client‑side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Data directory: ${DATA_DIR}`);
  console.log(`Data file: ${DATA_FILE}`);
});
