import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';

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

// Initialize DB once
let dbInitialized = false;

const initializeDB = async () => {
  if (!dbInitialized) {
    try {
      console.log('🔗 Connecting to MongoDB...');
      await connectDB();
      dbInitialized = true;
      console.log('✅ MongoDB ready');
    } catch (error) {
      console.error('❌ DB Error:', error.message);
      // Don't fail - API can work in memory
    }
  }
};

// Initialize DB on startup (non-blocking)
initializeDB().catch(err => console.error('Init error:', err));

// Import routes after express setup
import expenseRoutes from '../routes/expenses.js';
import memberRoutes from '../routes/members.js';
import calculationRoutes from '../routes/calculations.js';

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    db: dbInitialized ? 'connected' : 'connecting'
  });
});

app.get('/api', (req, res) => {
  res.json({ 
    message: 'Expense Manager API',
    version: '1.0.0',
    endpoints: {
      expenses: '/api/expenses',
      members: '/api/members',
      calculations: '/api/calculations',
      health: '/api/health'
    }
  });
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
