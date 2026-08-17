import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNutrition } from '../../context/NutritionContext';

const pageTitleMap = {
  '/dashboard': 'Wednesday Fast',
  '/food-logging': 'Food Logging',
  '/analytics': 'Analytics',
  '/meal-planning': 'Weekly Plan',
  '/fasting-calendar': 'Wednesday Fast',
  '/nutritionist': 'Wednesday Fast',
};

const TopBar = ({ onSearch }) => {
  const location = useLocation();
  const { fastingCycle } = useNutrition();
  const [searchTerm, setSearchTerm] = useState('');
  const [hasUnread, setHasUnread] = useState(true);
  const [currentLang, setCurrentLang] = useState('EN');

  const currentTitle = pageTitleMap[location.pathname] || fastingCycle.title;

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  const toggleLanguage = () => {
    setCurrentLang((prev) => (prev === 'EN' ? 'አማ' : 'EN'));
  };

  return (
    <header className="topbar-container">
      {/* Left: Search input */}
      <div className="topbar-search-wrap">
        <div className="search-icon-inside">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8E857E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <input
          type="text"
          className="topbar-search-input"
          placeholder="Search foods, recipes..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* Center: Context/Page Title in Burnt Orange */}
      <div className="topbar-center-title">
        {currentTitle}
      </div>

      {/* Right: Icon Cluster */}
      <div className="topbar-right-actions">
        {/* Language switch */}
        <button
          className="topbar-icon-btn lang-btn"
          onClick={toggleLanguage}
          title="Toggle Language / ቋንቋ ቀይር"
        >
          <span className="lang-icon-symbol">文A</span>
        </button>

        {/* Notification bell with red badge */}
        <button
          className="topbar-icon-btn notification-btn"
          onClick={() => setHasUnread(false)}
          title="Notifications (Iron intake alert)"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2B2622" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          {hasUnread && <span className="notification-red-dot" />}
        </button>

        {/* User avatar */}
        <div className="topbar-user-avatar" title="Selamawit Kebede">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
            alt="User Avatar"
            className="avatar-img"
          />
        </div>
      </div>
    </header>
  );
};

export default TopBar;
