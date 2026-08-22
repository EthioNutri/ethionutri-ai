import { useLanguage } from '../../context/LanguageContext';

const Step1Language = ({ onNext }) => {
  const { language, setLanguage, t } = useLanguage();

  const handleSelectLanguage = (lang) => {
    setLanguage(lang);
  };

  return (
    <div className="onboarding-screen">
      {/* Brand Header */}
      <h1 className="brand-header-title">{t('appName')}</h1>

      {/* 5-Pill Step Indicator matching Image 1 */}
      <div className="step-pills-container">
        <div className="step-pills-row">
          <div className="step-pill-bar active" />
          <div className="step-pill-bar" />
          <div className="step-pill-bar" />
          <div className="step-pill-bar" />
          <div className="step-pill-bar" />
        </div>
        <span className="step-pills-label">{t('step')} 1 {t('of')} 5</span>
      </div>

      {/* Main Card */}
      <div className="onboarding-card">
        <h2 className="card-main-title">{t('step1Title')}</h2>
        <p className="card-main-subtitle">{t('step1Subtitle')}</p>

        {/* English Option */}
        <div 
          className={`lang-option-card ${language === 'en' ? 'selected' : ''}`}
          onClick={() => handleSelectLanguage('en')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleSelectLanguage('en')}
        >
          <div className="lang-option-left">
            <div className="lang-icon-circle">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
            </div>
            <div className="lang-option-text">
              <h3>{t('langEnglish')}</h3>
              <p>{t('langEnglishSub')}</p>
            </div>
          </div>
          <div className="lang-check-circle">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        </div>

        {/* Amharic Option */}
        <div 
          className={`lang-option-card ${language === 'am' ? 'selected' : ''}`}
          onClick={() => handleSelectLanguage('am')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleSelectLanguage('am')}
        >
          <div className="lang-option-left">
            <div className="lang-icon-circle">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
            </div>
            <div className="lang-option-text">
              <h3 style={{ fontFamily: 'var(--font-ethiopic)' }}>{t('langAmharic')}</h3>
              <p>{t('langAmharicSub')}</p>
            </div>
          </div>
          <div className="lang-check-circle">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        </div>

        {/* Action Button */}
        <div className="onboarding-footer-nav" style={{ justifyContent: 'flex-end', marginTop: '36px' }}>
          <button className="nav-next-btn" onClick={onNext}>
            {t('next')} &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step1Language;
