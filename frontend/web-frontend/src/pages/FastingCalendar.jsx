import React, { useState } from 'react';
import { useNutrition } from '../context/NutritionContext';

const FastingCalendar = () => {
  const { fastingCycle } = useNutrition();
  const [selectedDay, setSelectedDay] = useState(11);
  const [reminderSet, setReminderSet] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Calendar dates matrix for October 2023 (as shown in reference image 2)
  const calendarRows = [
    [
      { day: 25, isCurrentMonth: false },
      { day: 26, isCurrentMonth: false },
      { day: 27, isCurrentMonth: false, isFasting: true },
      { day: 28, isCurrentMonth: false },
      { day: 29, isCurrentMonth: false, isFasting: true },
      { day: 30, isCurrentMonth: false },
      { day: 1, isCurrentMonth: true },
    ],
    [
      { day: 2, isCurrentMonth: true },
      { day: 3, isCurrentMonth: true },
      { day: 4, isCurrentMonth: true, isFasting: true },
      { day: 5, isCurrentMonth: true },
      { day: 6, isCurrentMonth: true, isFasting: true },
      { day: 7, isCurrentMonth: true },
      { day: 8, isCurrentMonth: true },
    ],
    [
      { day: 9, isCurrentMonth: true },
      { day: 10, isCurrentMonth: true },
      { day: 11, isCurrentMonth: true, isFasting: true, isCurrentDay: true },
      { day: 12, isCurrentMonth: true },
      { day: 13, isCurrentMonth: true, isFasting: true },
      { day: 14, isCurrentMonth: true },
      { day: 15, isCurrentMonth: true },
    ],
    [
      { day: 16, isCurrentMonth: true },
      { day: 17, isCurrentMonth: true },
      { day: 18, isCurrentMonth: true, isFasting: true },
      { day: 19, isCurrentMonth: true },
      { day: 20, isCurrentMonth: true, isFasting: true },
      { day: 21, isCurrentMonth: true },
      { day: 22, isCurrentMonth: true },
    ],
    [
      { day: 23, isCurrentMonth: true },
      { day: 24, isCurrentMonth: true },
      { day: 25, isCurrentMonth: true, isFasting: true },
      { day: 26, isCurrentMonth: true },
      { day: 27, isCurrentMonth: true, isFasting: true },
      { day: 28, isCurrentMonth: true },
      { day: 29, isCurrentMonth: true },
    ],
  ];

  const handleSetReminder = () => {
    setReminderSet(true);
    setToastMsg('⏰ Break-Fast reminder scheduled for 3:00 PM (9 ሰዓት)!');
    setTimeout(() => setToastMsg(''), 4000);
  };

  const majorFasts = [
    { name: 'Abiy Tsom (Great Lent)', amharic: 'አቢይ ፆም', duration: '55 Days', dates: 'Feb 19 - Apr 15', icon: '🕊️' },
    { name: 'Tsome Hawaryat (Apostles Fast)', amharic: 'የሐዋርያት ፆም', duration: '14-44 Days', dates: 'June 5 - July 12', icon: '📜' },
    { name: 'Tsome Filseta (Assumption)', amharic: 'የፍልሰታ ፆም', duration: '16 Days', dates: 'Aug 7 - Aug 22', icon: '✨' },
    { name: 'Tsome Nebiyat (Prophets Fast)', amharic: 'የነቢያት ፆም (ገና)', duration: '43 Days', dates: 'Nov 25 - Jan 6', icon: '🕯️' },
  ];

  return (
    <div className="fasting-calendar-page">
      {/* Toast */}
      {toastMsg && (
        <div className="app-toast-alert">
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Page Heading */}
      <div className="tsom-page-header">
        <h1 className="tsom-main-heading">Tsom Calendar</h1>
        <p className="tsom-main-sub">
          Manage your fasting schedule and maintain optimal nutrition.
        </p>
      </div>

      {/* Main Grid: Calendar Table on Left, Details & Tips on Right */}
      <div className="tsom-calendar-grid">
        {/* Left Column: Month Matrix */}
        <div className="tsom-calendar-card">
          <div className="calendar-month-nav">
            <h3 className="calendar-month-name">October 2023</h3>
            <div className="calendar-nav-arrows">
              <button className="arrow-btn">‹</button>
              <button className="arrow-btn">›</button>
            </div>
          </div>

          <div className="calendar-table">
            <div className="calendar-weekdays-header">
              <span>MON</span>
              <span>TUE</span>
              <span>WED</span>
              <span>THU</span>
              <span>FRI</span>
              <span>SAT</span>
              <span>SUN</span>
            </div>

            <div className="calendar-days-matrix">
              {calendarRows.map((row, rIdx) => (
                <div key={rIdx} className="calendar-row">
                  {row.map((cell, cIdx) => {
                    const isSelected = selectedDay === cell.day && cell.isCurrentMonth;
                    return (
                      <div
                        key={cIdx}
                        className={`calendar-cell ${!cell.isCurrentMonth ? 'other-month' : ''} ${
                          cell.isFasting ? 'fasting-cell' : ''
                        } ${cell.isCurrentDay ? 'current-day-cell' : ''} ${
                          isSelected ? 'selected-cell' : ''
                        }`}
                        onClick={() => cell.isCurrentMonth && setSelectedDay(cell.day)}
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
              <span>Wednesday/Friday Fast (ረቡዕ እና አርብ ፆም)</span>
            </div>
            <div className="legend-entry">
              <span className="legend-indicator-dot green-dot" />
              <span>Current Day</span>
            </div>
          </div>
        </div>

        {/* Right Column: Active Fast & Tsom Nutrition Tips */}
        <div className="tsom-sidebar-column">
          {/* Active Fast Card (Screenshot 2) */}
          <div className="active-fast-detail-card">
            <div className="active-fast-top-badge-row">
              <span className="active-fast-badge">ACTIVE FAST</span>
              <span className="active-fast-icon">⏳</span>
            </div>

            <h3 className="active-fast-title">
              Wednesday Fast <span className="active-fast-amharic amharic-text">የረቡዕ ፆም</span>
            </h3>

            <div className="active-fast-metrics">
              <div className="metric-line">
                <span className="metric-label">Fasting Ends</span>
                <span className="metric-value highlight-bold">3:00 PM (9 ሰዓት)</span>
              </div>
              <div className="metric-line">
                <span className="metric-label">Dietary Rule</span>
                <span className="metric-value">Strict Vegan</span>
              </div>
            </div>

            <button
              className={`btn-set-reminder ${reminderSet ? 'reminder-active' : ''}`}
              onClick={handleSetReminder}
            >
              <span className="bell-icon">🔔</span>
              {reminderSet ? 'Reminder Set for 3:00 PM' : 'Set Break-Fast Reminder'}
            </button>
          </div>

          {/* Tsom Nutrition Tips Card (Screenshot 2) */}
          <div className="tsom-nutrition-tips-card">
            <div className="tips-card-header">
              <span className="tips-shield-icon">🛡️</span>
              <h4 className="tips-title">Tsom Nutrition Tips</h4>
            </div>

            <div className="tips-list">
              <div className="tip-item">
                <div className="tip-icon-circle protein-circle">🥑</div>
                <div className="tip-text-wrap">
                  <h5 className="tip-heading">Protein Focus</h5>
                  <p className="tip-desc">
                    Combine Shiro (chickpeas) with Injera (teff) for a complete amino acid profile today.
                  </p>
                </div>
              </div>

              <div className="tip-item">
                <div className="tip-icon-circle b12-circle">💊</div>
                <div className="tip-text-wrap">
                  <h5 className="tip-heading">B12 Reminder</h5>
                  <p className="tip-desc">
                    Extended fasting requires B12 supplementation. Consider fortified plant milks or a supplement.
                  </p>
                </div>
              </div>

              <div className="tip-item">
                <div className="tip-icon-circle iron-circle">🥬</div>
                <div className="tip-text-wrap">
                  <h5 className="tip-heading">Iron Synergy</h5>
                  <p className="tip-desc">
                    Pair iron-rich Gomen with fresh lemon or tomato salata to amplify non-heme iron absorption.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Major Orthodox Fasting Seasons Banner List */}
      <div className="major-fasting-seasons-section">
        <h3 className="seasons-heading">Major Ethiopian Orthodox Fasting Seasons (አጽዋማት)</h3>
        <div className="seasons-grid">
          {majorFasts.map((fast, idx) => (
            <div key={idx} className="season-card">
              <div className="season-icon">{fast.icon}</div>
              <div className="season-info">
                <h4 className="season-title">{fast.name}</h4>
                <div className="season-amharic amharic-text">{fast.amharic}</div>
                <div className="season-meta">
                  <span>{fast.duration}</span> • <span>{fast.dates}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FastingCalendar;
