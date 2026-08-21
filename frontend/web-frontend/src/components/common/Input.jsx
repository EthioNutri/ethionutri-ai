import React from 'react';

const Input = React.forwardRef(({ label, error, helperText, className = '', ...props }, ref) => {
  return (
    <div style={{ marginBottom: '18px', width: '100%' }}>
      {label && (
        <label className="form-field-label">
          {label}
        </label>
      )}
      <input 
        ref={ref}
        className={`custom-text-input ${className}`}
        style={{
          borderColor: error ? 'var(--color-error)' : undefined,
          backgroundColor: 'var(--color-bg-card)',
          color: 'var(--color-text)'
        }}
        {...props} 
      />
      {error && (
        <div style={{ color: 'var(--color-error)', fontSize: '12px', marginTop: '5px', fontWeight: '500' }}>
          {error}
        </div>
      )}
      {helperText && !error && (
        <div style={{ color: 'var(--color-text-muted)', fontSize: '12px', marginTop: '4px' }}>
          {helperText}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
