import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createProxyMiddleware } from 'http-proxy-middleware';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the Vite build
app.use(express.static(path.join(__dirname, 'dist')));


// Proxy requests for /api/upload directly to your backend service.
app.use('/api/upload', createProxyMiddleware({
  target: 'http://devops-backend-service:8001',
  changeOrigin: true,
  timeout: 30000, // 30 seconds
  proxyTimeout: 30000
  // Optionally, you can add more configuration options here.
}));

// Catch-all handler to support client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
