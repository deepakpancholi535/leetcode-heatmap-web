import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { FiLink, FiExternalLink, FiTrendingUp } from 'react-icons/fi';
import './Dashboard.css';

function Dashboard({ user, setUser }) {
  const [leetcodeUsername, setLeetcodeUsername] = useState(user?.leetcodeUsername || '');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [linking, setLinking] = useState(false);

  useEffect(() => {
    if (user?.leetcodeUsername) {
      fetchLeetCodeData(user.leetcodeUsername);
    }
  }, [user]);

  const fetchLeetCodeData = async (username) => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/leetcode/stats/${username}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('LeetCode data received:', res.data);
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching LeetCode data:', err);
      setError(err.response?.data?.message || 'Failed to fetch LeetCode data');
    } finally {
      setLoading(false);
    }
  };

  const handleLinkAccount = async (e) => {
    e.preventDefault();
    setLinking(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      // Verify username exists
      const verifyRes = await axios.get(`/api/leetcode/verify/${leetcodeUsername}`);
      if (!verifyRes.data.exists) {
        setError('LeetCode username not found');
        setLinking(false);
        return;
      }

      // Link account
      const res = await axios.put('/api/user/leetcode', 
        { leetcodeUsername },
        { headers: { Authorization: `Bearer ${token}` }}
      );

      // Update user data
      const updatedUser = res.data.user;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Fetch stats
      await fetchLeetCodeData(leetcodeUsername);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to link account');
    } finally {
      setLinking(false);
    }
  };

  const getHeatmapData = () => {
    if (!stats?.submissionCalendar) {
      console.log('No submission calendar data');
      return [];
    }

    const data = [];
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    console.log('Submission calendar:', stats.submissionCalendar);
    
    // Convert submission calendar to array format
    for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const timestamp = Math.floor(d.getTime() / 1000).toString();
      const count = stats.submissionCalendar[timestamp] || 0;
      
      data.push({
        date: dateStr,
        count: count
      });
    }

    console.log('Heatmap data generated:', data.length, 'days');
    console.log('Sample data:', data.slice(0, 5));
    
    return data;
  };

  const getColorClass = (value) => {
    if (!value || value.count === 0) return 'color-empty';
    if (value.count < 3) return 'color-scale-1';
    if (value.count < 6) return 'color-scale-2';
    if (value.count < 9) return 'color-scale-3';
    return 'color-scale-4';
  };

  if (!user?.leetcodeUsername) {
    return (
      <div className="dashboard-container">
        <div className="link-account-card">
          <div className="link-header">
            <FiLink className="link-icon" />
            <h2>Link Your LeetCode Account</h2>
            <p>Connect your LeetCode profile to start tracking your progress</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleLinkAccount} className="link-form">
            <div className="form-group">
              <label htmlFor="leetcodeUsername">LeetCode Username</label>
              <input
                type="text"
                id="leetcodeUsername"
                value={leetcodeUsername}
                onChange={(e) => setLeetcodeUsername(e.target.value)}
                placeholder="Enter your LeetCode username"
                required
              />
            </div>

            <button type="submit" className="link-btn" disabled={linking}>
              {linking ? 'Linking...' : 'Link Account'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>Welcome back, {user.name}! 👋</h1>
            <p className="subtitle">
              Tracking progress for{' '}
              <a 
                href={`https://leetcode.com/${user.leetcodeUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="leetcode-link"
              >
                @{user.leetcodeUsername} <FiExternalLink />
              </a>
            </p>
          </div>
        </div>

        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your LeetCode data...</p>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        {stats && !loading && (
          <>
            {/* Stats Cards */}
            <div className="stats-grid">
              <div className="stat-card total">
                <div className="stat-icon">🎯</div>
                <div className="stat-content">
                  <h3>{stats.totalSolved}</h3>
                  <p>Total Solved</p>
                </div>
              </div>

              <div className="stat-card easy">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <h3>{stats.easySolved}</h3>
                  <p>Easy</p>
                </div>
              </div>

              <div className="stat-card medium">
                <div className="stat-icon">⚡</div>
                <div className="stat-content">
                  <h3>{stats.mediumSolved}</h3>
                  <p>Medium</p>
                </div>
              </div>

              <div className="stat-card hard">
                <div className="stat-icon">🔥</div>
                <div className="stat-content">
                  <h3>{stats.hardSolved}</h3>
                  <p>Hard</p>
                </div>
              </div>

              <div className="stat-card ranking">
                <div className="stat-icon">🏆</div>
                <div className="stat-content">
                  <h3>#{stats.ranking.toLocaleString()}</h3>
                  <p>Global Rank</p>
                </div>
              </div>

              <div className="stat-card submissions">
                <div className="stat-icon"><FiTrendingUp /></div>
                <div className="stat-content">
                  <h3>{stats.totalSubmissions}</h3>
                  <p>Submissions</p>
                </div>
              </div>
            </div>

            {/* Heatmap */}
            <div className="heatmap-card">
              <div className="heatmap-header">
                <h2>📊 Submission Heatmap</h2>
                <p>Your coding activity over the last year</p>
              </div>

              <div className="heatmap-container">
                <CalendarHeatmap
                  startDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
                  endDate={new Date()}
                  values={getHeatmapData()}
                  classForValue={getColorClass}
                  showWeekdayLabels={true}
                  tooltipDataAttrs={(value) => {
                    if (!value || !value.date) {
                      return {
                        'data-tooltip-id': 'heatmap-tooltip',
                        'data-tooltip-content': 'No data'
                      };
                    }
                    return {
                      'data-tooltip-id': 'heatmap-tooltip',
                      'data-tooltip-content': `${value.date}: ${value.count || 0} submission${value.count !== 1 ? 's' : ''}`
                    };
                  }}
                />
                <Tooltip id="heatmap-tooltip" />
              </div>

              <div className="heatmap-legend">
                <span>Less</span>
                <div className="legend-boxes">
                  <div className="legend-box color-empty"></div>
                  <div className="legend-box color-scale-1"></div>
                  <div className="legend-box color-scale-2"></div>
                  <div className="legend-box color-scale-3"></div>
                  <div className="legend-box color-scale-4"></div>
                </div>
                <span>More</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
