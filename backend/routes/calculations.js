import express from 'express';
import { Expense } from '../models/Expense.js';
import { Member } from '../models/Member.js';
import { defaultMembers, defaultExpenses } from '../models/data.js';

const router = express.Router();

// Calculate expenses for a month
router.get('/monthly/:month', async (req, res) => {
  try {
    const { month } = req.params;
    const [year, monthNum] = month.split('-');
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0);

    const [monthlyExpenses, allMembers] = await Promise.all([
      Expense.find({
        date: { $gte: startDate, $lte: endDate }
      }),
      Member.find()
    ]);

    const calculations = {};

    // Initialize all members
    allMembers.forEach(member => {
      calculations[member.name] = {
        id: member._id,
        name: member.name,
        bank: member.bank,
        account: member.account,
        totalExpense: 0,
        paid: 0,
        owes: 0
      };
    });

    // Calculate contributions and shares
    monthlyExpenses.forEach(expense => {
      const { payer, amount, participants } = expense;
      const participantCount = (participants && participants.length > 0) ? participants.length : 1;
      const sharePerPerson = amount / participantCount;

      // Add to payer's paid amount
      if (calculations[payer]) {
        calculations[payer].paid += amount;
      }

      // Add to each participant's total expense
      (participants && participants.length > 0 ? participants : [payer]).forEach(participant => {
        if (calculations[participant]) {
          calculations[participant].totalExpense += sharePerPerson;
        }
      });
    });

    // Calculate who owes what
    Object.values(calculations).forEach(person => {
      person.owes = person.totalExpense - person.paid;
    });

    res.json(Object.values(calculations).sort((a, b) => a.name.localeCompare(b.name)));
  } catch (error) {
    console.warn('⚠️  Returning fallback calculations:', error.message);
    const fallbackCalcs = defaultMembers.map(m => ({
      id: m._id,
      name: m.name,
      bank: m.bank,
      account: m.account,
      totalExpense: 0,
      paid: 0,
      owes: 0
    }));
    res.json(fallbackCalcs);
  }
});

// Get summary statistics
router.get('/summary/:month', async (req, res) => {
  try {
    const { month } = req.params;
    const [year, monthNum] = month.split('-');
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0);

    const [monthlyExpenses, allMembers] = await Promise.all([
      Expense.find({
        date: { $gte: startDate, $lte: endDate }
      }),
      Member.find()
    ]);

    const totalExpense = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
    const averagePerPerson = allMembers.length > 0 ? totalExpense / allMembers.length : 0;

    res.json({
      month,
      totalExpense,
      averagePerPerson,
      expenseCount: monthlyExpenses.length,
      memberCount: allMembers.length,
      categories: [...new Set(monthlyExpenses.map(e => e.category))]
    });
  } catch (error) {
    console.warn('⚠️  Returning fallback summary:', error.message);
    res.json({
      month: req.params.month,
      totalExpense: 0,
      averagePerPerson: 0,
      expenseCount: 0,
      memberCount: defaultMembers.length,
      categories: []
    });
  }
});

export default router;
