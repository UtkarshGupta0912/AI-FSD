const express = require('express');
const FamilyMember = require('../models/FamilyMember');
const auth = require('../middleware/auth');
const router = express.Router();

// GET /api/family — list all family members for current user
router.get('/', auth, async (req, res) => {
  try {
    const members = await FamilyMember.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/family — add a family member
router.post('/', auth, async (req, res) => {
  try {
    const { name, age, gender, relation } = req.body;
    const member = new FamilyMember({ userId: req.user._id, name, age, gender, relation });
    await member.save();
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/family/:id — update a family member
router.put('/:id', auth, async (req, res) => {
  try {
    const member = await FamilyMember.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!member) return res.status(404).json({ message: 'Family member not found' });
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/family/:id — delete a family member
router.delete('/:id', auth, async (req, res) => {
  try {
    const member = await FamilyMember.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!member) return res.status(404).json({ message: 'Family member not found' });
    res.json({ message: 'Family member deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
