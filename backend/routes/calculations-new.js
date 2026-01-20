import express from 'express';
import { Expense } from '../models/Expense.js';
import { User } from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Calculate what current user owes/is owed
router.get('/summary/:month', authMiddleware, async (req, res) => {
  try {
    const { month } = req.params;
    const [year, monthNum] = month.split('-');
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0);

    const expenses = await Expense.find({
      date: { $gte: startDate, $lte: endDate },
      $or: [
        { createdBy: req.userId },
        { participants: req.userId },
        { payer: req.userId }
      ]
    })
      .populate('payer')
      .populate('participants');

    const calculations = {};
    const users = await User.find();

    // Initialize all users
    users.forEach(user => {
      calculations[user._id.toString()] = {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        totalExpense: 0,
        paid: 0,
        owes: 0,
        isOwedBy: 0
      };
    });

    // Calculate shares
    expenses.forEach(expense => {
      const payerId = expense.payer._id.toString();
      const participantIds = expense.participants.map(p => p._id.toString());
      const sharePerPerson = expense.amount / participantIds.length;

      if (calculations[payerId]) {
        calculations[payerId].paid += expense.amount;
      }

      participantIds.forEach(participantId => {
        if (calculations[participantId]) {
          calculations[participantId].totalExpense += sharePerPerson;
        }
      });
    });

    // Calculate who owes whom
    Object.keys(calculations).forEach(userId => {
      const calc = calculations[userId];
      const difference = calc.paid - calc.totalExpense;
      if (difference > 0) {
        calc.isOwedBy = difference; // Others owe this person
      } else {
        calc.owes = Math.abs(difference); // This person owes
      }
    });

    res.json({
      month,
      calculations: Object.values(calculations),
      totalExpenses: expenses.reduce((sum, e) => sum + e.amount, 0)
    });
  } catch (error) {
    console.error('Calculations error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get monthly settlement
router.get('/settlement/:month', authMiddleware, async (req, res) => {
  try {
    const { month } = req.params;
    const [year, monthNum] = month.split('-');
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0);

    const expenses = await Expense.find({
      date: { $gte: startDate, $lte: endDate }
    })
      .populate('payer')
      .populate('participants');

    const userBalances = {};
    const users = await User.find();

    users.forEach(user => {
      userBalances[user._id.toString()] = {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        balance: 0
      };
    });

    // Calculate balances
    expenses.forEach(expense => {
      const payerId = expense.payer._id.toString();
      const participantIds = expense.participants.map(p => p._id.toString());
      const sharePerPerson = expense.amount / participantIds.length;

      if (userBalances[payerId]) {
        userBalances[payerId].balance += expense.amount;
      }

      participantIds.forEach(participantId => {
        if (userBalances[participantId]) {
          userBalances[participantId].balance -= sharePerPerson;
        }
      });
    });

    res.json({
      month,
      balances: Object.values(userBalances).filter(b => Math.abs(b.balance) > 0.01)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
