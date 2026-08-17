import React, { useState } from 'react';
import { useNutrition } from '../context/NutritionContext';
import CalorieRing from '../components/ui/CalorieRing';
import MacroCard from '../components/ui/MacroCard';
import ActionRow from '../components/ui/ActionRow';
import LogMealModal from '../components/ui/LogMealModal';

const FoodLogging = () => {
  const { foodLogs, dailyStats, removeFoodLog } = useNutrition();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('manual');
  const [targetCategory, setTargetCategory] = useState('lunch');
  const [searchFilter, setSearchFilter] = useState('');
  const [activeDateTab, setActiveDateTab] = useState('today');

  const handleOpenModal = (mode, category = 'lunch') => {
    setModalMode(mode);
    setTargetCategory(category);
    setModalOpen(true);
  };

  const mealCategories = [
    { key: 'breakfast', label: 'Breakfast', amharic: 'የቁርስ ሰዓት', icon: '🌅', targetCal: '400 - 500 kcal' },
    { key: 'lunch', label: 'Lunch', amharic: 'የምሳ ሰዓት', icon: '☀️', targetCal: '600 - 750 kcal' },
    { key: 'dinner', label: 'Dinner', amharic: 'የእራት ሰዓት', icon: '🌙', targetCal: '500 - 650 kcal' },
    { key: 'snacks', label: 'Snacks & Beverages', amharic: 'መክሰስ', icon: '☕', targetCal: '150 - 250 kcal' },
  ];

  const getLogsForCategory = (catKey) => {
    return foodLogs.filter((item) => {
      const matchCat = (item.category || '').toLowerCase() === catKey;
      const matchSearch =
        item.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        (item.amharicName && item.amharicName.includes(searchFilter));
      return matchCat && matchSearch;
    });
  };

  const calculateCategoryTotals = (catKey) => {
    const items = foodLogs.filter((i) => (i.category || '').toLowerCase() === catKey);
    const calories = items.reduce((sum, i) => sum + Number(i.calories || 0), 0);
    const protein = items.reduce((sum, i) => sum + Number(i.protein || 0), 0);
    return { calories, protein };
  };

  return (
    <div className="food-logging-page">
      {/* Header Bar with Date Switcher and Search */}
      <div className="logging-top-controls">
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
            Today (Wed Fast)
          </button>
          <button
            className={`date-tab-btn ${activeDateTab === 'tomorrow' ? 'active' : ''}`}
            onClick={() => setActiveDateTab('tomorrow')}
          >
            Tomorrow
          </button>
        </div>

        <div className="logging-search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search logged foods, Injera, Misir, Shiro..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
          />
        </div>
      </div>

      {/* 3 Quick-Entry Action Cards */}
      <div className="logging-action-section">
        <ActionRow
          onScanMeal={() => handleOpenModal('scan')}
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
                            className="btn-delete-entry"
                            onClick={() => removeFoodLog(item.id)}
                            title="Delete log"
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
                consumed={dailyStats.calories.consumed}
                target={dailyStats.calories.target}
                size={190}
                label="kcal consumed"
              />
            </div>

            <div className="totals-remaining-badge">
              <span className="remaining-count">
                {Math.max(0, dailyStats.calories.target - dailyStats.calories.consumed)} kcal
              </span>{' '}
              remaining for today
            </div>

            <div className="totals-macro-list">
              <MacroCard
                name="Protein"
                consumed={dailyStats.protein.consumed}
                target={dailyStats.protein.target}
                unit="g"
                color="#1F4B3F"
              />
              <MacroCard
                name="Carbs"
                consumed={dailyStats.carbs.consumed}
                target={dailyStats.carbs.target}
                unit="g"
                color="#A8571E"
              />
              <MacroCard
                name="Fats"
                consumed={dailyStats.fats.consumed}
                target={dailyStats.fats.target}
                unit="g"
                color="#78350F"
              />
              <MacroCard
                name="Hydration"
                consumed={dailyStats.water.consumed}
                target={dailyStats.water.target}
                unit="L"
                isWater={true}
              />
            </div>

            {/* Micronutrient tracker */}
            <div className="micronutrient-box">
              <div className="micro-header">
                <span>Key Micronutrients</span>
                <span className="micro-status-warning">⚠️ Iron Alert</span>
              </div>
              <div className="micro-bar-row">
                <span className="micro-name">Iron (Teff & Lentils)</span>
                <span className="micro-val">{dailyStats.iron.consumed} / {dailyStats.iron.target} mg</span>
              </div>
              <div className="micro-track">
                <div className="micro-fill alert-red" style={{ width: '52%' }} />
              </div>

              <div className="micro-bar-row" style={{ marginTop: '12px' }}>
                <span className="micro-name">Dietary Fiber</span>
                <span className="micro-val">{dailyStats.fiber.consumed} / {dailyStats.fiber.target} g</span>
              </div>
              <div className="micro-track">
                <div className="micro-fill safe-green" style={{ width: '80%' }} />
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
