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


connectDB();


app.use(cors())

app.use(express.json());


app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SEO Analysis and Automated Execution Assistant API is running',
  });
});

app.use('/api/organizations', organizationRoutes);
app.use('/api/seo', seoRoutes);
app.use('/api/execution', executionRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;