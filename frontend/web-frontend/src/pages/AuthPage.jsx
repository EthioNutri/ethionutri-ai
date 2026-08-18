import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path
      fill="#EA4335"
      d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.9 5 12 5z"
    />
    <path
      fill="#4285F4"
      d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
    />
    <path
      fill="#FBBC05"
      d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7s.1-2 .4-2.7L1.6 6.4C.6 8.3 0 10.1 0 12s.6 3.7 1.6 5.6l3.7-2.9z"
    />
    <path
      fill="#34A853"
      d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.3-6.7-5.3L1.6 16c1.9 3.8 5.8 7 10.4 7z"
    />
  </svg>
);

const AuthPage = ({ initialMode = 'signup' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  const [isActive, setIsActive] = useState(() => {
    if (location.pathname === '/login') return false;
    if (location.pathname === '/signup' || location.pathname === '/register') return true;
    return initialMode === 'signup';
  });

  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [signUpData, setSignUpData] = useState({ name: '', email: '', password: '' });
  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  useEffect(() => {
    if (location.pathname === '/login') {
      setIsActive(false);
    } else if (location.pathname === '/signup' || location.pathname === '/register') {
      setIsActive(true);
    }
  }, [location.pathname]);

  const showMessage = (text) => {
    setErrorMsg(text);
  };

  // Google Single Sign-On
  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setErrorMsg('');

    const result = await register({
      fullName: 'Selamawit Kebede (Google User)',
      email: 'selamawit@ethionutri.ai',
      password: 'google_oauth_verified'
    });

    setIsLoading(false);

    if (result.success) {
      if (isActive) {
        navigate('/onboarding', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } else {
      showMessage(language === 'am' ? 'በGoogle መግባት አልተሳካም' : 'Google Authentication failed');
    }
  };

  // Sign Up Form Submission
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const name = signUpData.name.trim();
    const email = signUpData.email.trim();
    const password = signUpData.password;

    if (!name || name.length < 2) {
      showMessage(language === 'am' ? 'ስም ቢያንስ 2 ፊደላት መሆን አለበት' : 'Name must be at least 2 characters');
      return;
    }
    if (!email || !email.includes('@')) {
      showMessage(language === 'am' ? 'እባክዎ ትክክለኛ ኢሜይል ያስገቡ' : 'Please enter a valid email');
      return;
    }
    if (!password || password.length < 6) {
      showMessage(language === 'am' ? 'የይለፍ ቃል ቢያንስ 6 ፊደላት መሆን አለበት' : 'Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    const result = await register({
      fullName: name,
      email: email,
      password: password
    });
    setIsLoading(false);

    if (result.success) {
      navigate('/onboarding', { replace: true });
    } else {
      showMessage(result.error || (language === 'am' ? 'የምዝገባ ስህተት ተከስቷል' : 'Registration failed'));
    }
  };

  // Sign In Form Submission
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const email = signInData.email.trim();
    const password = signInData.password;

    if (!email || !password) {
      showMessage(language === 'am' ? 'ኢሜይል እና የይለፍ ቃል ያስፈልጋል' : 'Email and password are required');
      return;
    }

    setIsLoading(true);
    const result = await login({ email, password });
    setIsLoading(false);

    if (result.success) {
      navigate('/dashboard', { replace: true });
    } else {
      showMessage(language === 'am' ? 'የተሳሳተ ኢሜይል ወይም የይለፍ ቃል' : 'Invalid email or password');
    }
  };

  // Forgot Password Form Submission
  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail || !forgotEmail.includes('@')) {
      showMessage(language === 'am' ? 'እባክዎ ትክክለኛ ኢሜይል ያስገቡ' : 'Please enter a valid email address');
      return;
    }
    setForgotSent(true);
    setTimeout(() => {
      setShowForgotModal(false);
      setForgotSent(false);
      setForgotEmail('');
    }, 2500);
  };

  return (
    <div className="auth-sliding-wrapper">
      {/* Top Header Navbar */}
      <header className="auth-sliding-topbar">
        <Link to="/" className="marketing-brand-logo" style={{ textDecoration: 'none' }}>
          <div className="marketing-brand-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
            </svg>
          </div>
          <span className="marketing-brand-text">EthioNutri AI</span>
        </Link>

        <div className="auth-minimal-actions">
          {/* Language Selector Dropdown */}
          <div className="marketing-lang-dropdown-wrapper">
            <button
              type="button"
              className="marketing-icon-btn"
              onClick={() => setLangDropdownOpen((prev) => !prev)}
              title="Change Language / ቋንቋ ቀይር"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#2B2622" strokeWidth="2">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Main Sliding Dual Panel Container */}
      <div className="auth-sliding-body">
        <div className={`container ${isActive ? 'active' : ''}`} id="container">
          
          {/* Sign Up Form Container */}
          <div className="form-container sign-up">
            <form onSubmit={handleSignUpSubmit}>
              <h1>{language === 'am' ? 'መለያ ይፍጠሩ' : 'Create Account'}</h1>
              
              {/* Single Google Sign-In Option */}
              <button
                type="button"
                className="google-auth-btn"
                onClick={handleGoogleAuth}
                disabled={isLoading}
              >
                <GoogleIcon />
                <span>{language === 'am' ? 'በGoogle ይቀጥሉ' : 'Continue with Google'}</span>
              </button>

              <span>{language === 'am' ? 'ወይም በኢሜይል ይመዝገቡ' : 'or use your email for registration'}</span>

              {errorMsg && isActive && (
                <div className="auth-msg-pill error">
                  {errorMsg}
                </div>
              )}

              <input
                type="text"
                placeholder={language === 'am' ? 'ሙሉ ስም' : 'Full Name'}
                value={signUpData.name}
                onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder={language === 'am' ? 'ኢሜይል አድራሻ' : 'Email Address'}
                value={signUpData.email}
                onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder={language === 'am' ? 'የይለፍ ቃል (ቢያንስ 6 ፊደላት)' : 'Password (min. 6 chars)'}
                value={signUpData.password}
                onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                required
              />
              <button type="submit" disabled={isLoading}>
                {isLoading ? (language === 'am' ? 'በመመዝገብ ላይ...' : 'Signing Up...') : (language === 'am' ? 'ይመዝገቡ' : 'Sign Up')}
              </button>

              {/* Mobile Quick Switch */}
              <div className="auth-mobile-switch">
                <span>{language === 'am' ? 'ቀደም ሲል መለያ አለዎት? ' : 'Already have an account? '}</span>
                <button
                  type="button"
                  className="auth-link-btn"
                  onClick={() => {
                    setIsActive(false);
                    navigate('/login', { replace: true });
                  }}
                >
                  {language === 'am' ? 'ግባ' : 'Sign In'}
                </button>
              </div>
            </form>
          </div>

          {/* Sign In Form Container */}
          <div className="form-container sign-in">
            <form onSubmit={handleSignInSubmit}>
              <h1>{language === 'am' ? 'ግባ' : 'Sign In'}</h1>
              
              {/* Single Google Sign-In Option */}
              <button
                type="button"
                className="google-auth-btn"
                onClick={handleGoogleAuth}
                disabled={isLoading}
              >
                <GoogleIcon />
                <span>{language === 'am' ? 'በGoogle ይቀጥሉ' : 'Continue with Google'}</span>
              </button>

              <span>{language === 'am' ? 'ወይም በኢሜይልና የይለፍ ቃል ይግቡ' : 'or use your email & password'}</span>

              {errorMsg && !isActive && (
                <div className="auth-msg-pill error">
                  {errorMsg}
                </div>
              )}

              {/* Quick Demo Fill Pill */}
              <div
                className="demo-credentials-pill"
                onClick={() => setSignInData({ email: 'test@example.com', password: 'password' })}
                title="Click to prefill test credentials"
              >
                ⚡ Quick Demo: test@example.com / password
              </div>

              <input
                type="email"
                placeholder={language === 'am' ? 'ኢሜይል አድራሻ' : 'Email Address'}
                value={signInData.email}
                onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder={language === 'am' ? 'የይለፍ ቃል' : 'Password'}
                value={signInData.password}
                onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                required
              />
              <a
                href="#forgot-password"
                onClick={(e) => {
                  e.preventDefault();
                  setShowForgotModal(true);
                }}
              >
                {language === 'am' ? 'የይለፍ ቃል ረሱ?' : 'Forget Your Password?'}
              </a>
              <button type="submit" disabled={isLoading}>
                {isLoading ? (language === 'am' ? 'በመግባት ላይ...' : 'Signing In...') : (language === 'am' ? 'ግባ' : 'Sign In')}
              </button>

              {/* Mobile Quick Switch */}
              <div className="auth-mobile-switch">
                <span>{language === 'am' ? 'መለያ የለዎትም? ' : "Don't have an account? "}</span>
                <button
                  type="button"
                  className="auth-link-btn"
                  onClick={() => {
                    setIsActive(true);
                    navigate('/signup', { replace: true });
                  }}
                >
                  {language === 'am' ? 'ይመዝገቡ' : 'Sign Up'}
                </button>
              </div>
            </form>
          </div>

          {/* Sliding Overlay Toggle Panels */}
          <div className="toggle-container">
            <div className="toggle">
              {/* Left Panel: Prompt to Sign In */}
              <div className="toggle-panel toggle-left">
                <h1>{language === 'am' ? 'እንኳን ደህና መጡ!' : 'Welcome Back!'}</h1>
                <p>
                  {language === 'am'
                    ? 'ወደ መለያዎ በመግባት ባህላዊ የአመጋገብ እቅድዎን እና የጤና ምክሮችን ይቀጥሉ።'
                    : 'Enter your personal details to access your personalized traditional Ethiopian nutrition blueprint.'}
                </p>
                <button
                  className="hidden"
                  id="login"
                  type="button"
                  onClick={() => {
                    setIsActive(false);
                    navigate('/login', { replace: true });
                  }}
                >
                  {language === 'am' ? 'ግባ' : 'Sign In'}
                </button>
              </div>

              {/* Right Panel: Prompt to Sign Up */}
              <div className="toggle-panel toggle-right">
                <h1>{language === 'am' ? 'ሰላም፣ እንኳን መጡ!' : 'Hello, Friend!'}</h1>
                <p>
                  {language === 'am'
                    ? 'ለግል የተዘጋጀ ባህላዊ የኢትዮጵያ የአመጋገብ እቅድ ለማግኘት አሁኑኑ ይመዝገቡ።'
                    : 'Register with your personal details to start your tailored Ethiopian wellness & nutrition journey.'}
                </p>
                <button
                  className="hidden"
                  id="register"
                  type="button"
                  onClick={() => {
                    setIsActive(true);
                    navigate('/signup', { replace: true });
                  }}
                >
                  {language === 'am' ? 'ይመዝገቡ' : 'Sign Up'}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="recipe-modal-backdrop" onClick={() => setShowForgotModal(false)}>
          <div className="recipe-modal-dialog small" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <button
              type="button"
              className="recipe-modal-close-btn"
              onClick={() => setShowForgotModal(false)}
            >
              ✕
            </button>
            <div style={{ padding: '32px 26px', textAlign: 'center' }}>
              <h2 style={{ fontSize: '22px', color: 'var(--color-primary)', marginBottom: '8px', fontWeight: '800' }}>
                {language === 'am' ? 'የይለፍ ቃል መልሶ ማግኛ' : 'Reset Password'}
              </h2>
              <p style={{ fontSize: '13.5px', color: 'var(--color-text-muted)', marginBottom: '20px', lineHeight: '1.45' }}>
                {language === 'am'
                  ? 'የይለፍ ቃል ማስተካከያ ማስፈንጠሪያ ለመቀበል የተመዘገቡበትን ኢሜይል ያስገቡ።'
                  : 'Enter your registered email address to receive a secure password reset link.'}
              </p>

              {forgotSent ? (
                <div style={{
                  backgroundColor: 'rgba(127, 217, 168, 0.15)',
                  color: '#7FD9A8',
                  border: '1px solid #7FD9A8',
                  padding: '14px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: '700'
                }}>
                  ✓ {language === 'am' ? 'የማስተካከያ ሊንክ ወደ ኢሜይልዎ ተልኳል!' : 'If this email is registered, you will receive a reset link shortly.'}
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} id="forgotForm">
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1.5px solid var(--color-border)',
                      backgroundColor: 'var(--color-bg-card)',
                      color: 'var(--color-text)',
                      marginBottom: '18px',
                      fontSize: '14px'
                    }}
                    required
                  />
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(false)}
                      style={{
                        flex: 1,
                        padding: '10px 18px',
                        borderRadius: '10px',
                        border: '1px solid var(--color-border)',
                        background: 'transparent',
                        color: 'var(--color-text)',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      {language === 'am' ? 'ተመለስ' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      style={{
                        flex: 1,
                        padding: '10px 18px',
                        borderRadius: '10px',
                        border: 'none',
                        background: '#E8935C',
                        color: '#121212',
                        fontWeight: '800',
                        cursor: 'pointer'
                      }}
                    >
                      {language === 'am' ? 'ላክ' : 'Send Link'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthPage;
