import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import { defaultMembers, defaultExpenses } from '../models/data.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Initialize DB (non-blocking)
let dbConnected = false;
initializeDB();

async function initializeDB() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await connectDB();
    dbConnected = true;
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('⚠️  MongoDB not available:', error.message);
    console.log('📦 Using in-memory fallback data');
  }
}

// Import routes
import expenseRoutes from '../routes/expenses.js';
import memberRoutes from '../routes/members.js';
import calculationRoutes from '../routes/calculations.js';

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    db: dbConnected ? 'connected' : 'memory'
  });
});

app.get('/api', (req, res) => {
  res.json({ 
    message: 'Expense Manager API',
    version: '1.0.0',
    mode: dbConnected ? 'mongodb' : 'memory',
    endpoints: {
      expenses: '/api/expenses',
      members: '/api/members',
      calculations: '/api/calculations',
      health: '/api/health'
    }
  });
});

// Routes with timeout protection
app.use((req, res, next) => {
  res.setTimeout(5000, () => {
    res.status(408).json({ error: 'Request timeout' });
  });
  next();
});

app.use('/api/expenses', expenseRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/calculations', calculationRoutes);

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
