import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const Step5NutritionGoals = ({ data, onChange, onComplete, onBack }) => {
  const { t } = useLanguage();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSelectGoal = (goal) => {
    onChange({ nutritionGoal: goal });
  };

  const handleFinalize = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      onComplete();
    }, 1200);
  };

  return (
    <div className="onboarding-screen">
      {/* Progress Header */}
      <div className="step-progress-wrapper">
        <div className="step-progress-meta">
          <span className="step-progress-current" style={{ color: 'var(--color-primary)' }}>
            {t('step')} 5 {t('of')} 5
          </span>
          <span className="step-progress-badge" style={{ color: 'var(--color-primary)' }}>
            {t('step5Badge')}
          </span>
        </div>
        <div className="step-progress-track">
          <div className="step-progress-fill-green" style={{ width: '100%' }} />
        </div>
      </div>

      {/* Main Card */}
      <div className="onboarding-card">
        <h2 className="card-main-title title-green">{t('step5Title')}</h2>
        <p className="card-main-subtitle">{t('step5Subtitle')}</p>

        <div className="fasting-cards-list">
          {/* Goal 1 */}
          <div
            className={`fasting-card ${data.nutritionGoal === 'weight_vitality' ? 'selected' : ''}`}
            onClick={() => handleSelectGoal('weight_vitality')}
            role="button"
            tabIndex={0}
          >
            <div className="fasting-icon-badge">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </div>
            <div className="fasting-card-content">
              <h3>{t('goalWeight')}</h3>
              <p>{t('goalWeightDesc')}</p>
            </div>
          </div>

          {/* Goal 2 */}
          <div
            className={`fasting-card ${data.nutritionGoal === 'muscle_energy' ? 'selected' : ''}`}
            onClick={() => handleSelectGoal('muscle_energy')}
            role="button"
            tabIndex={0}
          >
            <div className="fasting-icon-badge">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6.5 6.5 11 11"></path>
                <path d="m21 21-1-1a5 5 0 0 0-7.07 0l-.71.71a5 5 0 0 1-7.07 0L4 19.5"></path>
                <path d="m3 3 1 1a5 5 0 0 0 7.07 0l.71-.71a5 5 0 0 1 7.07 0L20 4.5"></path>
              </svg>
            </div>
            <div className="fasting-card-content">
              <h3>{t('goalMuscle')}</h3>
              <p>{t('goalMuscleDesc')}</p>
            </div>
          </div>

          {/* Goal 3 */}
          <div
            className={`fasting-card ${data.nutritionGoal === 'health_balance' ? 'selected' : ''}`}
            onClick={() => handleSelectGoal('health_balance')}
            role="button"
            tabIndex={0}
          >
            <div className="fasting-icon-badge">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <div className="fasting-card-content">
              <h3>{t('goalHealth')}</h3>
              <p>{t('goalHealthDesc')}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="onboarding-footer-nav">
          <button className="nav-back-btn" onClick={onBack} disabled={isGenerating}>
            {t('back')}
          </button>
          <button className="nav-next-btn" onClick={handleFinalize} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <span style={{ 
                  width: '16px', 
                  height: '16px', 
                  border: '2px solid rgba(255,255,255,0.4)', 
                  borderTopColor: '#fff', 
                  borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'spin 0.8s linear infinite'
                }} />
                <span>Go to Dashboard...</span>
              </>
            ) : (
              t('completePlan')
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step5NutritionGoals;
