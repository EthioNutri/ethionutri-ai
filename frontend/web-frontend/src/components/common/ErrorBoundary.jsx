import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('EthioNutri AI UI Caught Error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px',
          textAlign: 'center',
          background: 'var(--bg-cream, #FAF7F2)',
          color: 'var(--text-dark, #2B2622)',
          fontFamily: 'inherit'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌿</div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--forest-green, #125238)', marginBottom: '8px' }}>
            Something went wrong
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-medium, #71717A)', maxWidth: '440px', marginBottom: '24px', lineHeight: 1.5 }}>
            An unexpected error occurred while rendering this view. Your logged meals and nutrition data are safe.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => this.setState({ hasError: false })}
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
                border: '1px solid #D1D5DB',
                background: '#FFFFFF',
                color: '#374151',
                fontWeight: 600,
                fontSize: '13.5px',
                cursor: 'pointer'
              }}
            >
              Try Again
            </button>
            <button
              onClick={this.handleReset}
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
                border: 'none',
                background: 'var(--forest-green, #125238)',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '13.5px',
                cursor: 'pointer'
              }}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
