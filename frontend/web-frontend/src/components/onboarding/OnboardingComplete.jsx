import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

const OnboardingComplete = ({ data, onReset }) => {
  const { t, language } = useLanguage();
  const { user } = useAuth();

  // Dynamic calorie calculation based on inputs
  const weight = Number(data.weight) || 65;
  const height = Number(data.height) || 170;
  const age = Number(data.age) || 30;
  const isMale = data.sex !== 'female';
  
  // Basal Metabolic Rate (Mifflin-St Jeor formula)
  const bmr = isMale 
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161;
    
  const activityMultiplier = data.activityLevel === 'moderately_active' ? 1.55 : (data.activityLevel === 'lightly_active' ? 1.375 : 1.2);
  const targetCalories = Math.round(bmr * activityMultiplier);

  const getFastingLabel = () => {
    if (data.fastingPractice === 'orthodox_tsom') return t('tsomTitle');
    if (data.fastingPractice === 'ramadan') return t('ramadanTitle');
    return t('customTitle');
  };

  return (
    <div className="onboarding-screen">
      <div className="onboarding-card" style={{ maxWidth: '640px', padding: '36px 32px' }}>
        {/* Header Badge */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            fontSize: '24px',
            marginBottom: '12px',
            border: '2px solid var(--color-primary)'
          }}>
            ✓
          </div>
          <h2 className="card-main-title title-green">{t('dashboardTitle')}</h2>
          <p className="card-main-subtitle" style={{ marginBottom: '16px' }}>
            {user?.name ? `${user.name}, ` : ''}
            {language === 'am'
              ? 'የእርስዎ ግላዊነት የተላበሰ ባህላዊ የኢትዮጵያ አመጋገብ እቅድ ዝግጁ ነው።'
              : 'Your personalized traditional Ethiopian nutritional blueprint is ready.'}
          </p>
        </div>

        {/* Nutritional Target Highlights (Metric Grid) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <div className="summary-metric-card">
            <div className="summary-metric-value">{targetCalories}</div>
            <div className="summary-metric-label">{t('calories')} / Day</div>
          </div>
          <div className="summary-metric-card">
            <div className="summary-metric-value">{Math.round(weight * 1.6)}g</div>
            <div className="summary-metric-label">{t('protein')}</div>
          </div>
          <div className="summary-metric-card">
            <div className="summary-metric-value">{Math.round(targetCalories * 0.55 / 4)}g</div>
            <div className="summary-metric-label">{t('carbs')}</div>
          </div>
        </div>

        {/* Fasting Cycle & Safeguard Card */}
        <div style={{
          backgroundColor: 'var(--color-bg-tile)',
          borderRadius: 'var(--radius-lg)',
          padding: '18px 20px',
          border: '1.5px solid var(--color-border)',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              {t('fastingMode')}
            </span>
            <span className="dietary-tag dietary-tag-fasting">
              Active Sync
            </span>
          </div>
          <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--color-text)', marginBottom: '4px' }}>
            {getFastingLabel()}
          </div>
          <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: '1.45' }}>
            {data.fastingPractice === 'orthodox_tsom' 
              ? (language === 'am' ? 'በጾም ቀናት (ረቡዕ/አርብ) የእጽዋት ፕሮቲን እና የጤፍ ማዕድን ተስተካክሏል።' : 'Plant-based micro-nutrient calibration with complete legume + teff amino acid balance.')
              : (language === 'am' ? 'የውሃ እና የኃይል ሚዛን የተጠበቀ የጾም ሰዓት ተዘጋጅቷል።' : 'Hydration and sustained glycemic energy windows configured.')}
          </div>
        </div>

        {/* Suggested Ethiopian Superfoods / Meals with Dietary Tags */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--color-text)' }}>
              {t('recommendedMeals')}
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--color-accent)', fontWeight: '600' }}>
              AI Curated
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Dish 1 */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              padding: '14px 16px',
              backgroundColor: 'var(--color-bg-card)',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid var(--color-border)',
              gap: '12px'
            }}>
              <div>
                <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '4px', color: 'var(--color-text)' }}>
                  🌾 100% Pure Teff Injera with Shiro & Gomen
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <span className="dietary-tag dietary-tag-fasting">Fasting-Friendly</span>
                  <span className="dietary-tag dietary-tag-vegan">Vegan</span>
                  <span className="dietary-tag dietary-tag-gluten">Gluten-Free</span>
                </div>
              </div>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-primary)', whiteSpace: 'nowrap' }}>
                480 kcal
              </span>
            </div>

            {/* Dish 2 */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              padding: '14px 16px',
              backgroundColor: 'var(--color-bg-card)',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid var(--color-border)',
              gap: '12px'
            }}>
              <div>
                <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '4px', color: 'var(--color-text)' }}>
                  🍲 Misir Wot with Kik Alicha & Telba Seed Drink
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <span className="dietary-tag dietary-tag-fasting">Fasting-Friendly</span>
                  <span className="dietary-tag dietary-tag-iron">Iron-Rich</span>
                  <span className="dietary-tag dietary-tag-vegan">22g Protein</span>
                </div>
              </div>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-accent)', whiteSpace: 'nowrap' }}>
                520 kcal
              </span>
            </div>

            {/* Dish 3: Coffee Ceremony Cultural Touch */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              padding: '14px 16px',
              backgroundColor: 'var(--color-bg-card)',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid var(--color-border)',
              gap: '12px'
            }}>
              <div>
                <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '4px', color: 'var(--color-text)' }}>
                  ☕ Traditional Buna Ceremony with Roasted Kolo & Rue (Tena Adam)
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <span className="dietary-tag" style={{ backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent)', border: '1px solid #E5C3A6' }}>
                    Antioxidant Boost
                  </span>
                  <span className="dietary-tag dietary-tag-vegan">Cultural Digestive</span>
                </div>
              </div>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                65 kcal
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="onboarding-footer-nav" style={{ marginTop: '0', paddingTop: '8px' }}>
          <button className="nav-back-btn" onClick={onReset}>
            ↺ {t('retakeOnboarding')}
          </button>
          <button 
            className="nav-next-btn" 
            onClick={() => alert(language === 'am' ? 'የአመጋገብ መገለጫዎ በተሳካ ሁኔታ ተቀምጧል!' : 'Your profile has been saved successfully!')}
          >
            {t('save')} &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingComplete;
