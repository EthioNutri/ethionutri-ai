import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import '../../styles/Marketing.css';

const MarketingLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  // Close mobile menu & dropdown on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setLangDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const navLinks = [
    { path: '/how-it-works', label: language === 'am' ? 'እንዴት እንደሚሰራ' : 'How it Works' },
    { path: '/fasting-calendar', label: language === 'am' ? 'የጾም ቀን መቁጠሪያ' : 'Fasting Calendar' },
    { path: '/recipes', label: language === 'am' ? 'የምግብ አዘገጃጀት' : 'Recipes' },
    { path: '/about', label: language === 'am' ? 'ስለ እኛ' : 'About Us' },
  ];

  return (
    <div className="marketing-site-wrapper">
      {/* Top Navigation Bar */}
      <header className="marketing-navbar-container">
        <div className="marketing-navbar-inner">
          {/* Brand Logo (Left) */}
          <Link to="/" className="marketing-brand-logo" aria-label="EthioNutri AI Home">
            <div className="marketing-brand-icon">
              {/* Leaf & Seed emblem in Forest Green */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
              </svg>
            </div>
            <span className="marketing-brand-text">EthioNutri AI</span>
          </Link>

          {/* Navigation Links (Center) */}
          <nav className="marketing-nav-links" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`marketing-nav-link ${isActive ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Utility Icons & Auth Buttons (Right) */}
          <div className="marketing-nav-actions">
            {/* Language Selector Dropdown */}
            <div className="marketing-lang-dropdown-wrapper">
              <button
                type="button"
                className="marketing-icon-btn"
                onClick={() => setLangDropdownOpen((prev) => !prev)}
                title="Change language / ቋንቋ ቀይር"
                aria-expanded={langDropdownOpen}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </button>

              {langDropdownOpen && (
                <div className="marketing-dropdown-menu">
                  <button
                    type="button"
                    className={`marketing-dropdown-item ${language === 'en' ? 'selected' : ''}`}
                    onClick={() => {
                      setLanguage('en');
                      setLangDropdownOpen(false);
                    }}
                  >
                    <span>English (US/UK)</span>
                    {language === 'en' && <span className="check-mark">✓</span>}
                  </button>
                  <button
                    type="button"
                    className={`marketing-dropdown-item ${language === 'am' ? 'selected' : ''}`}
                    onClick={() => {
                      setLanguage('am');
                      setLangDropdownOpen(false);
                    }}
                  >
                    <span>አማርኛ (Amharic)</span>
                    {language === 'am' && <span className="check-mark">✓</span>}
                  </button>
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              type="button"
              className="marketing-icon-btn"
              onClick={toggleTheme}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
            >
              {isDark ? (
                /* Sun Icon */
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                /* Moon Icon */
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              )}
            </button>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="marketing-auth-group">
                <Link to="/dashboard" className="marketing-btn-primary" style={{ padding: '8px 20px', fontSize: '14px' }}>
                  {language === 'am' ? 'ዳሽቦርድ' : 'Dashboard'}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="marketing-btn-ghost"
                  style={{ padding: '8px 16px', fontSize: '14px' }}
                >
                  {language === 'am' ? 'ውጣ' : 'Sign Out'}
                </button>
              </div>
            ) : (
              <div className="marketing-auth-group">
                <Link to="/login" className="marketing-btn-ghost">
                  {language === 'am' ? 'ግባ' : 'Log In'}
                </Link>
                <Link to="/signup" className="marketing-btn-primary">
                  {language === 'am' ? 'ይመዝገቡ' : 'Sign Up'}
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              type="button"
              className="marketing-hamburger-btn"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Drawer */}
        {mobileMenuOpen && (
          <div className="marketing-mobile-drawer">
            <nav className="marketing-mobile-nav">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`marketing-mobile-link ${location.pathname === link.path ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="marketing-mobile-auth">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="marketing-btn-primary" style={{ width: '100%', textAlign: 'center' }}>
                    {language === 'am' ? 'ወደ ዳሽቦርድ ይሂዱ' : 'Go to Dashboard'}
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                    className="marketing-btn-ghost"
                    style={{ width: '100%', textAlign: 'center' }}
                  >
                    {language === 'am' ? 'ውጣ' : 'Sign Out'}
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="marketing-btn-ghost" style={{ width: '100%', textAlign: 'center' }}>
                    {language === 'am' ? 'ግባ' : 'Log In'}
                  </Link>
                  <Link to="/signup" className="marketing-btn-primary" style={{ width: '100%', textAlign: 'center' }}>
                    {language === 'am' ? 'ይመዝገቡ (ነፃ)' : 'Sign Up Free'}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Routed Page Content */}
      <main className="marketing-main-content">
        <Outlet />
      </main>

      {/* Shared Global Marketing Footer */}
      <footer className="marketing-footer-container">
        <div className="marketing-footer-inner">
          {/* Left Column: Brand & Tagline */}
          <div className="marketing-footer-brand-section">
            <Link to="/" className="marketing-footer-logo">
              <div className="marketing-brand-icon small">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                </svg>
              </div>
              <span className="marketing-footer-title">EthioNutri AI</span>
            </Link>
            <p className="marketing-footer-copy">
              © {new Date().getFullYear()} EthioNutri AI. {language === 'am' ? 'ባህልን በአመጋገብ ሳይንስ ማክበር።' : 'Celebrating heritage through nutrition.'}
            </p>
          </div>

          {/* Right Column: Utility / Legal Links */}
          <div className="marketing-footer-links-row">
            <Link to="/privacy" className="marketing-footer-link">
              {language === 'am' ? 'የግላዊነት ፖሊሲ' : 'Privacy Policy'}
            </Link>
            <Link to="/terms" className="marketing-footer-link">
              {language === 'am' ? 'የአገልግሎት ውሎች' : 'Terms of Service'}
            </Link>
            <Link to="/cultural-guidelines" className="marketing-footer-link">
              {language === 'am' ? 'ባህላዊ መመሪያዎች' : 'Cultural Guidelines'}
            </Link>
            <Link to="/contact" className="marketing-footer-link">
              {language === 'am' ? 'አግኙን' : 'Contact'}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MarketingLayout;
