import express from 'express';
import { Member } from '../models/Member.js';
import { defaultMembers } from '../models/data.js';

const router = express.Router();

// Get all members
router.get('/', async (req, res) => {
  try {
    const members = await Member.find().sort({ name: 1 });
    res.json(members);
  } catch (error) {
    // Fallback to default members if DB fails
    console.warn('⚠️  Returning fallback members:', error.message);
    res.json(defaultMembers);
  }
});

// Get member by id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const member = await Member.findById(id);

    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    res.json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add member
router.post('/', async (req, res) => {
  try {
    const { name, bank, account } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const member = new Member({
      name,
      bank: bank || '',
      account: account || ''
    });

    await member.save();
    res.status(201).json(member);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Member already exists' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Update member
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const member = await Member.findByIdAndUpdate(id, req.body, { new: true });

    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    res.json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete member
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const member = await Member.findByIdAndDelete(id);

    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    res.json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
