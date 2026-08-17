import React, { useState } from 'react';
import { useNutrition } from '../context/NutritionContext';
import CalorieRing from '../components/ui/CalorieRing';

const MealPlanning = () => {
  const { shoppingList, toggleShoppingItem, addShoppingItem } = useNutrition();
  const [activeView, setActiveView] = useState('calendar'); // 'calendar' or 'shopping'
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [newCustomItem, setNewCustomItem] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const filterChips = [
    'All',
    'Fasting-Friendly (Tsom)',
    'High Protein',
    'Traditional Heritage',
    'Quick Meals (<20m)',
  ];

  // 7-day Meal Plan Data
  const weeklyPlanDays = [
    {
      day: 'Mon',
      date: 'Oct 23',
      isTsom: false,
      aiSynced: true,
      meals: [
        {
          type: 'BREAKFAST',
          name: 'Kinche with Niter Kibbeh',
          amharic: 'ቂንጬ',
          calories: 320,
          protein: '8g',
          tag: 'VEGETARIAN',
          tagType: 'veg',
          image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80',
        },
        {
          type: 'LUNCH',
          name: 'Spicy Misir Wat & Injera',
          amharic: 'ምስር ወጥ',
          calories: 450,
          protein: '18g',
          tag: 'FASTING (TSOM)',
          secondTag: 'VEGAN',
          tagType: 'tsom',
          image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=300&q=80',
        },
        {
          type: 'DINNER',
          name: 'Shiro Wat with Side Salad',
          amharic: 'ሽሮ ወጥ',
          calories: 380,
          protein: '14g',
          tag: 'FASTING (TSOM)',
          tagType: 'tsom',
          image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=300&q=80',
        },
      ],
    },
    {
      day: 'Tue',
      date: 'Oct 24',
      isTsom: false,
      meals: [
        {
          type: 'BREAKFAST',
          name: 'Genfo (Barley Porridge)',
          amharic: 'ገንፎ',
          calories: 410,
          protein: '12g',
          tag: 'TRADITIONAL',
          tagType: 'trad',
          image: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&w=300&q=80',
        },
        {
          type: 'LUNCH',
          name: 'Kik Alicha with Injera',
          amharic: 'ክክ አልጫ',
          calories: 390,
          protein: '16g',
          tag: 'FASTING (TSOM)',
          tagType: 'tsom',
          image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80',
        },
        {
          type: 'DINNER',
          name: 'Doro Wat with Brown Rice',
          amharic: 'ዶሮ ወጥ',
          calories: 460,
          protein: '36g',
          tag: 'HIGH PROTEIN',
          tagType: 'prot',
          image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80',
        },
      ],
    },
    {
      day: 'Wed',
      date: 'Oct 25',
      isTsom: true,
      tsomBadge: 'Wednesday Fast (የረቡዕ ፆም)',
      meals: [
        {
          type: 'BREAKFAST',
          name: 'Chechebsa (Olive Oil)',
          amharic: 'ጨጨብሳ',
          calories: 360,
          protein: '9g',
          tag: 'FASTING (TSOM)',
          tagType: 'tsom',
          image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80',
        },
        {
          type: 'LUNCH',
          name: 'Beyaynetu (Fasting Platter)',
          amharic: 'የጾም በያይነቱ',
          calories: 520,
          protein: '22g',
          tag: 'FASTING (TSOM)',
          tagType: 'tsom',
          image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=300&q=80',
        },
        {
          type: 'DINNER',
          name: 'Fasolia & Steamed Gomen',
          amharic: 'ፋሶሊያ እና ጎመን',
          calories: 340,
          protein: '11g',
          tag: 'FASTING (TSOM)',
          tagType: 'tsom',
          image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80',
        },
      ],
    },
    {
      day: 'Thu',
      date: 'Oct 26',
      isTsom: false,
      meals: [
        {
          type: 'BREAKFAST',
          name: 'Scrambled Eggs with Tomato',
          amharic: 'እንቁላል ፍርፍር',
          calories: 350,
          protein: '18g',
          tag: 'HIGH PROTEIN',
          tagType: 'prot',
          image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=300&q=80',
        },
        {
          type: 'LUNCH',
          name: 'Tibs with Injera & Awaze',
          amharic: 'ጥብስ',
          calories: 560,
          protein: '34g',
          tag: 'TRADITIONAL',
          tagType: 'trad',
          image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=300&q=80',
        },
        {
          type: 'DINNER',
          name: 'Atkilt Wat (Vegetable Stew)',
          amharic: 'የአትክልት ወጥ',
          calories: 290,
          protein: '7g',
          tag: 'VEGAN',
          tagType: 'veg',
          image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=300&q=80',
        },
      ],
    },
    {
      day: 'Fri',
      date: 'Oct 27',
      isTsom: true,
      tsomBadge: 'Friday Fast (የአርብ ፆም)',
      meals: [
        {
          type: 'BREAKFAST',
          name: 'Kinche with Sunflower Seeds',
          amharic: 'ቂንጬ በሱፍ',
          calories: 330,
          protein: '9g',
          tag: 'FASTING (TSOM)',
          tagType: 'tsom',
          image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80',
        },
        {
          type: 'LUNCH',
          name: 'Shiro Tegabino & Injera',
          amharic: 'ተጋቢኖ ሽሮ',
          calories: 460,
          protein: '17g',
          tag: 'FASTING (TSOM)',
          tagType: 'tsom',
          image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=300&q=80',
        },
        {
          type: 'DINNER',
          name: 'Misir Wat & Timatim Salata',
          amharic: 'ምስር እና ሰላጣ',
          calories: 390,
          protein: '15g',
          tag: 'FASTING (TSOM)',
          tagType: 'tsom',
          image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=300&q=80',
        },
      ],
    },
  ];

  const handleGeneratePlan = () => {
    setIsGeneratingPlan(true);
    setTimeout(() => {
      setIsGeneratingPlan(false);
      setToastMsg('✨ AI Heritage Meal Plan customized with Wednesday/Friday Tsom rules!');
      setTimeout(() => setToastMsg(''), 3500);
    }, 1200);
  };

  const handleAddCustomShoppingItem = () => {
    if (!newCustomItem.trim()) return;
    addShoppingItem('Grains & Legumes', {
      name: newCustomItem,
      amharic: 'ብጁ እቃ',
      amount: '1 unit',
      note: 'Custom addition',
      priceETB: 100,
    });
    setNewCustomItem('');
    setShowAddModal(false);
    setToastMsg('Item added to Shopping List');
    setTimeout(() => setToastMsg(''), 2500);
  };

  // Calculate shopping budget
  const allItems = shoppingList.flatMap((c) => c.items);
  const totalBudgetETB = allItems.reduce((acc, i) => acc + (i.priceETB || 0), 0);
  const totalItemsCount = allItems.length;
  const completedCount = allItems.filter((i) => i.checked).length;

  return (
    <div className="meal-planning-page">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="app-toast-alert">
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Header & View Switcher */}
      <div className="planning-header-row">
        <div>
          <h2 className="planning-page-title">
            {activeView === 'calendar' ? 'Weekly Meal Plan' : 'Shopping List'}
          </h2>
          <p className="planning-page-sub">
            {activeView === 'calendar'
              ? 'AI-balanced Ethiopian menu tailored to your Wednesday & Friday fasting commitments'
              : 'Auto-generated ingredients checklist with local Ethiopian Birr (ETB) budget tracking'}
          </p>
        </div>

        <div className="planning-top-actions">
          {/* Calendar vs Shopping List Tab Toggle */}
          <div className="view-toggle-pill">
            <button
              className={`view-pill-btn ${activeView === 'calendar' ? 'active' : ''}`}
              onClick={() => setActiveView('calendar')}
            >
              📅 Weekly Plan
            </button>
            <button
              className={`view-pill-btn ${activeView === 'shopping' ? 'active' : ''}`}
              onClick={() => setActiveView('shopping')}
            >
              🛒 Shopping List ({completedCount}/{totalItemsCount})
            </button>
          </div>

          {activeView === 'calendar' ? (
            <button
              className="btn-generate-ai-plan"
              onClick={handleGeneratePlan}
              disabled={isGeneratingPlan}
            >
              <span className="sparkle-icon">✨</span>
              {isGeneratingPlan ? 'Optimizing Menu...' : 'Generate AI Meal Plan'}
            </button>
          ) : (
            <button className="btn-add-custom-item" onClick={() => setShowAddModal(true)}>
              + Add Custom Item
            </button>
          )}
        </div>
      </div>

      {/* If Calendar View */}
      {activeView === 'calendar' && (
        <>
          {/* Filter Chips Bar */}
          <div className="filter-chips-row">
            {filterChips.map((chip) => (
              <button
                key={chip}
                className={`filter-chip-btn ${activeFilter === chip ? 'active' : ''}`}
                onClick={() => setActiveFilter(chip)}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Main Grid: Days Columns + Right Summary Panel */}
          <div className="planning-calendar-grid">
            {/* Days Columns */}
            <div className="planning-days-columns">
              <div className="week-nav-bar">
                <div className="week-nav-label">
                  <span className="sub-tag">CURRENT WEEK</span>
                  <h3>Oct 23 - Oct 29</h3>
                </div>
                <div className="week-nav-btns">
                  <button className="btn-week-arrow" onClick={() => setCurrentWeekIndex((p) => p - 1)}>
                    ‹ Prev
                  </button>
                  <button className="btn-week-arrow" onClick={() => setCurrentWeekIndex((p) => p + 1)}>
                    Next ›
                  </button>
                </div>
              </div>

              {/* Day Cards Row */}
              <div className="days-cards-row">
                {weeklyPlanDays.map((dayPlan, idx) => (
                  <div
                    key={idx}
                    className={`day-column-card ${dayPlan.isTsom ? 'tsom-day-card' : ''}`}
                  >
                    <div className="day-card-header">
                      <div>
                        <div className="day-name-title">{dayPlan.day}</div>
                        <div className="day-date-sub">{dayPlan.date}</div>
                      </div>
                      {dayPlan.aiSynced && (
                        <span className="ai-sync-badge">🔄 AI Sync</span>
                      )}
                      {dayPlan.tsomBadge && (
                        <span className="day-tsom-indicator">🌱 Fasting</span>
                      )}
                    </div>

                    {/* Meal Slots */}
                    <div className="day-meal-slots">
                      {dayPlan.meals.map((meal, mIdx) => (
                        <div key={mIdx} className="meal-slot-item">
                          <div className="slot-type-label">{meal.type}</div>
                          <div className="slot-content-row">
                            <img src={meal.image} alt={meal.name} className="slot-meal-thumb" />
                            <div className="slot-details">
                              <h5 className="slot-meal-title">{meal.name}</h5>
                              <div className="slot-macros-text">
                                {meal.calories} kcal • {meal.protein} Protein
                              </div>
                              <div className="slot-tags-cluster">
                                <span className={`slot-tag-pill pill-${meal.tagType}`}>
                                  {meal.tag}
                                </span>
                                {meal.secondTag && (
                                  <span className="slot-tag-pill pill-vegan">
                                    {meal.secondTag}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Add Snack Slot */}
                      <button className="btn-add-snack-slot">
                        + Add Snack
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Summary Panel */}
            <div className="planning-right-panel">
              <div className="weekly-summary-card">
                <h3 className="summary-title">Weekly Summary</h3>
                <p className="summary-sub">Oct 23 - Oct 29 Avg.</p>

                <div className="summary-ring-wrap">
                  <CalorieRing
                    consumed={1850}
                    target={2000}
                    size={180}
                    label="kcal / day"
                  />
                </div>

                <div className="summary-macro-breakdown">
                  <div className="macro-bar-line">
                    <div className="macro-line-head">
                      <span className="dot-prot">●</span> Protein
                      <span className="macro-line-val">65g (15%)</span>
                    </div>
                    <div className="line-track"><div className="line-fill prot" style={{ width: '65%' }}></div></div>
                  </div>

                  <div className="macro-bar-line">
                    <div className="macro-line-head">
                      <span className="dot-carb">●</span> Carbs
                      <span className="macro-line-val">250g (55%)</span>
                    </div>
                    <div className="line-track"><div className="line-fill carb" style={{ width: '75%' }}></div></div>
                  </div>

                  <div className="macro-bar-line">
                    <div className="macro-line-head">
                      <span className="dot-fat">●</span> Fats
                      <span className="macro-line-val">60g (30%)</span>
                    </div>
                    <div className="line-track"><div className="line-fill fat" style={{ width: '50%' }}></div></div>
                  </div>
                </div>

                {/* Shopping List Trigger Card */}
                <div
                  className="shopping-list-ready-card"
                  onClick={() => setActiveView('shopping')}
                >
                  <div className="cart-icon-circle">🛍️</div>
                  <div className="ready-text-wrap">
                    <h4>Shopping List Ready</h4>
                    <p>View ingredients & ETB budget →</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* If Shopping List View (Matching Image 3 from Prompt!) */}
      {activeView === 'shopping' && (
        <div className="shopping-list-view-layout">
          {/* Left Column: Categorized Items */}
          <div className="shopping-categories-column">
            {shoppingList.map((cat, cIdx) => (
              <div key={cIdx} className="shopping-category-card">
                <div className="category-header">
                  <span className="category-icon">{cat.icon}</span>
                  <h3 className="category-title">{cat.category}</h3>
                </div>

                <div className="category-items-list">
                  {cat.items.map((item) => (
                    <div
                      key={item.id}
                      className={`shopping-item-row ${item.checked ? 'item-checked' : ''}`}
                      onClick={() => toggleShoppingItem(item.id)}
                    >
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => {}}
                        className="shopping-checkbox"
                      />

                      <div className="item-details">
                        <div className="item-name-row">
                          <span className="item-name">{item.name}</span>
                          <span className="item-amharic amharic-text">/ {item.amharic}</span>
                        </div>
                        <div className="item-note">{item.note}</div>
                      </div>

                      <div className="item-amount-col">
                        <div className="item-qty">{item.amount}</div>
                        <div className="item-price">~ {item.priceETB} ETB</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Weekly Budget Card (Image 3) */}
          <div className="shopping-budget-column">
            <div className="weekly-budget-card">
              <h3 className="budget-title">Weekly Budget</h3>

              <div className="budget-est-row">
                <span className="budget-sublabel">Estimated Total</span>
                <span className="budget-main-num">{totalBudgetETB} <span className="currency">ETB</span></span>
              </div>

              <div className="budget-progress-track">
                <div
                  className="budget-progress-fill"
                  style={{ width: `${Math.min(100, (totalBudgetETB / 1800) * 100)}%` }}
                />
              </div>

              <div className="budget-spend-footer">
                <span>Spent: 0 ETB</span>
                <span>Remaining: 1,800 ETB</span>
              </div>

              <div className="budget-actions">
                <button
                  className="btn-send-phone"
                  onClick={() => {
                    setToastMsg('📱 Shopping list sent to your registered phone via SMS!');
                    setTimeout(() => setToastMsg(''), 3500);
                  }}
                >
                  <span>📱</span> Send to Phone
                </button>
                <button
                  className="btn-export-list"
                  onClick={() => {
                    setToastMsg('📥 Exported PDF checklist for Mercato / local market');
                    setTimeout(() => setToastMsg(''), 3500);
                  }}
                >
                  <span>📥</span> Export List
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Item Modal */}
      {showAddModal && (
        <div className="modal-backdrop-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-card-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <h3 className="modal-title">Add Custom Ingredient</h3>
              <button className="modal-close-btn" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <div style={{ padding: '20px 0' }}>
              <input
                type="text"
                className="modal-input"
                placeholder="e.g. Berbere Spice / በርበሬ, Cardamom, Teff..."
                value={newCustomItem}
                onChange={(e) => setNewCustomItem(e.target.value)}
              />
            </div>
            <div className="modal-actions-footer">
              <button className="btn-modal-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="btn-modal-submit" onClick={handleAddCustomShoppingItem}>Add Item</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealPlanning;
