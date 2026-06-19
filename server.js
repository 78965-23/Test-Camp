const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from root
app.use(express.static(__dirname));

// Data file path
const DATA_DIR = process.env.RENDER_DISK_PATH || path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'data.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  console.log('Created data directory:', DATA_DIR);
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

// ============================================================
// API ROUTES – MUST COME BEFORE THE CATCH-ALL
// ============================================================

// GET all applications
app.get('/api/applications', (req, res) => {
  try {
    const apps = readData();
    res.json(apps);
  } catch (err) {
    console.error('GET error:', err);
    res.status(500).json({ error: 'Failed to read data' });
  }
});

// POST new application
app.post('/api/applications', (req, res) => {
  console.log('POST /api/applications received');
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

    // Check for duplicate
    if (apps.some(a => a.referenceNumber === newApp.referenceNumber)) {
      return res.status(409).json({ error: 'Duplicate reference number' });
    }

    apps.push(newApp);
    writeData(apps);
    console.log('Application saved:', newApp.referenceNumber);
    res.status(201).json(newApp);
  } catch (err) {
    console.error('POST error:', err);
    res.status(500).json({ error: 'Internal server error: ' + err.message });
  }
});

// PUT update application
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
    console.error('PUT error:', err);
    res.status(500).json({ error: 'Update failed' });
  }
});

// DELETE application
app.delete('/api/applications/:id', (req, res) => {
  try {
    const apps = readData();
    const id = req.params.id;
    const filtered = apps.filter(app => app.referenceNumber !== id && app.certificateNumber !== id);
    if (filtered.length === apps.length) {
      return res.status(404).json({ error: 'Application not found' });
    }
    writeData(filtered);
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE error:', err);
    res.status(500).json({ error: 'Delete failed' });
  }
});

// ============================================================
// CATCH-ALL – MUST BE LAST
// ============================================================
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Data directory: ${DATA_DIR}`);
  console.log(`Data file: ${DATA_FILE}`);
  console.log(`========================================`);
});
