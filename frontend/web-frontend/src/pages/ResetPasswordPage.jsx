import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import EthioNutriLogo from '../components/common/EthioNutriLogo';
import { apiAuth } from '../services/apiAuth';
import { useLanguage } from '../context/LanguageContext';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { language } = useLanguage();

  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!token || !email) {
      setErrorMsg(language === 'am' ? 'የይለፍ ቃል ማደሻ ሊንክ ትክክል አይደለም ወይም ተበላሽቷል።' : 'Invalid or missing password reset parameters.');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setErrorMsg(language === 'am' ? 'አዲሱ የይለፍ ቃል ቢያንስ 6 ፊደላት መሆን አለበት' : 'New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg(language === 'am' ? 'የይለፍ ቃሎቹ አይመሳሰሉም' : 'Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiAuth.resetPassword({ email, token, newPassword });
      setIsLoading(false);
      setSuccessMsg(response.data?.message || (language === 'am' ? 'የይለፍ ቃልዎ በትክክል ተቀይሯል።' : 'Your password has been reset successfully.'));
    } catch (err) {
      setIsLoading(false);
      const msg = err.response?.data?.error?.message || err.message || (language === 'am' ? 'የይለፍ ቃል መቀየር አልተሳካም።' : 'Failed to reset password.');
      setErrorMsg(msg);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAFAFA', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ marginBottom: '32px' }}>
        <EthioNutriLogo />
      </div>

      <div style={{ width: '100%', maxWidth: '440px', backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #EAEAEA', boxShadow: '0 8px 30px rgba(0,0,0,0.06)', padding: '36px 32px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#125238', marginTop: 0, marginBottom: '8px', textAlign: 'center' }}>
          {language === 'am' ? 'አዲስ የይለፍ ቃል ያዘጋጁ' : 'Set New Password'}
        </h2>
        <p style={{ fontSize: '14px', color: '#666666', marginTop: 0, marginBottom: '24px', textAlign: 'center' }}>
          {email ? `${language === 'am' ? 'ለ' : 'For'} ${email}` : (language === 'am' ? 'እባክዎ አዲሱን የይለፍ ቃልዎን ያስገቡ' : 'Enter your new password below.')}
        </p>

        {errorMsg && (
          <div style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: 'rgba(235, 87, 87, 0.1)', border: '1px solid rgba(235, 87, 87, 0.3)', color: '#EB5757', fontSize: '13px', fontWeight: 600, marginBottom: '20px' }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {successMsg ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
            <div style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: 'rgba(31, 148, 92, 0.1)', border: '1px solid rgba(31, 148, 92, 0.3)', color: '#125238', fontSize: '14px', fontWeight: 700, marginBottom: '24px' }}>
              {successMsg}
            </div>
            <button
              onClick={() => navigate('/login')}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#125238', color: '#FFFFFF', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}
            >
              {language === 'am' ? 'ወደ መግቢያ ይሂዱ' : 'Proceed to Sign In'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#333333', marginBottom: '6px' }}>
                {language === 'am' ? 'አዲስ የይለፍ ቃል' : 'New Password'}
              </label>
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CCCCCC', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#333333', marginBottom: '6px' }}>
                {language === 'am' ? 'የይለፍ ቃል ያረጋግጡ' : 'Confirm New Password'}
              </label>
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CCCCCC', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{ marginTop: '8px', padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#125238', color: '#FFFFFF', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}
            >
              {isLoading ? (language === 'am' ? 'በመቀየር ላይ...' : 'Updating...') : (language === 'am' ? 'የይለፍ ቃል ቀይር' : 'Update Password')}
            </button>

            <div style={{ textAlign: 'center', marginTop: '12px' }}>
              <Link to="/login" style={{ color: '#C97B3D', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>
                ← {language === 'am' ? 'ወደ መግቢያ ተመለስ' : 'Back to Sign In'}
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
