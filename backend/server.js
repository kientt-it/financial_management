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
  await connectDB();
  await seedDatabase();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Routes
  app.use('/api/expenses', expenseRoutes);
  app.use('/api/members', memberRoutes);
  app.use('/api/calculations', calculationRoutes);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
