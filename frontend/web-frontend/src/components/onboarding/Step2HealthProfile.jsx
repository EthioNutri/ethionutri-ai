import { useLanguage } from '../../context/LanguageContext';

const Step2HealthProfile = ({ data, onChange, onNext, onBack }) => {
  const { t } = useLanguage();

  const handleInputChange = (field, value) => {
    onChange({ [field]: value });
  };

  return (
    <div className="onboarding-screen">
      {/* Progress Header matching Image 2 */}
      <div className="step-progress-wrapper">
        <div className="step-progress-meta">
          <span className="step-progress-current">{t('step')} 2 {t('of')} 5</span>
          <span className="step-progress-badge">{t('step2Badge')}</span>
        </div>
        <div className="step-progress-track">
          <div className="step-progress-fill-ochre" style={{ width: '40%' }} />
        </div>
      </div>

      {/* Main Card with Dotted Background */}
      <div className="onboarding-card dotted-pattern">
        <h2 className="card-main-title">{t('step2Title')}</h2>
        <p className="card-main-subtitle">{t('step2Subtitle')}</p>

        {/* Row 1: Age & Biological Sex */}
        <div className="form-row-2col">
          <div>
            <label className="form-field-label">
              {t('age')} <span className="info-icon-badge" title="Used to calculate basal metabolic rate">i</span>
            </label>
            <input
              type="number"
              className="custom-text-input"
              placeholder={t('agePlaceholder')}
              value={data.age || ''}
              onChange={(e) => handleInputChange('age', e.target.value)}
              min="1"
              max="120"
            />
          </div>

          <div>
            <label className="form-field-label">
              {t('biologicalSex')} <span className="info-icon-badge" title="Biological sex influences nutrient requirements">i</span>
            </label>
            <div className="sex-pills-row">
              <button
                type="button"
                className={`sex-pill-btn ${data.sex === 'male' ? 'selected' : ''}`}
                onClick={() => handleInputChange('sex', 'male')}
              >
                <span className="radio-indicator" />
                <span>{t('male')}</span>
              </button>
              <button
                type="button"
                className={`sex-pill-btn ${data.sex === 'female' ? 'selected' : ''}`}
                onClick={() => handleInputChange('sex', 'female')}
              >
                <span className="radio-indicator" />
                <span>{t('female')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Height & Weight */}
        <div className="form-row-2col">
          <div>
            <label className="form-field-label">{t('height')}</label>
            <div className="input-with-unit-wrapper">
              <input
                type="number"
                className="custom-text-input"
                placeholder={t('heightPlaceholder')}
                value={data.height || ''}
                onChange={(e) => handleInputChange('height', e.target.value)}
              />
              <span className="input-unit-label">cm</span>
            </div>
          </div>

          <div>
            <label className="form-field-label">{t('weight')}</label>
            <div className="input-with-unit-wrapper">
              <input
                type="number"
                className="custom-text-input"
                placeholder={t('weightPlaceholder')}
                value={data.weight || ''}
                onChange={(e) => handleInputChange('weight', e.target.value)}
              />
              <span className="input-unit-label">kg</span>
            </div>
          </div>
        </div>

        {/* Row 3: Target Weight */}
        <div className="form-row-2col">
          <div>
            <label className="form-field-label">Target Weight <span className="info-icon-badge" title="Used to calculate deficit or surplus">i</span></label>
            <div className="input-with-unit-wrapper">
              <input
                type="number"
                className="custom-text-input"
                placeholder="Target Weight"
                value={data.targetWeight || ''}
                onChange={(e) => handleInputChange('targetWeight', e.target.value)}
              />
              <span className="input-unit-label">kg</span>
            </div>
            {data.targetWeight && data.weight && data.nutritionGoal === 'lose_weight' && Number(data.targetWeight) >= Number(data.weight) && (
              <p style={{ color: 'var(--terracotta)', fontSize: '12px', marginTop: '4px' }}>Target weight should be less than current weight for weight loss.</p>
            )}
            {data.targetWeight && data.weight && data.nutritionGoal === 'gain_weight' && Number(data.targetWeight) <= Number(data.weight) && (
              <p style={{ color: 'var(--terracotta)', fontSize: '12px', marginTop: '4px' }}>Target weight should be more than current weight for weight gain.</p>
            )}
          </div>
        </div>

        {/* Activity Level */}
        <div>
          <label className="form-field-label">
            {t('activityLevel')} <span className="info-icon-badge" title="Determines daily caloric expenditure">i</span>
          </label>
          <div className="activity-cards-list">
            <div
              className={`activity-card ${data.activityLevel === 'sedentary' ? 'selected' : ''}`}
              onClick={() => handleInputChange('activityLevel', 'sedentary')}
              role="button"
              tabIndex={0}
            >
              <span className="radio-indicator" />
              <span className="activity-card-title">{t('sedentary')}</span>
              <span className="activity-card-desc">{t('sedentaryDesc')}</span>
            </div>

            <div
              className={`activity-card ${data.activityLevel === 'lightly_active' ? 'selected' : ''}`}
              onClick={() => handleInputChange('activityLevel', 'lightly_active')}
              role="button"
              tabIndex={0}
            >
              <span className="radio-indicator" />
              <span className="activity-card-title">{t('lightlyActive')}</span>
              <span className="activity-card-desc">{t('lightlyActiveDesc')}</span>
            </div>

            <div
              className={`activity-card ${data.activityLevel === 'moderately_active' ? 'selected' : ''}`}
              onClick={() => handleInputChange('activityLevel', 'moderately_active')}
              role="button"
              tabIndex={0}
            >
              <span className="radio-indicator" />
              <span className="activity-card-title">{t('moderatelyActive')}</span>
              <span className="activity-card-desc">{t('moderatelyActiveDesc')}</span>
            </div>
          </div>
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

export default Step2HealthProfile;
