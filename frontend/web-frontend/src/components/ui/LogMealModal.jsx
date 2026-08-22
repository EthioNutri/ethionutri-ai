import React, { useState, useEffect, useRef } from 'react';
import { useNutrition } from '../../context/NutritionContext';
import { useLanguage } from '../../context/LanguageContext';
import apiClient from '../../services/apiClient';

const ETHIOPIAN_FOOD_PRESETS = [
  { name: 'Spicy Misir Wat & Teff Injera', amharic: 'ምስር ወጥ በእንጀራ', calories: 490, protein: 21, carbs: 76, fats: 11, iron: 4.8, isTsom: true, category: 'lunch' },
  { name: 'Shiro Mitten with Teff Injera', amharic: 'ሽሮ ምጥን በእንጀራ', calories: 420, protein: 16, carbs: 65, fats: 9, iron: 3.5, isTsom: true, category: 'lunch' },
  { name: 'Kinche with Olive Oil / Niter Kibbeh', amharic: 'ቂንጬ በቅቤ/ዘይት', calories: 320, protein: 8, carbs: 58, fats: 7, iron: 3.2, isTsom: true, category: 'breakfast' },
  { name: 'Steamed Gomen (Collard Greens)', amharic: 'የሀበሻ ጎመን', calories: 90, protein: 3, carbs: 12, fats: 3, iron: 2.1, isTsom: true, category: 'dinner' },
  { name: 'Genfo (Barley/Wheat Porridge)', amharic: 'የገብስ ገንፎ', calories: 410, protein: 12, carbs: 72, fats: 10, iron: 2.8, isTsom: false, category: 'breakfast' },
  { name: 'Doro Wat with Brown Injera & Egg', amharic: 'ዶሮ ወጥ ከእንቁላል ጋር', calories: 580, protein: 38, carbs: 42, fats: 22, iron: 4.2, isTsom: false, category: 'dinner' },
  { name: 'Roasted Kolo & Peanuts', amharic: 'የተቆላ ቆሎ', calories: 140, protein: 6, carbs: 24, fats: 3, iron: 1.6, isTsom: true, category: 'snacks' },
  { name: 'Chechebsa (Kita Firfir)', amharic: 'ጨጨብሳ', calories: 360, protein: 9, carbs: 62, fats: 8, iron: 2.4, isTsom: true, category: 'breakfast' },
  { name: 'Fosolia & Karot (Green Beans & Carrots)', amharic: 'የፋሶሊያ ወጥ', calories: 130, protein: 4, carbs: 19, fats: 4, iron: 1.8, isTsom: true, category: 'dinner' },
  { name: 'Azifa (Whole Green Lentil Salad)', amharic: 'አዚፋ በሰናፍጭ', calories: 280, protein: 14, carbs: 42, fats: 6, iron: 3.8, isTsom: true, category: 'lunch' },
  { name: 'Buticha (Chickpea Scramble with Lemon)', amharic: 'ቡቲቻ በሎሚ', calories: 260, protein: 13, carbs: 36, fats: 7, iron: 3.1, isTsom: true, category: 'breakfast' },
  { name: 'Beef Tibs with Injera & Awaze', amharic: 'የበሬ ጥብስ', calories: 520, protein: 34, carbs: 48, fats: 18, iron: 4.0, isTsom: false, category: 'dinner' }
];

const parseSpeechDescription = (text) => {
  const lower = text.toLowerCase();
  let matchedPreset = ETHIOPIAN_FOOD_PRESETS[1]; // default Shiro

  if (lower.includes('misir') || lower.includes('ምስር') || lower.includes('lentil')) {
    matchedPreset = ETHIOPIAN_FOOD_PRESETS[0];
  } else if (lower.includes('shiro') || lower.includes('ሽሮ')) {
    matchedPreset = ETHIOPIAN_FOOD_PRESETS[1];
  } else if (lower.includes('kinche') || lower.includes('ቂንጬ') || lower.includes('wheat')) {
    matchedPreset = ETHIOPIAN_FOOD_PRESETS[2];
  } else if (lower.includes('gomen') || lower.includes('ጎመን') || lower.includes('greens')) {
    matchedPreset = ETHIOPIAN_FOOD_PRESETS[3];
  } else if (lower.includes('genfo') || lower.includes('ገንፎ') || lower.includes('porridge')) {
    matchedPreset = ETHIOPIAN_FOOD_PRESETS[4];
  } else if (lower.includes('doro') || lower.includes('ዶሮ') || lower.includes('chicken')) {
    matchedPreset = ETHIOPIAN_FOOD_PRESETS[5];
  } else if (lower.includes('kolo') || lower.includes('ቆሎ')) {
    matchedPreset = ETHIOPIAN_FOOD_PRESETS[6];
  } else if (lower.includes('chechebsa') || lower.includes('ጨጨብሳ') || lower.includes('firfir')) {
    matchedPreset = ETHIOPIAN_FOOD_PRESETS[7];
  } else if (lower.includes('fosolia') || lower.includes('ፋሶሊያ')) {
    matchedPreset = ETHIOPIAN_FOOD_PRESETS[8];
  } else if (lower.includes('azifa') || lower.includes('አዚፋ')) {
    matchedPreset = ETHIOPIAN_FOOD_PRESETS[9];
  } else if (lower.includes('buticha') || lower.includes('ቡቲቻ')) {
    matchedPreset = ETHIOPIAN_FOOD_PRESETS[10];
  } else if (lower.includes('tibs') || lower.includes('ጥብስ') || lower.includes('beef')) {
    matchedPreset = ETHIOPIAN_FOOD_PRESETS[11];
  }

  // Detect meal timing
  let category = matchedPreset.category;
  if (lower.includes('breakfast') || lower.includes('ቁርስ') || lower.includes('morning')) {
    category = 'breakfast';
  } else if (lower.includes('lunch') || lower.includes('ምሳ') || lower.includes('afternoon')) {
    category = 'lunch';
  } else if (lower.includes('dinner') || lower.includes('እራት') || lower.includes('evening') || lower.includes('night')) {
    category = 'dinner';
  } else if (lower.includes('snack') || lower.includes('መክሰስ')) {
    category = 'snacks';
  }

  // Detect portion multiplier
  let portionMultiplier = 1;
  let portionText = '1 standard plate';
  if (lower.includes('1.5') || lower.includes('one and a half') || lower.includes('አንድ ተኩል')) {
    portionMultiplier = 1.5;
    portionText = '1.5 plates / Injera';
  } else if (lower.includes('2') || lower.includes('two') || lower.includes('ሁለት')) {
    portionMultiplier = 2;
    portionText = '2 servings / Injera';
  } else if (lower.includes('half') || lower.includes('0.5') || lower.includes('ግማሽ')) {
    portionMultiplier = 0.5;
    portionText = '0.5 serving (half portion)';
  } else if (lower.includes('bowl') || lower.includes('ሰሃን')) {
    portionText = '1 bowl / ሰሃን';
  }

  return {
    name: matchedPreset.name,
    amharic: matchedPreset.amharic,
    portion: portionText,
    calories: Math.round(matchedPreset.calories * portionMultiplier),
    protein: Math.round(matchedPreset.protein * portionMultiplier),
    carbs: Math.round(matchedPreset.carbs * portionMultiplier),
    fats: Math.round(matchedPreset.fats * portionMultiplier),
    iron: Number((matchedPreset.iron * portionMultiplier).toFixed(1)),
    category,
    isTsom: matchedPreset.isTsom,
    source: 'voice'
  };
};

const LogMealModal = ({ isOpen, onClose, initialMode = 'manual', defaultCategory = 'lunch' }) => {
  const { addFoodLog } = useNutrition();
  const { language } = useLanguage();
  const isAmharic = language === 'am';

  const [activeTab, setActiveTab] = useState(initialMode === 'voice' ? 'voice' : 'manual');
  const [category, setCategory] = useState(defaultCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  const [portion, setPortion] = useState('1 standard plate');
  const [customCalories, setCustomCalories] = useState('');
  const [customProtein, setCustomProtein] = useState('');
  const [customCarbs, setCustomCarbs] = useState('');
  const [customFats, setCustomFats] = useState('');
  const [customIron, setCustomIron] = useState('');

  // Voice Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [parsedVoiceEntry, setParsedVoiceEntry] = useState(null);
  const [isParsingVoice, setIsParsingVoice] = useState(false);

  const recognitionRef = useRef(null);

  useEffect(() => {
    setActiveTab(initialMode === 'voice' ? 'voice' : 'manual');
  }, [initialMode, isOpen]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  if (!isOpen) return null;

  const handleSelectPreset = (food) => {
    setSelectedFood(food);
    setSearchQuery(food.name);
    setCustomCalories(food.calories);
    setCustomProtein(food.protein);
    setCustomCarbs(food.carbs);
    setCustomFats(food.fats);
    setCustomIron(food.iron || 3.0);
    if (food.category) setCategory(food.category);
  };

  const startVoiceRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsRecording(true);
      setVoiceTranscript(isAmharic ? 'የድምጽ ግቤት እየተቀዳ ነው...' : 'Listening for your meal description...');
      setTimeout(() => {
        const demoPhrase = isAmharic
          ? 'ለእራት አንድ ሰሃን የጤፍ እንጀራ በሽሮ ምጥን እና ጎመን ተመግቤያለሁ'
          : 'I ate 1 plate of Shiro Mitten with 1.5 Injera and Gomen for dinner';
        setVoiceTranscript(`"${demoPhrase}"`);
        setIsRecording(false);
        processVoiceResult(demoPhrase);
      }, 2000);
      return;
    }

    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = isAmharic ? 'am-ET' : 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
        setVoiceTranscript(isAmharic ? '🎙️ እያዳመጥኩ ነው... ምሳ ወይም እራት ምን እንደተመገቡ ይናገሩ' : '🎙️ Listening... Speak what you ate (e.g. 1 plate of Shiro with Injera)');
        setParsedVoiceEntry(null);
      };

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript.trim()) {
          setVoiceTranscript(transcript);
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsRecording(false);
        if (!voiceTranscript) {
          setVoiceTranscript(isAmharic ? '⚠️ ድምጽ አልተያዘም። እባክዎ እንደገና ይሞክሩ።' : '⚠️ Speech not captured. Please retry.');
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
        if (voiceTranscript) {
          processVoiceResult(voiceTranscript);
        }
      };

      recognition.start();
    } catch (err) {
      console.error('Speech recognition initiation error:', err);
      setIsRecording(false);
    }
  };

  const stopVoiceRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
    if (voiceTranscript) {
      processVoiceResult(voiceTranscript);
    }
  };

  const processVoiceResult = async (spokenText) => {
    setIsParsingVoice(true);
    try {
      let parsed = null;
      try {
        const res = await apiClient.post('/food-logs/voice', { text: spokenText });
        if (res.data && res.data.proposed) {
          const p = res.data.proposed;
          parsed = {
            name: p.customName || p.name || 'Ethiopian Meal',
            amharic: p.nameAmharic || '',
            portion: p.quantityG ? `${p.quantityG}g` : '1 standard plate',
            calories: p.calories || 380,
            protein: p.proteinG || p.protein || 14,
            carbs: p.carbsG || p.carbs || 55,
            fats: p.fatsG || p.fats || 9,
            iron: p.ironMg || p.iron || 3.5,
            category: p.mealType || category || 'lunch',
            isTsom: p.isFastingFriendly !== undefined ? p.isFastingFriendly : true
          };
        }
      } catch (backendErr) {
        console.warn('Backend voice parser fallback to local NLP:', backendErr);
      }

      if (!parsed) {
        parsed = parseSpeechDescription(spokenText);
      }

      setParsedVoiceEntry(parsed);
      setSelectedFood(parsed);
      setCustomCalories(parsed.calories);
      setCustomProtein(parsed.protein);
      setCustomCarbs(parsed.carbs);
      setCustomFats(parsed.fats);
      setCustomIron(parsed.iron);
      setPortion(parsed.portion);
      setCategory(parsed.category);
    } finally {
      setIsParsingVoice(false);
    }
  };

  const handleConfirmVoiceEntry = () => {
    if (!parsedVoiceEntry) return;

    addFoodLog({
      name: parsedVoiceEntry.name,
      amharicName: parsedVoiceEntry.amharic,
      portion: parsedVoiceEntry.portion,
      calories: Number(parsedVoiceEntry.calories),
      protein: Number(parsedVoiceEntry.protein),
      carbs: Number(parsedVoiceEntry.carbs),
      fats: Number(parsedVoiceEntry.fats),
      iron: Number(parsedVoiceEntry.iron),
      category: parsedVoiceEntry.category,
      isTsom: parsedVoiceEntry.isTsom,
      image: '/images/foods/beyaynetu_platter.jpg',
    });

    onClose();
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    const name = selectedFood ? selectedFood.name : searchQuery || 'Custom Ethiopian Meal';
    const amharic = selectedFood ? selectedFood.amharic : '';
    const calories = Number(customCalories) || (selectedFood ? selectedFood.calories : 350);
    const protein = Number(customProtein) || (selectedFood ? selectedFood.protein : 12);
    const carbs = Number(customCarbs) || (selectedFood ? selectedFood.carbs : 50);
    const fats = Number(customFats) || (selectedFood ? selectedFood.fats : 8);
    const iron = Number(customIron) || (selectedFood ? selectedFood.iron : 3.0);

    addFoodLog({
      name,
      amharicName: amharic,
      portion,
      calories,
      protein,
      carbs,
      fats,
      iron,
      category,
      isTsom: selectedFood ? selectedFood.isTsom : true,
      image: '/images/foods/beyaynetu_platter.jpg',
    });

    onClose();
  };

  const filteredPresets = ETHIOPIAN_FOOD_PRESETS.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.amharic.includes(searchQuery)
  );

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div className="modal-card-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
        <div className="modal-header-row">
          <div className="modal-title-wrap">
            <h3 className="modal-title" style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-dark)' }}>
              {isAmharic ? 'የኢትዮጵያ ምግብ መዝግብ' : 'Log Ethiopian Meal'}
            </h3>
            <p className="modal-subtitle" style={{ fontSize: '12.5px', color: 'var(--text-medium)' }}>
              {isAmharic ? 'በባህላዊ ስነ-ምግብ እውቀት የተመሰረተ ትክክለኛ ምዝገባ' : 'Track nutrition with heritage recipe intelligence'}
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose} title="Close">✕</button>
        </div>

        {/* 2 Clean Mode Selector Tabs */}
        <div className="modal-tabs-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
          <button
            type="button"
            className={`modal-tab-btn ${activeTab === 'voice' ? 'active' : ''}`}
            onClick={() => setActiveTab('voice')}
            style={{ padding: '10px 14px', fontWeight: 800, fontSize: '13.5px' }}
          >
            🎙️ {isAmharic ? 'በድምጽ መዝግብ' : 'Voice Log'}
          </button>
          <button
            type="button"
            className={`modal-tab-btn ${activeTab === 'manual' ? 'active' : ''}`}
            onClick={() => setActiveTab('manual')}
            style={{ padding: '10px 14px', fontWeight: 800, fontSize: '13.5px' }}
          >
            ✏️ {isAmharic ? 'በጽሑፍ መዝግብ' : 'Manual Entry'}
          </button>
        </div>

        {/* Voice Log Mode */}
        {activeTab === 'voice' && (
          <div className="modal-voice-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Visualizer and Live Recording Controls */}
            <div style={{
              background: 'var(--card-bg-muted, #FAF7F2)',
              border: isRecording ? '2px solid #EF4444' : '1px solid var(--border-color, #EADBCE)',
              borderRadius: '14px',
              padding: '24px 20px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '14px',
              transition: 'all 0.2s ease'
            }}>
              {/* Waveform / Pulsing Mic Indicator */}
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isRecording && (
                  <div style={{
                    position: 'absolute',
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'rgba(239, 68, 68, 0.25)',
                    animation: 'pulse 1.2s infinite ease-out'
                  }} />
                )}
                <div
                  onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: isRecording ? '#EF4444' : 'var(--forest-green, #125238)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                    cursor: 'pointer',
                    boxShadow: isRecording ? '0 0 16px rgba(239, 68, 68, 0.5)' : '0 4px 12px rgba(18, 82, 56, 0.25)',
                    zIndex: 2,
                    transition: 'all 0.2s ease'
                  }}
                  title={isRecording ? 'Click to Stop' : 'Click to Speak'}
                >
                  🎙️
                </div>
              </div>

              {/* Pulsing Waveform Bars */}
              {isRecording && (
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center', height: '24px' }}>
                  {[12, 22, 16, 24, 18, 10, 20, 14].map((h, i) => (
                    <div
                      key={i}
                      style={{
                        width: '4px',
                        height: `${h}px`,
                        background: '#EF4444',
                        borderRadius: '2px',
                        animation: `bounce 0.6s infinite alternate ${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Transcript text */}
              <p style={{
                fontSize: '13.5px',
                color: isRecording ? '#B91C1C' : 'var(--text-dark, #2B2622)',
                fontWeight: isRecording ? 700 : 500,
                maxWidth: '440px',
                lineHeight: 1.5,
                margin: 0
              }}>
                {voiceTranscript || (isAmharic ? 'ማይክሮፎኑን ተጭነው የተመገቡትን ምግብ በአማርኛ ወይም በእንግሊዝኛ ይናገሩ (ለምሳሌ፡ "ምሳ 1 ሰሃን ሽሮ ወጥ በጤፍ እንጀራ")' : 'Click the mic and describe your meal (e.g. "I ate 1 plate of Shiro Wat with 1.5 Injera for lunch")')}
              </p>

              {/* Recording Action Button */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                  style={{
                    background: isRecording ? '#EF4444' : 'var(--forest-green, #125238)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 20px',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  {isRecording ? (isAmharic ? '⏹️ ቀረጻ አቁም' : '⏹️ Stop Recording') : (isAmharic ? '🎙️ መቅረጽ ጀምር' : '🎙️ Start Speaking')}
                </button>
              </div>
            </div>

            {/* Parsing Spinner */}
            {isParsingVoice && (
              <div style={{ textAlign: 'center', padding: '12px', fontSize: '13px', color: 'var(--forest-green, #125238)', fontWeight: 700 }}>
                ✨ {isAmharic ? 'የስነ-ምግብ ዝርዝር በመተንተን ላይ ነው...' : 'Analyzing nutritional composition & portion...'}
              </div>
            )}

            {/* Editable Confirmation Card */}
            {parsedVoiceEntry && !isParsingVoice && (
              <div style={{
                background: 'var(--card-bg, #FFFFFF)',
                border: '2px solid var(--forest-green, #125238)',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                boxShadow: '0 4px 16px rgba(18, 82, 56, 0.08)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '10px', fontWeight: 800, color: '#C97B3D', textTransform: 'uppercase' }}>
                      {isAmharic ? 'የተተነተነ ምግብ' : 'AI Parsed Meal Entry'}
                    </span>
                    <h4 style={{ margin: '2px 0 0', fontSize: '16px', fontWeight: 800, color: 'var(--text-dark, #125238)' }}>
                      {isAmharic ? (parsedVoiceEntry.amharic || parsedVoiceEntry.name) : parsedVoiceEntry.name}
                    </h4>
                    {parsedVoiceEntry.amharic && (
                      <span style={{ fontSize: '12px', color: 'var(--text-medium, #716A63)' }}>
                        {parsedVoiceEntry.amharic}
                      </span>
                    )}
                  </div>
                  {parsedVoiceEntry.isTsom && (
                    <span style={{ background: 'rgba(201, 123, 61, 0.15)', color: '#C97B3D', border: '1px solid #C97B3D', fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '12px' }}>
                      🌱 {isAmharic ? 'የጾም ምግብ' : 'Tsom Friendly'}
                    </span>
                  )}
                </div>

                {/* Editable Fields Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  <div style={{ background: 'var(--card-bg-muted, #FAF7F2)', padding: '8px', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-medium)', fontWeight: 700 }}>{isAmharic ? 'ካሎሪ' : 'Calories'}</div>
                    <input
                      type="number"
                      value={parsedVoiceEntry.calories}
                      onChange={(e) => setParsedVoiceEntry({ ...parsedVoiceEntry, calories: Number(e.target.value) })}
                      style={{ width: '100%', textAlign: 'center', border: '1px solid #D5C9BE', borderRadius: '4px', padding: '2px', fontWeight: 800, fontSize: '13px' }}
                    />
                    <span style={{ fontSize: '9.5px', color: 'var(--text-medium)' }}>kcal</span>
                  </div>

                  <div style={{ background: 'var(--card-bg-muted, #FAF7F2)', padding: '8px', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-medium)', fontWeight: 700 }}>{isAmharic ? 'ፕሮቲን' : 'Protein'}</div>
                    <input
                      type="number"
                      value={parsedVoiceEntry.protein}
                      onChange={(e) => setParsedVoiceEntry({ ...parsedVoiceEntry, protein: Number(e.target.value) })}
                      style={{ width: '100%', textAlign: 'center', border: '1px solid #D5C9BE', borderRadius: '4px', padding: '2px', fontWeight: 800, fontSize: '13px' }}
                    />
                    <span style={{ fontSize: '9.5px', color: 'var(--text-medium)' }}>g</span>
                  </div>

                  <div style={{ background: 'var(--card-bg-muted, #FAF7F2)', padding: '8px', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-medium)', fontWeight: 700 }}>{isAmharic ? 'ካርቦሃይድሬት' : 'Carbs'}</div>
                    <input
                      type="number"
                      value={parsedVoiceEntry.carbs}
                      onChange={(e) => setParsedVoiceEntry({ ...parsedVoiceEntry, carbs: Number(e.target.value) })}
                      style={{ width: '100%', textAlign: 'center', border: '1px solid #D5C9BE', borderRadius: '4px', padding: '2px', fontWeight: 800, fontSize: '13px' }}
                    />
                    <span style={{ fontSize: '9.5px', color: 'var(--text-medium)' }}>g</span>
                  </div>

                  <div style={{ background: 'var(--card-bg-muted, #FAF7F2)', padding: '8px', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-medium)', fontWeight: 700 }}>{isAmharic ? 'ብረት' : 'Iron'}</div>
                    <input
                      type="number"
                      step="0.1"
                      value={parsedVoiceEntry.iron}
                      onChange={(e) => setParsedVoiceEntry({ ...parsedVoiceEntry, iron: Number(e.target.value) })}
                      style={{ width: '100%', textAlign: 'center', border: '1px solid #D5C9BE', borderRadius: '4px', padding: '2px', fontWeight: 800, fontSize: '13px' }}
                    />
                    <span style={{ fontSize: '9.5px', color: 'var(--text-medium)' }}>mg</span>
                  </div>
                </div>

                {/* Portion & Category Selection */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-medium)' }}>{isAmharic ? 'መጠን' : 'Portion'}</label>
                    <input
                      type="text"
                      className="modal-input"
                      value={parsedVoiceEntry.portion}
                      onChange={(e) => setParsedVoiceEntry({ ...parsedVoiceEntry, portion: e.target.value })}
                      style={{ padding: '6px 10px', fontSize: '12.5px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-medium)' }}>{isAmharic ? 'የምግብ ሰዓት' : 'Meal Type'}</label>
                    <select
                      className="modal-input"
                      value={parsedVoiceEntry.category}
                      onChange={(e) => setParsedVoiceEntry({ ...parsedVoiceEntry, category: e.target.value })}
                      style={{ padding: '6px 10px', fontSize: '12.5px' }}
                    >
                      <option value="breakfast">{isAmharic ? 'ቁርስ (Breakfast)' : 'Breakfast'}</option>
                      <option value="lunch">{isAmharic ? 'ምሳ (Lunch)' : 'Lunch'}</option>
                      <option value="dinner">{isAmharic ? 'እራት (Dinner)' : 'Dinner'}</option>
                      <option value="snacks">{isAmharic ? 'መክሰስ (Snacks)' : 'Snacks'}</option>
                    </select>
                  </div>
                </div>

                {/* Confirm Button */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                  <button type="button" className="btn-modal-cancel" onClick={onClose} style={{ padding: '7px 14px', fontSize: '12.5px' }}>
                    {isAmharic ? 'ሰርዝ' : 'Cancel'}
                  </button>
                  <button
                    type="button"
                    className="btn-modal-submit"
                    onClick={handleConfirmVoiceEntry}
                    style={{ padding: '7px 18px', fontSize: '13px', fontWeight: 800, background: 'var(--forest-green, #125238)' }}
                  >
                    ✓ {isAmharic ? 'አረጋግጥና መዝግብ' : 'Confirm & Log Meal'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Manual Input Mode */}
        {activeTab === 'manual' && (
          <form onSubmit={handleManualSubmit} className="modal-form">
            <div className="form-group">
              <label className="form-label">{isAmharic ? 'የምግብ ሰዓት' : 'Meal Timing'}</label>
              <div className="meal-type-selector">
                {[
                  { key: 'breakfast', label: 'Breakfast', am: 'ቁርስ' },
                  { key: 'lunch', label: 'Lunch', am: 'ምሳ' },
                  { key: 'dinner', label: 'Dinner', am: 'እራት' },
                  { key: 'snacks', label: 'Snacks', am: 'መክሰስ' }
                ].map((t) => (
                  <button
                    type="button"
                    key={t.key}
                    className={`meal-type-pill ${category === t.key ? 'active' : ''}`}
                    onClick={() => setCategory(t.key)}
                  >
                    {isAmharic ? t.am : t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">{isAmharic ? 'የኢትዮጵያ ምግብ ፈልግ' : 'Search Ethiopian Food / Recipe'}</label>
              <input
                type="text"
                className="modal-input"
                placeholder={isAmharic ? 'ለምሳሌ፡ ምስር ወጥ፣ ቂንጬ፣ ሽሮ፣ ዶሮ...' : 'e.g. Misir Wat, Kinche, Shiro, Doro...'}
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
                  <span className="preset-name">{isAmharic ? item.amharic : item.name}</span>
                  <span className="preset-amharic amharic-text">{isAmharic ? item.name : item.amharic}</span>
                  <span className="preset-cal">{item.calories} kcal</span>
                </div>
              ))}
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">{isAmharic ? 'መጠን / አገልግሎት' : 'Portion / Serving'}</label>
                <input
                  type="text"
                  className="modal-input"
                  value={portion}
                  onChange={(e) => setPortion(e.target.value)}
                  placeholder="e.g. 1 plate, 200g, 1 bowl"
                />
              </div>
              <div className="form-group">
                <label className="form-label">{isAmharic ? 'ካሎሪ (kcal)' : 'Estimated Calories (kcal)'}</label>
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
                <label className="form-label">{isAmharic ? 'ፕሮቲን (g)' : 'Protein (g)'}</label>
                <input
                  type="number"
                  className="modal-input"
                  value={customProtein}
                  onChange={(e) => setCustomProtein(e.target.value)}
                  placeholder="g"
                />
              </div>
              <div className="form-group">
                <label className="form-label">{isAmharic ? 'ካርቦሃይድሬት (g)' : 'Carbs (g)'}</label>
                <input
                  type="number"
                  className="modal-input"
                  value={customCarbs}
                  onChange={(e) => setCustomCarbs(e.target.value)}
                  placeholder="g"
                />
              </div>
              <div className="form-group">
                <label className="form-label">{isAmharic ? 'ስብ (g)' : 'Fats (g)'}</label>
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
                {isAmharic ? 'ሰርዝ' : 'Cancel'}
              </button>
              <button type="submit" className="btn-modal-submit">
                + {isAmharic ? 'ምግብ መዝግብ' : 'Save & Log Meal'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LogMealModal;

