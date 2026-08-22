import React from 'react';
import { Link } from 'react-router-dom';

const EthioNutriLogo = ({ to = '/', className = '', style = {} }) => {
  return (
    <Link
      to={to}
      className={`ethionutri-brand-pill ${className}`}
      aria-label="EthioNutri AI Home"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '9px',
        padding: '6px 14px',
        borderRadius: '24px',
        backgroundColor: 'var(--brand-pill-bg, rgba(18, 82, 56, 0.08))',
        border: '1px solid var(--brand-pill-border, rgba(18, 82, 56, 0.15))',
        textDecoration: 'none',
        transition: 'all 0.2s ease',
        ...style
      }}
    >
      <div
        className="brand-icon-wrap"
        style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          backgroundColor: '#125238',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </svg>
      </div>
      <span style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '-0.01em', lineHeight: 1 }}>
        <span style={{ color: 'var(--brand-text-main, #125238)' }}>EthioNutri</span>
        <span style={{ color: '#C97B3D', marginLeft: '4px' }}>AI</span>
      </span>
    </Link>
  );
};

export default EthioNutriLogo;
