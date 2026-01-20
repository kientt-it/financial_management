import express from 'express';
import { Expense } from '../models/Expense.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get expenses for current user (created or participating)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { type } = req.query; // 'created' or 'participating'
    
    let query = {};
    if (type === 'created') {
      query = { createdBy: req.userId };
    } else if (type === 'participating') {
      query = { participants: req.userId };
    } else {
      // Default: all expenses user is involved in
      query = {
        $or: [
          { createdBy: req.userId },
          { participants: req.userId }
        ]
      };
    }

    const expenses = await Expense.find(query)
      .populate('createdBy', 'username fullName')
      .populate('payer', 'username fullName')
      .populate('participants', 'username fullName')
      .sort({ date: -1 });

    res.json(expenses);
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get expenses by month
router.get('/month/:month', authMiddleware, async (req, res) => {
  try {
    const { month } = req.params;
    const [year, monthNum] = month.split('-');
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0);

    const expenses = await Expense.find({
      date: { $gte: startDate, $lte: endDate },
      $or: [
        { createdBy: req.userId },
        { participants: req.userId }
      ]
    })
      .populate('createdBy', 'username fullName')
      .populate('payer', 'username fullName')
      .populate('participants', 'username fullName')
      .sort({ date: -1 });

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create expense
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { date, description, amount, category, payer, participants } = req.body;

    if (!date || !description || !amount || !payer) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const expense = new Expense({
      createdBy: req.userId,
      date: new Date(date),
      description,
      amount: Number(amount),
      category: category || 'Other',
      payer,
      participants: participants || [payer]
    });

    await expense.save();
    await expense.populate('createdBy', 'username fullName');
    await expense.populate('payer', 'username fullName');
    await expense.populate('participants', 'username fullName');

    res.status(201).json(expense);
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update expense (only creator can update)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findById(id);

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    if (expense.createdBy.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { date, description, amount, category, payer, participants } = req.body;
    
    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      {
        date: date ? new Date(date) : undefined,
        description,
        amount: amount ? Number(amount) : undefined,
        category,
        payer,
        participants
      },
      { new: true }
    )
      .populate('createdBy', 'username fullName')
      .populate('payer', 'username fullName')
      .populate('participants', 'username fullName');

    res.json(updatedExpense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete expense (only creator can delete)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findById(id);

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    if (expense.createdBy.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await Expense.findByIdAndDelete(id);
    res.json({ message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
