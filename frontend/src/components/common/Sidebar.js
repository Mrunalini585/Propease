// src/components/common/Sidebar.js

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// navItems: array of { key, icon, label }
// activePage: current active page key
// onNavigate: function to call when a nav button is clicked
export default function Sidebar({ navItems, activePage, onNavigate, unreadCount = 0 }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Get initials from name (e.g. "Rahul Sharma" → "RS")
  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-logo">P</div>
        <div>
          <div className="sidebar-brand-name">PropEase</div>
          <div className="sidebar-brand-sub">
            {user?.role === 'owner' ? '🏢 Owner Portal' : '🏠 Tenant Portal'}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="nav-section-label">Navigation</div>
      {navItems.map(item => (
        <button
          key={item.key}
          className={`nav-btn ${activePage === item.key ? 'active' : ''}`}
          onClick={() => onNavigate(item.key)}
        >
          <span className="nav-icon">{item.icon}</span>
          {item.label}
          {/* Show unread badge on Messages */}
          {item.key === 'messages' && unreadCount > 0 && (
            <span className="nav-badge">{unreadCount}</span>
          )}
        </button>
      ))}

      {/* User info + logout at bottom */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{initials}</div>
          <div>
            <div className="sidebar-user-name">{user?.name}</div>
            <div className="sidebar-user-role">{user?.role}</div>
          </div>
        </div>
        <button className="nav-btn" onClick={handleLogout} style={{color: 'var(--red)'}}>
          <span className="nav-icon">🚪</span> Logout
        </button>
      </div>
    </aside>
  );
}
