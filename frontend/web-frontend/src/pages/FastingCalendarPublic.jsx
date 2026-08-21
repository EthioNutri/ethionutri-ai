import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  toEthiopianDate,
  getEthiopianFastingInfo,
  ETHIOPIAN_MONTHS
} from '../utils/ethiopianCalendar';

const FastingCalendarPublic = () => {
  const { language } = useLanguage();
  const [anchorDate, setAnchorDate] = useState(new Date());
  const [selectedDayNum, setSelectedDayNum] = useState(new Date().getDate());

  const year = anchorDate.getFullYear();
  const month = anchorDate.getMonth();

  // Dynamic Month Matrix computation using standard JS Date API & Ethiopian Calendar utilities
  const calendarCells = useMemo(() => {
    const cells = [];
    const firstDayOfMonth = new Date(year, month, 1);
    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const todayStr = new Date().toDateString();

    // 1. Previous month trailing padding
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const dNum = prevMonthDays - i;
      const gDate = new Date(year, month - 1, dNum);
      const ethDate = toEthiopianDate(gDate);
      const fastInfo = getEthiopianFastingInfo(ethDate.year, ethDate.month, ethDate.day);
      cells.push({
        day: dNum,
        isCurrentMonth: false,
        isToday: gDate.toDateString() === todayStr,
        isFasting: fastInfo.isFasting,
        fastInfo,
        gDate,
        ethDate
      });
    }

    // 2. Active month days
    for (let d = 1; d <= totalDaysInMonth; d++) {
      const gDate = new Date(year, month, d);
      const ethDate = toEthiopianDate(gDate);
      const fastInfo = getEthiopianFastingInfo(ethDate.year, ethDate.month, ethDate.day);
      cells.push({
        day: d,
        isCurrentMonth: true,
        isToday: gDate.toDateString() === todayStr,
        isFasting: fastInfo.isFasting,
        fastInfo,
        gDate,
        ethDate
      });
    }

    // 3. Next month leading padding to complete 35 or 42 cells (5 or 6 rows)
    const targetLength = cells.length > 35 ? 42 : 35;
    let nextDay = 1;
    while (cells.length < targetLength) {
      const gDate = new Date(year, month + 1, nextDay);
      const ethDate = toEthiopianDate(gDate);
      const fastInfo = getEthiopianFastingInfo(ethDate.year, ethDate.month, ethDate.day);
      cells.push({
        day: nextDay,
        isCurrentMonth: false,
        isToday: gDate.toDateString() === todayStr,
        isFasting: fastInfo.isFasting,
        fastInfo,
        gDate,
        ethDate
      });
      nextDay++;
    }

    return cells;
  }, [year, month]);

  const activeMonthCells = useMemo(() => {
    return calendarCells.filter((c) => c.isCurrentMonth);
  }, [calendarCells]);

  const fastingDaysCount = useMemo(() => {
    return activeMonthCells.filter((c) => c.isFasting).length;
  }, [activeMonthCells]);

  // Active selected cell details
  const activeCellObj = useMemo(() => {
    return (
      activeMonthCells.find((c) => c.day === selectedDayNum) ||
      activeMonthCells[0] ||
      calendarCells[0]
    );
  }, [activeMonthCells, selectedDayNum, calendarCells]);

  // Month navigation handlers
  const handlePrevMonth = () => {
    setAnchorDate(new Date(year, month - 1, 1));
    setSelectedDayNum(1);
  };

  const handleNextMonth = () => {
    setAnchorDate(new Date(year, month + 1, 1));
    setSelectedDayNum(1);
  };

  const monthYearLabelEn = anchorDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const ethMid = toEthiopianDate(new Date(year, month, 15));
  const ethMonthMeta = ETHIOPIAN_MONTHS[ethMid.month - 1] || ETHIOPIAN_MONTHS[0];
  const monthYearLabelAm = `${ethMonthMeta.nameAm} ${ethMid.year} ዓ.ም. (${monthYearLabelEn})`;

  const weekdays = language === 'am'
    ? ['እሑድ', 'ሰኞ', 'ማክሰኞ', 'ረቡዕ', 'ሐሙስ', 'ዓርብ', 'ቅዳሜ']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const fastingPeriods = [
    {
      title: language === 'am' ? 'የረቡዕ እና አርብ ጾም (ጾመ ድኅነት)' : 'Wednesday & Friday Fasts (Tsome Dihnet)',
      days: language === 'am' ? '~116 ቀናት በዓመት' : '~116 days / year',
      badge: language === 'am' ? 'ሳምንታዊ ቀኖናዊ ጾም' : 'Weekly Canonical Fast',
      desc: language === 'am'
        ? 'ከበዓለ ሃምሳ (የትንሳኤ ወቅት 50 ቀናት) ውጭ ዓመቱን ሙሉ ረቡዕና አርብ የሚጾም ስርዓት።'
        : 'Observed throughout the year outside of the 50 days of Pentecost to commemorate the betrayal and crucifixion of Christ.',
    },
    {
      title: language === 'am' ? 'አቢይ ጾም (ሁዳዴ)' : 'The Great Lent (Abiy Tsom)',
      days: language === 'am' ? '55 ተከታታይ ቀናት' : '55 consecutive days',
      badge: language === 'am' ? 'ዋነኛ የንስሐ ወቅት' : 'Major Canonical Season',
      desc: language === 'am'
        ? 'ከፋሲካ በፊት የሚቆይ ታላቅ የንስሐ፣ የጸሎት እና ጥብቅ የዕፅዋት አመጋገብ ወቅት።'
        : 'The most sacred and extensive fasting season preceding Easter, dedicated to strict plant-based sustenance and spiritual devotion.',
    },
    {
      title: language === 'am' ? 'የሐዋርያት ጾም (የሰኔ ጾም)' : 'Fast of the Apostles (Tsome Hawaryat)',
      days: language === 'am' ? 'ከ10–40 ቀናት' : '10–40 days (variable)',
      badge: language === 'am' ? 'የክረምት ጾም' : 'Summer Fast',
      desc: language === 'am'
        ? 'ከበዓለ ሃምሳ በኋላ የሚጾም የቅዱሳን ሐዋርያት ወንጌል የማስተማር አገልግሎት መታሰቢያ ጾም።'
        : 'Observed after Pentecost in honor of the disciples preaching the Gospel to the nations.',
    },
    {
      title: language === 'am' ? 'ጾመ ፍልሰታ' : 'Fast of the Assumption (Filseta)',
      days: language === 'am' ? '16 ቀናት (ነሐሴ 1–16)' : '16 days (August 7–22)',
      badge: language === 'am' ? 'የነሐሴ ጾም' : 'August Fast',
      desc: language === 'am'
        ? 'የእመቤታችን ቅድስት ድንግል ማርያም የዕርገት መታሰቢያ የተከበረ ጾም።'
        : 'A revered 16-day fast in August commemorating the dormition and bodily assumption of Saint Mary.',
    },
  ];

  return (
    <div className="fasting-calendar-public-page">
      {/* Hero Section */}
      <section className="how-hero-section">
        <div className="how-hero-container">
          <div className="landing-badge-pill">
            {language === 'am' ? 'የኦርቶዶክስ ተዋሕዶ የጾም ስርዓት' : 'Orthodox Fasting Companion'}
          </div>
          <h1 className="how-hero-title">
            {language === 'am' ? 'የኢትዮጵያ የጾም ቀን መቁጠሪያ' : 'Ethiopian Orthodox Fasting Calendar'}
          </h1>
          <p className="how-hero-subtitle">
            {language === 'am'
              ? 'በዓመት ከ180 በላይ የጾም ቀናት አሉ። EthioNutri AI የአመጋገብ ግብዎን ከእያንዳንዱ የጾም ወቅት ጋር ያለምንም እንከን ያጣጥማል።'
              : 'With over 180+ fasting days each canonical year, EthioNutri AI automatically aligns your daily macronutrients with sacred heritage traditions.'}
          </p>
        </div>
      </section>

      {/* Interactive Live Calendar Preview & Day Details */}
      <section className="calendar-preview-section">
        <div className="calendar-preview-container">
          <div className="calendar-grid-wrapper">
            {/* Calendar Header */}
            <div className="calendar-month-header">
              <div className="calendar-title-group">
                <span className="month-name">
                  {language === 'am' ? monthYearLabelAm : monthYearLabelEn}
                </span>
                <span className="fasting-count-tag">
                  {language === 'am' ? `${fastingDaysCount} የጾም ቀናት` : `${fastingDaysCount} Fasting Days`}
                </span>
              </div>
              <div className="calendar-nav-buttons">
                <button
                  type="button"
                  className="cal-nav-btn"
                  onClick={handlePrevMonth}
                  title="Previous Month"
                >
                  &larr;
                </button>
                <button
                  type="button"
                  className="cal-nav-btn"
                  onClick={handleNextMonth}
                  title="Next Month"
                >
                  &rarr;
                </button>
              </div>
            </div>

            {/* Days of Week Header */}
            <div className="cal-days-header-row">
              {weekdays.map((d, i) => (
                <div key={d} className={`cal-weekday-label ${i === 3 || i === 5 ? 'highlight' : ''}`}>
                  {d}
                </div>
              ))}
            </div>

            {/* Live Days Grid */}
            <div className="cal-days-grid">
              {calendarCells.map((item, idx) => {
                const isSelected = item.isCurrentMonth && item.day === selectedDayNum;
                return (
                  <button
                    key={idx}
                    type="button"
                    className={`cal-day-cell ${!item.isCurrentMonth ? 'other-month' : ''} ${
                      item.isFasting ? 'is-fasting' : ''
                    } ${item.isToday ? 'is-today' : ''} ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      if (item.isCurrentMonth) setSelectedDayNum(item.day);
                    }}
                  >
                    <span className="day-number">{item.day}</span>
                    {item.isFasting && (
                      <span className="fasting-dot-indicator" title={item.fastInfo?.fastNameEn || "Fasting Day"} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="cal-legend-row">
              <div className="legend-item">
                <span className="legend-swatch fasting" />
                <span>{language === 'am' ? 'የጾም ቀን (ቀይ/ቡናማ)' : 'Fasting Day (Tsom)'}</span>
              </div>
              <div className="legend-item">
                <span className="legend-swatch non-fasting" />
                <span>{language === 'am' ? 'የፍስክ ቀን' : 'Feasting / Regular Day'}</span>
              </div>
              <div className="legend-item">
                <span className="legend-swatch today" />
                <span>{language === 'am' ? 'የዛሬ ቀን' : 'Today'}</span>
              </div>
            </div>
          </div>

          {/* Dynamic Day Details Card */}
          <div className="day-details-panel">
            <div className="panel-header">
              <span className="panel-badge">
                {activeCellObj.isFasting ? (
                  <span className="tag-fasting">🌿 {language === 'am' ? 'የጾም ቀን (ጾም)' : 'Fasting Day (Tsom)'}</span>
                ) : (
                  <span className="tag-regular">🍖 {language === 'am' ? 'የፍስክ ቀን' : 'Feasting Day'}</span>
                )}
              </span>
              <h3 className="panel-date-title">
                {activeCellObj.gDate.toLocaleDateString(language === 'am' ? 'en-US' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                {' '}
                <span style={{ fontSize: '13px', color: 'var(--terracotta)', fontWeight: 700 }}>
                  ({ETHIOPIAN_MONTHS[activeCellObj.ethDate.month - 1]?.nameAm} {activeCellObj.ethDate.day} ቀን {activeCellObj.ethDate.year} ዓ.ም.)
                </span>
              </h3>
              <p className="panel-period-name">
                {activeCellObj.isFasting
                  ? (language === 'am' ? activeCellObj.fastInfo.fastNameAm : activeCellObj.fastInfo.fastNameEn)
                  : (language === 'am' ? 'መደበኛ የፍስክ ቀን' : 'Regular Feasting Nutrition Day')}
              </p>
            </div>

            <div className="panel-rules-box">
              <h4 className="rules-title">
                {activeCellObj.isFasting
                  ? (language === 'am' ? 'የተፈቀዱ የጾም ምግቦች እና ስርዓቶች' : 'Allowed Fasting Foods & Nutrition')
                  : (language === 'am' ? 'የተመጣጠነ የፍስክ አመጋገብ መመሪያ' : 'Standard Nutrition Guidance')}
              </h4>
              {activeCellObj.isFasting ? (
                <ul className="rules-list">
                  <li>🌱 <strong>{language === 'am' ? '100% ከዕፅዋት የሚዘጋጅ፡' : '100% Plant-Based:'}</strong> {language === 'am' ? 'ንጹህ የጤፍ እንጀራ፣ ምስር ወጥ፣ ሽሮ ተጋሚኖ፣ ክክ አልጫ፣ ጎመን፣ አትክልት፣ ሱፍ ፍርፍር፣ ተልባ።' : 'Pure teff injera, misir wot, shiro, kik alicha, gomen, atkilt.'}</li>
                  <li>❌ <strong>{language === 'am' ? 'የተከለከለ፡' : 'Restricted:'}</strong> {language === 'am' ? 'ስጋ፣ ዶሮ፣ እንቁላል፣ ወተት፣ ቅቤ፣ አይብ እና የእንስሳት ተዋጽኦዎች።' : 'No meat, poultry, eggs, milk, cheese, or animal fats.'}</li>
                  <li>💪 <strong>{language === 'am' ? 'የታለመ ፕሮቲን፡' : 'Target Protein:'}</strong> {language === 'am' ? 'ከ45–65ግ በሽሮ፣ ምስር እና ሱፍ አማካኝነት።' : '45–65g via chickpea shiro, lentils, and suf firfir.'}</li>
                </ul>
              ) : (
                <ul className="rules-list">
                  <li>🥩 <strong>{language === 'am' ? 'ባህላዊ ምግቦች፡' : 'Traditional Heritage:'}</strong> {language === 'am' ? 'ዶሮ ወጥ፣ ድስ ጥብስ፣ ክትፎ፣ የተቀቀለ እንቁላል፣ እና አይብ።' : 'Doro wat, lean beef tibs, kitfo, boiled eggs, and ayib.'}</li>
                  <li>🌾 <strong>{language === 'am' ? 'ካርቦሃይድሬት፡' : 'Carbohydrates:'}</strong> {language === 'am' ? 'በብረት የበለጸገ የጤፍ እንጀራ።' : 'Complex iron-rich whole grain teff injera.'}</li>
                  <li>💪 <strong>{language === 'am' ? 'የታለመ ፕሮቲን፡' : 'Target Protein:'}</strong> {language === 'am' ? 'ከ70–90ግ ለጡንቻ ጥንካሬ እና እርካታ።' : '70–90g for active muscle retention and satiety.'}</li>
                </ul>
              )}
            </div>

            {/* CTA inside panel */}
            <div className="panel-cta-box">
              <p className="panel-cta-text">
                {language === 'am'
                  ? 'የእርስዎን ግላዊ የጾም መርሃ ግብር እና የአመጋገብ ማስተካከያ በየቀኑ ለመከታተል ይመዝገቡ።'
                  : 'Sync your personal fasting schedule and unlock automated plant-based macro adaptation.'}
              </p>
              <Link to="/signup" className="landing-cta-primary" style={{ width: '100%', textAlign: 'center' }}>
                {language === 'am' ? 'የግል ጾምዎን ይከታተሉ' : 'Track Your Fasting Cycle'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Orthodox Fasting Canonical Seasons Section */}
      <section className="fasting-periods-section">
        <div className="fasting-periods-container">
          <div className="stats-header">
            <span className="stats-badge">
              {language === 'am' ? 'የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ጾሞች' : 'Major Fasting Seasons'}
            </span>
            <h2 className="stats-title">
              {language === 'am' ? 'ዋና ዋና የዓመቱ የጾም ወቅቶች' : 'Canonical Fasting Periods in Detail'}
            </h2>
          </div>

          <div className="fasting-periods-grid">
            {fastingPeriods.map((period, idx) => (
              <div key={idx} className="fasting-period-card">
                <div className="period-card-top">
                  <span className="period-badge">{period.badge}</span>
                  <span className="period-days-tag">{period.days}</span>
                </div>
                <h3 className="period-title">{period.title}</h3>
                <p className="period-desc">{period.desc}</p>
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
                {language === 'am' ? 'የመንፈስ እና የአካል ጤናዎን ያጣጥሙ' : 'Honor Your Faith & Nourish Your Body'}
              </h2>
              <p className="cta-banner-desc">
                {language === 'am'
                  ? 'የጾም ቀናትዎን ከጤና ግቦችዎ ጋር ያጣጥሙ። አሁኑኑ በነፃ ይመዝገቡ።'
                  : 'Join EthioNutri AI to seamlessly bridge Ethiopian Orthodox fasting traditions with clinically sound nutrition.'}
              </p>
              <div className="cta-banner-actions">
                <Link to="/signup" className="landing-cta-primary large">
                  {language === 'am' ? 'በነፃ ይጀምሩ' : 'Get Started Free'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FastingCalendarPublic;
