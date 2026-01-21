// Simple dev server for testing locally
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// In-memory stores
const users = new Map();
const expenses = new Map();
let userIdCounter = 1;
let expenseIdCounter = 1;

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Auth middleware
const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token' });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Helper functions
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '30d' });
};

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', mode: 'memory-dev' });
});

app.get('/api', (req, res) => {
  res.json({ 
    message: 'Expense Manager API v2',
    version: '2.0.0',
    mode: 'in-memory-auth'
  });
});

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, fullName, password, email } = req.body;

    if (!username || !fullName || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user exists
    for (let user of users.values()) {
      if (user.username === username) {
        return res.status(400).json({ error: 'Username already exists' });
      }
    }

    const userId = String(userIdCounter++);
    const hashedPassword = await hashPassword(password);
    
    const user = {
      id: userId,
      username,
      fullName,
      password: hashedPassword,
      email: email || '',
      bank: '',
      accountNumber: '',
      accountHolder: '',
      phone: '',
      createdAt: new Date()
    };

    users.set(userId, user);
    const token = generateToken(userId);

    const userResponse = { ...user };
    delete userResponse.password;

    console.log('✅ User registered:', username);
    res.status(201).json({ token, user: userResponse });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Missing credentials' });
    }

    let user = null;
    for (let u of users.values()) {
      if (u.username === username) {
        user = u;
        break;
      }
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id);
    const userResponse = { ...user };
    delete userResponse.password;

    console.log('✅ User logged in:', username);
    res.json({ token, user: userResponse });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get current user
app.get('/api/auth/me', authMiddleware, (req, res) => {
  try {
    const user = users.get(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const userResponse = { ...user };
    delete userResponse.password;
    res.json(userResponse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update profile
app.put('/api/auth/me', authMiddleware, (req, res) => {
  try {
    const user = users.get(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { fullName, email, bank, accountNumber, accountHolder, phone } = req.body;
    
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (bank) user.bank = bank;
    if (accountNumber) user.accountNumber = accountNumber;
    if (accountHolder) user.accountHolder = accountHolder;
    if (phone) user.phone = phone;

    users.set(req.userId, user);

    const userResponse = { ...user };
    delete userResponse.password;
    res.json(userResponse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all users (for selecting payer)
app.get('/api/auth/users', authMiddleware, (req, res) => {
  try {
    const allUsers = [];
    for (let user of users.values()) {
      const userData = { ...user };
      delete userData.password;
      allUsers.push(userData);
    }
    res.json(allUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get expenses
app.get('/api/expenses', authMiddleware, (req, res) => {
  try {
    const userExpenses = [];
    for (let expense of expenses.values()) {
      if (expense.createdBy === req.userId || 
          expense.participants.includes(req.userId) ||
          expense.payer === req.userId) {
        userExpenses.push(expense);
      }
    }
    res.json(userExpenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get expenses by month
app.get('/api/expenses/month/:month', authMiddleware, (req, res) => {
  try {
    const { month } = req.params;
    const [year, monthNum] = month.split('-');
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0);

    const monthExpenses = [];
    for (let expense of expenses.values()) {
      const expDate = new Date(expense.date);
      if (expDate >= startDate && expDate <= endDate &&
          (expense.createdBy === req.userId || 
           expense.participants.includes(req.userId) ||
           expense.payer === req.userId)) {
        monthExpenses.push(expense);
      }
    }
    res.json(monthExpenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create expense
app.post('/api/expenses', authMiddleware, (req, res) => {
  try {
    const { date, description, amount, category, payer, participants } = req.body;

    if (!date || !description || !amount || !payer) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const expenseId = String(expenseIdCounter++);
    const expense = {
      id: expenseId,
      createdBy: req.userId,
      date: new Date(date),
      description,
      amount: Number(amount),
      category: category || 'Other',
      payer,
      participants: participants || [payer],
      createdAt: new Date()
    };

    expenses.set(expenseId, expense);
    console.log('✅ Expense created:', description);
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update expense
app.put('/api/expenses/:id', authMiddleware, (req, res) => {
  try {
    const expense = expenses.get(req.params.id);
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    if (expense.createdBy !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { date, description, amount, category, payer, participants } = req.body;
    
    if (date) expense.date = new Date(date);
    if (description) expense.description = description;
    if (amount) expense.amount = Number(amount);
    if (category) expense.category = category;
    if (payer) expense.payer = payer;
    if (participants) expense.participants = participants;

    expenses.set(req.params.id, expense);
    res.json(expense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete expense
app.delete('/api/expenses/:id', authMiddleware, (req, res) => {
  try {
    const expense = expenses.get(req.params.id);
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    if (expense.createdBy !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    expenses.delete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get calculations
app.get('/api/calculations/monthly/:month', authMiddleware, (req, res) => {
  try {
    const { month } = req.params;
    const [year, monthNum] = month.split('-');
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0);

    const calculations = {};
    
    // Initialize all users
    for (let user of users.values()) {
      calculations[user.id] = {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        totalExpense: 0,
        paid: 0,
        owes: 0,
        isOwedBy: 0
      };
    }

    // Calculate shares
    for (let expense of expenses.values()) {
      const expDate = new Date(expense.date);
      if (expDate < startDate || expDate > endDate) continue;

      const payerId = expense.payer;
      const participantIds = expense.participants;
      const sharePerPerson = expense.amount / participantIds.length;

      if (calculations[payerId]) {
        calculations[payerId].paid += expense.amount;
      }

      participantIds.forEach(participantId => {
        if (calculations[participantId]) {
          calculations[participantId].totalExpense += sharePerPerson;
        }
      });
    }

    // Calculate who owes whom
    Object.keys(calculations).forEach(userId => {
      const calc = calculations[userId];
      const difference = calc.paid - calc.totalExpense;
      if (difference > 0) {
        calc.isOwedBy = difference;
      } else {
        calc.owes = Math.abs(difference);
      }
    });

    res.json(Object.values(calculations));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('\n✅ Dev server running on port', PORT);
  console.log('📍 API: http://localhost:' + PORT + '/api');
  console.log('🔐 Auth endpoints ready\n');
});
