import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import organizationRoutes from './routes/organizationRoutes';
import seoRoutes from './routes/seoRoutes';
import executionRoutes from './routes/executionRoutes';
import { errorMiddleware } from './middlewares/errorMiddleware';
import { notFoundMiddleware } from './middlewares/notFoundMiddleware';

dotenv.config();

const app: Application = express();

// ── CORS — must be FIRST, before everything including DB connect ──────────────
// Raw middleware so it cannot fail regardless of what happens later.
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,Accept');
  res.setHeader('Access-Control-Max-Age', '86400');
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  next();
});

// ── Body Parsing ───────────────────────────────────────────────────────────────
app.use(express.json());

// ── Database (non-blocking — server starts even if DB is slow) ─────────────────
connectDB().catch((err) => {
  console.error('Initial DB connection failed:', err.message);
});

// ── Health Check ───────────────────────────────────────────────────────────────
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'SEO Analysis and Automated Execution Assistant API is running',
  });
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/organizations', organizationRoutes);
app.use('/api/seo', seoRoutes);
app.use('/api/execution', executionRoutes);

// ── Error Handling ────────────────────────────────────────────────────────────
app.use(notFoundMiddleware);
app.use(errorMiddleware);

// ── Server ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;