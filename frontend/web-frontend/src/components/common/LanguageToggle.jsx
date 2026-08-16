import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button 
      onClick={toggleLanguage}
      type="button"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        borderRadius: 'var(--radius-pill)',
        border: '1.5px solid var(--color-border)',
        backgroundColor: 'var(--color-bg-card)',
        cursor: 'pointer',
        color: 'var(--color-text)',
        fontSize: '14px',
        fontWeight: '600',
        fontFamily: language === 'am' ? 'var(--font-ethiopic)' : 'var(--font-latin)',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: 'var(--shadow-sm)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-primary-border)';
        e.currentTarget.style.backgroundColor = 'var(--color-primary-light)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-border)';
        e.currentTarget.style.backgroundColor = 'var(--color-bg-card)';
      }}
      aria-label="Switch Language"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-primary)' }}>
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
      </svg>
      <span>{language === 'en' ? 'አማርኛ' : 'English'}</span>
    </button>
  );
};

export default LanguageToggle;
