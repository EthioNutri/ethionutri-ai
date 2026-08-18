import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const DataSharingConsent = ({ initialActive = true, onConsentChange }) => {
  const { t } = useLanguage();
  const [isActive, setIsActive] = useState(initialActive);

  const handleToggle = () => {
    const next = !isActive;
    setIsActive(next);
    // TODO: persist to backend once the consent endpoint exists.
    if (onConsentChange) onConsentChange(next);
  };

  return (
    <div className="consent-panel">
      <div className="consent-panel-header">
        <div>
          <h3 className="consent-panel-title">{t('consentTitle')}</h3>
          <p className="consent-panel-subtitle">{t('consentSubtitle')}</p>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={isActive}
          onClick={handleToggle}
          className={`consent-toggle ${isActive ? 'consent-toggle-active' : ''}`}
        >
          <span className="consent-toggle-knob" />
          <span className="consent-toggle-label">
            {isActive ? t('consentActive') : t('consentInactive')}
          </span>
        </button>
      </div>

      <div className="consent-status-pills">
        <div className="consent-pill">
          <span className="consent-pill-icon">🍽️</span>
          <div>
            <p className="consent-pill-label">{t('consentRecentLogs')}</p>
            <p className="consent-pill-value">{t('consentAvgKcalValue')}</p>
          </div>
        </div>

        <div className="consent-pill">
          <span className="consent-pill-icon">🕊️</span>
          <div>
            <p className="consent-pill-label">{t('consentFastingAdherence')}</p>
            <p className="consent-pill-value">{t('consentComplianceValue')}</p>
          </div>
        </div>

        <div className="consent-pill consent-pill-alert">
          <span className="consent-pill-icon">⚠️</span>
          <div>
            <p className="consent-pill-label">{t('consentAlertShared')}</p>
            <p className="consent-pill-value consent-pill-value-alert">{t('consentIronLow')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataSharingConsent;