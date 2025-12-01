const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   GET /api/user/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/user/leetcode
// @desc    Link LeetCode username
// @access  Private
router.put('/leetcode', auth, async (req, res) => {
  const { leetcodeUsername } = req.body;

  if (!leetcodeUsername) {
    return res.status(400).json({ message: 'LeetCode username is required' });
  }

  try {
    const user = await User.findById(req.user.id);
    user.leetcodeUsername = leetcodeUsername;
    await user.save();

    res.json({
      message: 'LeetCode username linked successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        leetcodeUsername: user.leetcodeUsername
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  const { name } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (name) user.name = name;
    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        leetcodeUsername: user.leetcodeUsername
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
