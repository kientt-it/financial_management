import express from 'express';
import { expenses, members } from '../models/data.js';

const router = express.Router();
let nextId = Math.max(...expenses.map(e => e.id), 0) + 1;

// Get all expenses
router.get('/', (req, res) => {
  res.json(expenses);
});

// Get expenses by month
router.get('/month/:month', (req, res) => {
  const { month } = req.params;
  const filtered = expenses.filter(e => e.date.startsWith(month));
  res.json(filtered);
});

// Add expense
router.post('/', (req, res) => {
  const { date, description, amount, category, payer, participants, status } = req.body;
  
  if (!date || !description || !amount || !payer) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newExpense = {
    id: nextId++,
    date,
    description,
    amount: Number(amount),
    category: category || 'Other',
    payer,
    participants: participants || [payer],
    status: status || 'Pending'
  };

  expenses.push(newExpense);
  res.status(201).json(newExpense);
});

// Update expense
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const expense = expenses.find(e => e.id === Number(id));

  if (!expense) {
    return res.status(404).json({ error: 'Expense not found' });
  }

  Object.assign(expense, req.body);
  res.json(expense);
});

// Delete expense
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const index = expenses.findIndex(e => e.id === Number(id));

  if (index === -1) {
    return res.status(404).json({ error: 'Expense not found' });
  }

  const deleted = expenses.splice(index, 1);
  res.json(deleted[0]);
});

export default router;
