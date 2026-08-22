import { useLanguage } from '../../context/LanguageContext';

const Step4FastingPractices = ({ data, onChange, onNext, onBack }) => {
  const { t } = useLanguage();

  const handleSelectFasting = (type) => {
    onChange({ fastingPractice: type });
  };

  return (
    <div className="onboarding-screen">
      {/* Progress Header matching Image 4 */}
      <div className="step-progress-wrapper">
        <div className="step-progress-meta">
          <span className="step-progress-current" style={{ color: 'var(--color-primary)' }}>
            {t('step')} 4 {t('of')} 5
          </span>
          <span className="step-progress-badge" style={{ color: 'var(--color-primary)' }}>
            {t('step4Badge')}
          </span>
        </div>
        <div className="step-progress-track">
          <div className="step-progress-fill-green" style={{ width: '80%' }} />
        </div>
      </div>

      {/* Main Card */}
      <div className="onboarding-card">
        <h2 className="card-main-title title-green">{t('step4Title')}</h2>
        <p className="card-main-subtitle">{t('step4Subtitle')}</p>

        {/* List of Fasting Cards matching Image 4 */}
        <div className="fasting-cards-list">
          {/* Ethiopian Orthodox (Tsom) */}
          <div
            className={`fasting-card ${data.fastingPractice === 'orthodox_tsom' ? 'selected' : ''}`}
            onClick={() => handleSelectFasting('orthodox_tsom')}
            role="button"
            tabIndex={0}
          >
            <div className="fasting-icon-badge">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {/* Orthodox Church / Cross Icon */}
                <path d="M12 2v6"></path>
                <path d="M9 5h6"></path>
                <path d="M4 10h16"></path>
                <path d="M12 10v12"></path>
                <path d="M6 22V12l6-4 6 4v10H6z"></path>
              </svg>
            </div>
            <div className="fasting-card-content">
              <h3>{t('tsomTitle')}</h3>
              <p>{t('tsomDesc')}</p>
            </div>
          </div>

          {/* Ramadan */}
          <div
            className={`fasting-card ${data.fastingPractice === 'ramadan' ? 'selected' : ''}`}
            onClick={() => handleSelectFasting('ramadan')}
            role="button"
            tabIndex={0}
          >
            <div className="fasting-icon-badge">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {/* Crescent Moon Icon */}
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
              </svg>
            </div>
            <div className="fasting-card-content">
              <h3>{t('ramadanTitle')}</h3>
              <p>{t('ramadanDesc')}</p>
            </div>
          </div>

          {/* Custom or None */}
          <div
            className={`fasting-card ${data.fastingPractice === 'custom_none' ? 'selected' : ''}`}
            onClick={() => handleSelectFasting('custom_none')}
            role="button"
            tabIndex={0}
          >
            <div className="fasting-icon-badge">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {/* Cutlery / Fork & Knife Icon */}
                <path d="M18 2v6a3 3 0 0 1-3 3v11"></path>
                <path d="M6 2v7a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V2"></path>
                <path d="M8 11v11"></path>
              </svg>
            </div>
            <div className="fasting-card-content">
              <h3>{t('customTitle')}</h3>
              <p>{t('customDesc')}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="onboarding-footer-nav">
          <button className="nav-back-btn" onClick={onBack}>
            {t('back')}
          </button>
          <button className="nav-next-btn" onClick={onNext}>
            {t('nextStep')} &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step4FastingPractices;
