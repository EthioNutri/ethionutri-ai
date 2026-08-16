import React from 'react';

const Button = ({ 
  children, 
  type = 'button', 
  variant = 'primary', 
  fullWidth = false, 
  isLoading = false,
  disabled = false,
  onClick,
  style = {},
  className = '',
  ...props 
}) => {
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';

  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '12px 28px',
    borderRadius: 'var(--radius-pill)',
    fontSize: '15px',
    fontWeight: '600',
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    width: fullWidth ? '100%' : 'auto',
    fontFamily: 'inherit',
    outline: 'none',
    border: isSecondary ? '1.5px solid var(--color-border)' : 'none',
    backgroundColor: isPrimary ? 'var(--color-primary)' : (isSecondary ? 'var(--color-bg-card)' : 'transparent'),
    color: isPrimary ? '#FFFFFF' : 'var(--color-text)',
    boxShadow: isPrimary ? '0 4px 14px rgba(47, 107, 79, 0.25)' : 'var(--shadow-sm)',
    opacity: disabled || isLoading ? 0.7 : 1,
    ...style
  };

  return (
    <button 
      type={type} 
      style={baseStyles}
      disabled={disabled || isLoading}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (!disabled && !isLoading) {
          if (isPrimary) {
            e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 6px 18px rgba(47, 107, 79, 0.35)';
          } else if (isSecondary) {
            e.currentTarget.style.borderColor = 'var(--color-primary-border)';
            e.currentTarget.style.backgroundColor = 'var(--color-primary-light)';
          }
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !isLoading) {
          if (isPrimary) {
            e.currentTarget.style.backgroundColor = 'var(--color-primary)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(47, 107, 79, 0.25)';
          } else if (isSecondary) {
            e.currentTarget.style.borderColor = 'var(--color-border)';
            e.currentTarget.style.backgroundColor = 'var(--color-bg-card)';
          }
        }
      }}
      {...props}
    >
      {isLoading && (
        <span style={{ 
          width: '16px', 
          height: '16px', 
          border: '2px solid rgba(255,255,255,0.4)', 
          borderTopColor: '#fff', 
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          display: 'inline-block'
        }} />
      )}
      {children}
    </button>
  );
};

export default Button;
