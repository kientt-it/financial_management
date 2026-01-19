import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { seedDatabase } from './models/seed.js';
import expenseRoutes from './routes/expenses.js';
import memberRoutes from './routes/members.js';
import calculationRoutes from './routes/calculations.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB and seed data
const startServer = async () => {
  console.log('\n🚀 Starting server...');
  
  try {
    await connectDB();
    await seedDatabase();

    // Middleware
    app.use(cors({
      origin: '*',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type']
    }));
    app.use(express.json());

    // Routes
    app.use('/api/expenses', expenseRoutes);
    app.use('/api/members', memberRoutes);
    app.use('/api/calculations', calculationRoutes);

    // Health check
    app.get('/api/health', (req, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    // Root API endpoint
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

    // 404 handler
    app.use((req, res) => {
      res.status(404).json({ error: 'Not found' });
    });

    app.listen(PORT, () => {
      console.log(`\n✅ Server running on port ${PORT}`);
      console.log(`📍 API: http://localhost:${PORT}/api`);
      console.log(`🏥 Health: http://localhost:${PORT}/api/health\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
