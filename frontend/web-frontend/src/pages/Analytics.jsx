import React, { useState } from 'react';
import AlertCard from '../components/ui/AlertCard';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('week'); // 'week', 'month', 'cycle'
  const [chartMetric, setChartMetric] = useState('calories'); // 'calories', 'macros'

  // Weekly data points
  const weeklyTrendData = [
    { day: 'Mon', calories: 1950, protein: 68, carbs: 240, fats: 55, isFasting: false },
    { day: 'Tue', calories: 2050, protein: 72, carbs: 250, fats: 58, isFasting: false },
    { day: 'Wed', calories: 1240, protein: 45, carbs: 180, fats: 32, isFasting: true }, // Fasting
    { day: 'Thu', calories: 1890, protein: 65, carbs: 230, fats: 50, isFasting: false },
    { day: 'Fri', calories: 1350, protein: 48, carbs: 190, fats: 35, isFasting: true }, // Fasting
    { day: 'Sat', calories: 2100, protein: 75, carbs: 260, fats: 60, isFasting: false },
    { day: 'Sun', calories: 2020, protein: 70, carbs: 245, fats: 58, isFasting: false },
  ];

  const maxCal = 2400;

  return (
    <div className="analytics-page-container">
      {/* Top Header Controls */}
      <div className="analytics-header-row">
        <div>
          <h2 className="analytics-page-heading">Nutrition Analytics</h2>
          <p className="analytics-page-sub">
            Track historical intake trends, fasting adherence, and micronutrient balance
          </p>
        </div>

        {/* Date Range Selector Toggle Pill */}
        <div className="range-selector-pill">
          <button
            className={`range-pill-btn ${timeRange === 'week' ? 'active' : ''}`}
            onClick={() => setTimeRange('week')}
          >
            Week
          </button>
          <button
            className={`range-pill-btn ${timeRange === 'month' ? 'active' : ''}`}
            onClick={() => setTimeRange('month')}
          >
            Month
          </button>
          <button
            className={`range-pill-btn ${timeRange === 'cycle' ? 'active' : ''}`}
            onClick={() => setTimeRange('cycle')}
          >
            Fasting Cycle
          </button>
        </div>
      </div>

      {/* Row of 4 Summary Stat Cards */}
      <div className="analytics-stats-grid">
        <div className="analytics-stat-card">
          <div className="stat-card-top">
            <span className="stat-dot green-dot"></span>
            <span className="stat-label">Daily Avg Calories</span>
          </div>
          <div className="stat-main-num">
            1,820 <span className="stat-unit">kcal</span>
          </div>
          <div className="stat-progress-bar">
            <div className="stat-fill green-fill" style={{ width: '86%' }} />
          </div>
          <div className="stat-footer-text">🎯 Target: 2,100 kcal (-13% on Tsom)</div>
        </div>

        <div className="analytics-stat-card">
          <div className="stat-card-top">
            <span className="stat-dot orange-dot"></span>
            <span className="stat-label">Avg Protein Intake</span>
          </div>
          <div className="stat-main-num">
            58 <span className="stat-unit">g / day</span>
          </div>
          <div className="stat-progress-bar">
            <div className="stat-fill orange-fill" style={{ width: '92%' }} />
          </div>
          <div className="stat-footer-text">🌱 Plant-based source: 65%</div>
        </div>

        <div className="analytics-stat-card">
          <div className="stat-card-top">
            <span className="stat-dot blue-dot"></span>
            <span className="stat-label">Hydration Streak</span>
          </div>
          <div className="stat-main-num">
            6 <span className="stat-unit">Days</span>
          </div>
          <div className="stat-progress-bar">
            <div className="stat-fill blue-fill" style={{ width: '85%' }} />
          </div>
          <div className="stat-footer-text">💧 Daily Avg: 2.3L</div>
        </div>

        <div className="analytics-stat-card">
          <div className="stat-card-top">
            <span className="stat-dot purple-dot"></span>
            <span className="stat-label">Fasting Adherence</span>
          </div>
          <div className="stat-main-num">
            94<span className="stat-unit">%</span>
          </div>
          <div className="stat-progress-bar">
            <div className="stat-fill purple-fill" style={{ width: '94%' }} />
          </div>
          <div className="stat-footer-text">🌿 8 of 8 Tsom days strictly observed</div>
        </div>
      </div>

      {/* 2-Column Trends & Fasting Comparison Grid */}
      <div className="analytics-charts-grid">
        {/* Left Column: Calorie & Macro Trend Interactive Chart */}
        <div className="chart-card-box">
          <div className="chart-card-header">
            <div>
              <h3 className="chart-card-title">Calorie & Macro Trends</h3>
              <p className="chart-card-sub">Daily intake pattern with Wednesday / Friday fasting indicators</p>
            </div>
            <div className="chart-metric-toggles">
              <button
                className={`chart-subtab ${chartMetric === 'calories' ? 'active' : ''}`}
                onClick={() => setChartMetric('calories')}
              >
                Calories
              </button>
              <button
                className={`chart-subtab ${chartMetric === 'macros' ? 'active' : ''}`}
                onClick={() => setChartMetric('macros')}
              >
                Macros
              </button>
            </div>
          </div>

          {/* Custom SVG / Bar Visualizer */}
          <div className="chart-body-visualizer">
            <div className="chart-bars-container">
              {weeklyTrendData.map((d, index) => {
                const heightPercent = Math.round((d.calories / maxCal) * 100);
                return (
                  <div key={index} className="chart-bar-column">
                    <div className="chart-bar-value-tooltip">
                      {chartMetric === 'calories' ? `${d.calories} kcal` : `P:${d.protein}g C:${d.carbs}g`}
                    </div>

                    <div className="bar-track">
                      {chartMetric === 'calories' ? (
                        <div
                          className={`bar-fill-calories ${d.isFasting ? 'fasting-bar' : 'regular-bar'}`}
                          style={{ height: `${heightPercent}%` }}
                        />
                      ) : (
                        <div className="bar-stacked-macros" style={{ height: `${heightPercent}%` }}>
                          <div style={{ height: '25%', backgroundColor: '#1F4B3F' }} title="Protein" />
                          <div style={{ height: '55%', backgroundColor: '#A8571E' }} title="Carbs" />
                          <div style={{ height: '20%', backgroundColor: '#D9A779' }} title="Fats" />
                        </div>
                      )}
                    </div>

                    <div className="chart-day-label">
                      <span className="day-name">{d.day}</span>
                      {d.isFasting && <span className="fasting-dot" title="Tsom Day">🌱</span>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Target line indicator */}
            <div className="chart-target-line" style={{ bottom: '70%' }}>
              <span className="target-badge">Daily Goal (2,100 kcal)</span>
            </div>
          </div>

          {/* Legend */}
          <div className="chart-legend-row">
            <div className="legend-item">
              <span className="legend-box green-box" /> Non-Fasting Days
            </div>
            <div className="legend-item">
              <span className="legend-box terracotta-box" /> Wednesday / Friday Fast (Tsom)
            </div>
            <div className="legend-item">
              <span className="legend-line" /> Calorie Target Line
            </div>
          </div>
        </div>

        {/* Right Column: Fasting vs Non-Fasting Comparison */}
        <div className="comparison-card-box">
          <h3 className="chart-card-title">Fasting vs Non-Fasting Impact</h3>
          <p className="chart-card-sub">Nutrient shift during Orthodox fasting traditions</p>

          <div className="comparison-metric-rows">
            <div className="comp-row">
              <div className="comp-label-wrap">
                <span className="comp-title">Average Calories</span>
                <span className="comp-diff">-32% on Tsom</span>
              </div>
              <div className="comp-double-bars">
                <div className="comp-bar-item">
                  <span className="bar-name">Regular</span>
                  <div className="bar-bg"><div className="bar-fg regular" style={{ width: '85%' }}>2,020 kcal</div></div>
                </div>
                <div className="comp-bar-item">
                  <span className="bar-name">Tsom</span>
                  <div className="bar-bg"><div className="bar-fg tsom" style={{ width: '58%' }}>1,295 kcal</div></div>
                </div>
              </div>
            </div>

            <div className="comp-row">
              <div className="comp-label-wrap">
                <span className="comp-title">Protein Sources</span>
                <span className="comp-diff">100% Plant Legumes</span>
              </div>
              <div className="comp-double-bars">
                <div className="comp-bar-item">
                  <span className="bar-name">Regular</span>
                  <div className="bar-bg"><div className="bar-fg regular" style={{ width: '70%' }}>Poultry & Eggs</div></div>
                </div>
                <div className="comp-bar-item">
                  <span className="bar-name">Tsom</span>
                  <div className="bar-bg"><div className="bar-fg tsom" style={{ width: '60%' }}>Shiro & Misir</div></div>
                </div>
              </div>
            </div>

            <div className="comp-row">
              <div className="comp-label-wrap">
                <span className="comp-title">Fiber & Prebiotics</span>
                <span className="comp-diff">+45% on Tsom</span>
              </div>
              <div className="comp-double-bars">
                <div className="comp-bar-item">
                  <span className="bar-name">Regular</span>
                  <div className="bar-bg"><div className="bar-fg regular" style={{ width: '55%' }}>22g</div></div>
                </div>
                <div className="comp-bar-item">
                  <span className="bar-name">Tsom</span>
                  <div className="bar-bg"><div className="bar-fg tsom" style={{ width: '90%' }}>38g (Teff)</div></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick takeaway badge */}
          <div className="comp-takeaway-banner">
            <span className="takeaway-icon">💡</span>
            <span className="takeaway-text">
              <strong>Fasting Insight:</strong> Your fiber intake is highest on fasting days thanks to Teff Injera, but iron absorption dips without citrus pairings.
            </span>
          </div>
        </div>
      </div>

      {/* Nutrient Deficiency Alert Card */}
      <div className="analytics-deficiency-section">
        <AlertCard
          title="Nutrient Deficiency Pattern: Iron & Vitamin B12 Gaps Detected"
          description="Analysis of the last 14 days shows that during 100% plant-based Tsom cycles, your daily iron intake falls 35% below the recommended 18mg daily value. Consider pairing Misir Wat with citrus-infused salad and utilizing B12 fortified foods."
          actionText="Generate Iron-Optimized Fasting Plan"
          onActionClick={() => {}}
        />
      </div>
    </div>
  );
};

export default Analytics;
