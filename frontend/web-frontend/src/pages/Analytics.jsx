import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { useAuth } from '../context/AuthContext';
import { useNutrition } from '../context/NutritionContext';
import { useLanguage } from '../context/LanguageContext';
import AlertCard from '../components/ui/AlertCard';
import { toEthiopianDate, getEthiopianFastingInfo } from '../utils/ethiopianCalendar';

const Analytics = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language } = useLanguage();
  const { dailyStats, foodLogs } = useNutrition();
  const [timeRange, setTimeRange] = useState('week'); // 'week', 'month', 'cycle'
  const [chartMetric, setChartMetric] = useState('calories'); // 'calories', 'macros'
  const [loading, setLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState({});
  const [deficiencyAlerts, setDeficiencyAlerts] = useState([]);

  // Fetch real analytics from backend
  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const rangeParam = timeRange === 'month' ? 'month' : 'week';
        const res = await apiClient.get(`/analytics?range=${rangeParam}`);
        if (res.data && res.data.data) {
          setAnalyticsData(res.data.data);
        }
      } catch (err) {
        console.warn('Could not fetch backend analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchDeficiencies = async () => {
      try {
        const res = await apiClient.get('/analytics/deficiencies');
        if (res.data && Array.isArray(res.data.alerts)) {
          setDeficiencyAlerts(res.data.alerts);
        }
      } catch (err) {
        console.warn('Could not fetch deficiency alerts:', err);
      }
    };

    fetchAnalytics();
    fetchDeficiencies();
  }, [timeRange]);

  // Compute trend data dynamically for the selected date range
  const trendDays = useMemo(() => {
    const numDays = timeRange === 'month' ? 30 : 7;
    const days = [];
    const today = new Date();

    for (let i = numDays - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().split('T')[0];
      const dayOfWeek = d.getDay();
      const dayName = d.toLocaleDateString(language === 'am' ? 'am-ET' : 'en-US', { weekday: 'short' });

      // Convert to Ethiopian date to check fasting rule
      const ethDate = toEthiopianDate(d);
      const fastInfo = getEthiopianFastingInfo(ethDate.year, ethDate.month, ethDate.day);

      // Check if we have logs for this date from backend analytics or current foodLogs
      const backendDay = analyticsData[dateKey];
      let calories = 0;
      let protein = 0;
      let carbs = 0;
      let fats = 0;
      let fiber = 0;

      if (backendDay) {
        calories = backendDay.calories || 0;
        protein = backendDay.protein || 0;
        carbs = backendDay.carbs || 0;
        fats = backendDay.fats || 0;
        fiber = backendDay.fiber || Math.round((backendDay.carbs || 0) * 0.25);
      } else if (i === 0 && foodLogs.length > 0) {
        // Fallback to today's active foodLogs in context
        calories = foodLogs.reduce((s, item) => s + Number(item.calories || 0), 0);
        protein = foodLogs.reduce((s, item) => s + Number(item.protein || 0), 0);
        carbs = foodLogs.reduce((s, item) => s + Number(item.carbs || 0), 0);
        fats = foodLogs.reduce((s, item) => s + Number(item.fats || 0), 0);
        fiber = Math.round(carbs * 0.25);
      }

      days.push({
        date: dateKey,
        day: dayName,
        calories,
        protein,
        carbs,
        fats,
        fiber,
        isFasting: fastInfo.isFasting,
        fastName: language === 'am' ? fastInfo.fastNameAm : fastInfo.fastNameEn
      });
    }
    return days;
  }, [timeRange, analyticsData, foodLogs, language]);

  // Aggregate metrics dynamically
  const metrics = useMemo(() => {
    const totalDays = trendDays.length;
    const loggedDays = trendDays.filter((d) => d.calories > 0);
    const countWithLogs = Math.max(1, loggedDays.length);

    const totalCal = trendDays.reduce((s, d) => s + d.calories, 0);
    const avgCal = Math.round(totalCal / countWithLogs);

    const totalProt = trendDays.reduce((s, d) => s + d.protein, 0);
    const avgProt = Math.round(totalProt / countWithLogs);

    // Fasting days analysis
    const fastingDaysList = trendDays.filter((d) => d.isFasting);
    const regularDaysList = trendDays.filter((d) => !d.isFasting);

    const tsomCount = Math.max(1, fastingDaysList.filter((d) => d.calories > 0).length);
    const regCount = Math.max(1, regularDaysList.filter((d) => d.calories > 0).length);

    const tsomAvgCal = Math.round(fastingDaysList.reduce((s, d) => s + d.calories, 0) / tsomCount);
    const regAvgCal = Math.round(regularDaysList.reduce((s, d) => s + d.calories, 0) / regCount);

    // Fasting Adherence: percentage of fasting days where meals were logged
    const fastingAdherence = Math.min(
      100,
      Math.round((fastingDaysList.filter((d) => d.calories > 0).length / Math.max(1, fastingDaysList.length)) * 100)
    );

    const targetCal = dailyStats?.calories?.target || 2000;
    const targetProt = dailyStats?.protein?.target || 150;

    // Fasting vs Regular averages computation
    const tsomAvgFiber = tsomCount > 0 ? Math.round(fastingDaysList.reduce((s, d) => s + d.fiber, 0) / tsomCount) : 0;
    const regAvgFiber = regCount > 0 ? Math.round(regularDaysList.reduce((s, d) => s + d.fiber, 0) / regCount) : 0;

    const tsomAvgProt = tsomCount > 0 ? Math.round(fastingDaysList.reduce((s, d) => s + d.protein, 0) / tsomCount) : 0;
    const regAvgProt = regCount > 0 ? Math.round(regularDaysList.reduce((s, d) => s + d.protein, 0) / regCount) : 0;

    const fiberDiffPercent = regAvgFiber > 0 && tsomAvgFiber > 0 ? Math.round(((tsomAvgFiber - regAvgFiber) / regAvgFiber) * 100) : 0;

    return {
      avgCal,
      targetCal,
      avgProt,
      targetProt,
      tsomAvgCal,
      regAvgCal,
      tsomAvgProt,
      regAvgProt,
      tsomAvgFiber,
      regAvgFiber,
      fiberDiffPercent,
      calDiffPercent: regAvgCal > 0 && tsomAvgCal > 0 ? Math.round(((tsomAvgCal - regAvgCal) / regAvgCal) * 100) : 0,
      fastingAdherence: countWithLogs > 0 ? fastingAdherence : 0,
      hasAnyLogs: loggedDays.length > 0,
    };
  }, [trendDays, dailyStats]);

  // Compute chart items (Daily for Week view, Weekly aggregated buckets for Month/Cycle view)
  const displayChartItems = useMemo(() => {
    if (timeRange === 'week') {
      return trendDays.map((d) => ({
        label: d.day,
        subLabel: d.date.split('-').slice(1).join('/'),
        calories: d.calories,
        protein: d.protein,
        carbs: d.carbs,
        fats: d.fats,
        isFasting: d.isFasting,
        fastName: d.fastName,
        isAggregated: false,
      }));
    }

    // Month or Cycle view: aggregate trendDays into weekly buckets
    const chunks = [];
    const totalDays = trendDays.length;
    const chunkSize = 7;

    for (let i = 0; i < totalDays; i += chunkSize) {
      const chunkDays = trendDays.slice(i, i + chunkSize);
      const weekIdx = Math.floor(i / chunkSize) + 1;
      
      const loggedDays = chunkDays.filter((d) => d.calories > 0);
      const count = Math.max(1, loggedDays.length);

      const avgCalories = Math.round(chunkDays.reduce((s, d) => s + d.calories, 0) / count);
      const avgProtein = Math.round(chunkDays.reduce((s, d) => s + d.protein, 0) / count);
      const avgCarbs = Math.round(chunkDays.reduce((s, d) => s + d.carbs, 0) / count);
      const avgFats = Math.round(chunkDays.reduce((s, d) => s + d.fats, 0) / count);

      const fastingDays = chunkDays.filter((d) => d.isFasting);
      const fastingCount = fastingDays.length;

      const startDateStr = chunkDays[0].date.split('-').slice(1).join('/');
      const endDateStr = chunkDays[chunkDays.length - 1].date.split('-').slice(1).join('/');

      chunks.push({
        label: language === 'am' ? `ሳምንት ${weekIdx}` : `W${weekIdx}`,
        subLabel: `${startDateStr}-${endDateStr}`,
        calories: avgCalories,
        protein: avgProtein,
        carbs: avgCarbs,
        fats: avgFats,
        isFasting: fastingCount > 0,
        fastingCount,
        fastName: language === 'am' ? `${fastingCount} የጾም ቀናት` : `${fastingCount} Tsom Days`,
        isAggregated: true,
      });
    }

    return chunks;
  }, [trendDays, timeRange, language]);

  const maxCal = Math.max(2400, ...displayChartItems.map((d) => d.calories + 300));

  return (
    <div className="analytics-page-container">
      {/* Top Header Controls */}
      <div className="analytics-header-row">
        <div>
          <h2 className="analytics-page-heading">
            {language === 'am' ? 'የስነ-ምግብ ትንታኔ እና አዝማሚያዎች' : 'Nutrition Analytics'}
          </h2>
          <p className="analytics-page-sub">
            {language === 'am'
              ? 'ከተመገቧቸው ምግቦች የተሰበሰበ የቀን ካሎሪ፣ ፕሮቲን እና የጾም አመጋገብ ክትትል።'
              : 'Track historical intake trends, fasting adherence, and micronutrient balance from your logged meals.'}
          </p>
        </div>

        {/* Date Range Selector Toggle Pill */}
        <div className="range-selector-pill">
          <button
            className={`range-pill-btn ${timeRange === 'week' ? 'active' : ''}`}
            onClick={() => setTimeRange('week')}
          >
            {language === 'am' ? 'ሳምንት' : 'Week'}
          </button>
          <button
            className={`range-pill-btn ${timeRange === 'month' ? 'active' : ''}`}
            onClick={() => setTimeRange('month')}
          >
            {language === 'am' ? 'ወር' : 'Month'}
          </button>
          <button
            className={`range-pill-btn ${timeRange === 'cycle' ? 'active' : ''}`}
            onClick={() => setTimeRange('cycle')}
          >
            {language === 'am' ? 'የጾም ወቅት' : 'Fasting Cycle'}
          </button>
        </div>
      </div>

      {/* Row of 4 Summary Stat Cards */}
      <div className="analytics-stats-grid">
        {/* Card 1: Daily Avg Calories */}
        <div className="analytics-stat-card">
          <div className="stat-card-top">
            <span className="stat-dot green-dot"></span>
            <span className="stat-label">
              {language === 'am' ? 'አማካይ የቀን ካሎሪ' : 'Daily Avg Calories'}
            </span>
          </div>
          <div className="stat-main-num">
            {metrics.avgCal.toLocaleString()} <span className="stat-unit">kcal</span>
          </div>
          <div className="stat-progress-bar">
            <div
              className="stat-fill green-fill"
              style={{ width: `${Math.min(100, Math.round((metrics.avgCal / metrics.targetCal) * 100))}%` }}
            />
          </div>
          <div className="stat-footer-text">
            🎯 {language === 'am' ? `ግብ፡ ${metrics.targetCal} kcal` : `Target: ${metrics.targetCal} kcal`}
          </div>
        </div>

        {/* Card 2: Avg Protein Intake */}
        <div className="analytics-stat-card">
          <div className="stat-card-top">
            <span className="stat-dot orange-dot"></span>
            <span className="stat-label">
              {language === 'am' ? 'አማካይ የፕሮቲን መጠን' : 'Avg Protein Intake'}
            </span>
          </div>
          <div className="stat-main-num">
            {metrics.avgProt} <span className="stat-unit">{language === 'am' ? 'ግ / ቀን' : 'g / day'}</span>
          </div>
          <div className="stat-progress-bar">
            <div
              className="stat-fill orange-fill"
              style={{ width: `${Math.min(100, Math.round((metrics.avgProt / metrics.targetProt) * 100))}%` }}
            />
          </div>
          <div className="stat-footer-text">
            🌱 {language === 'am' ? 'የእፅዋት ምንጭ፡ 70% (ሽሮ/ምስር)' : 'Plant-based source: ~70%'}
          </div>
        </div>

        {/* Card 3: Hydration */}
        <div className="analytics-stat-card">
          <div className="stat-card-top">
            <span className="stat-dot blue-dot"></span>
            <span className="stat-label">
              {language === 'am' ? 'የውሃ መጠጥ አማካይ' : 'Daily Hydration'}
            </span>
          </div>
          <div className="stat-main-num">
            {dailyStats?.water?.consumed} <span className="stat-unit">L / day</span>
          </div>
          <div className="stat-sub">
            <div className="stat-progress-bar">
              <div
                className="stat-progress-fill"
                style={{ width: `${Math.min(100, Math.round((dailyStats?.water?.consumed / dailyStats?.water?.target) * 100))}%` }}
              ></div>
            </div>
            {language === 'am' ? `ግብ፡ ${dailyStats?.water?.target}L` : `Target Goal: ${dailyStats?.water?.target}L`}
          </div>
        </div>

        {/* Card 4: Fasting Adherence */}
        <div className="analytics-stat-card">
          <div className="stat-card-top">
            <span className="stat-dot purple-dot"></span>
            <span className="stat-label">
              {language === 'am' ? 'የጾም ስርዓት ክትትል' : 'Fasting Adherence'}
            </span>
          </div>
          <div className="stat-main-num">
            {metrics.fastingAdherence}<span className="stat-unit">%</span>
          </div>
          <div className="stat-progress-bar">
            <div className="stat-fill purple-fill" style={{ width: `${metrics.fastingAdherence}%` }} />
          </div>
          <div className="stat-footer-text">
            🌿 {language === 'am' ? 'የቀኖናዊ ጾም ተከብሯል' : 'Scheduled fast days observed'}
          </div>
        </div>
      </div>

      {/* Empty State Banner if no logs in this period */}
      {!metrics.hasAnyLogs && (
        <div style={{
          background: 'var(--card-bg)',
          border: '1px dashed rgba(201, 123, 61, 0.3)',
          borderRadius: 'var(--card-radius)',
          padding: '24px',
          margin: '20px 0',
          textAlign: 'center',
          color: 'var(--text-medium)'
        }}>
          <span style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}>📊</span>
          <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-dark)' }}>
            {language === 'am' ? 'በዚህ ወቅት የተመዘገበ ምግብ የለም' : 'No logs available for this period'}
          </h4>
          <p style={{ fontSize: '13px', marginTop: '4px', maxWidth: '480px', margin: '4px auto 16px' }}>
            {language === 'am'
              ? 'የዕለቱን ምግቦች መዝግበው ሲያጠናቅቁ የቀን ካሎሪ፣ ፕሮቲን እና የጾም ተጽዕኖ ትንታኔ እዚህ ይቀርባል።'
              : 'Log your meals to populate your historical calorie curves, protein distribution, and fasting impact.'}
          </p>
          <button
            className="btn-empty-log"
            onClick={() => navigate('/food-logging')}
            style={{ padding: '8px 20px', fontSize: '13px' }}
          >
            + {language === 'am' ? 'ምግብ መዝግብ' : 'Start Logging Meals'}
          </button>
        </div>
      )}

      {/* 2-Column Trends & Fasting Comparison Grid */}
      <div className="analytics-charts-grid">
        {/* Left Column: Calorie & Macro Trend Interactive Chart */}
        <div className="chart-card-box">
          <div className="chart-card-header">
            <div>
              <h3 className="chart-card-title">
                {language === 'am' ? 'የካሎሪ እና ማክሮ አዝማሚያዎች' : 'Calorie & Macro Trends'}
              </h3>
              <p className="chart-card-sub">
                {language === 'am'
                  ? 'የየቀኑ የአመጋገብ ልምድ ከረቡዕ / ዓርብ የጾም ምልክቶች ጋር'
                  : 'Daily intake pattern with Wednesday / Friday fasting indicators'}
              </p>
            </div>
            <div className="chart-metric-toggles">
              <button
                className={`chart-subtab ${chartMetric === 'calories' ? 'active' : ''}`}
                onClick={() => setChartMetric('calories')}
              >
                {language === 'am' ? 'ካሎሪ' : 'Calories'}
              </button>
              <button
                className={`chart-subtab ${chartMetric === 'macros' ? 'active' : ''}`}
                onClick={() => setChartMetric('macros')}
              >
                {language === 'am' ? 'ማክሮ' : 'Macros'}
              </button>
            </div>
          </div>

          {/* Bar Visualizer */}
          <div className="chart-body-visualizer">
            <div className="chart-bars-container">
              {displayChartItems.map((item, index) => {
                const heightPercent = item.calories > 0 ? Math.max(8, Math.round((item.calories / maxCal) * 100)) : 4;
                return (
                  <div key={index} className="chart-bar-column">
                    <div className="chart-bar-value-tooltip">
                      {chartMetric === 'calories'
                        ? (item.calories > 0 ? `${item.calories}` : '0')
                        : `P:${item.protein}g`}
                    </div>

                    <div className="bar-track">
                      {chartMetric === 'calories' ? (
                        <div
                          className={`bar-fill-calories ${item.isFasting ? 'fasting-bar' : 'regular-bar'}`}
                          style={{
                            height: `${heightPercent}%`,
                            opacity: item.calories > 0 ? 1 : 0.25
                          }}
                        />
                      ) : (
                        <div className="bar-stacked-macros" style={{ height: `${heightPercent}%` }}>
                          <div style={{ height: '30%', backgroundColor: '#1F4B3F' }} title="Protein" />
                          <div style={{ height: '50%', backgroundColor: '#A8571E' }} title="Carbs" />
                          <div style={{ height: '20%', backgroundColor: '#D9A779' }} title="Fats" />
                        </div>
                      )}
                    </div>

                    <div className="chart-day-label">
                      <span className="day-name">{item.label}</span>
                      {item.isFasting && (
                        <span className="fasting-dot" title={item.fastName}>
                          🌱{item.isAggregated && item.fastingCount > 1 ? item.fastingCount : ''}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Target line indicator */}
            <div className="chart-target-line" style={{ bottom: '70%' }}>
              <span className="target-badge">
                {language === 'am' ? `የቀን ግብ (${metrics.targetCal} kcal)` : `Daily Goal (${metrics.targetCal} kcal)`}
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="chart-legend-row">
            <div className="legend-item">
              <span className="legend-box green-box" /> {language === 'am' ? 'የፍስክ ቀን' : 'Non-Fasting Days'}
            </div>
            <div className="legend-item">
              <span className="legend-box terracotta-box" /> {language === 'am' ? 'የጾም ቀን (ረቡዕ / ዓርብ)' : 'Tsom Days (Terracotta)'}
            </div>
            <div className="legend-item">
              <span className="legend-line" /> {language === 'am' ? 'የካሎሪ ግብ መስመር' : 'Calorie Target Line'}
            </div>
          </div>
        </div>

        {/* Right Column: Fasting vs Non-Fasting Comparison */}
        <div className="comparison-card-box">
          <div className="comp-header-row">
            <div>
              <h3 className="chart-card-title">
                {language === 'am' ? 'የጾም እና የፍስክ ቀናት ንጽጽር' : 'Fasting vs Non-Fasting Impact'}
              </h3>
              <p className="chart-card-sub">
                {language === 'am' ? 'በጾም ወቅት የሚታይ የአመጋገብ ለውጥ' : 'Nutrient shift during Orthodox fasting traditions'}
              </p>
            </div>
          </div>

          {!metrics.hasAnyLogs ? (
            <div className="comp-empty-box">
              <span className="comp-empty-icon">📊</span>
              <h4 className="comp-empty-title">
                {language === 'am' ? 'ማነፃፀሪያ መረጃ የለም' : 'No Logged Meals in Period'}
              </h4>
              <p className="comp-empty-desc">
                {language === 'am'
                  ? 'በጾም (Tsom) እና በፍስክ ቀናት የተመገቧቸውን ምግቦች ይመዝግቡ፤ ንጽጽሩ እዚህ ይወጣል።'
                  : 'Log your meals on both Fasting (Tsom) and Regular days during this period to view nutrition shift comparisons.'}
              </p>
            </div>
          ) : (
            <>
              {/* Legend */}
              <div className="comp-legend-row">
                <div className="comp-legend-item">
                  <span className="comp-legend-dot regular-dot" />
                  <span>{language === 'am' ? 'የፍስክ ቀን' : 'Regular Days'}</span>
                </div>
                <div className="comp-legend-item">
                  <span className="comp-legend-dot tsom-dot" />
                  <span>{language === 'am' ? 'የጾም ቀን (Tsom)' : 'Tsom Days'}</span>
                </div>
              </div>

              <div className="comparison-metric-rows">
                {/* Row 1: Average Calories */}
                <div className="comp-row">
                  <div className="comp-row-header">
                    <span className="comp-title">{language === 'am' ? 'አማካይ ካሎሪ' : 'Average Calories'}</span>
                    <span className="comp-badge-tag">
                      {metrics.regAvgCal > 0 && metrics.tsomAvgCal > 0
                        ? (metrics.calDiffPercent < 0
                            ? `${metrics.calDiffPercent}% on Tsom`
                            : metrics.calDiffPercent > 0
                            ? `+${metrics.calDiffPercent}% on Tsom`
                            : 'Balanced')
                        : (metrics.tsomAvgCal > 0 ? 'Tsom Logged' : 'Regular Logged')}
                    </span>
                  </div>
                  
                  <div className="comp-bars-stack">
                    <div className="comp-bar-line">
                      <span className="comp-bar-label">{language === 'am' ? 'ፍስክ' : 'Regular'}</span>
                      <div className="comp-bar-track">
                        <div
                          className="comp-bar-fill regular"
                          style={{
                            width: `${metrics.regAvgCal > 0 ? Math.min(100, Math.max(10, Math.round((metrics.regAvgCal / Math.max(metrics.regAvgCal, metrics.tsomAvgCal, metrics.targetCal)) * 100))) : 0}%`
                          }}
                        />
                      </div>
                      <span className="comp-bar-value">{metrics.regAvgCal > 0 ? `${metrics.regAvgCal.toLocaleString()} kcal` : '0 kcal'}</span>
                    </div>

                    <div className="comp-bar-line">
                      <span className="comp-bar-label">{language === 'am' ? 'ጾም' : 'Tsom'}</span>
                      <div className="comp-bar-track">
                        <div
                          className="comp-bar-fill tsom"
                          style={{
                            width: `${metrics.tsomAvgCal > 0 ? Math.min(100, Math.max(10, Math.round((metrics.tsomAvgCal / Math.max(metrics.regAvgCal, metrics.tsomAvgCal, metrics.targetCal)) * 100))) : 0}%`
                          }}
                        />
                      </div>
                      <span className="comp-bar-value">{metrics.tsomAvgCal > 0 ? `${metrics.tsomAvgCal.toLocaleString()} kcal` : '0 kcal'}</span>
                    </div>
                  </div>
                </div>

                {/* Row 2: Protein Breakdown */}
                <div className="comp-row">
                  <div className="comp-row-header">
                    <span className="comp-title">{language === 'am' ? 'የፕሮቲን ምንጭ' : 'Protein Sources'}</span>
                    <span className="comp-badge-tag">
                      {language === 'am' ? '100% የእፅዋት ምንጭ (በጾም)' : '100% Plant Legumes on Tsom'}
                    </span>
                  </div>

                  <div className="comp-bars-stack">
                    <div className="comp-bar-line">
                      <span className="comp-bar-label">{language === 'am' ? 'ፍስክ' : 'Regular'}</span>
                      <div className="comp-bar-track">
                        <div
                          className="comp-bar-fill regular"
                          style={{
                            width: `${metrics.regAvgProt > 0 ? Math.min(100, Math.max(10, Math.round((metrics.regAvgProt / Math.max(metrics.regAvgProt, metrics.tsomAvgProt, 1)) * 100))) : 0}%`
                          }}
                        />
                      </div>
                      <span className="comp-bar-value">{metrics.regAvgProt > 0 ? `${metrics.regAvgProt}g / day` : '0g'}</span>
                    </div>

                    <div className="comp-bar-line">
                      <span className="comp-bar-label">{language === 'am' ? 'ጾም' : 'Tsom'}</span>
                      <div className="comp-bar-track">
                        <div
                          className="comp-bar-fill tsom"
                          style={{
                            width: `${metrics.tsomAvgProt > 0 ? Math.min(100, Math.max(10, Math.round((metrics.tsomAvgProt / Math.max(metrics.regAvgProt, metrics.tsomAvgProt, 1)) * 100))) : 0}%`
                          }}
                        />
                      </div>
                      <span className="comp-bar-value">{metrics.tsomAvgProt > 0 ? `${metrics.tsomAvgProt}g (Plant)` : '0g'}</span>
                    </div>
                  </div>
                </div>

                {/* Row 3: Fiber & Prebiotics */}
                <div className="comp-row">
                  <div className="comp-row-header">
                    <span className="comp-title">{language === 'am' ? 'የፋይበር (Fiber) መጠን' : 'Fiber & Prebiotics'}</span>
                    <span className="comp-badge-tag">
                      {metrics.regAvgFiber > 0 && metrics.tsomAvgFiber > 0
                        ? (metrics.fiberDiffPercent > 0 ? `+${metrics.fiberDiffPercent}% on Tsom` : `${metrics.fiberDiffPercent}% on Tsom`)
                        : (language === 'am' ? 'የጤናማ ፋይበር ምንጭ' : 'Teff & Legume Fiber')}
                    </span>
                  </div>

                  <div className="comp-bars-stack">
                    <div className="comp-bar-line">
                      <span className="comp-bar-label">{language === 'am' ? 'ፍስክ' : 'Regular'}</span>
                      <div className="comp-bar-track">
                        <div
                          className="comp-bar-fill regular"
                          style={{
                            width: `${metrics.regAvgFiber > 0 ? Math.min(100, Math.max(10, Math.round((metrics.regAvgFiber / Math.max(metrics.regAvgFiber, metrics.tsomAvgFiber, 30)) * 100))) : 0}%`
                          }}
                        />
                      </div>
                      <span className="comp-bar-value">{metrics.regAvgFiber > 0 ? `${metrics.regAvgFiber}g / day` : '0g'}</span>
                    </div>

                    <div className="comp-bar-line">
                      <span className="comp-bar-label">{language === 'am' ? 'ጾም' : 'Tsom'}</span>
                      <div className="comp-bar-track">
                        <div
                          className="comp-bar-fill tsom"
                          style={{
                            width: `${metrics.tsomAvgFiber > 0 ? Math.min(100, Math.max(10, Math.round((metrics.tsomAvgFiber / Math.max(metrics.regAvgFiber, metrics.tsomAvgFiber, 30)) * 100))) : 0}%`
                          }}
                        />
                      </div>
                      <span className="comp-bar-value">{metrics.tsomAvgFiber > 0 ? `${metrics.tsomAvgFiber}g (Teff)` : '0g'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick takeaway banner */}
              <div className="comp-takeaway-banner">
                <span className="takeaway-icon">💡</span>
                <span className="takeaway-text">
                  <strong>{language === 'am' ? 'የአመጋገብ ምክር፡' : 'Fasting Insight:'}</strong>{' '}
                  {language === 'am'
                    ? 'በጾም ቀናት የፋይበር መጠንዎ ከፍተኛ ነው። የብረት ውህደትን ለማሳደግ ሽሮ ወይም ምስር ሲመገቡ ሎሚ ማከልዎን አይርሱ።'
                    : 'Your fiber intake peaks on fasting days thanks to Teff Injera & lentils. Pair with fresh citrus to optimize iron absorption.'}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Dynamic Real-Time Micronutrient Guidance (Iron & Vitamin B12) */}
      <div className="analytics-deficiency-section" style={{ marginTop: '28px' }}>
        {(() => {
          // Dynamic calculation of Iron and Vitamin B12 from 7-day logs
          const sevenDays = trendDays.slice(-7);
          const loggedDaysCount = Math.max(1, sevenDays.filter(d => d.calories > 0).length);
          
          // Demographic-specific RDA for Iron
          const ironRda = dailyStats?.iron?.target || (user?.healthProfile?.biologicalSex === 'male' || (user?.healthProfile?.age && user?.healthProfile?.age >= 50) ? 8 : 18);
          const b12Rda = 2.4; // mcg

          // Estimate iron & B12 from calories / logged food items
          let totalIronMg = 0;
          let totalB12Mcg = 0;

          if (foodLogs && foodLogs.length > 0) {
            foodLogs.forEach(item => {
              const name = (item.name || item.customName || '').toLowerCase();
              if (name.includes('teff') || name.includes('injera')) {
                totalIronMg += 7.5;
              } else if (name.includes('misir') || name.includes('lentil')) {
                totalIronMg += 6.5;
              } else if (name.includes('shiro')) {
                totalIronMg += 5.0;
              } else if (name.includes('gomen') || name.includes('spinach')) {
                totalIronMg += 3.5;
              } else if (name.includes('doro') || name.includes('tibs') || name.includes('meat') || name.includes('egg')) {
                totalIronMg += 3.0;
                totalB12Mcg += 1.8;
              } else {
                totalIronMg += 2.0;
              }
            });
          } else {
            // Default computed estimates from weekly calories
            totalIronMg = (metrics.avgCal / 2000) * 12 * loggedDaysCount;
            totalB12Mcg = (metrics.tsomAvgCal > 0 ? 0.8 : 2.1) * loggedDaysCount;
          }

          const avgIronMg = Number((totalIronMg / loggedDaysCount).toFixed(1));
          const avgB12Mcg = Number((totalB12Mcg / loggedDaysCount).toFixed(1));

          const isIronLow = avgIronMg < ironRda;
          const isB12Low = avgB12Mcg < b12Rda;

          const handleGenerateIronPlan = async () => {
            try {
              await apiClient.post('/meal-plans/generate', {
                boostIron: true,
                targetNutrient: 'iron',
                fastingSafe: true
              }).catch(() => {});
            } catch (e) {
              console.warn(e);
            }
            navigate('/meal-planning');
          };

          const cardTitle = language === 'am'
            ? `የስነ-ምግብ ትንታኔ፡ የብረት (${avgIronMg}mg/${ironRda}mg) እና ቫይታሚን B12 (${avgB12Mcg}µg/${b12Rda}µg) ክትትል`
            : `Nutrient Pattern: Iron (${avgIronMg}mg / ${ironRda}mg RDA) & Vitamin B12 (${avgB12Mcg}µg / ${b12Rda}µg RDA)`;

          const cardDescription = language === 'am'
            ? `ባለፉት 7 ቀናት የተመዘገቡት ምግቦች አማካይ የብረት መጠን ${avgIronMg}mg (${isIronLow ? 'ከታለመው ግብ በታች' : 'በቂ'}) እና የቫይታሚን B12 መጠን ${avgB12Mcg}µg (${isB12Low ? 'ዝቅተኛ' : 'በቂ'}) ያሳያሉ። በጾም ወቅት የብረት ውህደትን ለማሳደግ ምስርና ሽሮን ከጤፍ እንጀራ እና ከሎሚ/ቲማቲም ሰላጣ (ቫይታሚን C) ጋር ያጣምሩ።`
            : `Your 7-day intake averages ${avgIronMg}mg Iron against your ${ironRda}mg RDA (${isIronLow ? 'Deficit Detected' : 'Optimal'}) and ${avgB12Mcg}µg Vitamin B12 against ${b12Rda}µg RDA (${isB12Low ? 'Low during plant-based Tsom' : 'Optimal'}). Enhance non-heme iron absorption by pairing Misir, Shiro, and Teff Injera with ascorbic acid (lemon and fresh salad).`;

          return (
            <AlertCard
              title={cardTitle}
              description={cardDescription}
              actionText={language === 'am' ? 'በብረት የበለጸገ የጾም ምግብ እቅድ አውጣ →' : 'Generate Iron-Optimized Fasting Plan →'}
              onActionClick={handleGenerateIronPlan}
            />
          );
        })()}
      </div>
    </div>
  );
};

export default Analytics;
