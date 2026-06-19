const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname));

const DATA_DIR = process.env.RENDER_DISK_PATH || path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'data.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

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

// ---- API ROUTES (must be BEFORE the catch-all) ----
app.get('/api/applications', (req, res) => {
  try {
    res.json(readData());
  } catch (err) {
    res.status(500).json({ error: 'Failed to read data' });
  }
});

app.post('/api/applications', (req, res) => {
  try {
    const apps = readData();
    const newApp = req.body;
    if (!newApp.referenceNumber) {
      return res.status(400).json({ error: 'Reference number is required' });
    }
    if (!newApp.fullName) {
      return res.status(400).json({ error: 'Full name is required' });
    }
    apps.push(newApp);
    writeData(apps);
    res.status(201).json(newApp);
  } catch (err) {
    console.error('POST error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/applications/:id', (req, res) => {
  try {
    const apps = readData();
    const id = req.params.id;
    const updated = req.body;
    const index = apps.findIndex(app => app.referenceNumber === id || app.certificateNumber === id);
    if (index === -1) return res.status(404).json({ error: 'Not found' });
    apps[index] = { ...apps[index], ...updated };
    writeData(apps);
    res.json(apps[index]);
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
});

app.delete('/api/applications/:id', (req, res) => {
  try {
    const apps = readData();
    const id = req.params.id;
    const filtered = apps.filter(app => app.referenceNumber !== id && app.certificateNumber !== id);
    if (filtered.length === apps.length) return res.status(404).json({ error: 'Not found' });
    writeData(filtered);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

// ---- CATCH-ALL (must be LAST) ----
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Data directory: ${DATA_DIR}`);
});
