import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const navItems = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    path: '/food-logging',
    label: 'Food Logging',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
  },
  {
    path: '/analytics',
    label: 'Analytics',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    path: '/meal-planning',
    label: 'Meal Planning',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m16 2-4 4 4 4" />
        <path d="m8 22 4-4-4-4" />
        <path d="m18 12-6 6-6-6" />
        <path d="M18 6H6" />
        <path d="M18 18H6" />
      </svg>
    ),
  },
  {
    path: '/fasting-calendar',
    label: 'Fasting Calendar',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    path: '/nutritionist',
    label: 'Nutritionist',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

const Sidebar = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    navigate('/login');
  };

  return (
    <aside className="app-sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand-box">
        <div className="sidebar-logo-mark">
          {/* Coffee bean / green leaf heraldic icon */}
          <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="17" fill="#F4E8DC" stroke="#C97B3D" strokeWidth="1.5" />
            <path
              d="M18 7C12 11 10 18 14 24C17 28.5 24 28 27 23C30 18 26 10 18 7Z"
              fill="#1F4B3F"
            />
            <path
              d="M18 10C15 14 16 21 21 24"
              stroke="#F4E8DC"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="21" cy="14" r="2.5" fill="#C97B3D" />
          </svg>
        </div>
        <div className="sidebar-brand-text">
          <h2 className="sidebar-brand-name">EthioNutri AI</h2>
          <p className="sidebar-brand-tagline">Modern Heritage Nutrition</p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? 'active' : ''}`
            }
          >
            <span className="sidebar-nav-icon">{item.icon}</span>
            <span className="sidebar-nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Pinned Bottom Sign Out */}
      <div className="sidebar-footer">
        <button className="sidebar-signout-btn" onClick={handleSignOut}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
