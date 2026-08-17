import React, { useState } from 'react';
import { useNutrition } from '../../context/NutritionContext';

const ETHIOPIAN_FOOD_PRESETS = [
  { name: 'Spicy Misir Wat & Teff Injera', amharic: 'ምስር ወጥ በእንጀራ', calories: 490, protein: 21, carbs: 76, fats: 11, iron: 4.8, isTsom: true, category: 'lunch' },
  { name: 'Shiro Mitten with Injera', amharic: 'ሽሮ ምጥን በእንጀራ', calories: 420, protein: 16, carbs: 65, fats: 9, iron: 3.5, isTsom: true, category: 'lunch' },
  { name: 'Kinche with Niter Kibbeh / Oil', amharic: 'ቂንጬ በቅቤ/ዘይት', calories: 320, protein: 8, carbs: 58, fats: 7, iron: 3.2, isTsom: true, category: 'breakfast' },
  { name: 'Gomen (Collard Greens)', amharic: 'የጎመን ወጥ', calories: 90, protein: 3, carbs: 12, fats: 3, iron: 2.1, isTsom: true, category: 'dinner' },
  { name: 'Genfo (Barley/Wheat Porridge)', amharic: 'የገንፎ ቁርስ', calories: 410, protein: 12, carbs: 72, fats: 10, iron: 2.8, isTsom: false, category: 'breakfast' },
  { name: 'Doro Wat with Boiled Egg', amharic: 'ዶሮ ወጥ ከእንቁላል ጋር', calories: 580, protein: 38, carbs: 42, fats: 22, iron: 4.2, isTsom: false, category: 'dinner' },
  { name: 'Kolo (Roasted Barley & Chickpeas)', amharic: 'ቆሎ', calories: 140, protein: 6, carbs: 24, fats: 3, iron: 1.6, isTsom: true, category: 'snacks' },
  { name: 'Chechebsa (Kita Firfir)', amharic: 'ጨጨብሳ', calories: 360, protein: 9, carbs: 62, fats: 8, iron: 2.4, isTsom: true, category: 'breakfast' },
  { name: 'Fasolia & Karot (Green Beans)', amharic: 'የፋሶሊያ ወጥ', calories: 130, protein: 4, carbs: 19, fats: 4, iron: 1.8, isTsom: true, category: 'dinner' },
];

const LogMealModal = ({ isOpen, onClose, initialMode = 'manual', defaultCategory = 'lunch' }) => {
  const { addFoodLog } = useNutrition();
  const [activeTab, setActiveTab] = useState(initialMode); // 'manual', 'scan', 'voice'
  const [category, setCategory] = useState(defaultCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  const [portion, setPortion] = useState('1 standard plate');
  const [customCalories, setCustomCalories] = useState('');
  const [customProtein, setCustomProtein] = useState('');
  const [customCarbs, setCustomCarbs] = useState('');
  const [customFats, setCustomFats] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState('');

  if (!isOpen) return null;

  const handleSelectPreset = (food) => {
    setSelectedFood(food);
    setSearchQuery(food.name);
    setCustomCalories(food.calories);
    setCustomProtein(food.protein);
    setCustomCarbs(food.carbs);
    setCustomFats(food.fats);
    if (food.category) setCategory(food.category);
  };

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      handleSelectPreset(ETHIOPIAN_FOOD_PRESETS[0]);
    }, 1200);
  };

  const handleSimulateVoice = () => {
    setIsListening(true);
    setVoiceText('Listening for Ethiopian meal description...');
    setTimeout(() => {
      setVoiceText('"I had one plate of Shiro Mitten with Injera and Gomen"');
      setIsListening(false);
      handleSelectPreset(ETHIOPIAN_FOOD_PRESETS[1]);
    }, 1500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = selectedFood ? selectedFood.name : searchQuery || 'Custom Ethiopian Meal';
    const amharic = selectedFood ? selectedFood.amharic : '';
    const calories = Number(customCalories) || (selectedFood ? selectedFood.calories : 350);
    const protein = Number(customProtein) || (selectedFood ? selectedFood.protein : 12);
    const carbs = Number(customCarbs) || (selectedFood ? selectedFood.carbs : 50);
    const fats = Number(customFats) || (selectedFood ? selectedFood.fats : 8);

    addFoodLog({
      name,
      amharicName: amharic,
      portion,
      calories,
      protein,
      carbs,
      fats,
      category,
      isTsom: selectedFood ? selectedFood.isTsom : true,
      image: selectedFood ? 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=400&q=80' : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
    });

    onClose();
  };

  const filteredPresets = ETHIOPIAN_FOOD_PRESETS.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.amharic.includes(searchQuery)
  );

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div className="modal-card-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-row">
          <div className="modal-title-wrap">
            <h3 className="modal-title">Log Ethiopian Meal</h3>
            <p className="modal-subtitle">Track nutrition with heritage recipe intelligence</p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="modal-tabs-row">
          <button
            className={`modal-tab-btn ${activeTab === 'manual' ? 'active' : ''}`}
            onClick={() => setActiveTab('manual')}
          >
            ✏️ Manual Entry
          </button>
          <button
            className={`modal-tab-btn ${activeTab === 'scan' ? 'active' : ''}`}
            onClick={() => setActiveTab('scan')}
          >
            📷 Scan Meal (AI Vision)
          </button>
          <button
            className={`modal-tab-btn ${activeTab === 'voice' ? 'active' : ''}`}
            onClick={() => setActiveTab('voice')}
          >
            🎙️ Voice Log
          </button>
        </div>

        {/* Scan Mode */}
        {activeTab === 'scan' && (
          <div className="modal-scan-panel">
            <div className="scan-viewfinder">
              {isScanning ? (
                <div className="scanning-pulse">
                  <div className="laser-line"></div>
                  <span>Analyzing meal composition & portion size...</span>
                </div>
              ) : (
                <div className="scan-placeholder">
                  <div className="camera-icon-large">📸</div>
                  <p>Point camera at your plate or upload photo of Wat / Injera</p>
                  <button type="button" className="btn-start-scan" onClick={handleSimulateScan}>
                    Simulate AI Meal Scan
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Voice Mode */}
        {activeTab === 'voice' && (
          <div className="modal-voice-panel">
            <div className="voice-mic-indicator">
              <div className={`voice-mic-circle ${isListening ? 'listening' : ''}`}>
                🎙️
              </div>
              <p className="voice-transcription">{voiceText || "Tap below to describe your meal in Amharic or English"}</p>
              <button
                type="button"
                className={`btn-start-voice ${isListening ? 'recording' : ''}`}
                onClick={handleSimulateVoice}
              >
                {isListening ? 'Listening...' : 'Start Voice Recording'}
              </button>
            </div>
          </div>
        )}

        {/* Manual Input Form */}
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Meal Timing</label>
            <div className="meal-type-selector">
              {['breakfast', 'lunch', 'dinner', 'snacks'].map((t) => (
                <button
                  type="button"
                  key={t}
                  className={`meal-type-pill ${category === t ? 'active' : ''}`}
                  onClick={() => setCategory(t)}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Search Ethiopian Food / Recipe</label>
            <input
              type="text"
              className="modal-input"
              placeholder="e.g. Misir Wat, ቂንጬ, Shiro, Doro..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Quick Presets Carousel/Chips */}
          <div className="presets-list">
            {filteredPresets.slice(0, 4).map((item, idx) => (
              <div
                key={idx}
                className={`preset-chip ${selectedFood?.name === item.name ? 'selected' : ''}`}
                onClick={() => handleSelectPreset(item)}
              >
                <span className="preset-name">{item.name}</span>
                <span className="preset-amharic amharic-text">{item.amharic}</span>
                <span className="preset-cal">{item.calories} kcal</span>
              </div>
            ))}
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Portion / Serving</label>
              <input
                type="text"
                className="modal-input"
                value={portion}
                onChange={(e) => setPortion(e.target.value)}
                placeholder="e.g. 1 plate, 200g, 1 bowl"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Estimated Calories (kcal)</label>
              <input
                type="number"
                className="modal-input"
                value={customCalories}
                onChange={(e) => setCustomCalories(e.target.value)}
                placeholder="e.g. 450"
              />
            </div>
          </div>

          <div className="form-row-3">
            <div className="form-group">
              <label className="form-label">Protein (g)</label>
              <input
                type="number"
                className="modal-input"
                value={customProtein}
                onChange={(e) => setCustomProtein(e.target.value)}
                placeholder="g"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Carbs (g)</label>
              <input
                type="number"
                className="modal-input"
                value={customCarbs}
                onChange={(e) => setCustomCarbs(e.target.value)}
                placeholder="g"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Fats (g)</label>
              <input
                type="number"
                className="modal-input"
                value={customFats}
                onChange={(e) => setCustomFats(e.target.value)}
                placeholder="g"
              />
            </div>
          </div>

          <div className="modal-actions-footer">
            <button type="button" className="btn-modal-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-modal-submit">
              + Save & Log Meal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogMealModal;
