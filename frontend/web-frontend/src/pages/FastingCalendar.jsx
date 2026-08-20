import React, { useState, useMemo, useEffect } from 'react';
import { useNutrition } from '../context/NutritionContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  ETHIOPIAN_MONTHS,
  ETHIOPIAN_WEEKDAYS,
  toEthiopianDate,
  generateEthiopianMonthMatrix,
  getEthiopianFastingInfo,
  isEthiopianLeapYear,
  getDaysInEthiopianMonth
} from '../utils/ethiopianCalendar';
import {
  HIJRI_MONTHS,
  HIJRI_WEEKDAYS,
  toHijriDate,
  generateHijriMonthMatrix,
  getIslamicFastingInfo,
  fetchLiveHijriData
} from '../utils/hijriCalendar';

const FastingCalendar = () => {
  const { fastingCycle } = useNutrition();
  const { language } = useLanguage();
  const { user } = useAuth();

  // Determine initial calendar mode based on user's profile fasting practice
  const userFastingPractice = user?.fastingPractice || user?.healthProfile?.fastingPractice || user?.fasting_practice;
  
  const getInitialMode = () => {
    if (userFastingPractice === 'ramadan' || userFastingPractice === 'muslim' || userFastingPractice === 'islamic') {
      return 'hijri';
    }
    if (userFastingPractice === 'intermittent' || userFastingPractice === 'none') {
      return 'intermittent';
    }
    return 'orthodox'; // Default
  };

  const [calendarMode, setCalendarMode] = useState(getInitialMode());

  // Keep calendarMode in sync if user profile loads later
  useEffect(() => {
    if (userFastingPractice) {
      if (userFastingPractice === 'ramadan' || userFastingPractice === 'muslim') setCalendarMode('hijri');
      else if (userFastingPractice === 'none' || userFastingPractice === 'intermittent') setCalendarMode('intermittent');
      else setCalendarMode('orthodox');
    }
  }, [userFastingPractice]);

  // Toast & Notifications
  const [toastMsg, setToastMsg] = useState('');
  const [reminderSet, setReminderSet] = useState(false);

  // -------------------------------------------------------------
  // 1. ETHIOPIAN ORTHODOX CALENDAR STATE
  // -------------------------------------------------------------
  const todayEth = useMemo(() => toEthiopianDate(new Date()), []);
  const [selectedEthYear, setSelectedEthYear] = useState(todayEth.year || 2017);
  const [selectedEthMonth, setSelectedEthMonth] = useState(todayEth.month || 1);
  const [selectedEthDay, setSelectedEthDay] = useState(todayEth.day || 1);

  const ethMonthData = useMemo(() => {
    return generateEthiopianMonthMatrix(selectedEthYear, selectedEthMonth);
  }, [selectedEthYear, selectedEthMonth]);

  const selectedEthDayInfo = useMemo(() => {
    return getEthiopianFastingInfo(selectedEthYear, selectedEthMonth, selectedEthDay);
  }, [selectedEthYear, selectedEthMonth, selectedEthDay]);

  const currentEthMonthMeta = ETHIOPIAN_MONTHS[selectedEthMonth - 1];

  const handleEthPrevMonth = () => {
    if (selectedEthMonth === 1) {
      setSelectedEthMonth(13);
      setSelectedEthYear((prev) => prev - 1);
    } else {
      setSelectedEthMonth((prev) => prev - 1);
    }
    setSelectedEthDay(1);
  };

  const handleEthNextMonth = () => {
    if (selectedEthMonth === 13) {
      setSelectedEthMonth(1);
      setSelectedEthYear((prev) => prev + 1);
    } else {
      setSelectedEthMonth((prev) => prev + 1);
    }
    setSelectedEthDay(1);
  };

  // -------------------------------------------------------------
  // 2. ISLAMIC / HIJRI CALENDAR STATE
  // -------------------------------------------------------------
  const todayHijri = useMemo(() => toHijriDate(new Date()), []);
  const [selectedHijriYear, setSelectedHijriYear] = useState(todayHijri.year || 1448);
  const [selectedHijriMonth, setSelectedHijriMonth] = useState(todayHijri.month || 9);
  const [selectedHijriDay, setSelectedHijriDay] = useState(todayHijri.day || 1);
  const [livePrayerTimes, setLivePrayerTimes] = useState(null);

  useEffect(() => {
    if (calendarMode === 'hijri') {
      fetchLiveHijriData().then((res) => {
        if (res.success && res.data) {
          setLivePrayerTimes(res.data);
        }
      });
    }
  }, [calendarMode]);

  const hijriMonthData = useMemo(() => {
    return generateHijriMonthMatrix(selectedHijriYear, selectedHijriMonth);
  }, [selectedHijriYear, selectedHijriMonth]);

  const selectedHijriDayInfo = useMemo(() => {
    return getIslamicFastingInfo(selectedHijriYear, selectedHijriMonth, selectedHijriDay);
  }, [selectedHijriYear, selectedHijriMonth, selectedHijriDay]);

  const currentHijriMonthMeta = HIJRI_MONTHS[selectedHijriMonth - 1];

  const handleHijriPrevMonth = () => {
    if (selectedHijriMonth === 1) {
      setSelectedHijriMonth(12);
      setSelectedHijriYear((prev) => prev - 1);
    } else {
      setSelectedHijriMonth((prev) => prev - 1);
    }
    setSelectedHijriDay(1);
  };

  const handleHijriNextMonth = () => {
    if (selectedHijriMonth === 12) {
      setSelectedHijriMonth(1);
      setSelectedHijriYear((prev) => prev + 1);
    } else {
      setSelectedHijriMonth((prev) => prev + 1);
    }
    setSelectedHijriDay(1);
  };

  // -------------------------------------------------------------
  // 3. INTERMITTENT FASTING STATE (General / None)
  // -------------------------------------------------------------
  const [ifProtocol, setIfProtocol] = useState('16:8'); // '16:8', '18:6', '20:4'
  const [ifStartTime, setIfStartTime] = useState('20:00'); // 8:00 PM
  const [ifElapsedHours, setIfElapsedHours] = useState(13.5);

  const handleSetReminderAction = (type, timeStr) => {
    setReminderSet(true);
    setToastMsg(
      language === 'am'
        ? `⏰ የ${type} ማስታወሻ ለ ${timeStr} ተይዟል!`
        : `⏰ ${type} reminder scheduled for ${timeStr}!`
    );
    setTimeout(() => setToastMsg(''), 4000);
  };

  // Major Orthodox Fasts
  const majorOrthodoxFasts = [
    {
      name: 'Abiy Tsom (The Great Lent)',
      amharic: 'አቢይ ጾም (ሁዳዴ)',
      duration: '55 Days / 55 ቀናት',
      dates: 'Yakatit – Miazia / የካቲት – ሚያዝያ',
      icon: '🕊️',
      desc: language === 'am' ? 'ከትንሣኤ (ፋሲካ) አስቀድሞ የሚጾም ታላቅ የንስሐ ወቅት' : '55-day canonical fast preceding Easter (Fasika)'
    },
    {
      name: 'Tsome Hawaryat (Apostles Fast)',
      amharic: 'የሐዋርያት ጾም (የሰኔ ጾም)',
      duration: '14–44 Days / ከ14–44 ቀናት',
      dates: 'Sene – Hamle 5 / ሰኔ – ሐምሌ 5',
      icon: '📜',
      desc: language === 'am' ? 'ከበዓለ ሃምሳ በኋላ የሚጾም የቅዱሳን ሐዋርያት አገልግሎት መታሰቢያ' : 'Summer fast observed following Pentecost Sunday'
    },
    {
      name: 'Tsome Filseta (Assumption Fast)',
      amharic: 'የፍልሰታ ጾም',
      duration: '16 Days / 16 ቀናት',
      dates: 'Nehase 1 – 16 / ነሐሴ 1 – 16',
      icon: '🌸',
      desc: language === 'am' ? 'የእመቤታችን ቅድስት ድንግል ማርያም የዕርገት መታሰቢያ' : '16-day sacred fast commemorating the Dormition of St. Mary'
    },
    {
      name: 'Tsome Nebiyat (Prophets / Advent)',
      amharic: 'የነቢያት ጾም (የገና ጾም)',
      duration: '43 Days / 43 ቀናት',
      dates: 'Hidar 15 – Tahsas 28 / ኅዳር 15 – ታኅሣሥ 28',
      icon: '🕯️',
      desc: language === 'am' ? 'ለጌታችን ልደት (ገና) መዘጋጃ የሚጾም 43 ቀናት' : '43-day fast preparing for the Nativity of Christ (Gena)'
    },
    {
      name: 'Tsome Nenewe (Fast of Nineveh)',
      amharic: 'ጾመ ነነዌ',
      duration: '3 Days / 3 ቀናት',
      dates: '2 Weeks before Lent / ከአቢይ ጾም 2 ሳምንት በፊት',
      icon: '⚓',
      desc: language === 'am' ? 'የዮናስ እና የነነዌ ሰዎች የንስሐ መታሰቢያ' : '3-day fast of repentance 14 days before Great Lent'
    },
    {
      name: 'Tsome Dihnet (Wed & Fri Fasts)',
      amharic: 'የረቡዕ እና ዓርብ ጾም (ጾመ ድኅነት)',
      duration: '~116 Days/Year / ~116 ቀናት',
      dates: 'Year-Round / ዓመቱን ሙሉ',
      icon: '🌱',
      desc: language === 'am' ? 'ከበዓለ ሃምሳ ውጭ በየሳምንቱ ረቡዕና ዓርብ የሚጾም' : 'Weekly Wednesday & Friday fasts outside Pentecost'
    },
  ];

  // Major Islamic Fasts
  const majorIslamicFasts = [
    {
      name: 'Holy Month of Ramadan',
      arabic: 'شهر رمضان المبارك',
      amharic: 'የተቀደሰው የረመዳን ወር',
      duration: '29–30 Days',
      dates: '9th Month of Hijri Year',
      icon: '🌙',
      desc: language === 'am' ? 'ከፈጅር እስከ መግሪብ የሚጾም የእስልምና አንዱ ምሰሶ የሆነ ግዴታ ጾም' : 'Obligatory dawn-to-sunset fast for all healthy adult Muslims'
    },
    {
      name: 'Sunnah Monday & Thursday Fasts',
      arabic: 'صيام الإثنين والخميس',
      amharic: 'የሰኞ እና ሐሙስ ሱና ጾም',
      duration: 'Weekly / ሳምንታዊ',
      dates: 'Year-Round (Outside Eid)',
      icon: '✨',
      desc: language === 'am' ? 'የነቢዩ ሙሐመድ (ሰ.ዐ.ወ) የተወደደ ሳምንታዊ ሱና' : 'Weekly voluntary fasts observed by Prophet Muhammad (PBUH)'
    },
    {
      name: 'White Days (Ayyam al-Bid)',
      arabic: 'صيام أيام البيض',
      amharic: 'የነጭ ቀናት ጾም (13፣ 14 እና 15)',
      duration: '3 Days / Month',
      dates: '13th, 14th, 15th of Every Lunar Month',
      icon: '🌕',
      desc: language === 'am' ? 'በየወሩ አጋማሽ በሙሉ ጨረቃ ወቅት የሚጾም ከፍተኛ ምንዳ ያለው ጾም' : 'Fasting 3 days of full moon lunar cycle'
    },
    {
      name: 'Day of Arafah',
      arabic: 'صيام يوم عرفة',
      amharic: 'የዐረፋ ቀን ጾም (9ኛው ዙል-ሒጃ)',
      duration: '1 Day',
      dates: '9th Dhul-Hijjah',
      icon: '🕋',
      desc: language === 'am' ? 'የሐጅ ተጓዦች በዐረፋ ተራራ በሚቆሙበት ቀን የሚጾም' : 'Expiates sins of the previous and upcoming year'
    },
    {
      name: 'Day of Ashura & Tasu’a',
      arabic: 'صيام عاشوراء وتاسوعاء',
      amharic: 'የዐሹራ እና ታሱዓ ጾም',
      duration: '2 Days',
      dates: '9th & 10th Muharram',
      icon: '⚓',
      desc: language === 'am' ? 'ነቢዩ ሙሳ እና ህዝቦቻቸው ከፈርዖን የዳኑበት መታሰቢያ' : 'Commemorating the salvation of Prophet Moses (AS)'
    },
    {
      name: 'Six Days of Shawwal',
      arabic: 'ستة من شوال',
      amharic: 'የሸዋል 6 ቀናት ጾም',
      duration: '6 Days',
      dates: 'Month of Shawwal (After Eid)',
      icon: '🌿',
      desc: language === 'am' ? 'ከረመዳን በኋላ 6 ቀናትን መጾም የዓመቱን ሙሉ ጾም ያህል ምንዳ ያስገኛል' : 'Equivalent to fasting the entire year in spiritual reward'
    },
  ];

  return (
    <div className="fasting-calendar-page">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="app-toast-alert">
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header with Mode Switcher */}
      <div className="tsom-page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 className="tsom-main-heading">
              {calendarMode === 'orthodox' && (language === 'am' ? 'የኢትዮጵያ 13ቱ ወራት የጾም ቀን መቁጠሪያ' : 'Ethiopian 13-Month Fasting Calendar')}
              {calendarMode === 'hijri' && (language === 'am' ? 'የእስልምና የሂጅሪ የጾም እና የሶላት መቁጠሪያ' : 'Islamic Hijri Fasting & Prayer Calendar')}
              {calendarMode === 'intermittent' && (language === 'am' ? 'የኢንተርሚተንት ፋስቲንግ መከታተያ' : 'Intermittent Fasting Tracker')}
            </h1>
            <p className="tsom-main-sub">
              {calendarMode === 'orthodox' && (language === 'am' ? 'ሁሉንም 13 የኢትዮጵያ ወራት (ከመስከረም እስከ ጳጉሜን) እና የቀኖናዊ የጾም ወቅቶችን ይከታተሉ።' : 'Explore all 13 Ethiopian Calendar months with accurate Orthodox fasting cycles & nutrition guidance.')}
              {calendarMode === 'hijri' && (language === 'am' ? 'የረመዳን፣ የሰኞ/ሐሙስ ሱና እና የነጭ ቀናት (አያም አል-ቢድ) የጾም እና የኢፍጣር ሰዓታት።' : 'Track Ramadan, Sunnah Monday/Thursday, White Days, and live Suhoor/Iftar timings with Islamic nutrition tips.')}
              {calendarMode === 'intermittent' && (language === 'am' ? 'ለ16:8፣ 18:6 እና 20:4 የጾም መስኮቶች ግላዊ ሰዓት ቆጣሪ እና የካሎሪ ማስተካከያ።' : 'Personalized fasting timer, eating windows, hydration tracker, and heritage nutrition pacing.')}
            </p>
          </div>

          {/* Calendar Practice Mode Switcher Pills */}
          <div className="range-selector-pill" style={{ background: 'var(--card-bg)', border: '1px solid rgba(201, 123, 61, 0.25)' }}>
            <button
              className={`range-pill-btn ${calendarMode === 'orthodox' ? 'active' : ''}`}
              onClick={() => setCalendarMode('orthodox')}
            >
              🕊️ {language === 'am' ? 'ኦርቶዶክስ (13 ወራት)' : 'Orthodox (13-Month)'}
            </button>
            <button
              className={`range-pill-btn ${calendarMode === 'hijri' ? 'active' : ''}`}
              onClick={() => setCalendarMode('hijri')}
            >
              🌙 {language === 'am' ? 'ሂጅሪ (ረመዳን/ሱና)' : 'Islamic (Hijri)'}
            </button>
            <button
              className={`range-pill-btn ${calendarMode === 'intermittent' ? 'active' : ''}`}
              onClick={() => setCalendarMode('intermittent')}
            >
              ⏱️ {language === 'am' ? 'ኢንተርሚተንት' : 'Intermittent (16:8)'}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. ETHIOPIAN ORTHODOX VIEW */}
      {/* ========================================================================= */}
      {calendarMode === 'orthodox' && (
        <>
          <div className="tsom-calendar-grid">
            {/* Left Calendar Grid Card */}
            <div className="tsom-calendar-card">
              {/* Month & Year Navigation Row */}
              <div className="calendar-month-nav">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  {/* 13-Month Dropdown Selector */}
                  <select
                    className="calendar-month-select"
                    value={selectedEthMonth}
                    onChange={(e) => {
                      const m = parseInt(e.target.value, 10);
                      setSelectedEthMonth(m);
                      const maxDays = getDaysInEthiopianMonth(selectedEthYear, m);
                      if (selectedEthDay > maxDays) setSelectedEthDay(maxDays);
                    }}
                    style={{
                      fontSize: '18px',
                      fontWeight: 800,
                      color: 'var(--forest-green)',
                      background: 'var(--ethiocream-bg)',
                      border: '1px solid rgba(201, 123, 61, 0.2)',
                      borderRadius: '10px',
                      padding: '6px 12px',
                      cursor: 'pointer',
                      outline: 'none',
                      fontFamily: 'inherit'
                    }}
                  >
                    {ETHIOPIAN_MONTHS.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.id}. {language === 'am' ? `${m.nameAm} (${m.nameEn})` : `${m.nameEn} (${m.nameAm})`}
                        {m.id === 13 ? (isEthiopianLeapYear(selectedEthYear) ? ' [6 ቀናት]' : ' [5 ቀናት]') : ' [30 ቀናት]'}
                      </option>
                    ))}
                  </select>

                  {/* Year Dropdown Selector */}
                  <select
                    className="calendar-year-select"
                    value={selectedEthYear}
                    onChange={(e) => {
                      const y = parseInt(e.target.value, 10);
                      setSelectedEthYear(y);
                    }}
                    style={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: 'var(--terracotta)',
                      background: 'var(--ethiocream-bg)',
                      border: '1px solid rgba(201, 123, 61, 0.2)',
                      borderRadius: '10px',
                      padding: '6px 10px',
                      cursor: 'pointer',
                      outline: 'none',
                      fontFamily: 'inherit'
                    }}
                  >
                    {[2015, 2016, 2017, 2018, 2019, 2020].map((y) => (
                      <option key={y} value={y}>
                        {y} ዓ.ም. ({y + 7}/{y + 8} Gregorian)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Prev / Next Arrows */}
                <div className="calendar-nav-arrows">
                  <button className="arrow-btn" onClick={handleEthPrevMonth} title="Previous Month">
                    ‹
                  </button>
                  <button className="arrow-btn" onClick={handleEthNextMonth} title="Next Month">
                    ›
                  </button>
                </div>
              </div>

              {/* Month Subtitle Information */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', fontSize: '12px', color: 'var(--text-medium)' }}>
                <span style={{ fontWeight: 600 }}>
                  🌿 {language === 'am' ? currentEthMonthMeta.seasonAm : currentEthMonthMeta.seasonEn} • {selectedEthMonth === 13 ? (isEthiopianLeapYear(selectedEthYear) ? 'ጳጉሜን 6 ቀናት (ዘመነ ዮሐንስ)' : 'ጳጉሜን 5 ቀናት') : '30 ቀናት / Days'}
                </span>
                <span style={{ color: 'var(--terracotta)', fontWeight: 700 }}>
                  {currentEthMonthMeta.nameAm} {selectedEthYear} ዓ.ም.
                </span>
              </div>

              {/* Weekdays Header */}
              <div className="calendar-table">
                <div className="calendar-weekdays-header">
                  {ETHIOPIAN_WEEKDAYS.map((wd) => (
                    <span key={wd.id} title={wd.fullEn}>
                      {language === 'am' ? wd.nameAm : wd.nameEn}
                    </span>
                  ))}
                </div>

                {/* Days Matrix */}
                <div className="calendar-days-matrix">
                  {ethMonthData.rows.map((row, rIdx) => (
                    <div key={rIdx} className="calendar-row">
                      {row.map((cell, cIdx) => {
                        const isSelected = cell.isCurrentMonth && selectedEthDay === cell.day;
                        return (
                          <div
                            key={cIdx}
                            className={`calendar-cell ${!cell.isCurrentMonth ? 'other-month' : ''} ${
                              cell.isFasting ? 'fasting-cell' : ''
                            } ${cell.isCurrentDay ? 'current-day-cell' : ''} ${
                              isSelected ? 'selected-cell' : ''
                            }`}
                            onClick={() => {
                              if (cell.isCurrentMonth) setSelectedEthDay(cell.day);
                            }}
                          >
                            <span className="cell-day-num">{cell.day}</span>
                            {cell.isFasting && <span className="cell-fast-dot" />}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* Calendar Legend */}
              <div className="calendar-legend-box">
                <div className="legend-entry">
                  <span className="legend-indicator-dot peach-dot" />
                  <span>{language === 'am' ? 'የጾም ቀን (Tsom)' : 'Fasting Day (Tsom)'}</span>
                </div>
                <div className="legend-entry">
                  <span className="legend-indicator-dot green-dot" />
                  <span>{language === 'am' ? 'የዛሬ ቀን (Today)' : 'Today'}</span>
                </div>
                <div className="legend-entry">
                  <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--ethiocream-bg)', border: '1px solid #CCC' }} />
                  <span>{language === 'am' ? 'የፍስክ ቀን' : 'Feasting Day'}</span>
                </div>
              </div>
            </div>

            {/* Right Sidebar Column: Day Details */}
            <div className="tsom-sidebar-column">
              <div className="active-fast-detail-card">
                <div className="active-fast-top-badge-row">
                  <span className={`active-fast-badge ${!selectedEthDayInfo.isFasting ? 'non-fast-badge' : ''}`} style={!selectedEthDayInfo.isFasting ? { background: 'var(--forest-green-light)', color: 'var(--forest-green)' } : {}}>
                    {selectedEthDayInfo.isFasting ? (language === 'am' ? 'የጾም ቀን' : 'ACTIVE FAST') : (language === 'am' ? 'የፍስክ ቀን' : 'FEASTING DAY')}
                  </span>
                  <span className="active-fast-icon">{selectedEthDayInfo.icon}</span>
                </div>

                <h3 className="active-fast-title">
                  {language === 'am' ? selectedEthDayInfo.fastNameAm : selectedEthDayInfo.fastNameEn}
                </h3>

                <div style={{ fontSize: '13px', color: 'var(--terracotta)', fontWeight: 700, marginBottom: '14px' }}>
                  📅 {currentEthMonthMeta.nameAm} {selectedEthDay} ቀን {selectedEthYear} ዓ.ም.
                </div>

                <div className="active-fast-metrics">
                  <div className="metric-line">
                    <span className="metric-label">{language === 'am' ? 'የጾም ስርዓት' : 'Dietary Rule'}</span>
                    <span className="metric-value">{selectedEthDayInfo.dietaryRule}</span>
                  </div>
                  <div className="metric-line">
                    <span className="metric-label">{language === 'am' ? 'የማብቂያ ሰዓት' : 'Break-Fast Time'}</span>
                    <span className="metric-value highlight-bold">
                      {selectedEthDayInfo.isFasting ? '3:00 PM (9:00 ሰዓት)' : 'Flexible'}
                    </span>
                  </div>
                  <div className="metric-line">
                    <span className="metric-label">{language === 'am' ? 'ማብራሪያ' : 'Context'}</span>
                    <span className="metric-value" style={{ fontSize: '12px', maxWidth: '60%' }}>
                      {language === 'am' ? selectedEthDayInfo.descriptionAm : selectedEthDayInfo.descriptionEn}
                    </span>
                  </div>
                </div>

                {selectedEthDayInfo.isFasting ? (
                  <button
                    className={`btn-set-reminder ${reminderSet ? 'reminder-active' : ''}`}
                    onClick={() => handleSetReminderAction(language === 'am' ? 'የፍስክ' : 'Break-Fast', '3:00 PM (9:00 ሰዓት)')}
                  >
                    <span className="bell-icon">🔔</span>
                    {reminderSet
                      ? (language === 'am' ? 'ማስታወሻ ለ 9:00 ሰዓት ተይዟል' : 'Reminder Set for 3:00 PM')
                      : (language === 'am' ? 'የፍስክ ማስታወሻ አስቀምጥ' : 'Set Break-Fast Reminder')}
                  </button>
                ) : (
                  <div style={{ padding: '10px 14px', background: 'var(--ethiocream-bg)', borderRadius: '10px', fontSize: '12.5px', color: 'var(--text-medium)', textAlign: 'center' }}>
                    ✨ {language === 'am' ? 'መደበኛ የተመጣጠነ የባህላዊ አመጋገብ ቀን ነው።' : 'Nutritionally balanced regular heritage diet day.'}
                  </div>
                )}
              </div>

              {/* Nutrition Tips */}
              <div className="tsom-nutrition-tips-card">
                <div className="tips-card-header">
                  <span className="tips-shield-icon">🛡️</span>
                  <h4 className="tips-title">
                    {language === 'am' ? 'የጾም ስነ-ምግብ መመሪያዎች' : 'Tsom Nutrition Tips'}
                  </h4>
                </div>

                <div className="tips-list">
                  <div className="tip-item">
                    <div className="tip-icon-circle protein-circle">🥑</div>
                    <div className="tip-text-wrap">
                      <h5 className="tip-heading">{language === 'am' ? 'የእፅዋት ፕሮቲን' : 'Protein Synergy'}</h5>
                      <p className="tip-desc">
                        {language === 'am'
                          ? 'ሽሮ ምጥን እና ምስር ወጥን ከጤፍ እንጀራ ጋር በማጣመር ሙሉ አሚኖ አሲድ ያግኙ።'
                          : 'Combine Shiro (chickpea) and Misir (lentil) with Teff Injera for a complete amino acid profile.'}
                      </p>
                    </div>
                  </div>

                  <div className="tip-item">
                    <div className="tip-icon-circle iron-circle">🥬</div>
                    <div className="tip-text-wrap">
                      <h5 className="tip-heading">{language === 'am' ? 'ብረት እና ቫይታሚን ሲ' : 'Iron Synergy'}</h5>
                      <p className="tip-desc">
                        {language === 'am'
                          ? 'የጎመን ወጥ ወይም ምስር ሲመገቡ ሎሚ ወይም ቲማቲም ሰላጣ በማከል የብረት ንጥረ ነገር ውህደትን ያሳድጉ።'
                          : 'Pair iron-rich Gomen or Misir with fresh lemon juice or tomato salata to maximize non-heme iron absorption.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Canonical Seasons Section */}
          <div className="major-fasting-seasons-section">
            <h3 className="seasons-heading">
              {language === 'am' ? 'ዋና ዋና የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ አጽዋማት' : 'Major Ethiopian Orthodox Fasting Seasons (አጽዋማት)'}
            </h3>
            <div className="seasons-grid">
              {majorOrthodoxFasts.map((fast, idx) => (
                <div key={idx} className="season-card">
                  <div className="season-icon">{fast.icon}</div>
                  <div className="season-info">
                    <h4 className="season-title">{language === 'am' ? fast.amharic : fast.name}</h4>
                    <div className="season-amharic amharic-text">{language === 'am' ? fast.name : fast.amharic}</div>
                    <div className="season-meta">
                      <span>{fast.duration}</span> • <span>{fast.dates}</span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-medium)', marginTop: '4px', lineHeight: 1.3 }}>
                      {fast.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* 2. ISLAMIC / HIJRI VIEW */}
      {/* ========================================================================= */}
      {calendarMode === 'hijri' && (
        <>
          {/* Suhoor & Iftar Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #125238 0%, #1F4B3F 100%)',
            color: '#FFFFFF',
            borderRadius: 'var(--card-radius)',
            padding: '20px 24px',
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            boxShadow: '0 8px 24px rgba(18, 82, 56, 0.15)'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '22px' }}>🌙</span>
                <h3 style={{ fontSize: '18px', fontWeight: 800 }}>
                  {language === 'am' ? 'የዛሬው የሱሁር እና የኢፍጣር ሰዓት' : 'Today’s Suhoor & Iftar Timings'}
                </h3>
              </div>
              <p style={{ fontSize: '13px', opacity: 0.9 }}>
                {livePrayerTimes?.fajr
                  ? `Live Addis Ababa API Timings: Suhoor ends at ${livePrayerTimes.fajr} • Iftar at ${livePrayerTimes.maghrib}`
                  : 'Fajr (Suhoor ends): 5:05 AM • Maghrib (Iftar): 6:35 PM (East Africa Time)'}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '10px 16px', borderRadius: '12px', textAlign: 'center' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Suhoor Ends</span>
                <div style={{ fontSize: '16px', fontWeight: 800 }}>5:05 AM</div>
              </div>
              <div style={{ background: 'rgba(201, 123, 61, 0.4)', padding: '10px 16px', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.3)' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Iftar (Maghrib)</span>
                <div style={{ fontSize: '16px', fontWeight: 800 }}>6:35 PM</div>
              </div>
            </div>
          </div>

          <div className="tsom-calendar-grid">
            {/* Hijri Calendar Card */}
            <div className="tsom-calendar-card">
              {/* Navigation */}
              <div className="calendar-month-nav">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  {/* Hijri Month Selector */}
                  <select
                    className="calendar-month-select"
                    value={selectedHijriMonth}
                    onChange={(e) => {
                      const m = parseInt(e.target.value, 10);
                      setSelectedHijriMonth(m);
                      setSelectedHijriDay(1);
                    }}
                    style={{
                      fontSize: '18px',
                      fontWeight: 800,
                      color: 'var(--forest-green)',
                      background: 'var(--ethiocream-bg)',
                      border: '1px solid rgba(201, 123, 61, 0.2)',
                      borderRadius: '10px',
                      padding: '6px 12px',
                      cursor: 'pointer',
                      outline: 'none',
                      fontFamily: 'inherit'
                    }}
                  >
                    {HIJRI_MONTHS.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.id}. {m.nameEn} ({m.nameAr}) - {m.nameAm} [{m.days} Days]
                      </option>
                    ))}
                  </select>

                  {/* Year Selector */}
                  <select
                    className="calendar-year-select"
                    value={selectedHijriYear}
                    onChange={(e) => setSelectedHijriYear(parseInt(e.target.value, 10))}
                    style={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: 'var(--terracotta)',
                      background: 'var(--ethiocream-bg)',
                      border: '1px solid rgba(201, 123, 61, 0.2)',
                      borderRadius: '10px',
                      padding: '6px 10px',
                      cursor: 'pointer',
                      outline: 'none',
                      fontFamily: 'inherit'
                    }}
                  >
                    {[1446, 1447, 1448, 1449].map((y) => (
                      <option key={y} value={y}>
                        {y} AH (Hijri)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="calendar-nav-arrows">
                  <button className="arrow-btn" onClick={handleHijriPrevMonth} title="Previous Hijri Month">‹</button>
                  <button className="arrow-btn" onClick={handleHijriNextMonth} title="Next Hijri Month">›</button>
                </div>
              </div>

              {/* Subtitle */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', fontSize: '12px', color: 'var(--text-medium)' }}>
                <span style={{ fontWeight: 600 }}>
                  ☪️ {currentHijriMonthMeta.nameAr} • {currentHijriMonthMeta.nameEn} {selectedHijriYear} AH
                </span>
                <span style={{ color: 'var(--terracotta)', fontWeight: 700 }}>
                  {currentHijriMonthMeta.isRamadan ? '🌟 Obligatory Fast (Fard)' : 'Sunnah Fasts Active'}
                </span>
              </div>

              {/* Days Table */}
              <div className="calendar-table">
                <div className="calendar-weekdays-header">
                  {HIJRI_WEEKDAYS.map((wd) => (
                    <span key={wd.id} title={wd.fullEn}>
                      {language === 'am' ? wd.nameAm : wd.nameEn}
                    </span>
                  ))}
                </div>

                <div className="calendar-days-matrix">
                  {hijriMonthData.rows.map((row, rIdx) => (
                    <div key={rIdx} className="calendar-row">
                      {row.map((cell, cIdx) => {
                        const isSelected = cell.isCurrentMonth && selectedHijriDay === cell.day;
                        return (
                          <div
                            key={cIdx}
                            className={`calendar-cell ${!cell.isCurrentMonth ? 'other-month' : ''} ${
                              cell.isFasting ? 'fasting-cell' : ''
                            } ${cell.isCurrentDay ? 'current-day-cell' : ''} ${
                              isSelected ? 'selected-cell' : ''
                            }`}
                            onClick={() => {
                              if (cell.isCurrentMonth) setSelectedHijriDay(cell.day);
                            }}
                          >
                            <span className="cell-day-num">{cell.day}</span>
                            {cell.isFasting && <span className="cell-fast-dot" />}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="calendar-legend-box">
                <div className="legend-entry">
                  <span className="legend-indicator-dot peach-dot" />
                  <span>{language === 'am' ? 'የጾም ቀን (ረመዳን/ሱና)' : 'Fasting (Ramadan / Sunnah)'}</span>
                </div>
                <div className="legend-entry">
                  <span className="legend-indicator-dot green-dot" />
                  <span>{language === 'am' ? 'የዛሬ ቀን' : 'Today'}</span>
                </div>
                <div className="legend-entry">
                  <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--ethiocream-bg)', border: '1px solid #CCC' }} />
                  <span>{language === 'am' ? 'መደበኛ ቀን' : 'Regular Day'}</span>
                </div>
              </div>
            </div>

            {/* Right Islamic Day Detail */}
            <div className="tsom-sidebar-column">
              <div className="active-fast-detail-card">
                <div className="active-fast-top-badge-row">
                  <span className={`active-fast-badge ${!selectedHijriDayInfo.isFasting ? 'non-fast-badge' : ''}`} style={!selectedHijriDayInfo.isFasting ? { background: 'var(--forest-green-light)', color: 'var(--forest-green)' } : {}}>
                    {selectedHijriDayInfo.isFasting ? selectedHijriDayInfo.obligation : 'REGULAR DAY'}
                  </span>
                  <span className="active-fast-icon">{selectedHijriDayInfo.icon}</span>
                </div>

                <h3 className="active-fast-title">
                  {language === 'am' ? selectedHijriDayInfo.titleAm : selectedHijriDayInfo.titleEn}
                </h3>

                <div style={{ fontSize: '13px', color: 'var(--terracotta)', fontWeight: 700, marginBottom: '14px' }}>
                  📅 {selectedHijriDay} {currentHijriMonthMeta.nameEn} {selectedHijriYear} AH
                </div>

                <div className="active-fast-metrics">
                  <div className="metric-line">
                    <span className="metric-label">Suhoor Ends (Fajr)</span>
                    <span className="metric-value highlight-bold">5:05 AM</span>
                  </div>
                  <div className="metric-line">
                    <span className="metric-label">Iftar Time (Maghrib)</span>
                    <span className="metric-value highlight-bold">6:35 PM</span>
                  </div>
                  <div className="metric-line">
                    <span className="metric-label">Rule</span>
                    <span className="metric-value" style={{ fontSize: '12px', maxWidth: '60%' }}>
                      {language === 'am' ? selectedHijriDayInfo.ruleAm : selectedHijriDayInfo.ruleEn}
                    </span>
                  </div>
                </div>

                {selectedHijriDayInfo.isFasting && (
                  <button
                    className={`btn-set-reminder ${reminderSet ? 'reminder-active' : ''}`}
                    onClick={() => handleSetReminderAction('Iftar', '6:35 PM')}
                  >
                    <span className="bell-icon">🔔</span>
                    {reminderSet ? 'Reminder Set for Iftar 6:35 PM' : 'Schedule Iftar & Suhoor Alerts'}
                  </button>
                )}
              </div>

              {/* Islamic Fasting Nutrition Tips */}
              <div className="tsom-nutrition-tips-card">
                <div className="tips-card-header">
                  <span className="tips-shield-icon">🛡️</span>
                  <h4 className="tips-title">Islamic Fasting Nutrition</h4>
                </div>

                <div className="tips-list">
                  <div className="tip-item">
                    <div className="tip-icon-circle protein-circle">🌴</div>
                    <div className="tip-text-wrap">
                      <h5 className="tip-heading">Iftar Sunnah: Dates & Water</h5>
                      <p className="tip-desc">
                        Break your fast with 1-3 dates and water to gently elevate blood glucose before eating Teff injera or soup.
                      </p>
                    </div>
                  </div>

                  <div className="tip-item">
                    <div className="tip-icon-circle b12-circle">🥣</div>
                    <div className="tip-text-wrap">
                      <h5 className="tip-heading">Suhoor Complex Carbohydrates</h5>
                      <p className="tip-desc">
                        Consume slow-digesting oats, barley Genfo, or Teff pancakes at Suhoor with boiled eggs and plenty of water.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Major Islamic Fasting Seasons */}
          <div className="major-fasting-seasons-section">
            <h3 className="seasons-heading">
              {language === 'am' ? 'ዋና ዋና የእስልምና የጾም ወቅቶች' : 'Major Islamic Fasting Seasons & Sunnah Cycles'}
            </h3>
            <div className="seasons-grid">
              {majorIslamicFasts.map((fast, idx) => (
                <div key={idx} className="season-card">
                  <div className="season-icon">{fast.icon}</div>
                  <div className="season-info">
                    <h4 className="season-title">{language === 'am' ? fast.amharic : fast.name}</h4>
                    <div className="season-amharic amharic-text">{fast.arabic}</div>
                    <div className="season-meta">
                      <span>{fast.duration}</span> • <span>{fast.dates}</span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-medium)', marginTop: '4px', lineHeight: 1.3 }}>
                      {fast.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* 3. INTERMITTENT FASTING VIEW (General / None) */}
      {/* ========================================================================= */}
      {calendarMode === 'intermittent' && (
        <div className="intermittent-fasting-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {/* Fasting Timer Card */}
          <div className="tsom-calendar-card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <span className="active-fast-badge">ACTIVE FASTING WINDOW</span>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--forest-green)', marginTop: '6px' }}>
                  {ifProtocol} Protocol Tracker
                </h3>
              </div>

              <select
                value={ifProtocol}
                onChange={(e) => setIfProtocol(e.target.value)}
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: 'var(--terracotta)',
                  background: 'var(--ethiocream-bg)',
                  border: '1px solid rgba(201, 123, 61, 0.25)',
                  borderRadius: '10px',
                  padding: '6px 12px',
                  cursor: 'pointer'
                }}
              >
                <option value="16:8">16:8 (LeanGains)</option>
                <option value="18:6">18:6 (Fat Loss)</option>
                <option value="20:4">20:4 (Warrior Diet)</option>
                <option value="24:0">24h (Monk Fast)</option>
              </select>
            </div>

            {/* Circular Progress Display */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 0' }}>
              <div style={{
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                background: 'conic-gradient(var(--forest-green) 0% 84%, var(--ethiocream-bg) 84% 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(18, 82, 56, 0.12)'
              }}>
                <div style={{
                  width: '144px',
                  height: '144px',
                  borderRadius: '50%',
                  background: 'var(--card-bg)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--forest-green)' }}>13h 30m</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-medium)', textTransform: 'uppercase' }}>Fasted of 16h</span>
                </div>
              </div>

              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-dark)' }}>
                  🍽️ Eating Window Opens at 12:00 PM
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-medium)', marginTop: '4px' }}>
                  Fasting Window Closes at 8:00 PM
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                className="btn-set-reminder reminder-active"
                style={{ width: '100%' }}
                onClick={() => handleSetReminderAction('Eating Window', '12:00 PM')}
              >
                🔔 Eating Window Alert Set
              </button>
            </div>
          </div>

          {/* Intermittent Fasting Nutrition & Hydration Guidance */}
          <div className="tsom-sidebar-column">
            <div className="tsom-nutrition-tips-card">
              <div className="tips-card-header">
                <span className="tips-shield-icon">💧</span>
                <h4 className="tips-title">Intermittent Fasting Principles</h4>
              </div>

              <div className="tips-list">
                <div className="tip-item">
                  <div className="tip-icon-circle protein-circle">☕</div>
                  <div className="tip-text-wrap">
                    <h5 className="tip-heading">Fasting Window Beverage Rules</h5>
                    <p className="tip-desc">
                      During fasting hours, consume only pure water, black Ethiopian Buna (coffee without sugar/milk), or herbal tea.
                    </p>
                  </div>
                </div>

                <div className="tip-item">
                  <div className="tip-icon-circle iron-circle">🍲</div>
                  <div className="tip-text-wrap">
                    <h5 className="tip-heading">First Meal Pacing (Break-Fast)</h5>
                    <p className="tip-desc">
                      Break your fast with easy-to-digest protein and fiber: Shiro with half Teff Injera, fresh Gomen, and adequate water before heavier meals.
                    </p>
                  </div>
                </div>

                <div className="tip-item">
                  <div className="tip-icon-circle b12-circle">⚖️</div>
                  <div className="tip-text-wrap">
                    <h5 className="tip-heading">Electrolyte Balance</h5>
                    <p className="tip-desc">
                      Add a pinch of mineral salt to your water during extended 18+ hour fasting windows to prevent headaches and fatigue.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FastingCalendar;
