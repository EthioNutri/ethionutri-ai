import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { language } = useLanguage();
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="landing-page-wrapper">
      {/* =========================================================================
          HERO SECTION (Clean Food Card Mockup without top bar)
         ========================================================================= */}
      <section className="landing-hero-section">
        <div className="landing-hero-container">
          {/* Left Column: Copy & CTAs */}
          <div className="landing-hero-content">
            {/* Pill Badge */}
            <div className="landing-badge-pill">
              {language === 'am' ? 'ዘመናዊ የባህል አመጋገብ' : 'Modern Heritage Nutrition'}
            </div>

            {/* Two-Tone Headline */}
            <h1 className="landing-hero-title">
              <span className="title-line-dark">
                {language === 'am' ? 'በጥሩ ይመገቡ። በስርዓት ይፁሙ።' : 'Eat Well. Fast Right.'}
              </span>
              <span className="title-line-green">
                {language === 'am' ? 'በብልሃት ይከታተሉ።' : 'Track Smarter.'}
              </span>
            </h1>

            {/* Supporting Subtitle */}
            <p className="landing-hero-subtitle">
              {language === 'am'
                ? 'በኢትዮጵያ ባህላዊ ምግቦች እና የኦርቶዶክስ ተዋሕዶ የጾም ስርዓት ዙሪያ የተገነባ በAI የተደገፈ የአመጋገብ መከታተያ። ባህልዎን እያከበሩ የጤና ግብዎን በሳይንሳዊ ትክክለኛነት ያሳኩ።'
                : 'AI-powered meal tracking built around Ethiopian food and fasting traditions. Honor your heritage while achieving your health goals with clinical precision.'}
            </p>

            {/* CTA Button Group */}
            <div className="landing-hero-ctas">
              <Link to="/signup" className="landing-cta-primary">
                {language === 'am' ? 'በነፃ ይጀምሩ' : 'Get Started Free'}
              </Link>
              <Link to="/how-it-works" className="landing-cta-secondary">
                <span className="play-icon-circle">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </span>
                <span>{language === 'am' ? 'እንዴት እንደሚሰራ ይመልከቱ' : 'See How It Works'}</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Clean Interactive Food Visual Mockup (NO TOP BAR) */}
          <div className="landing-hero-visual">
            <div className="hero-mockup-frame clean-frame">
              {/* Realistic Food Image Banner */}
              <div className="mockup-image-wrapper full-view">
                <img
                  src="/images/hero-food.jpg"
                  alt="Authentic Ethiopian Doro Wat Feast with Injera, Misir, and Traditional Coffee"
                  className="mockup-dish-img"
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80';
                  }}
                />

                {/* Floating Top-Right Stat Card: "42g PROTEIN On Track" */}
                <div className="mockup-floating-stat-card">
                  <div className="stat-circle-gauge">
                    <svg className="gauge-svg" viewBox="0 0 44 44">
                      <circle cx="22" cy="22" r="18" className="gauge-bg" />
                      <circle
                        cx="22"
                        cy="22"
                        r="18"
                        className="gauge-fill"
                        strokeDasharray="113"
                        strokeDashoffset="28"
                      />
                    </svg>
                    <span className="gauge-number">42g</span>
                  </div>
                  <div className="stat-meta">
                    <span className="stat-label">
                      {language === 'am' ? 'ፕሮቲን' : 'PROTEIN'}
                    </span>
                    <span className="stat-status">
                      {language === 'am' ? 'በሂደት ላይ' : 'On Track'}
                    </span>
                  </div>
                </div>

                {/* Mini Nutritional Breakdown Tag (Right Side) */}
                <div className="mockup-floating-nutrition-tag">
                  <div className="tag-header">
                    <strong>
                      {language === 'am' ? 'ዶሮ ወጥ - ባህላዊ' : 'Doro Wat - Traditional'}
                    </strong>
                    <span className="tag-trend-badge">📈 {language === 'am' ? 'ስታቲስቲክስ' : 'Stats'}</span>
                  </div>
                  <div className="tag-sub">
                    {language === 'am'
                      ? 'የንጥረ ነገር ይዘት፡ 680 ካሎሪ | 35ግ ፕሮቲን | 78ግ ካርቦሃይድሬት | 12ግ ፋይበር'
                      : 'Nutritional Breakdown: 680 Cal | Protein 35g | Carbs 78g | Fiber 12g'}
                  </div>
                </div>

                {/* Dish Name Tag (Bottom Left): ዶሮ ወጥ (Doro Wat) */}
                <div className="mockup-dish-badge">
                  <span className="amharic-title">ዶሮ ወጥ</span>
                  <span className="english-title">(Doro Wat)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FEATURE GRID (3 CARDS — Fasting-Aware, AI Nutritionist, Smart Meals)
         ========================================================================= */}
      <section className="landing-features-section">
        <div className="landing-features-container">
          <div className="features-grid">
            {/* Card 1: Fasting-Aware Tracking */}
            <div className="feature-card">
              <div className="feature-icon-badge orange-badge">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                  <circle cx="8" cy="15" r="1" fill="currentColor" />
                  <circle cx="12" cy="15" r="1" fill="currentColor" />
                  <circle cx="16" cy="15" r="1" fill="currentColor" />
                </svg>
              </div>
              <h3 className="feature-card-title">
                {language === 'am' ? 'የጾም ስርዓትን ያገናዘበ ክትትል' : 'Fasting-Aware Tracking'}
              </h3>
              <p className="feature-card-desc">
                {language === 'am'
                  ? 'የአመጋገብ ግቦችዎን ከኦርቶዶክስ ተዋሕዶ የጾም መርሃ ግብሮች (ጾም) ጋር በራስ-ሰር ያስተካክላል፣ ማክሮዎችን ያለችግር ያስተካክላል።'
                  : 'Automatically aligns your goals with Orthodox fasting schedules (Tsom), adjusting macros seamlessly.'}
              </p>
            </div>

            {/* Card 2: AI Nutritionist */}
            <div className="feature-card">
              <div className="feature-icon-badge mint-badge">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a8 8 0 0 0-8 8c0 3.37 2.1 6.25 5.09 7.4.38.15.66.49.66.9v1.7c0 .55.45 1 1 1h2.5c.55 0 1-.45 1-1v-1.7c0-.41.28-.75.66-.9A8.003 8.003 0 0 0 20 10a8 8 0 0 0-8-8z" />
                  <path d="M9.5 9h5" />
                  <path d="M12 6.5v5" />
                </svg>
              </div>
              <h3 className="feature-card-title">
                {language === 'am' ? 'የAI የአመጋገብ አማካሪ' : 'AI Nutritionist'}
              </h3>
              <p className="feature-card-desc">
                {language === 'am'
                  ? 'የዘመናዊ የአመጋገብ ሳይንስን እና ባህላዊ የአመጋገብ ምርጫዎችዎን ያከበረ ግላዊ ምክር እና መመሪያ ያግኙ።'
                  : 'Get personalized guidance that respects both modern nutrition science and your cultural dietary preferences.'}
              </p>
            </div>

            {/* Card 3: Smart Meal Suggestions */}
            <div className="feature-card">
              <div className="feature-icon-badge tan-badge">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2v8a3 3 0 0 1-3 3h-1a3 3 0 0 1-3-3V2" />
                  <path d="M15 13v9" />
                  <path d="M7 2v20" />
                  <path d="M4 2v6a3 3 0 0 0 3 3h0" />
                </svg>
              </div>
              <h3 className="feature-card-title">
                {language === 'am' ? 'ብልህ የምግብ ጥቆማዎች' : 'Smart Meal Suggestions'}
              </h3>
              <p className="feature-card-desc">
                {language === 'am'
                  ? 'ለእርስዎ ልዩ የካሎሪ እና የማክሮ ኒውትሪየንት ፍላጎት የተበጁ የባህላዊ የምግብ አዘገጃጀት ጤናማ ማስተካከያዎችን ያግኙ።'
                  : 'Discover healthy adaptations of heritage recipes tailored to your specific caloric and macronutrient needs.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CULTURAL NUTRITION DATABASE STATS & HIGHLIGHTS
         ========================================================================= */}
      <section className="landing-stats-section">
        <div className="landing-stats-container">
          <div className="stats-header">
            <span className="stats-badge">
              {language === 'am' ? 'ትክክለኛ ሳይንሳዊ መረጃ' : 'Clinically Validated Heritage Data'}
            </span>
            <h2 className="stats-title">
              {language === 'am' ? 'የኢትዮጵያ ምግብ በልዩ ትክክለኛነት ሲተነተን' : 'Built Specifically for the Ethiopian Kitchen'}
            </h2>
            <p className="stats-subtitle">
              {language === 'am'
                ? 'አጠቃላይ የካሎሪ መከታተያዎች እንጀራን እንደ ተራ ዳቦ ይቆጥሩታል። EthioNutri AI ግን ለእያንዳንዱ የጤፍ አይነት፣ ወጥ እና የጾም ምግብ ትክክለኛ ትንተና አዘጋጅቷል።'
                : 'Generic fitness apps fail on Ethiopian food by treating injera like regular bread and ignoring fasting cycles. EthioNutri AI provides clinical-grade nutritional accuracy for over 300 traditional dishes.'}
            </p>
          </div>

          <div className="stats-metrics-grid">
            <div className="stat-metric-card">
              <span className="metric-number">300+</span>
              <span className="metric-title">{language === 'am' ? 'ባህላዊ ምግቦች የተተነተኑ' : 'Authentic Dishes Modeled'}</span>
              <span className="metric-desc">{language === 'am' ? 'ከዶሮ ወጥ እስከ ሽሮ ተጋሚኖ እና ሱፍ ፍርፍር' : 'From Doro Wat & Shiro to Yetsom Beyaynetu & Suf Firfir'}</span>
            </div>
            <div className="stat-metric-card">
              <span className="metric-number">180+</span>
              <span className="metric-title">{language === 'am' ? 'የጾም ቀናት የተካተቱ' : 'Orthodox Fasting Days Synced'}</span>
              <span className="metric-desc">{language === 'am' ? 'ረቡዕ፣ አርብ፣ አቢይ ጾም እና የሐዋርያት ጾም' : 'Wednesdays, Fridays, Great Lent & Apostles Fast'}</span>
            </div>
            <div className="stat-metric-card">
              <span className="metric-number">100%</span>
              <span className="metric-title">{language === 'am' ? 'የጤፍና የጥራጥሬ ትክክለኛነት' : 'Teff & Legume Macro Precision'}</span>
              <span className="metric-desc">{language === 'am' ? 'የብረት (Iron)፣ ፕሮቲንና ፋይበር ዝርዝር' : 'Accurate iron, bioavailable protein & fiber tracking'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CLOSING CTA BAND
         ========================================================================= */}
      <section className="landing-cta-banner-section">
        <div className="landing-cta-banner-container">
          <div className="cta-banner-card">
            <div className="cta-banner-content">
              <h2 className="cta-banner-title">
                {language === 'am' ? 'የተሟላ የባህል ጤና ጉዞዎን ዛሬ ይጀምሩ' : 'Start Your Modern Heritage Nutrition Journey'}
              </h2>
              <p className="cta-banner-desc">
                {language === 'am'
                  ? 'ከሺዎች የሚቆጠሩ ኢትዮጵያውያን ጋር በመሆን ባህልዎን እያጣጣሙ ጤናዎን ይጠብቁ።'
                  : 'Join thousands of Ethiopian families, diaspora communities, and fasting believers balancing ancient traditions with modern vitality.'}
              </p>
              <div className="cta-banner-actions">
                <Link to="/signup" className="landing-cta-primary large">
                  {language === 'am' ? 'አሁኑኑ በነፃ ይመዝገቡ' : 'Get Started Free'}
                </Link>
                <Link to="/fasting-calendar" className="landing-cta-secondary">
                  {language === 'am' ? 'የጾም ቀን መቁጠሪያን ይመልከቱ' : 'Explore Fasting Calendar'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
