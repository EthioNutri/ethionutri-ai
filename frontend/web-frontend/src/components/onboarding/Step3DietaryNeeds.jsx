import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const Step3DietaryNeeds = ({ data, onChange, onNext, onBack }) => {
  const { t } = useLanguage();
  const selectedConditions = data.conditions || [];

  const toggleCondition = (id) => {
    if (selectedConditions.includes(id)) {
      onChange({ conditions: selectedConditions.filter(c => c !== id) });
    } else {
      onChange({ conditions: [...selectedConditions.filter(c => c !== 'none'), id] });
    }
  };

  const selectNone = () => {
    if (selectedConditions.includes('none')) {
      onChange({ conditions: [] });
    } else {
      onChange({ conditions: ['none'] });
    }
  };

  const isNoneSelected = selectedConditions.includes('none');

  return (
    <div className="onboarding-screen">
      {/* Progress Header */}
      <div className="step-progress-wrapper">
        <div className="step-progress-meta">
          <span className="step-progress-current">{t('step')} 3 {t('of')} 5</span>
          <span className="step-progress-badge">{t('step3Badge')}</span>
        </div>
        <div className="step-progress-track">
          <div className="step-progress-fill-ochre" style={{ width: '60%' }} />
        </div>
      </div>

      {/* Main Card */}
      <div className="onboarding-card">
        <h2 className="card-main-title title-green">{t('step3Title')}</h2>
        <p className="card-main-subtitle">{t('step3Subtitle')}</p>

        {/* 3-Column Condition Tiles matching Image 3 */}
        <div className="conditions-grid">
          {/* Diabetes */}
          <div
            className={`condition-card ${!isNoneSelected && selectedConditions.includes('diabetes') ? 'selected' : ''}`}
            onClick={() => toggleCondition('diabetes')}
            role="button"
            tabIndex={0}
          >
            <div className="condition-card-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="6" width="20" height="12" rx="2"></rect>
                <path d="M6 12h3l2-4 3 8 2-4h2"></path>
              </svg>
            </div>
            <span className="condition-card-label">{t('diabetes')}</span>
          </div>

          {/* Hypertension */}
          <div
            className={`condition-card ${!isNoneSelected && selectedConditions.includes('hypertension') ? 'selected' : ''}`}
            onClick={() => toggleCondition('hypertension')}
            role="button"
            tabIndex={0}
          >
            <div className="condition-card-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18"></path>
                <path d="m19 9-5 5-4-4-3 3"></path>
                <circle cx="18" cy="7" r="3"></circle>
              </svg>
            </div>
            <span className="condition-card-label">{t('hypertension')}</span>
          </div>

          {/* Anemia */}
          <div
            className={`condition-card ${!isNoneSelected && selectedConditions.includes('anemia') ? 'selected' : ''}`}
            onClick={() => toggleCondition('anemia')}
            role="button"
            tabIndex={0}
          >
            <div className="condition-card-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
              </svg>
            </div>
            <span className="condition-card-label">{t('anemia')}</span>
          </div>

          {/* Pregnancy */}
          <div
            className={`condition-card ${!isNoneSelected && selectedConditions.includes('pregnancy') ? 'selected' : ''}`}
            onClick={() => toggleCondition('pregnancy')}
            role="button"
            tabIndex={0}
          >
            <div className="condition-card-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="5" r="3"></circle>
                <path d="M9 22V12c0-1.7 1.3-3 3-3s3 1.3 3 3v10"></path>
                <path d="M12 10a4 4 0 0 1 4 4c0 2.2-1.8 4-4 4"></path>
              </svg>
            </div>
            <span className="condition-card-label">{t('pregnancy')}</span>
          </div>

          {/* Gluten-sensitive */}
          <div
            className={`condition-card ${!isNoneSelected && selectedConditions.includes('gluten') ? 'selected' : ''}`}
            onClick={() => toggleCondition('gluten')}
            role="button"
            tabIndex={0}
          >
            <div className="condition-card-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22V8"></path>
                <path d="M5 12H2a10 10 0 0 1 10-10v0a10 10 0 0 1 10 10h-3"></path>
                <path d="M7 17a5 5 0 0 1 5-5 5 5 0 0 1 5 5"></path>
              </svg>
            </div>
            <span className="condition-card-label">{t('glutenSensitive')}</span>
          </div>
        </div>

        <div className="conditions-divider" />

        {/* None of the above option */}
        <div
          className={`none-above-card ${isNoneSelected ? 'selected' : ''}`}
          onClick={selectNone}
          role="button"
          tabIndex={0}
        >
          <div className="none-above-check">
            {isNoneSelected ? '✓' : ''}
          </div>
          <span>{t('noneOfTheAbove')}</span>
        </div>

        {/* Navigation */}
        <div className="onboarding-footer-nav">
          <button className="nav-back-btn" onClick={onBack}>
            &larr; {t('back')}
          </button>
          <button className="nav-next-btn" onClick={onNext}>
            {t('next')} &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step3DietaryNeeds;
