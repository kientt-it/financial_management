import express from 'express';
import { Expense } from '../models/Expense.js';

const router = express.Router();

// Get all expenses
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get expenses by month
router.get('/month/:month', async (req, res) => {
  try {
    const { month } = req.params;
    const [year, monthNum] = month.split('-');
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0);

    const expenses = await Expense.find({
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: -1 });

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add expense
router.post('/', async (req, res) => {
  try {
    const { date, description, amount, category, payer, participants, status } = req.body;

    if (!date || !description || !amount || !payer) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const expense = new Expense({
      date: new Date(date),
      description,
      amount: Number(amount),
      category: category || 'Other',
      payer,
      participants: participants || [payer],
      status: status || 'Pending'
    });

    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update expense
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findByIdAndUpdate(id, req.body, { new: true });

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json(expense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete expense
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findByIdAndDelete(id);

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json(expense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
