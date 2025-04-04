import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';
import cors from 'cors';

dotenv.config();

const app = express();

const allowedOrigins = [
  'https://task-manager-six-beryl.vercel.app',
  'https://task-manager-lr4cnybq1-goutham-shanubhogars-projects.vercel.app',
  'https://task-manager-goutham-shanubhogars-projects.vercel.app',
  'http://localhost:5173',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Add console logs to debug routes
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Routes configured:');
  console.log('- /api/auth/*');
  console.log('- /api/tasks/*');
});
