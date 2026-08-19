import React, { useState, useEffect } from 'react';
import { useNutrition } from '../context/NutritionContext';
import apiClient from '../services/apiClient';

const FastingCalendar = () => {
  const { fastingCycle } = useNutrition();
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [reminderSet, setReminderSet] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [calendarRows, setCalendarRows] = useState([]);
  const [currentMonthName, setCurrentMonthName] = useState('');

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        setCurrentMonthName(today.toLocaleString('default', { month: 'long', year: 'numeric' }));
        
        const res = await apiClient.get(`/fasting-calendar?month=${year}-${month}`);
        // Response is an array of {date, isFastingDay, cycleName}
        // Group into 7-day rows
        const data = res.data;
        const rows = [];
        let currentRow = [];
        
        // Pad beginning of month
        const firstDay = new Date(year, month - 1, 1).getDay();
        const padDays = (firstDay === 0 ? 6 : firstDay - 1);
        for(let i=0; i<padDays; i++) {
          currentRow.push({ day: '', isCurrentMonth: false });
        }

        data.forEach(d => {
          const dayNum = parseInt(d.date.split('-')[2]);
          currentRow.push({
            day: dayNum,
            isCurrentMonth: true,
            isFasting: d.isFastingDay,
            isCurrentDay: dayNum === today.getDate()
          });
          if (currentRow.length === 7) {
            rows.push(currentRow);
            currentRow = [];
          }
        });

        if (currentRow.length > 0) {
          while (currentRow.length < 7) {
            currentRow.push({ day: '', isCurrentMonth: false });
          }
          rows.push(currentRow);
        }

        setCalendarRows(rows);
      } catch (err) {
        console.error("Failed to fetch calendar", err);
      }
    };
    fetchCalendar();
  }, []);

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
      {toastMsg && (
        <div className="app-toast-alert">
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="tsom-page-header">
        <h1 className="tsom-main-heading">Tsom Calendar</h1>
        <p className="tsom-main-sub">
          Manage your fasting schedule and maintain optimal nutrition.
        </p>
      </div>

      <div className="tsom-calendar-grid">
        <div className="tsom-calendar-card">
          <div className="calendar-month-nav">
            <h3 className="calendar-month-name">{currentMonthName}</h3>
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

          <div className="calendar-legend-box">
            <div className="legend-entry">
              <span className="legend-indicator-dot peach-dot" />
              <span>Fasting Day (ፆም)</span>
            </div>
            <div className="legend-entry">
              <span className="legend-indicator-dot green-dot" />
              <span>Current Day</span>
            </div>
          </div>
        </div>

        <div className="tsom-sidebar-column">
          <div className="active-fast-detail-card">
            <div className="active-fast-top-badge-row">
              <span className="active-fast-badge">ACTIVE FAST</span>
              <span className="active-fast-icon">⏳</span>
            </div>

            <h3 className="active-fast-title">
              {fastingCycle.title || 'Wednesday Fast'} <span className="active-fast-amharic amharic-text">{fastingCycle.amharicTitle}</span>
            </h3>

            <div className="active-fast-metrics">
              <div className="metric-line">
                <span className="metric-label">Fasting Ends</span>
                <span className="metric-value highlight-bold">3:00 PM (9 ሰዓት)</span>
              </div>
              <div className="metric-line">
                <span className="metric-label">Dietary Rule</span>
                <span className="metric-value">{fastingCycle.description || 'Strict Vegan'}</span>
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
