import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const CulturalGuidelines = () => {
  const { language } = useLanguage();

  return (
    <div className="legal-page-container">
      <div className="legal-article-card">
        <div className="legal-header">
          <div className="landing-badge-pill">
            {language === 'am' ? 'ባህላዊና ሃይማኖታዊ መርሆዎች' : 'Sacred Heritage Principles'}
          </div>
          <h1 className="legal-title">
            {language === 'am' ? 'ባህላዊ እና ሃይማኖታዊ መመሪያዎች' : 'Cultural & Fasting Guidelines'}
          </h1>
          <p className="legal-updated">
            {language === 'am'
              ? 'EthioNutri AI የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ የጾም ስርዓትን እና ባህላዊ የምግብ እሴቶችን እንዴት እንደሚያከብር'
              : 'How EthioNutri AI Honors Ethiopian Orthodox Fasting & Culinary Heritage'}
          </p>
        </div>

        <div className="legal-body-content">
          <section className="legal-section">
            <h2>{language === 'am' ? '1. ቀኖናዊ የጾም ስርዓትን ማክበር' : '1. Respecting the Canonical Fasting Tradition (Tsom)'}</h2>
            <p>
              {language === 'am'
                ? 'የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን በዓለም ላይ ካሉ ጥንታዊና ጥብቅ የጾም ስርዓቶች አንዱ አላት። በዓመት ውስጥ ከ180 በላይ የጾም ቀናት ይገኛሉ።'
                : 'Ethiopian Orthodox Tewahedo Christianity maintains one of the most rigorous and ancient fasting traditions in Christendom, comprising over 180 fasting days per year for lay faithful and up to 250 days for clergy.'}
            </p>
            <p>
              {language === 'am'
                ? 'EthioNutri AI ጾምን እንደ ተራ የአመጋገብ ስልት አይመለከተውም። እንደ የተቀደሰ መንፈሳዊ ስርዓት ያከብረዋል፡'
                : 'EthioNutri AI does not treat fasting as a casual "diet fad" or standard veganism. We respect it as a sacred spiritual discipline. On canonical fasting days:'}
            </p>
            <ul>
              <li><strong>{language === 'am' ? 'ምንም አይነት የእንስሳት ተዋጽኦ የለም፡' : 'Zero Animal Byproducts:'}</strong> {language === 'am' ? 'ስጋ፣ ዶሮ፣ እንቁላል፣ ወተት፣ ቅቤና አይብ በጾም ቀናት ሙሉ በሙሉ ከመጠቆሚያ ይወገዳሉ።' : 'All meat, poultry, dairy (milk, butter, cheese), eggs, and animal-derived fats are completely removed from recommendations.'}</li>
              <li><strong>{language === 'am' ? 'የመጾሚያ ሰዓታት፡' : 'Spiritual Fast Timing:'}</strong> {language === 'am' ? 'እስከ 6፡00 ሰዓት (እኩለ ቀን) ወይም እስከ 9፡00 ሰዓት (የቀኑ 9ኛ ሰዓት) ድረስ ያለውን የመጾም ስርዓት ያገናዝባል።' : 'The app accommodates traditional abstinence hours (fasting until noon or 3 PM / None hour before breaking the fast).'}</li>
              <li><strong>{language === 'am' ? 'የጤና እፎይታዎች፡' : 'Health Exemptions:'}</strong> {language === 'am' ? 'ለነፍሰ ጡር እናቶች፣ ለህጻናት፣ ለአረጋውያን እና በህመም ምክንያት ከንስሐ አባታቸው ፈቃድ ላላቸው ልዩ ማስተካከያ ያደርጋል።' : 'The app supports customizable settings for pregnant or nursing mothers, children, the elderly, and those with medical dispensations from their confessional fathers.'}</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>{language === 'am' ? '2. የጤፍ እና የቦካ እንጀራ ሳይንሳዊ ጠቀሜታ' : '2. The Science of Teff & Fermented Injera'}</h2>
            <p>
              {language === 'am'
                ? 'እንጀራ የኢትዮጵያ አመጋገብ መሰረት ነው። በፋብሪካ እርሾ ከሚቦካ የምዕራባውያን ዳቦ በተለየ፣ እውነተኛ የጤፍ እንጀራ ለ3-4 ቀናት በተፈጥሮ የላክቲክ አሲድ እና እርሾ ፍላት ይዘጋጃል፡'
                : 'Injera is the cornerstone of Ethiopian nutrition. Unlike western leavened bread made with commercial yeast, authentic injera is crafted through a natural 3–4 day wild lactic acid and yeast fermentation process with 100% Eragrostis tef (Teff):'}
            </p>
            <ul>
              <li><strong>{language === 'am' ? 'ዝቅተኛ የግሉኮስ ተጽዕኖ (Low Glycemic Index):' : 'Low Glycemic Load:'}</strong> {language === 'am' ? 'ተፈጥሯዊው ፍላት የስኳር መጠን በፍጥነት እንዳይጨምር ይከላከላል።' : 'The natural fermentation dramatically reduces glycemic index and increases resistant starches.'}</li>
              <li><strong>{language === 'am' ? 'ለሆድ ጤና ተስማሚ (Prebiotics & Probiotics):' : 'Prebiotic & Probiotic Rich:'}</strong> {language === 'am' ? 'የአንጀት ጤናማ ባክቴሪያዎችን በማጎልበት የምግብ መፈጨትን ያቀላጥፋል።' : 'Supports optimal gut microbiota balance and enhances digestive transit.'}</li>
              <li><strong>{language === 'am' ? 'የማዕድናት መሟሟት፡' : 'Mineral Bioavailability:'}</strong> {language === 'am' ? 'ፍላቱ ፊቴትስን በማጥፋት ብረት፣ ካልሲየም፣ ዚንክ እና ማግኒዚየም በቀላሉ ወደ ሰውነት እንዲገቡ ያደርጋል።' : 'Fermentation naturally deactivates phytates, allowing superior absorption of iron, calcium, zinc, and magnesium.'}</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>{language === 'am' ? '3. ማዕድ መጋራት እና ጉርሻ (communal plate)' : '3. Communal Eating & Portion Estimation (Gursha & Mesob)'}</h2>
            <p>
              {language === 'am'
                ? 'የኢትዮጵያ ምግብ በባህሪው ማህበራዊ ነው። ቤተሰብ እና ወዳጅ ዘመድ በአንድ ትልቅ ሰፌድ ወይም መሶብ ዙሪያ ተሰብስበው በፍቅር ይጎራረሳሉ።'
                : 'Ethiopian culinary culture is communal at its core. Meals are shared from a central woven mesob or sefed tray, often with the affectionate practice of Gursha (feeding family and guests with one’s own hand).'}
            </p>
            <p>
              {language === 'am'
                ? 'የእኛ የAI እይታ ሞዴል ይህንን የመሶብ ባህል ሳይነካ የእያንዳንዱን ሰው ድርሻ (ለምሳሌ፡ ከትልቁ በያይነቱ ማዕድ 1/3ኛ ድርሻ) በትክክል ለማስላት የተነደፈ ነው።'
                : 'EthioNutri AI’s proprietary computer vision and logging system is trained to solve the "communal plate challenge"—allowing users to log their individualized portion share without disrupting the joy of collective dining.'}
            </p>
          </section>

          <section className="legal-section">
            <h2>{language === 'am' ? '4. ባህላዊ ቅመሞች እንደ ፈዋሽ መድኃኒት' : '4. Traditional Spice Medicine & Synergy'}</h2>
            <p>
              {language === 'am'
                ? 'በርበሬ፣ ኮረሪማ፣ በሶቢላ፣ ጥቁር አዝሙድ እና ሚጥሚጣ የምግብ ማጣፈጫ ብቻ አይደሉም። ጸረ-ብግነት እና የምግብ መፈጨትን የሚያፋጥኑ የተፈጥሮ መድሃኒቶች ናቸው።'
                : 'Traditional Ethiopian blends—including Berbere, Korerima, Besobila, and Mitmita—are functional foods with powerful anti-inflammatory and thermogenic benefits.'}
            </p>
          </section>
        </div>

        <div className="legal-footer-cta">
          <p>{language === 'am' ? 'ባህልዎን የጠበቀ ዘመናዊ የአመጋገብ መከታተያ ለመጠቀም ዝግጁ ነዎት?' : 'Ready to experience heritage nutrition calibrated for your goals?'}</p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', marginTop: '16px', flexWrap: 'wrap' }}>
            <Link to="/signup" className="landing-cta-primary">
              {language === 'am' ? 'በነፃ ይጀምሩ' : 'Get Started Free'}
            </Link>
            <Link to="/recipes" className="landing-cta-secondary">
              {language === 'am' ? 'ምግቦችን ይመልከቱ' : 'Browse Recipes'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CulturalGuidelines;
