import React, { useState } from 'react';
import { useNutrition } from '../context/NutritionContext';
import CalorieRing from '../components/ui/CalorieRing';
import MacroCard from '../components/ui/MacroCard';
import ActionRow from '../components/ui/ActionRow';
import LogMealModal from '../components/ui/LogMealModal';

const FoodLogging = () => {
  const { foodLogs, dailyStats, removeFoodLog, saveDraftLogs, resetTodayLogs } = useNutrition();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('manual');
  const [targetCategory, setTargetCategory] = useState('lunch');
  const [searchFilter, setSearchFilter] = useState('');
  const [activeDateTab, setActiveDateTab] = useState('today');
  const [toastMsg, setToastMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const hasUnsavedDrafts = foodLogs.some((l) => l.isDraft || String(l.id).startsWith('local-'));

  const handleOpenModal = (mode, category = 'lunch') => {
    setModalMode(mode);
    setTargetCategory(category);
    setModalOpen(true);
  };

  const handleSingleDelete = async (item) => {
    if (window.confirm(`Delete "${item.name}" from your log?`)) {
      await removeFoodLog(item.id);
      setToastMsg(`✨ Removed ${item.name}`);
      setTimeout(() => setToastMsg(''), 3000);
    }
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      if (saveDraftLogs) {
        await saveDraftLogs();
      }
      setToastMsg('✨ Food log saved successfully!');
    } catch (err) {
      setToastMsg('⚠️ Failed to save food log.');
    } finally {
      setIsSaving(false);
      setTimeout(() => setToastMsg(''), 3500);
    }
  };

  const handleResetLogs = async () => {
    if (window.confirm('Reset all logged foods for today? This cannot be undone.')) {
      if (resetTodayLogs) {
        await resetTodayLogs();
      }
      setToastMsg('✨ Today\'s food log has been reset.');
      setTimeout(() => setToastMsg(''), 3500);
    }
  };

  const mealCategories = [
    { key: 'breakfast', label: 'Breakfast', amharic: 'የቁርስ ሰዓት', icon: '🌅', targetCal: '400 - 500 kcal' },
    { key: 'lunch', label: 'Lunch', amharic: 'የምሳ ሰዓት', icon: '☀️', targetCal: '600 - 750 kcal' },
    { key: 'dinner', label: 'Dinner', amharic: 'የእራት ሰዓት', icon: '🌙', targetCal: '500 - 650 kcal' },
    { key: 'snacks', label: 'Snacks & Beverages', amharic: 'መክሰስ', icon: '☕', targetCal: '150 - 250 kcal' },
  ];

  const getLogsForCategory = (catKey) => {
    return foodLogs.filter((item) => (item.category || '').toLowerCase() === catKey);
  };

  const calculateCategoryTotals = (catKey) => {
    const items = foodLogs.filter((i) => (i.category || '').toLowerCase() === catKey);
    const calories = items.reduce((sum, i) => sum + Number(i.calories || 0), 0);
    const protein = items.reduce((sum, i) => sum + Number(i.protein || 0), 0);
    return { calories, protein };
  };

  return (
    <div className="food-logging-page">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="app-toast-alert" style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 99999 }}>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Bar with Date Switcher, Save & Reset Actions, and Search */}
      <div className="logging-top-controls" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div className="date-tabs-pill">
          <button
            className={`date-tab-btn ${activeDateTab === 'yesterday' ? 'active' : ''}`}
            onClick={() => setActiveDateTab('yesterday')}
          >
            Yesterday
          </button>
          <button
            className={`date-tab-btn ${activeDateTab === 'today' ? 'active' : ''}`}
            onClick={() => setActiveDateTab('today')}
          >
            Today
          </button>
          <button
            className={`date-tab-btn ${activeDateTab === 'tomorrow' ? 'active' : ''}`}
            onClick={() => setActiveDateTab('tomorrow')}
          >
            Tomorrow
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {hasUnsavedDrafts && (
            <span style={{ fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '12px', background: 'rgba(232, 147, 92, 0.2)', color: '#C97B3D', border: '1px solid rgba(201, 123, 61, 0.4)' }}>
              ● Unsaved Changes
            </span>
          )}
          <button
            type="button"
            className="btn-save-logs"
            onClick={handleSaveAll}
            disabled={isSaving}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: 'var(--forest-green)',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            💾 {isSaving ? 'Saving...' : 'Save'}
          </button>
          <button
            type="button"
            className="btn-reset-logs"
            onClick={handleResetLogs}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid var(--terracotta)',
              background: 'transparent',
              color: 'var(--terracotta)',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            ↺ Reset
          </button>
        </div>
      </div>

      {/* 2 Quick-Entry Action Cards */}
      <div className="logging-action-section">
        <ActionRow
          onVoiceLog={() => handleOpenModal('voice')}
          onManualEntry={() => handleOpenModal('manual')}
        />
      </div>

      {/* Main Grid: Meal Groups on Left, Running Totals on Right */}
      <div className="logging-content-grid">
        {/* Left Column: Grouped Meal Sections */}
        <div className="logging-meals-column">
          {mealCategories.map((cat) => {
            const items = getLogsForCategory(cat.key);
            const totals = calculateCategoryTotals(cat.key);

            return (
              <div key={cat.key} className="meal-group-card">
                <div className="meal-group-header">
                  <div className="meal-group-title-wrap">
                    <span className="meal-group-icon">{cat.icon}</span>
                    <div>
                      <h3 className="meal-group-title">
                        {cat.label} <span className="meal-group-amharic amharic-text">({cat.amharic})</span>
                      </h3>
                      <div className="meal-group-target">
                        Target: {cat.targetCal}
                      </div>
                    </div>
                  </div>

                  <div className="meal-group-right">
                    {items.length > 0 && (
                      <div className="meal-group-summary-badge">
                        <span>{totals.calories} kcal</span> • <span>{totals.protein}g protein</span>
                      </div>
                    )}
                    <button
                      className="btn-add-meal-small"
                      onClick={() => handleOpenModal('manual', cat.key)}
                      title={`Add to ${cat.label}`}
                    >
                      + Add Food
                    </button>
                  </div>
                </div>

                {/* Items List or Empty State */}
                {items.length > 0 ? (
                  <div className="meal-items-list">
                    {items.map((item) => (
                      <div key={item.id} className="meal-entry-row">
                        <img src={item.image} alt={item.name} className="meal-entry-thumb" />

                        <div className="meal-entry-details">
                          <div className="meal-entry-name-row">
                            <h4 className="meal-entry-name">{item.name}</h4>
                            {item.amharicName && (
                              <span className="meal-entry-amharic amharic-text">
                                {item.amharicName}
                              </span>
                            )}
                            {item.isTsom && (
                              <span className="meal-entry-tsom-badge">🌱 Tsom</span>
                            )}
                          </div>
                          <div className="meal-entry-portion-time">
                            {item.portion} • {item.time}
                          </div>
                        </div>

                        {/* Macro mini breakdown */}
                        <div className="meal-entry-macros">
                          <span className="macro-chip cal-chip">{item.calories} kcal</span>
                          <span className="macro-chip protein-chip">{item.protein}g P</span>
                          <span className="macro-chip carb-chip">{item.carbs}g C</span>
                          <span className="macro-chip fat-chip">{item.fats}g F</span>
                        </div>

                        {/* Actions */}
                        <div className="meal-entry-actions">
                          <button
                            type="button"
                            className="btn-delete-entry"
                            onClick={() => handleSingleDelete(item)}
                            title="Delete food entry"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="meal-empty-state">
                    <div className="empty-state-icon">🍽️</div>
                    <div className="empty-state-text">
                      No foods logged for {cat.label} yet
                    </div>
                    <button
                      className="btn-empty-log"
                      onClick={() => handleOpenModal('manual', cat.key)}
                    >
                      + Log {cat.label}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column: Running Daily Total Card */}
        <div className="logging-summary-column">
          <div className="daily-totals-card">
            <h3 className="totals-card-title">Daily Running Totals</h3>
            <p className="totals-card-sub">Wednesday Fast • 100% Plant-Based</p>

            <div className="totals-ring-wrap">
              <CalorieRing
                consumed={dailyStats?.calories?.consumed ?? 0}
                target={dailyStats?.calories?.target}
                size={190}
                label="kcal consumed"
              />
            </div>

            <div className="totals-remaining-badge">
              <span className="remaining-count">
                {Math.max(0, (dailyStats?.calories?.target ?? 2000) - (dailyStats?.calories?.consumed ?? 0))} kcal
              </span>{' '}
              remaining for today
            </div>

            <div className="totals-macro-list">
              <MacroCard
                name="Protein"
                consumed={dailyStats?.protein?.consumed ?? 0}
                target={dailyStats?.protein?.target}
                unit="g"
                color="#1F4B3F"
              />
              <MacroCard
                name="Carbs"
                consumed={dailyStats?.carbs?.consumed ?? 0}
                target={dailyStats?.carbs?.target}
                unit="g"
                color="#A8571E"
              />
              <MacroCard
                name="Fats"
                consumed={dailyStats?.fats?.consumed ?? 0}
                target={dailyStats?.fats?.target}
                unit="g"
                color="#78350F"
              />
              <MacroCard
                name="Hydration"
                consumed={dailyStats?.water?.consumed ?? 0}
                target={dailyStats?.water?.target}
                unit="L"
                isWater={true}
              />
            </div>

            {/* Micronutrient tracker */}
            <div className="micronutrient-box">
              <div className="micro-header">
                <span>Key Micronutrients</span>
                {(dailyStats?.iron?.consumed ?? 0) < (dailyStats?.iron?.target || 18) * 0.5 ? (
                  <span className="micro-status-warning">⚠️ Iron Alert</span>
                ) : (
                  <span style={{ fontSize: '11px', color: 'var(--forest-green)', fontWeight: 700 }}>✓ Optimal</span>
                )}
              </div>
              <div className="micro-bar-row">
                <span className="micro-name">Iron (Teff & Lentils)</span>
                <span className="micro-val">{dailyStats?.iron?.consumed ?? 0} / {dailyStats?.iron?.target ?? 18} mg</span>
              </div>
              <div className="micro-track">
                <div
                  className="micro-fill alert-red"
                  style={{
                    width: `${Math.min(100, Math.round(((dailyStats?.iron?.consumed ?? 0) / (dailyStats?.iron?.target || 18)) * 100))}%`,
                    backgroundColor: (dailyStats?.iron?.consumed ?? 0) >= (dailyStats?.iron?.target || 18) * 0.5 ? 'var(--forest-green)' : '#DC2626'
                  }}
                />
              </div>

              <div className="micro-bar-row" style={{ marginTop: '12px' }}>
                <span className="micro-name">Dietary Fiber</span>
                <span className="micro-val">{dailyStats?.fiber?.consumed ?? 0} / {dailyStats?.fiber?.target ?? 30} g</span>
              </div>
              <div className="micro-track">
                <div
                  className="micro-fill safe-green"
                  style={{ width: `${Math.min(100, Math.round(((dailyStats?.fiber?.consumed ?? 0) / (dailyStats?.fiber?.target || 30)) * 100))}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Log Meal Interactive Modal */}
      <LogMealModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialMode={modalMode}
        defaultCategory={targetCategory}
      />
    </div>
  );
};

export default FoodLogging;
