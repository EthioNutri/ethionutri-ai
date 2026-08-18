import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const HowItWorks = () => {
  const { language } = useLanguage();
  const [openFaq, setOpenFaq] = useState(0);

  const steps = [
    {
      number: '1',
      title: language === 'am' ? 'ባህላዊ ምግቦችን በቀላሉ ይመዝግቡ' : 'Log Your Traditional Meals',
      desc: language === 'am'
        ? 'በስልክዎ የምግብ ፎቶ በማንሳት፣ በአማርኛ ወይም በእንግሊዝኛ ድምጽዎን በመጠቀም፣ ወይም ከ300+ በላይ ባህላዊ ምግቦች ዝርዝር ውስጥ በመምረጥ የቁርስ፣ ምሳ እና እራትዎን ይመዝግቡ።'
        : 'Snap a photo of your plate, use voice logging in Amharic or English, or select from our database of over 300 verified Ethiopian dishes including injera sizes and specific wot portions.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      ),
      badgeColor: 'orange-badge',
    },
    {
      number: '2',
      title: language === 'am' ? 'ከጾም ስርዓት ጋር በራስ-ሰር ይጣጣማል' : 'Automatic Fasting (Tsom) Sync',
      desc: language === 'am'
        ? 'ረቡዕና አርብ፣ አቢይ ጾም፣ የሐዋርያት ጾም እና ሌሎች የኦርቶዶክስ ተዋሕዶ ጾሞችን በቀጥታ በማወቅ የእንስሳት ተዋጽኦዎችን ያስወግዳል፤ ጤናማ የዕፅዋት ፕሮቲን ግቦችን ያስተካክላል።'
        : 'Our intelligent calendar syncs with Ethiopian Orthodox fasting seasons. On fasting days (Tsom), target macros automatically pivot to plant-based proteins without disrupting your fitness momentum.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
      badgeColor: 'mint-badge',
    },
    {
      number: '3',
      title: language === 'am' ? 'የAI ክሊኒካዊ ምክሮችን ይቀበሉ' : 'Get Real-Time Clinical AI Insights',
      desc: language === 'am'
        ? 'በጾም ወቅት የሚቀንስ የብረት (Iron)፣ ቫይታሚን B12 እና ፕሮቲን መጠን ሲኖር AI ረዳትዎ እንደ ምስር፣ ሱፍ፣ ቴምር እና ጎመን ያሉ ተስማሚ ምግቦችን ይጠቁማል።'
        : 'Our clinical AI algorithm monitors micronutrients like iron, zinc, and B12 during plant-based fasting periods, recommending smart traditional food pairings (e.g. lemon with gomen to maximize iron absorption).',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2a8 8 0 0 0-8 8c0 3.37 2.1 6.25 5.09 7.4.38.15.66.49.66.9v1.7c0 .55.45 1 1 1h2.5c.55 0 1-.45 1-1v-1.7c0-.41.28-.75.66-.9A8.003 8.003 0 0 0 20 10a8 8 0 0 0-8-8z" />
          <path d="M9.5 9h5" />
        </svg>
      ),
      badgeColor: 'tan-badge',
    },
    {
      number: '4',
      title: language === 'am' ? 'ባህልን እያከበሩ የጤና ግብዎን ያሳኩ' : 'Achieve Sustainable Health & Vitality',
      desc: language === 'am'
        ? 'ክብደት ለመቀነስ፣ ጡንቻ ለመገንባት ወይም የስኳር መጠንን ለመቆጣጠር ባህላዊ ምግቦችን ሳያቋርጡ ዘላቂ የጤና ውጤት ያስመዝግቡ።'
        : 'Whether your goal is fat loss, muscle building, or managing blood sugar, you accomplish it while enjoying full, joyful communal meals with family and community.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
      badgeColor: 'mint-badge',
    },
  ];

  const faqs = [
    {
      q: language === 'am' ? 'EthioNutri AI የኦርቶዶክስ ተዋሕዶ የጾም ህጎችን እንዴት ያከብራል?' : 'How does EthioNutri AI adhere to Ethiopian Orthodox fasting rules?',
      a: language === 'am'
        ? 'መተግበሪያው በቤተክርስቲያኑ የቀን መቁጠሪያ መሰረት ረቡዕና አርብ፣ አቢይ ጾም፣ የነቢያት ጾም እና ሌሎች ወቅቶችን ይከታተላል። በእነዚህ ቀናት ስጋ፣ እንቁላል፣ ወተትና ቅቤ አይጠቁምም፤ በምትኩ የተመጣጠኑ የጾም ምግቦችን ያቀርባል።'
        : 'The app follows canonical Ethiopian Orthodox fasting calendars (Tsom). On designated fast days, all animal products (meat, poultry, dairy, eggs) are automatically excluded from meal suggestions, and the app optimizes plant-based proteins, iron, and micronutrients.',
    },
    {
      q: language === 'am' ? 'የእንጀራ እና የወጥ ካሎሪዎች እንዴት በትክክል ይሰላሉ?' : 'How is Ethiopian food accurately calculated for calories and macros?',
      a: language === 'am'
        ? 'የእኛ የምግብ ዳታቤዝ የተዘጋጀው ከኢትዮጵያ ህብረተሰብ ጤና ኢንስቲትዩት (EPHI) የምርምር መረጃዎችና ከክሊኒካል ዲያቲሽያኖች ጋር በመተባበር ነው። የነጭ፣ ቀይ እና ሰርገኛ ጤፍ ልዩነቶች ተካተዋል።'
        : 'Our database was constructed using nutritional data from the Ethiopian Public Health Institute (EPHI) alongside registered dietitians. We account for 100% pure teff vs mixed blends, specific wot cooking techniques, and niter kibbeh fats.',
    },
    {
      q: language === 'am' ? 'የግል የጤና መረጃዬ የተጠበቀ ነው?' : 'Is my personal health and dietary data kept private?',
      a: language === 'am'
        ? 'አዎ፣ የእርስዎ የግል መረጃ፣ ክብደት እና የአመጋገብ ታሪክ በዘመናዊ የኢንክሪፕሽን ቴክኖሎጂ በጥብቅ የተጠበቀ ነው፤ ለሶስተኛ ወገን አይሸጥም።'
        : 'Absolutely. Your health metrics, dietary preferences, and personal logs are encrypted in transit and at rest. We do not sell your personal health data to third parties.',
    },
    {
      q: language === 'am' ? 'የአገልግሎቱ ክፍያ እንዴት ነው?' : 'What is the pricing model?',
      a: language === 'am'
        ? 'መሰረታዊ የምግብ መመዝገቢያ እና የጾም ቀን መቁጠሪያ በነፃ ይቀርባሉ። የላቀ የAI ምስል መለያ፣ የግል የአመጋገብ እቅድ እና የክሊኒካል ምክር በPremium አባልነት ይገኛሉ።'
        : 'EthioNutri AI offers a generous free tier with core meal logging and the Orthodox fasting calendar. Advanced features like photo-AI meal recognition, custom meal prep blueprints, and micronutrient alerts are available in our Premium plan.',
    },
  ];

  return (
    <div className="how-it-works-page">
      {/* Hero Section */}
      <section className="how-hero-section">
        <div className="how-hero-container">
          <div className="landing-badge-pill">
            {language === 'am' ? 'ቀላል • ባህላዊ • ሳይንሳዊ' : 'Simple • Heritage-First • Clinical'}
          </div>
          <h1 className="how-hero-title">
            {language === 'am' ? 'EthioNutri AI እንዴት ይሰራል?' : 'How EthioNutri AI Works'}
          </h1>
          <p className="how-hero-subtitle">
            {language === 'am'
              ? 'ባህላዊ የምግብ አሰራርን ሳያዛቡ፣ የጾም ስርዓትን ሳያጓድሉ፣ ጤናማና ንቁ አኗኗርን ለመምራት የተነደፈ 4 ደረጃዎች ያሉት ቀላል ሂደት።'
              : 'A seamless 4-step journey designed to celebrate traditional Ethiopian food and fasting culture with cutting-edge artificial intelligence.'}
          </p>
        </div>
      </section>

      {/* Step by Step Walkthrough */}
      <section className="how-steps-section">
        <div className="how-steps-container">
          <div className="steps-vertical-flow">
            {steps.map((step, idx) => (
              <div key={idx} className="step-card-row">
                <div className="step-number-col">
                  <div className="step-number-circle">
                    {step.number}
                  </div>
                  {idx < steps.length - 1 && <div className="step-connector-line" />}
                </div>
                <div className="step-card-body">
                  <div className={`step-icon-badge ${step.badgeColor}`}>
                    {step.icon}
                  </div>
                  <div className="step-text-content">
                    <h3 className="step-title">{step.title}</h3>
                    <p className="step-description">{step.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="how-faq-section">
        <div className="how-faq-container">
          <div className="faq-header">
            <span className="stats-badge">
              {language === 'am' ? 'ተደጋግመው የሚጠየቁ ጥያቄዎች' : 'Frequently Asked Questions'}
            </span>
            <h2 className="faq-main-title">
              {language === 'am' ? 'ማወቅ የሚፈልጓቸው ዝርዝሮች' : 'Everything You Need to Know'}
            </h2>
          </div>

          <div className="faq-accordion-list">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className={`faq-accordion-card ${isOpen ? 'open' : ''}`}
                  onClick={() => setOpenFaq(isOpen ? -1 : index)}
                >
                  <div className="faq-card-header">
                    <h3 className="faq-question-text">{faq.q}</h3>
                    <span className="faq-toggle-icon">
                      {isOpen ? '−' : '+'}
                    </span>
                  </div>
                  {isOpen && (
                    <div className="faq-card-body">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Closing CTA Band */}
      <section className="landing-cta-banner-section">
        <div className="landing-cta-banner-container">
          <div className="cta-banner-card">
            <div className="cta-banner-content">
              <h2 className="cta-banner-title">
                {language === 'am' ? 'የጤና እና የባህል ጉዞዎን አሁኑኑ ይጀምሩ' : 'Experience Modern Heritage Nutrition Today'}
              </h2>
              <p className="cta-banner-desc">
                {language === 'am'
                  ? 'ምንም አይነት የክፍያ ካርድ ሳይጠየቅ በነፃ ይመዝገቡና የመጀመሪያውን ምግብዎን ይከታተሉ።'
                  : 'Start free with no credit card required. Sync your fasting calendar and log your first meal in seconds.'}
              </p>
              <div className="cta-banner-actions">
                <Link to="/signup" className="landing-cta-primary large">
                  {language === 'am' ? 'በነፃ ይጀምሩ' : 'Get Started Free'}
                </Link>
                <Link to="/recipes" className="landing-cta-secondary">
                  {language === 'am' ? 'ምግቦችን ይመልከቱ' : 'Explore Heritage Recipes'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
