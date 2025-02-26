import express from 'express';
import fetch from 'node-fetch'; // or you can use axios if you prefer
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
const upload = multer();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the Vite build
app.use(express.static(path.join(__dirname, 'dist')));


// Handle file uploads on /api/upload
app.post('/api/upload', upload.any(), async (req, res) => {
  try {
    const response = await fetch('http://backend-service:8001/data');
    const data = await response.json();
    res.status(200).send(data);
  } catch (error) {
    console.error('Error processing files:', error);
    res.status(500).send('Internal server error');
  }
});

// Catch-all handler to support client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
