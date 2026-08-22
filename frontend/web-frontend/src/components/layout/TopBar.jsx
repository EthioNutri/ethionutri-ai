import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useNutrition } from '../../context/NutritionContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { getAvatarUrl } from '../../utils/imageHelper';

const pageTitleMap = {
  '/dashboard': 'Wednesday Fast',
  '/food-logging': 'Food Logging',
  '/analytics': 'Analytics',
  '/meal-planning': 'Weekly Plan',
  '/fasting-app': 'Fasting Calendar (Tsom)',
  '/nutritionist': 'Nutritionist AI',
  '/profile': 'Profile & Preferences',
};

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=150&q=80'
];

const TopBar = ({ onSearch }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { fastingCycle } = useNutrition();
  const { user, updateUserProfile, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();

  const [searchTerm, setSearchTerm] = useState('');
  const [hasUnread, setHasUnread] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Edit profile form state
  const [editForm, setEditForm] = useState({
    firstName: user?.name?.split(' ')[0] || 'Thomas D.',
    lastName: user?.name?.split(' ').slice(1).join(' ') || 'Hardison',
    email: user?.email || 'thomashardison@dayrep.com',
    phone: '661-724-7734',
    fastingPractice: 'Ethiopian Orthodox (Tsom)',
    healthConditions: 'None',
    languagePreference: 'English',
    password: 'password',
    avatar: user?.avatar || AVATAR_PRESETS[0]
  });

  const dropdownRef = useRef(null);

  // Sync edit form with user state when modal opens
  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || user.fullName || 'Selamawit Kebede',
        email: user.email || 'selamawit@ethionutri.ai',
        avatar: user.avatar || AVATAR_PRESETS[0]
      });
    }
  }, [user, isEditModalOpen]);

  // Click outside listener for dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calculate real date dynamically for top bar date display
  const todayObj = new Date();
  const formattedDateStr = todayObj.toLocaleDateString(language === 'am' ? 'en-US' : 'en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  const isTodayFasting = todayObj.getDay() === 3 || todayObj.getDay() === 5 || (fastingCycle?.allowedBadge && fastingCycle.allowedBadge.toLowerCase().includes('fasting'));

  let titleContent;
  if (location.pathname === '/dashboard') {
    titleContent = (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span>{formattedDateStr}</span>
        {isTodayFasting && (
          <span style={{
            fontSize: '11px',
            fontWeight: 800,
            padding: '2px 8px',
            borderRadius: '12px',
            background: 'rgba(201, 123, 61, 0.18)',
            color: '#C97B3D',
            border: '1px solid rgba(201, 123, 61, 0.4)',
            letterSpacing: '0.3px'
          }}>
            🌱 {language === 'am' ? 'የጾም ቀን' : 'Fasting'}
          </span>
        )}
      </div>
    );
  } else {
    titleContent = pageTitleMap[location.pathname] || fastingCycle.title;
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!editForm.name.trim()) return;

    updateUserProfile({
      name: editForm.name,
      fullName: editForm.name,
      email: editForm.email,
      avatar: editForm.avatar
    });

    setIsEditModalOpen(false);
    setToastMsg(language === 'am' ? '✨ መገለጫዎ በተሳካ ሁኔታ ተስተካክሏል!' : '✨ Profile updated successfully!');
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleSignOut = () => {
    setDropdownOpen(false);
    logout();
    navigate('/');
  };

  return (
    <header className="topbar-container">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="app-toast-alert" style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 99999 }}>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Left: Search input (only rendered on recipes screen) */}
      {location.pathname === '/recipes' && (
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
            placeholder={language === 'am' ? 'ምግቦችን፣ የምግብ አዘገጃጀቶችን ይፈልጉ...' : 'Search foods, recipes...'}
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      )}

      {/* Center: Context/Page Title in Burnt Orange */}
      <div className="topbar-center-title">
        {titleContent}
      </div>

      {/* Right: Icon Cluster & Profile Dropdown */}
      <div className="topbar-right-actions" ref={dropdownRef}>
        {/* Dark Mode Toggle */}
        <button
          type="button"
          className="topbar-icon-btn"
          onClick={toggleTheme}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle Theme"
        >
          {isDark ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="m4.93 4.93 1.41 1.41" />
              <path d="m17.66 17.66 1.41 1.41" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="m6.34 17.66-1.41 1.41" />
              <path d="m19.07 4.93-1.41 1.41" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2B2622" strokeWidth="2">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          )}
        </button>

        {/* Language switch with translation icon */}
        <button
          type="button"
          className="topbar-icon-btn lang-btn"
          onClick={toggleLanguage}
          title="Toggle Language (English / አማርኛ)"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="m5 8 6 6" />
            <path d="m4 14 6-6 2-3" />
            <path d="M2 5h12" />
            <path d="M7 2h1" />
            <path d="m22 22-5-10-5 10" />
            <path d="M14 18h6" />
          </svg>
        </button>

        {/* Notification bell with red badge */}
        <button
          type="button"
          className="topbar-icon-btn notification-btn"
          onClick={() => setHasUnread(false)}
          title="Notifications (Iron intake alert)"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          {hasUnread && <span className="notification-red-dot" />}
        </button>

        {/* Constrained Circular Avatar Button */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            className="topbar-user-avatar-btn"
            onClick={() => navigate('/profile')}
            title={user?.name || 'User Profile'}
            style={{
              width: '42px',
              height: '42px',
              minWidth: '42px',
              minHeight: '42px',
              maxWidth: '42px',
              maxHeight: '42px',
              borderRadius: '50%',
              overflow: 'hidden',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: isDark ? '2px solid rgba(255,255,255,0.2)' : '2px solid #FFFFFF',
              boxShadow: '0 2px 10px rgba(0,0,0,0.12)',
              cursor: 'pointer',
              background: 'transparent'
            }}
          >
            <img
              src={getAvatarUrl(user?.avatar) || AVATAR_PRESETS[0]}
              alt={user?.name || 'User Avatar'}
              className="topbar-user-avatar"
              onError={(e) => {
                e.currentTarget.src = AVATAR_PRESETS[0];
              }}
            />
          </button>

          {/* Google-Style Card Profile Dropdown Menu */}
          {dropdownOpen && (
            <div className="google-profile-dropdown-card">
              {/* Centered User Info Section (Google Style) */}
              <div className="google-dropdown-hero">
                <div className="google-avatar-container" onClick={() => { setDropdownOpen(false); setIsEditModalOpen(true); }} title="Click to change photo">
                  <img
                    src={getAvatarUrl(user?.avatar) || AVATAR_PRESETS[0]}
                    alt="User"
                    className="google-hero-avatar"
                  />
                  <div className="google-avatar-edit-badge" title="Change Photo">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                  </div>
                </div>

                <h3 className="google-hero-name">{user?.name || 'Selamawit Kebede'}</h3>
                <p className="google-hero-email">{user?.email || 'selamawit@ethionutri.ai'}</p>

                {/* Manage Account Pill Button */}
                <button
                  type="button"
                  className="google-manage-pill-btn"
                  onClick={() => {
                    setDropdownOpen(false);
                    setIsEditModalOpen(true);
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  <span>{language === 'am' ? 'መገለጫን አርትዕ' : 'Manage Profile'}</span>
                </button>
              </div>

              {/* Fasting / Nutrition Status Badge */}
              <div className="google-status-pill-row">
                <span className="google-status-tag">🌿 {language === 'am' ? `የጾም ስርዓት፡ ${fastingCycle?.title || 'ጾም'}` : `Fasting: ${fastingCycle?.title || 'Active'}`}</span>
                <span className="google-status-tag pro">💪 42g Protein</span>
              </div>

              <div className="google-dropdown-divider" />

              {/* Action Rows */}
              <div className="google-dropdown-links-list">
                <button
                  type="button"
                  className="google-menu-item-row"
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate('/onboarding');
                  }}
                >
                  <div className="google-item-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                  </div>
                  <div className="google-item-content">
                    <span className="google-item-title">{language === 'am' ? 'የአመጋገብ ቅንብሮች እና ግቦች' : 'Dietary Goals & Targets'}</span>
                    <span className="google-item-sub">{language === 'am' ? 'ካሎሪ፣ ማክሮ እና የጾም ማስተካከያ' : 'Caloric targets, fasting preferences'}</span>
                  </div>
                </button>

                <button
                  type="button"
                  className="google-menu-item-row"
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate('/');
                  }}
                >
                  <div className="google-item-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                  </div>
                  <div className="google-item-content">
                    <span className="google-item-title">{language === 'am' ? 'ወደ ዋና ገጽ ይሂዱ' : 'View Marketing Site'}</span>
                    <span className="google-item-sub">{language === 'am' ? 'የምግብ አዘገጃጀት እና ባህላዊ መመሪያዎች' : 'Public recipes, fasting calendar'}</span>
                  </div>
                </button>
              </div>

              <div className="google-dropdown-divider" />

              {/* Sign Out Button */}
              <div style={{ padding: '4px 8px 8px 8px' }}>
                <button
                  type="button"
                  className="google-signout-btn"
                  onClick={handleSignOut}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  <span>{language === 'am' ? 'ውጣ' : 'Sign Out'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal Dialog */}
      {isEditModalOpen && (
        <div className="recipe-modal-backdrop" onClick={() => setIsEditModalOpen(false)}>
          <div className="recipe-modal-dialog small" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px', borderRadius: '16px', background: 'var(--card-bg)', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 24px 48px rgba(0,0,0,0.6)' }}>
            <div style={{ padding: '24px 32px' }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#F5F5F0', margin: 0 }}>
                  {language === 'am' ? 'መገለጫዎን ያርትዑ' : 'Edit Profile'}
                </h2>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  style={{ background: 'transparent', border: 'none', color: '#A8A8A0', cursor: 'pointer', fontSize: '20px', padding: 0 }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column' }}>
                {/* Avatar */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '36px' }}>
                  <div style={{ position: 'relative', width: '96px', height: '96px' }}>
                    <img
                      src={editForm.avatar}
                      alt="Avatar"
                      style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', opacity: 0.8 }}
                    />
                    <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid #E8935C' }} />
                    <button
                      type="button"
                      style={{
                        position: 'absolute',
                        bottom: '0',
                        right: '0',
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: '#E8935C',
                        border: '2px solid #242426',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#121212',
                        cursor: 'pointer',
                        padding: 0
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                        <path d="m15 5 4 4" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Form Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 24px', marginBottom: '40px' }}>
                  
                  {/* First Name */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#F5F5F0' }}>First Name</label>
                    <input
                      type="text"
                      className="modal-input"
                      value={editForm.firstName}
                      onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                      style={{ background: '#1C1C1E', border: '1px solid #3A3A38', borderRadius: '8px', padding: '12px 14px', color: '#F5F5F0', fontSize: '13.5px', outline: 'none' }}
                    />
                  </div>

                  {/* Last Name */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#F5F5F0' }}>Last Name</label>
                    <input
                      type="text"
                      className="modal-input"
                      value={editForm.lastName}
                      onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                      style={{ background: '#1C1C1E', border: '1px solid #3A3A38', borderRadius: '8px', padding: '12px 14px', color: '#F5F5F0', fontSize: '13.5px', outline: 'none' }}
                    />
                  </div>

                  {/* Email */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#F5F5F0' }}>Email</label>
                    <input
                      type="email"
                      className="modal-input"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      style={{ background: '#1C1C1E', border: '1px solid #3A3A38', borderRadius: '8px', padding: '12px 14px', color: '#F5F5F0', fontSize: '13.5px', outline: 'none' }}
                    />
                  </div>

                  {/* Phone Number */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#F5F5F0' }}>Phone Number</label>
                    <input
                      type="text"
                      className="modal-input"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      style={{ background: '#1C1C1E', border: '1px solid #3A3A38', borderRadius: '8px', padding: '12px 14px', color: '#F5F5F0', fontSize: '13.5px', outline: 'none' }}
                    />
                  </div>

                  {/* Fasting Practice */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#F5F5F0' }}>Fasting Practice</label>
                    <input
                      type="text"
                      className="modal-input"
                      value={editForm.fastingPractice}
                      onChange={(e) => setEditForm({ ...editForm, fastingPractice: e.target.value })}
                      style={{ background: '#1C1C1E', border: '1px solid #3A3A38', borderRadius: '8px', padding: '12px 14px', color: '#F5F5F0', fontSize: '13.5px', outline: 'none' }}
                    />
                  </div>

                  {/* Health Conditions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#F5F5F0' }}>Health Conditions</label>
                    <input
                      type="text"
                      className="modal-input"
                      value={editForm.healthConditions}
                      onChange={(e) => setEditForm({ ...editForm, healthConditions: e.target.value })}
                      style={{ background: '#1C1C1E', border: '1px solid #3A3A38', borderRadius: '8px', padding: '12px 14px', color: '#F5F5F0', fontSize: '13.5px', outline: 'none' }}
                    />
                  </div>

                  {/* Language Preference */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#F5F5F0' }}>Language Preference</label>
                    <div style={{ position: 'relative' }}>
                      <select
                        className="modal-input"
                        value={editForm.languagePreference}
                        onChange={(e) => setEditForm({ ...editForm, languagePreference: e.target.value })}
                        style={{ width: '100%', background: '#1C1C1E', border: '1px solid #3A3A38', borderRadius: '8px', padding: '12px 32px 12px 14px', color: '#F5F5F0', fontSize: '13.5px', outline: 'none', appearance: 'none', cursor: 'pointer' }}
                      >
                        <option value="English">English</option>
                        <option value="Amharic">Amharic (አማርኛ)</option>
                      </select>
                      <svg style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A8A8A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </div>

                  {/* Password */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#F5F5F0' }}>Password</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="password"
                        className="modal-input"
                        value={editForm.password}
                        onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                        style={{ width: '100%', background: '#1C1C1E', border: '1px solid #3A3A38', borderRadius: '8px', padding: '12px 36px 12px 14px', color: '#F5F5F0', fontSize: '13.5px', outline: 'none', letterSpacing: '3px' }}
                      />
                      <button type="button" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#A8A8A0', cursor: 'pointer', padding: 0 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                          <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                          <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                          <line x1="2" y1="2" x2="22" y2="22" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px' }}>
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    style={{ background: 'transparent', border: 'none', color: '#E8935C', fontSize: '13.5px', fontWeight: '600', cursor: 'pointer', padding: '10px' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ background: '#F4A876', border: 'none', color: '#121212', fontSize: '13.5px', fontWeight: '700', cursor: 'pointer', padding: '12px 24px', borderRadius: '6px' }}
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default TopBar;
