import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import blogRouter from './routes/blog';
import booksRouter from './routes/books';
import eventsRouter from './routes/events';
import paymentsRouter from './routes/payments';
import sermonsRouter from './routes/sermons';
import uploadRouter from './routes/upload';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Root endpoint
app.get('/', (_req, res) => {
  res.json({
    message: 'Jethro Liberation Ministries Backend API',
    version: '1.0.0',
  });
});

// Routes
app.use('/api/events', eventsRouter);
app.use('/api/sermons', sermonsRouter);
app.use('/api/books', booksRouter);
app.use('/api/blog', blogRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/upload', uploadRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

export default app;
