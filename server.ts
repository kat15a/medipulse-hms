import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import apiRouter from './src/backend/routes/index.js';

const ROOT_DIR = process.cwd();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // Mount backend API router
  app.use('/api', apiRouter);

  // Serve static assets
  app.use('/static', express.static(path.join(ROOT_DIR, 'static')));
  app.use('/resources/templates', express.static(path.join(ROOT_DIR, 'resources/templates')));

  // Direct routes for clean URLs
  const pages = [
    'login', 'register', 'dashboard', 'patients', 'doctors', 
    'appointments', 'prescriptions', 'billing', 'medical-records', 
    'profile', 'settings', 'ai'
  ];

  pages.forEach(page => {
    app.get(`/${page}`, (req, res) => {
      res.sendFile(path.join(ROOT_DIR, `resources/templates/${page}.html`));
    });
    app.get(`/${page}.html`, (req, res) => {
      res.sendFile(path.join(ROOT_DIR, `resources/templates/${page}.html`));
    });
  });

  // Root redirect
  app.get('/', (req, res) => {
    res.sendFile(path.join(ROOT_DIR, 'resources/templates/login.html'));
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'MediPulse HMS Full-Stack Backend' });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(ROOT_DIR, 'dist')));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MediPulse HMS Full-Stack Backend running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Server Error] Failed to start server:', err);
});


