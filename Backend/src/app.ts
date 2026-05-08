import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import organizationRoutes from './routes/organizationRoutes';
import seoRoutes from './routes/seoRoutes';
import executionRoutes from './routes/executionRoutes';
import { errorMiddleware } from './middlewares/errorMiddleware';
import { notFoundMiddleware } from './middlewares/notFoundMiddleware';

dotenv.config();

const app: Application = express();

// Connect to MongoDB (cached for serverless)
connectDB();

// ── CORS ──────────────────────────────────────────────────────────────────────
// Must be configured BEFORE routes so preflight OPTIONS requests are handled.
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  // Add your deployed frontend URL here once known:
  'https://seo-analytics-git-main-arvind-kumar2006.vercel.app',
  'https://seo-analytics-one.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (Postman, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      // In development, allow all
      if (process.env.NODE_ENV !== 'production') return callback(null, true);
      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Explicitly handle preflight for all routes
app.options('*', cors());

// ── Body Parsing ───────────────────────────────────────────────────────────────
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SEO Analysis and Automated Execution Assistant API is running',
  });
});

app.use('/api/organizations', organizationRoutes);
app.use('/api/seo', seoRoutes);
app.use('/api/execution', executionRoutes);

// ── Error Handling ────────────────────────────────────────────────────────────
app.use(notFoundMiddleware);
app.use(errorMiddleware);

// ── Server ────────────────────────────────────────────────────────────────────
// Only call app.listen in non-serverless environments.
// Vercel imports this file as a module — app.listen is not needed there.
if (process.env.NODE_ENV !== 'production' || process.env.RUN_LOCAL === 'true') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;