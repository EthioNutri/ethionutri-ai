import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import LanguageToggle from '../common/LanguageToggle';
import ThemeToggle from '../common/ThemeToggle';
import { useLanguage } from '../../context/LanguageContext';

const AuthLayout = () => {
  const { t } = useLanguage();

  return (
    <div style={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--color-bg-page)'
    }}>
      <header className="app-header">
        <Link to="/register" className="brand-logo-wrap">
          <div className="brand-logo-icon">
            🌾
          </div>
          <span className="brand-title">EthioNutri AI</span>
        </Link>

        <div className="header-actions-group">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>

      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px 16px 40px'
      }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
