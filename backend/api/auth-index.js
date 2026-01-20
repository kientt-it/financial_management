import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import authRoutes from '../routes/auth.js';
import expensesRoutes from '../routes/expenses-new.js';
import calculationsRoutes from '../routes/calculations-new.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Initialize DB on startup (non-blocking)
let dbConnected = false;
initializeDB();

async function initializeDB() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await connectDB();
    dbConnected = true;
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('⚠️  MongoDB error:', error.message);
  }
}

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    db: dbConnected ? 'connected' : 'offline'
  });
});

app.get('/api', (req, res) => {
  res.json({ 
    message: 'Expense Manager API v2',
    version: '2.0.0',
    endpoints: {
      auth: '/api/auth',
      expenses: '/api/expenses',
      calculations: '/api/calculations'
    }
  });
});

// Auth routes (public)
app.use('/api/auth', authRoutes);

// Protected routes (require authentication)
app.use('/api/expenses', expensesRoutes);
app.use('/api/calculations', calculationsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

export default app;
