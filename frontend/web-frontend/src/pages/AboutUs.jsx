import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const AboutUs = () => {
  const { language } = useLanguage();

  const values = [
    {
      title: language === 'am' ? 'ባህላዊ ቅርስን ማክበር' : 'Cultural Authenticity',
      desc: language === 'am'
        ? 'የኢትዮጵያ ምግብ በሺዎች ዓመታት የበለጸገ የጤና እና የቅመማቅመም ጥበብ አለው። እያንዳንዱን ባህል ሳናዛባ በክብር እንጠብቃለን።'
        : 'Ethiopian gastronomy is one of the world’s most sophisticated, ancient culinary systems. We honor its rituals, communal eating traditions, and ecclesiastical fasting rules without compromise.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      ),
      badgeColor: 'orange-badge',
    },
    {
      title: language === 'am' ? 'ክሊኒካዊና ሳይንሳዊ ትክክለኛነት' : 'Clinical & Scientific Precision',
      desc: language === 'am'
        ? 'የጤፍ፣ የጥራጥሬዎችና የቅመማቅመሞች የምግብ ይዘት በክሊኒካል ዲያቲሽያኖች እና በህብረተሰብ ጤና ተመራማሪዎች የተረጋገጠ ነው።'
        : 'Our nutrition models are built on verified chemical analyses of teff varieties, indigenous pulses, and traditional cooking methods to ensure laboratory-grade macro and micronutrient precision.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      ),
      badgeColor: 'mint-badge',
    },
    {
      title: language === 'am' ? 'የህብረተሰብ ጤና ማጎልበት' : 'Community Wellness & Longevity',
      desc: language === 'am'
        ? 'የኢትዮጵያውያን እና የዲያስፖራ ቤተሰቦች ስኳርን፣ የደም ግፊትንና ውፍረትን በመከላከል ረጅም እና ጤናማ እድሜ እንዲኖሩ እናበረታታለን።'
        : 'We empower families and diaspora communities worldwide to prevent lifestyle diseases like diabetes and hypertension while staying deeply connected to their ancestral dishes.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      badgeColor: 'tan-badge',
    },
  ];

  const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';

  const team = [
    {
      name: 'Bereket Muluken',
      nameAm: 'በረከት ሙሉከን',
      roleEn: 'Backend',
      roleAm: 'ባክኤንድ',
      avatar: DEFAULT_AVATAR,
    },
    {
      name: 'Bereket Teshome',
      nameAm: 'በረከት ተሾመ',
      roleEn: 'Full-Stack',
      roleAm: 'ፉል-ስታክ',
      avatar: DEFAULT_AVATAR,
    },
    {
      name: 'Degefa Lemma',
      nameAm: 'ደገፋ ለማ',
      roleEn: 'Frontend',
      roleAm: 'ፍሮንትኤንድ',
      avatar: DEFAULT_AVATAR,
    },
    {
      name: 'Dagmawi Yonas Lakew',
      nameAm: 'ዳግማዊ ዮናስ ላቀው',
      roleEn: 'App',
      roleAm: 'አፕሊኬሽን',
      avatar: DEFAULT_AVATAR,
    },
  ];

  return (
    <div className="about-us-page">
      {/* Hero Section */}
      <section className="how-hero-section">
        <div className="how-hero-container">
          <div className="landing-badge-pill">
            {language === 'am' ? 'ራዕያችን እና ታሪካችን' : 'Our Story & Purpose'}
          </div>
          <h1 className="how-hero-title">
            {language === 'am' ? 'የጥንት ቅርስ ከዘመናዊ የAI ቴክኖሎጂ ጋር' : 'Ancient Heritage Meets Modern Intelligence'}
          </h1>
          <p className="how-hero-subtitle">
            {language === 'am'
              ? 'EthioNutri AI የተቋቋመው የምዕራባውያን የአመጋገብ መከታተያዎች ለኢትዮጵያ ምግብ እና ለጾም ስርዓት ያላቸውን ክፍተት ለመሙላት ነው።'
              : 'EthioNutri AI was born from a simple realization: mainstream fitness apps fundamentally misunderstand Ethiopian food, injera portioning, and Orthodox fasting cycles.'}
          </p>
        </div>
      </section>

      {/* Mission & Story Narrative */}
      <section className="about-narrative-section">
        <div className="about-narrative-container">
          <div className="about-story-card">
            <div className="about-story-text">
              <span className="stats-badge">
                {language === 'am' ? 'የተልዕኮ መግለጫ' : 'Our Mission'}
              </span>
              <h2 className="about-story-title">
                {language === 'am' ? 'ባህልን ሳይተዉ ጤናማ መሆን ይቻላል' : 'Celebrating Heritage Through Clinical Nutrition'}
              </h2>
              <p>
                {language === 'am'
                  ? 'ለበርካታ ዓመታት ጤናቸውን ለመጠበቅ የሚፈልጉ ኢትዮጵያውያን ባህላዊ ምግባቸውን እንዲተዉ ወይም የምዕራባውያን ምግቦችን ብቻ እንዲመገቡ ይገደዱ ነበር። እኛ ግን የኢትዮጵያ ምግብ (ጤፍ፣ ምስር፣ ሽሮ፣ አትክልት) በዓለም ላይ ካሉ እጅግ የተመጣጠኑ ምግቦች አንዱ እንደሆነ እናምናለን።'
                  : 'For decades, individuals from the Horn of Africa striving for optimal fitness or managing chronic conditions were told to abandon their traditional diets. Western calorie counters labeled injera as "generic white bread" and miscalculated communal wots.'}
              </p>
              <p>
                {language === 'am'
                  ? 'የእኛ አላማ የኢትዮጵያን ባህላዊ ምግቦች እና የጾም ስርዓትን በሳይንሳዊ ትክክለኛነት በመተንተን ማንኛውም ሰው ባህሉን እያጣጣመ ጤናማ እንዲሆን ማስቻል ነው።'
                  : 'We built EthioNutri AI to provide the Ethiopian community globally with the precision, respect, and technological sophistication our cuisine deserves. From the iron-rich soil of the highlands to the sacred fasting calendar of the Orthodox church, we bridge heritage with vitality.'}
              </p>
            </div>
            <div className="about-story-media">
              <img
                src="/images/hero-food.jpg"
                alt="Ethiopian Heritage Cuisine Feast"
                className="story-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="landing-features-section">
        <div className="landing-features-container">
          <div className="stats-header" style={{ marginBottom: '40px' }}>
            <span className="stats-badge">
              {language === 'am' ? 'የመመሪያ እሴቶቻችን' : 'Our Guiding Principles'}
            </span>
            <h2 className="stats-title">
              {language === 'am' ? 'የምንመራባቸው ዋና ዋና እሴቶች' : 'The Core Pillars of EthioNutri AI'}
            </h2>
          </div>

          <div className="features-grid">
            {values.map((v, i) => (
              <div key={i} className="feature-card">
                <div className={`feature-icon-badge ${v.badgeColor}`}>
                  {v.icon}
                </div>
                <h3 className="feature-card-title">{v.title}</h3>
                <p className="feature-card-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership & Advisory Team Section */}
      <section className="about-team-section">
        <div className="about-team-container">
          <div className="stats-header" style={{ marginBottom: '48px' }}>
            <span className="stats-badge">
              {language === 'am' ? 'ባለሙያዎቻችን' : 'Our Leadership & Advisory'}
            </span>
            <h2 className="stats-title">
              {language === 'am' ? 'የቡድን አባላት እና የዘርፉ ባለሙያዎች' : 'Meet the Minds Behind EthioNutri AI'}
            </h2>
          </div>

          <div className="about-team-grid">
            {team.map((member, idx) => (
              <div key={idx} className="team-card">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="team-avatar-img"
                />
                <div className="team-meta">
                  <h3 className="team-name">
                    {language === 'am' ? member.nameAm : member.name}
                  </h3>
                  <span className="team-role">
                    {language === 'am' ? member.roleAm : member.roleEn}
                  </span>
                  {(member.bioEn || member.bioAm) && (
                    <p className="team-bio">
                      {language === 'am' ? member.bioAm : member.bioEn}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="landing-cta-banner-section">
        <div className="landing-cta-banner-container">
          <div className="cta-banner-card">
            <div className="cta-banner-content">
              <h2 className="cta-banner-title">
                {language === 'am' ? 'ከእኛ ጋር ጤናዎን ይገንቡ' : 'Join Our Global Heritage Health Movement'}
              </h2>
              <p className="cta-banner-desc">
                {language === 'am'
                  ? 'ዛሬውኑ በነፃ ይመዝገቡና ባህላዊ የአመጋገብ ስርዓትዎን በዘመናዊ AI ይከታተሉ።'
                  : 'Start tracking your Ethiopian meals with clinical accuracy. Join thousands of users worldwide today.'}
              </p>
              <div className="cta-banner-actions">
                <Link to="/signup" className="landing-cta-primary large">
                  {language === 'am' ? 'በነፃ ይጀምሩ' : 'Get Started Free'}
                </Link>
                <Link to="/contact" className="landing-cta-secondary">
                  {language === 'am' ? 'አግኙን' : 'Contact Our Team'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
