import express from 'express';
import { members } from '../models/data.js';

const router = express.Router();
let nextId = Math.max(...members.map(m => m.id), 0) + 1;

// Get all members
router.get('/', (req, res) => {
  res.json(members);
});

// Get member by id
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const member = members.find(m => m.id === Number(id));

  if (!member) {
    return res.status(404).json({ error: 'Member not found' });
  }

  res.json(member);
});

// Add member
router.post('/', (req, res) => {
  const { name, bank, account } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  const newMember = {
    id: nextId++,
    name,
    bank: bank || '',
    account: account || ''
  };

  members.push(newMember);
  res.status(201).json(newMember);
});

// Update member
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const member = members.find(m => m.id === Number(id));

  if (!member) {
    return res.status(404).json({ error: 'Member not found' });
  }

  Object.assign(member, req.body);
  res.json(member);
});

// Delete member
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const index = members.findIndex(m => m.id === Number(id));

  if (index === -1) {
    return res.status(404).json({ error: 'Member not found' });
  }

  const deleted = members.splice(index, 1);
  res.json(deleted[0]);
});

export default router;
