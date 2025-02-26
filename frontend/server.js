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

app.use('/api/upload', (req, res, next) => {
  console.log(`Received ${req.method} request on ${req.originalUrl} at ${new Date().toISOString()}`);
  next();
});

// Proxy requests for /api/upload directly to your backend service.
app.use('/api/upload', createProxyMiddleware({
  target: 'http://devops-backend-service:8001',
  changeOrigin: true,
  timeout: 30000, // 30 seconds
  proxyTimeout: 30000,
  onProxyReq: (proxyReq, req, res) => {
    // Only works if the body was parsed as JSON, not for multipart
    if (req.body) {
      const bodyData = JSON.stringify(req.body);
      console.log(`Proxy Request Body: ${bodyData}`);
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
  pathRewrite: {
    '^/api/upload': '/'  // Remove the prefix so the backend sees '/'
  },
}));

// Catch-all handler to support client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
