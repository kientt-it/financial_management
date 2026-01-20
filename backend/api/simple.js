import express from 'express';
import cors from 'cors';
import { defaultMembers, defaultExpenses } from '../models/data.js';

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    mode: 'simple'
  });
});

app.get('/api', (req, res) => {
  res.json({ 
    message: 'Expense Manager API',
    version: '1.0.0',
    mode: 'simple-memory',
    endpoints: {
      expenses: '/api/expenses',
      members: '/api/members',
      health: '/api/health'
    }
  });
});

// Members endpoint
app.get('/api/members', (req, res) => {
  res.json(defaultMembers);
});

// Expenses endpoint
app.get('/api/expenses', (req, res) => {
  res.json(defaultExpenses);
});

// Calculations endpoint
app.get('/api/calculations/monthly/:month', (req, res) => {
  const calculations = defaultMembers.map(m => ({
    id: m._id || m.name,
    name: m.name,
    bank: m.bank,
    account: m.account,
    totalExpense: 0,
    paid: 0,
    owes: 0
  }));
  res.json(calculations);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

export default app;
