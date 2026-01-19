import express from 'express';
import { expenses, members } from '../models/data.js';

const router = express.Router();

// Calculate expenses for a month
router.get('/monthly/:month', (req, res) => {
  const { month } = req.params;
  
  const monthlyExpenses = expenses.filter(e => e.date.startsWith(month));
  const calculations = {};

  // Initialize all members
  members.forEach(member => {
    calculations[member.name] = {
      id: member.id,
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
});

// Get summary statistics
router.get('/summary/:month', (req, res) => {
  const { month } = req.params;
  
  const monthlyExpenses = expenses.filter(e => e.date.startsWith(month));
  const totalExpense = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
  const averagePerPerson = members.length > 0 ? totalExpense / members.length : 0;

  res.json({
    month,
    totalExpense,
    averagePerPerson,
    expenseCount: monthlyExpenses.length,
    memberCount: members.length,
    categories: [...new Set(monthlyExpenses.map(e => e.category))]
  });
});

export default router;
