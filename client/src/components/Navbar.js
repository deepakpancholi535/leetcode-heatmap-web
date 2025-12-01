import React from 'react';
import { FiLogOut, FiUser } from 'react-icons/fi';
import './Navbar.css';

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h2>🔥 LeetCode Heatmap</h2>
        </div>
        <div className="navbar-user">
          <div className="user-info">
            <FiUser className="user-icon" />
            <span className="user-name">{user?.name}</span>
          </div>
          <button onClick={onLogout} className="logout-btn">
            <FiLogOut /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
