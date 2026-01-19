import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import { seedDatabase } from '../models/seed.js';
import expenseRoutes from '../routes/expenses.js';
import memberRoutes from '../routes/members.js';
import calculationRoutes from '../routes/calculations.js';

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

// Initialize DB on first request
let dbConnected = false;
let seedDone = false;

const initializeDB = async () => {
  if (!dbConnected) {
    try {
      console.log('🔗 Initializing MongoDB...');
      await connectDB();
      dbConnected = true;
    } catch (error) {
      console.error('❌ DB Error:', error.message);
    }
  }
  
  if (!seedDone && dbConnected) {
    try {
      console.log('🌱 Seeding database...');
      await seedDatabase();
      seedDone = true;
    } catch (error) {
      console.error('❌ Seed Error:', error.message);
    }
  }
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
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

app.use('/api/expenses', async (req, res, next) => {
  await initializeDB();
  next();
}, expenseRoutes);

app.use('/api/members', async (req, res, next) => {
  await initializeDB();
  next();
}, memberRoutes);

app.use('/api/calculations', async (req, res, next) => {
  await initializeDB();
  next();
}, calculationRoutes);

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
