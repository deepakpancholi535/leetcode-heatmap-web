const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');

// @route   GET /api/leetcode/stats/:username
// @desc    Get LeetCode user stats
// @access  Private
router.get('/stats/:username', auth, async (req, res) => {
  const { username } = req.params;

  try {
    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          username
          submitStats {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
          }
          profile {
            ranking
            reputation
            starRating
          }
          submissionCalendar
        }
      }
    `;

    const response = await axios.post('https://leetcode.com/graphql', {
      query,
      variables: { username }
    });

    if (!response.data.data.matchedUser) {
      return res.status(404).json({ message: 'LeetCode user not found' });
    }

    const data = response.data.data.matchedUser;
    
    // Parse stats
    const acSubmissions = data.submitStats.acSubmissionNum;
    const stats = {
      username: data.username,
      totalSolved: acSubmissions.find(s => s.difficulty === 'All')?.count || 0,
      totalSubmissions: acSubmissions.find(s => s.difficulty === 'All')?.submissions || 0,
      easySolved: acSubmissions.find(s => s.difficulty === 'Easy')?.count || 0,
      mediumSolved: acSubmissions.find(s => s.difficulty === 'Medium')?.count || 0,
      hardSolved: acSubmissions.find(s => s.difficulty === 'Hard')?.count || 0,
      ranking: data.profile.ranking || 0,
      reputation: data.profile.reputation || 0,
      starRating: data.profile.starRating || 0,
      submissionCalendar: JSON.parse(data.submissionCalendar || '{}')
    };

    res.json(stats);
  } catch (err) {
    console.error(err.message);
    if (err.response?.status === 404) {
      return res.status(404).json({ message: 'LeetCode user not found' });
    }
    res.status(500).json({ message: 'Error fetching LeetCode data' });
  }
});

// @route   GET /api/leetcode/verify/:username
// @desc    Verify LeetCode username exists
// @access  Public
router.get('/verify/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          username
        }
      }
    `;

    const response = await axios.post('https://leetcode.com/graphql', {
      query,
      variables: { username }
    });

    if (!response.data.data.matchedUser) {
      return res.json({ exists: false });
    }

    res.json({ exists: true, username: response.data.data.matchedUser.username });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Error verifying LeetCode username' });
  }
});

module.exports = router;
