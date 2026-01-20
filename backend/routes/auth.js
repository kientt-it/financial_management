import express from 'express';
import { User } from '../models/User.js';
import { generateToken, authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, fullName, password, email } = req.body;

    if (!username || !fullName || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const user = new User({
      username,
      fullName,
      password,
      email: email || ''
    });

    await user.save();
    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    res.json({
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get current user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user.toJSON());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update profile
router.put('/me', authMiddleware, async (req, res) => {
  try {
    const { fullName, email, bank, accountNumber, accountHolder, phone } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        fullName: fullName || undefined,
        email: email || undefined,
        bank: bank || undefined,
        accountNumber: accountNumber || undefined,
        accountHolder: accountHolder || undefined,
        phone: phone || undefined,
        updatedAt: new Date()
      },
      { new: true }
    );

    res.json(user.toJSON());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all users
router.get('/users', authMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
