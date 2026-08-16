import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.01 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
);

const AuthPage = ({ initialMode = 'signup' }) => {
  const [isActive, setIsActive] = useState(initialMode === 'signup');
  const [signUpData, setSignUpData] = useState({ name: '', email: '', password: '' });
  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const { login, register } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState(location.pathname);

  // Keep the active panel in sync with the current route (e.g. /login vs /register)
  if (location.pathname !== currentPath) {
    setCurrentPath(location.pathname);
    setIsActive(location.pathname === '/register' || location.pathname === '/signup');
  }

  // Google Single Sign-On Simulation & Direct Onboarding Routing
  const handleGoogleAuth = async () => {
    setIsGoogleLoading(true);
    setErrorMsg('');

    // Simulate Google SSO exchange
    const result = await register({
      fullName: 'Abebe Bikila (Google User)',
      email: 'user@gmail.com',
      password: 'google_oauth_verified'
    });

    setIsGoogleLoading(false);

    if (result.success) {
      // Seamlessly directs straight into Onboarding
      navigate('/onboarding');
    } else {
      setErrorMsg(language === 'am' ? 'በGoogle መግባት አልተሳካም' : 'Google Authentication failed');
    }
  };

  // Sign Up Form Submission -> Directly into Onboarding
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!signUpData.name || signUpData.name.trim().length < 2) {
      setErrorMsg(language === 'am' ? 'እባክዎ ሙሉ ስም ያስገቡ' : 'Name must be at least 2 characters');
      return;
    }
    if (!signUpData.email || !signUpData.email.includes('@')) {
      setErrorMsg(language === 'am' ? 'እባክዎ ትክክለኛ ኢሜይል ያስገቡ' : 'Please enter a valid email');
      return;
    }
    if (!signUpData.password || signUpData.password.length < 6) {
      setErrorMsg(language === 'am' ? 'የይለፍ ቃል ቢያንስ 6 ፊደላት መሆን አለበት' : 'Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    const result = await register({
      fullName: signUpData.name,
      email: signUpData.email,
      password: signUpData.password
    });
    setIsLoading(false);

    if (result.success) {
      // Direct integration: seamlessly route new registrations to Onboarding screen
      navigate('/onboarding');
    } else {
      setErrorMsg(result.error || (language === 'am' ? 'የምዝገባ ስህተት ተከስቷል' : 'Registration failed'));
    }
  };

  // Sign In Form Submission
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!signInData.email || !signInData.password) {
      setErrorMsg(language === 'am' ? 'ኢሜይል እና የይለፍ ቃል ያስፈልጋል' : 'Email and password are required');
      return;
    }

    setIsLoading(true);
    const result = await login(signInData);
    setIsLoading(false);

    if (result.success) {
      const from = location.state?.from?.pathname || '/onboarding';
      navigate(from, { replace: true });
    } else {
      setErrorMsg(t('invalidCredentials'));
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail || !forgotEmail.includes('@')) {
      alert(language === 'am' ? 'እባክዎ ትክክለኛ ኢሜይል ያስገቡ' : 'Please enter a valid email address');
      return;
    }
    setForgotSent(true);
    setTimeout(() => {
      setShowForgotModal(false);
      setForgotSent(false);
      setForgotEmail('');
    }, 2200);
  };

  return (
    <div className="auth-sliding-wrapper">
      <div className={`auth-sliding-container ${isActive ? 'active' : ''}`} id="container">
        
        {/* Sign Up Form Container */}
        <div className="sliding-form-container sliding-sign-up">
          <form onSubmit={handleSignUpSubmit}>
            <h1>{t('createAccount')}</h1>
            
            {/* Google-Only Social Auth Button */}
            <button
              type="button"
              className="google-auth-btn"
              onClick={handleGoogleAuth}
              disabled={isGoogleLoading}
            >
              <GoogleIcon />
              <span>
                {isGoogleLoading 
                  ? (language === 'am' ? 'በመገናኘት ላይ...' : 'Connecting Google...') 
                  : (language === 'am' ? 'በGoogle ይመዝገቡ' : 'Sign up with Google')}
              </span>
            </button>

            <span className="auth-subtitle">
              {language === 'am' ? 'ወይም በኢሜይል ይመዝገቡ' : 'or use your email for registration'}
            </span>

            {errorMsg && isActive && (
              <div style={{
                backgroundColor: 'var(--color-error-bg)',
                color: 'var(--color-error)',
                padding: '8px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '12px',
                marginBottom: '8px',
                fontWeight: '600',
                width: '100%',
                maxWidth: '340px'
              }}>
                {errorMsg}
              </div>
            )}

            <input
              type="text"
              placeholder={language === 'am' ? 'ሙሉ ስም' : 'Full Name'}
              className="auth-input-field"
              value={signUpData.name}
              onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
            />
            <input
              type="email"
              placeholder={language === 'am' ? 'ኢሜይል' : 'Email address'}
              className="auth-input-field"
              value={signUpData.email}
              onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
            />
            <input
              type="password"
              placeholder={language === 'am' ? 'የይለፍ ቃል (ቢያንስ 6)' : 'Password (min. 6 chars)'}
              className="auth-input-field"
              value={signUpData.password}
              onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
            />

            <button type="submit" className="auth-form-btn" disabled={isLoading}>
              {isLoading ? (language === 'am' ? 'በመመዝገብ ላይ...' : 'Creating Account...') : t('register')} &rarr;
            </button>

            {/* Mobile switch button */}
            <div style={{ display: 'none', marginTop: '14px', fontSize: '13px' }} className="mobile-only-switch">
              <span>{t('alreadyHaveAccount')} </span>
              <button 
                type="button" 
                onClick={() => setIsActive(false)} 
                style={{ background: 'none', border: 'none', color: 'var(--color-accent)', fontWeight: '700', cursor: 'pointer' }}
              >
                {t('login')}
              </button>
            </div>
          </form>
        </div>

        {/* Sign In Form Container */}
        <div className="sliding-form-container sliding-sign-in">
          <form onSubmit={handleSignInSubmit}>
            <h1>{t('login')}</h1>
            
            {/* Google-Only Social Auth Button */}
            <button
              type="button"
              className="google-auth-btn"
              onClick={handleGoogleAuth}
              disabled={isGoogleLoading}
            >
              <GoogleIcon />
              <span>
                {isGoogleLoading 
                  ? (language === 'am' ? 'በመገናኘት ላይ...' : 'Connecting Google...') 
                  : (language === 'am' ? 'በGoogle ይግቡ' : 'Sign in with Google')}
              </span>
            </button>

            <span className="auth-subtitle">
              {language === 'am' ? 'ወይም በኢሜይልና የይለፍ ቃል ይግቡ' : 'or use your email & password'}
            </span>

            {errorMsg && !isActive && (
              <div style={{
                backgroundColor: 'var(--color-error-bg)',
                color: 'var(--color-error)',
                padding: '8px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '12px',
                marginBottom: '8px',
                fontWeight: '600',
                width: '100%',
                maxWidth: '340px'
              }}>
                {errorMsg}
              </div>
            )}

            <input
              type="email"
              placeholder={language === 'am' ? 'ኢሜይል' : 'Email address'}
              className="auth-input-field"
              value={signInData.email}
              onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
            />
            <input
              type="password"
              placeholder={language === 'am' ? 'የይለፍ ቃል' : 'Password'}
              className="auth-input-field"
              value={signInData.password}
              onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
            />

            <a
              href="#forgot-password"
              className="forgot-link"
              onClick={(e) => {
                e.preventDefault();
                setShowForgotModal(true);
              }}
            >
              {t('forgotPassword')}
            </a>

            <button type="submit" className="auth-form-btn" disabled={isLoading}>
              {isLoading ? (language === 'am' ? 'በመግባት ላይ...' : 'Signing In...') : t('login')} &rarr;
            </button>

            {/* Mobile switch button */}
            <div style={{ display: 'none', marginTop: '14px', fontSize: '13px' }} className="mobile-only-switch">
              <span>{t('noAccount')} </span>
              <button 
                type="button" 
                onClick={() => setIsActive(true)} 
                style={{ background: 'none', border: 'none', color: 'var(--color-accent)', fontWeight: '700', cursor: 'pointer' }}
              >
                {t('register')}
              </button>
            </div>
          </form>
        </div>

        {/* Sliding Toggle Panel Overlay */}
        <div className="sliding-toggle-container">
          <div className="sliding-toggle">
            
            {/* Left Toggle Panel (Shown when Sign Up is visible, prompts Sign In) */}
            <div className="sliding-toggle-panel sliding-toggle-left">
              <h1>{t('welcomeBack')}</h1>
              <p>
                {language === 'am'
                  ? 'ወደ መለያዎ በመግባት ባህላዊ የአመጋገብ እቅድዎን እና የጤና ምክሮችን ይቀጥሉ።'
                  : 'Sign in with your details to access your personalized traditional Ethiopian nutrition blueprint.'}
              </p>
              <button
                type="button"
                className="auth-form-btn hidden-btn"
                id="login"
                onClick={() => {
                  setIsActive(false);
                  navigate('/login', { replace: true });
                }}
              >
                {t('login')}
              </button>
            </div>

            {/* Right Toggle Panel (Shown when Sign In is visible, prompts Sign Up) */}
            <div className="sliding-toggle-panel sliding-toggle-right">
              <h1>{language === 'am' ? 'ሰላም፣ እንኳን መጡ!' : 'Hello, Friend!'}</h1>
              <p>
                {language === 'am'
                  ? 'ለግል የተዘጋጀ ባህላዊ የኢትዮጵያ የአመጋገብ እቅድ ለማግኘት አሁኑኑ ይመዝገቡና ኦንቦርዲንግ ይጀምሩ።'
                  : 'Register your account to start your tailored Ethiopian wellness & nutrition onboarding journey.'}
              </p>
              <button
                type="button"
                className="auth-form-btn hidden-btn"
                id="register"
                onClick={() => {
                  setIsActive(true);
                  navigate('/register', { replace: true });
                }}
              >
                {t('register')}
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'var(--color-bg-card)',
            padding: '34px 30px',
            borderRadius: 'var(--radius-xl)',
            width: '100%',
            maxWidth: '440px',
            border: '1.5px solid var(--color-border)',
            boxShadow: 'var(--shadow-lg)',
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: '22px', color: 'var(--color-primary)', marginBottom: '8px', fontWeight: '800' }}>
              {t('forgotPassword')}
            </h2>
            <p style={{ fontSize: '13.5px', color: 'var(--color-text-muted)', marginBottom: '20px', lineHeight: '1.45' }}>
              {language === 'am'
                ? 'የይለፍ ቃል ማስተካከያ ማስፈንጠሪያ ለመቀበል የተመዘገቡበትን ኢሜይል ያስገቡ።'
                : 'Enter your registered email address to receive a secure password reset link.'}
            </p>

            {forgotSent ? (
              <div style={{
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                fontWeight: '700',
                border: '1px solid var(--color-primary-border)'
              }}>
                ✓ {language === 'am' ? 'የማስተካከያ ሊንክ ወደ ኢሜይልዎ ተልኳል!' : 'Reset link has been sent to your email!'}
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit}>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="auth-input-field"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  style={{ marginBottom: '18px', maxWidth: '100%' }}
                  required
                />
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    style={{
                      padding: '12px 22px',
                      borderRadius: 'var(--radius-pill)',
                      border: '1.5px solid var(--color-border)',
                      backgroundColor: 'transparent',
                      color: 'var(--color-text)',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '600'
                    }}
                  >
                    {t('back')}
                  </button>
                  <button type="submit" className="auth-form-btn" style={{ marginTop: 0, padding: '12px 28px', width: 'auto' }}>
                    {language === 'am' ? 'ላክ' : 'Send Link'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthPage;
