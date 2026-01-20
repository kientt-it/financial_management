import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// In-memory user store (temporary)
const users = new Map();
let userIdCounter = 1;

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
  res.json({ status: 'ok', mode: 'memory' });
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

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

export default app;
