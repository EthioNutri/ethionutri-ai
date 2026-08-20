import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { getAvatarUrl } from '../utils/imageHelper';
import { getUserProfile, updateUserProfile } from '../services/userService';

const FASTING_PRACTICE_OPTIONS = [
  { id: 'orthodox_tsom', labelEn: 'Ethiopian Orthodox (Tsom)', labelAm: 'የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ (ጾም)', icon: '🌱', badge: 'Orthodox Fasting Active 🌱' },
  { id: 'ramadan', labelEn: 'Islamic Fasting (Ramadan & Sunnah)', labelAm: 'የእስልምና ጾም (ረመዳን እና ሱና)', icon: '🌙', badge: 'Ramadan Fasting Active 🌙' },
  { id: 'none', labelEn: 'None (No religious fasts)', labelAm: 'ምንም ጾም አልከተልም', icon: '☀️', badge: 'Fasting Inactive ☀️' }
];

const FASTING_STRICTNESS_OPTIONS = [
  { id: 'strict_vegan', labelEn: 'Strict Vegan (No Animal Products / Dairy / Eggs)', labelAm: 'Strict Vegan (የእንስሳት ተዋጽኦ ጨርሶ አይበላም)' },
  { id: 'seafood_allowed', labelEn: 'Seafood Allowed (Fish Permitted)', labelAm: 'የዓሣ ምግብ ይፈቀዳል' },
  { id: 'standard', labelEn: 'Standard / Flexible Fasting', labelAm: 'መደበኛ / ተለዋዋጭ ጾም' }
];

const DIETARY_RESTRICTION_CHIPS = [
  { id: 'vegan', labelEn: 'Strict Vegan', labelAm: 'ቪጋን (100% የዕፅዋት)' },
  { id: 'vegetarian', labelEn: 'Vegetarian', labelAm: 'ቬጀቴሪያን' },
  { id: 'halal', labelEn: 'Halal Certified', labelAm: 'ሐላል (Halal)' },
  { id: 'gluten_free', labelEn: 'Gluten-Free (Teff Only)', labelAm: 'ግሉተን-ነፃ (100% ጤፍ)' }
];

const CLINICAL_CONDITION_CHIPS = [
  { id: 'anemia', name: 'Anemia', labelEn: 'Anemia (Iron Deficiency Alerts)', labelAm: 'የደም ማነስ (የብረት እጥረት alerts)', icon: '🩸' },
  { id: 'diabetes', name: 'Diabetes', labelEn: 'Type 2 Diabetes (Carb Targets)', labelAm: 'የስኳር በሽታ (የካርቦሃይድሬት ክትትል)', icon: '🩸' },
  { id: 'hypertension', name: 'Hypertension', labelEn: 'Hypertension (Low Sodium)', labelAm: 'የደም ግፊት (የጨው መጠን መቆጣጠሪያ)', icon: '🫀' },
  { id: 'pregnancy', name: 'Pregnancy', labelEn: 'Pregnancy / Lactation Support', labelAm: 'እርግዝና / ጡት ማጥባት', icon: '🤰' },
  { id: 'celiac', name: 'Gluten-sensitive', labelEn: 'Gluten-Sensitive / Celiac', labelAm: 'ግሉተን አለመስማማት', icon: '🌾' },
  { id: 'lactose_intolerant', name: 'Lactose-intolerant', labelEn: 'Lactose Intolerance', labelAm: 'የወተት ተዋጽኦ አለመስማማት', icon: '🥛' }
];

const ACTIVITY_LEVEL_OPTIONS = [
  { id: 'sedentary', labelEn: 'Sedentary (Little to no exercise, desk work)', labelAm: 'አነስተኛ እንቅስቃሴ (የቢሮ ስራ)' },
  { id: 'lightly_active', labelEn: 'Lightly Active (1-3 workout days/week)', labelAm: 'ቀላል እንቅስቃሴ (1-3 ቀናት በሳምንት)' },
  { id: 'moderately_active', labelEn: 'Moderately Active (3-5 workout days/week)', labelAm: 'መካከለኛ እንቅስቃሴ (3-5 ቀናት በሳምንት)' },
  { id: 'very_active', labelEn: 'Very Active (6-7 heavy workout days/week)', labelAm: 'ከፍተኛ እንቅስቃሴ (6-7 ቀናት በሳምንት)' }
];

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';

const Profile = () => {
  const { user, updateUserProfile: updateAuthUser } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme, isDark } = useTheme();

  const fileInputRef = useRef(null);

  // Initial & Form State
  const [initialData, setInitialData] = useState({});
  const [isEditing, setIsEditing] = useState(true);
  const [isDirty, setIsDirty] = useState(false);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(DEFAULT_AVATAR);
  
  // Biometrics
  const [age, setAge] = useState(28);
  const [biologicalSex, setBiologicalSex] = useState('female');
  const [heightCm, setHeightCm] = useState(168);
  const [weightKg, setWeightKg] = useState(62);
  const [targetWeightKg, setTargetWeightKg] = useState(60);
  const [activityLevel, setActivityLevel] = useState('moderately_active');
  const [dailyCalorieTarget, setDailyCalorieTarget] = useState(2000);

  // Ethiopian Dietary & Fasting
  const [fastingPractice, setFastingPractice] = useState('orthodox_tsom');
  const [fastingStrictness, setFastingStrictness] = useState('strict_vegan');
  const [dietaryRestrictions, setDietaryRestrictions] = useState([]);

  // Clinical Conditions
  const [medicalConditions, setMedicalConditions] = useState([]);

  // App Preferences
  const [preferredLanguage, setPreferredLanguage] = useState('en');
  const [themeMode, setThemeMode] = useState('light');

  // Status & Feedback
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [validationError, setValidationError] = useState('');

  // Fetch initial profile
  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const data = await getUserProfile();
      const userObj = data.user || data;
      const hp = userObj.healthProfile || {};
      const ng = userObj.nutritionGoals || {};

      const fetchedName = userObj.fullName || userObj.full_name || userObj.name || `${userObj.firstName || ''} ${userObj.lastName || ''}`.trim() || 'Selamawit Kebede';
      const fetchedEmail = userObj.email || 'user@ethionutri.ai';
      const fetchedPhone = userObj.phone || userObj.phoneNumber || userObj.phone_number || '+251 91 123 4567';
      const fetchedAvatar = userObj.avatar || userObj.avatarUrl || userObj.profilePhotoUrl || userObj.avatar_url || DEFAULT_AVATAR;

      const fetchedAge = hp.age || userObj.age || 28;
      const fetchedSex = hp.biologicalSex || userObj.biological_sex || userObj.biologicalSex || 'female';
      const fetchedHeight = hp.heightCm || userObj.height_cm || userObj.heightCm || 168;
      const fetchedWeight = hp.weightKg || userObj.weight_kg || userObj.weightKg || 62;
      const fetchedTargetWeight = hp.targetWeightKg || userObj.target_weight_kg || userObj.targetWeightKg || 60;
      const fetchedActivity = hp.activityLevel || userObj.activity_level || userObj.activityLevel || 'moderately_active';

      const fetchedFasting = hp.fastingPractice || userObj.fasting_practice || userObj.fastingPractice || 'orthodox_tsom';
      const fetchedStrictness = hp.fastingStrictness || userObj.fasting_strictness || userObj.fastingStrictness || 'strict_vegan';
      
      const rawConditions = userObj.medical_conditions || hp.healthConditions || userObj.healthConditions || [];
      const fetchedConditions = Array.isArray(rawConditions) ? rawConditions : [rawConditions];

      const rawRestrictions = userObj.dietary_restrictions || hp.dietaryRestrictions || userObj.dietaryRestrictions || [];
      const fetchedRestrictions = Array.isArray(rawRestrictions) ? rawRestrictions : [rawRestrictions];

      const fetchedLang = userObj.preferred_language || userObj.languagePreference || userObj.preferredLanguage || language || 'en';
      const fetchedTheme = userObj.theme_mode || userObj.themeMode || theme || 'light';
      const fetchedCalorieTarget = ng.dailyCalorieGoal || userObj.daily_calorie_target || userObj.dailyCalorieTarget || 2000;

      const parsedState = {
        fullName: fetchedName,
        email: fetchedEmail,
        phone: fetchedPhone,
        avatarUrl: fetchedAvatar,
        age: Number(fetchedAge),
        biologicalSex: fetchedSex.toLowerCase(),
        heightCm: Number(fetchedHeight),
        weightKg: Number(fetchedWeight),
        targetWeightKg: Number(fetchedTargetWeight),
        activityLevel: fetchedActivity,
        fastingPractice: fetchedFasting,
        fastingStrictness: fetchedStrictness,
        medicalConditions: fetchedConditions,
        dietaryRestrictions: fetchedRestrictions,
        preferredLanguage: fetchedLang,
        themeMode: fetchedTheme,
        dailyCalorieTarget: Number(fetchedCalorieTarget)
      };

      setInitialData(parsedState);
      populateFormState(parsedState);
      
      if (fetchedLang && fetchedLang !== language) {
        setLanguage(fetchedLang);
      }
      if (fetchedTheme && fetchedTheme !== theme) {
        setTheme(fetchedTheme);
      }
    } catch (err) {
      console.warn('Error loading remote user profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const populateFormState = (s) => {
    setFullName(s.fullName || '');
    setEmail(s.email || '');
    setPhone(s.phone || '');
    setAvatarUrl(s.avatarUrl || DEFAULT_AVATAR);
    setAge(s.age || 28);
    setBiologicalSex(s.biologicalSex || 'female');
    setHeightCm(s.heightCm || 168);
    setWeightKg(s.weightKg || 62);
    setTargetWeightKg(s.targetWeightKg || 60);
    setActivityLevel(s.activityLevel || 'moderately_active');
    setFastingPractice(s.fastingPractice || 'orthodox_tsom');
    setFastingStrictness(s.fastingStrictness || 'strict_vegan');
    setMedicalConditions(s.medicalConditions || []);
    setDietaryRestrictions(s.dietaryRestrictions || []);
    setPreferredLanguage(s.preferredLanguage || 'en');
    setThemeMode(s.themeMode || 'light');
    setDailyCalorieTarget(s.dailyCalorieTarget || 2000);
    setIsDirty(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleFieldChange = (setter, value) => {
    setter(value);
    setIsDirty(true);
  };

  // Live Biometric & Macro Calculations
  const calculatedBmr = Math.round(
    biologicalSex === 'male'
      ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
      : 10 * weightKg + 6.25 * heightCm - 5 * age - 161
  );

  const activityMultipliers = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725
  };
  const calculatedTdee = Math.round(calculatedBmr * (activityMultipliers[activityLevel] || 1.45));
  const calculatedDailyCalories = Math.max(1200, calculatedTdee);
  const proteinTargetG = Math.round((calculatedDailyCalories * 0.3) / 4);
  const carbsTargetG = Math.round((calculatedDailyCalories * 0.4) / 4);
  const fatsTargetG = Math.round((calculatedDailyCalories * 0.3) / 9);
  const ironRdaMg = biologicalSex === 'female' && age < 50 ? 18 : 8;

  // Multi-select chip toggle helpers
  const toggleMedicalCondition = (id) => {
    setIsDirty(true);
    setMedicalConditions(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const toggleDietaryRestriction = (id) => {
    setIsDirty(true);
    setDietaryRestrictions(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Avatar Photo Handler
  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setValidationError(language === 'am' ? 'ምስሉ በጣም ትልቅ ነው። እባክዎ ከ 5MB በታች የሆነ ምስል ይምረጡ።' : 'Image file is too large. Please choose an image under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 400;
        const MAX_HEIGHT = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
          setAvatarUrl(compressedBase64);
          setIsDirty(true);
        }
      };
      if (typeof event.target?.result === 'string') {
        img.src = event.target.result;
      }
    };
    reader.readAsDataURL(file);
  };

  // Form Discard & Reset
  const handleDiscard = () => {
    populateFormState(initialData);
    setValidationError('');
    setToastMessage(language === 'am' ? '🔄 ለውጦች ተሰርዘዋል' : '🔄 Changes discarded');
    setTimeout(() => setToastMessage(''), 2500);
  };

  // Save Profile Handler
  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setValidationError('');

    if (!fullName.trim()) {
      setValidationError(language === 'am' ? 'እባክዎ ሙሉ ስምዎን ያስገቡ' : 'Please enter your full name');
      return;
    }
    if (Number(heightCm) <= 50 || Number(heightCm) > 250) {
      setValidationError(language === 'am' ? 'እባክዎ ትክክለኛ ቁመት ያስገቡ' : 'Please enter a valid height in cm (50-250)');
      return;
    }
    if (Number(weightKg) <= 20 || Number(weightKg) > 300) {
      setValidationError(language === 'am' ? 'እባክዎ ትክክለኛ ክብደት ያስገቡ' : 'Please enter a valid weight in kg (20-300)');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        full_name: fullName,
        fullName,
        phone,
        phoneNumber: phone,
        age: Number(age) || 28,
        biological_sex: biologicalSex,
        biologicalSex,
        height_cm: Number(heightCm) || 170,
        heightCm: Number(heightCm) || 170,
        weight_kg: Number(weightKg) || 65,
        weightKg: Number(weightKg) || 65,
        target_weight_kg: Number(targetWeightKg) || Number(weightKg) || 65,
        targetWeightKg: Number(targetWeightKg) || Number(weightKg) || 65,
        activity_level: activityLevel,
        activityLevel,
        fasting_practice: fastingPractice,
        fastingPractice,
        fasting_strictness: fastingStrictness,
        fastingStrictness,
        medical_conditions: medicalConditions,
        healthConditions: medicalConditions,
        dietary_restrictions: dietaryRestrictions,
        dietaryRestrictions,
        preferred_language: preferredLanguage,
        preferredLanguage,
        languagePreference: preferredLanguage,
        theme_mode: themeMode,
        themeMode,
        avatar: avatarUrl,
        daily_calorie_target: calculatedDailyCalories
      };

      const res = await updateUserProfile(payload);
      
      if (res) {
        const updatedUser = res.user || res;
        setInitialData(updatedUser);
        populateFormState(updatedUser);
        setIsDirty(false);

        if (preferredLanguage && preferredLanguage !== language) {
          setLanguage(preferredLanguage);
        }
        if (themeMode && themeMode !== theme) {
          setTheme(themeMode);
        }
        if (updateAuthUser) {
          updateAuthUser(updatedUser);
        }

        setToastMessage(language === 'am' ? '✨ መገለጫዎ በጥሩ ሁኔታ ተዘምኗል!' : 'Profile updated successfully! ✨');
        setTimeout(() => setToastMessage(''), 3500);
      }
    } catch (err) {
      console.error('Failed to update user profile:', err);
      setValidationError(err.response?.data?.error?.message || err.message || 'Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const activeFastingConfig = FASTING_PRACTICE_OPTIONS.find(p => p.id === fastingPractice) || FASTING_PRACTICE_OPTIONS[0];

  return (
    <div style={{
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '24px 16px 120px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: isDark ? '#F3F4F6' : '#2D2723',
      backgroundColor: isDark ? '#111827' : '#FFF8F5',
      minHeight: '100vh'
    }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 9999,
          backgroundColor: '#125238',
          color: '#FFFFFF',
          padding: '12px 24px',
          borderRadius: '12px',
          fontWeight: 700,
          boxShadow: '0 10px 25px rgba(18, 82, 56, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          {toastMessage}
        </div>
      )}

      {/* Validation Error Banner */}
      {validationError && (
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid #EF4444',
          color: '#B91C1C',
          padding: '12px 18px',
          borderRadius: '12px',
          marginBottom: '20px',
          fontSize: '14px',
          fontWeight: 600,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>⚠️ {validationError}</span>
          <button
            onClick={() => setValidationError('')}
            style={{ background: 'none', border: 'none', color: '#B91C1C', cursor: 'pointer', fontWeight: 800 }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Page Title Header */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#125238', margin: 0 }}>
            {language === 'am' ? 'የተጠቃሚ መገለጫ እና የጤና ቅንብሮች' : 'User Profile & Clinical Preferences'}
          </h1>
          <p style={{ fontSize: '14px', color: isDark ? '#9CA3AF' : '#6B7280', margin: '4px 0 0' }}>
            {language === 'am'
              ? 'ባዮሜትሪክስ፣ የባህል ጾም አመጋገብ እና የሕክምና መረጃዎችዎን ያስተካክሉ።'
              : 'Manage biometrics, Ethiopian Orthodox & Islamic fasting adherence, and clinical nutrition targets.'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            style={{
              backgroundColor: isEditing ? '#904d11' : '#125238',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              padding: '10px 20px',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(18, 82, 56, 0.15)'
            }}
          >
            {isEditing ? '🔒 Lock Profile View' : '✏️ Edit Profile'}
          </button>
        </div>
      </div>

      {/* Header Card: User Avatar, Name, Fasting Badge */}
      <div style={{
        backgroundColor: isDark ? '#1F2937' : '#F6ECE5',
        border: `1px solid ${isDark ? '#374151' : '#E2D8D2'}`,
        borderRadius: '20px',
        padding: '24px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        flexWrap: 'wrap'
      }}>
        {/* Avatar Container */}
        <div style={{ position: 'relative' }}>
          <img
            src={getAvatarUrl(avatarUrl)}
            alt={fullName}
            style={{
              width: '96px',
              height: '96px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '4px solid #125238',
              boxShadow: '0 6px 16px rgba(0,0,0,0.1)'
            }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            style={{
              position: 'absolute',
              bottom: '0',
              right: '0',
              backgroundColor: '#125238',
              color: '#FFFFFF',
              border: '2px solid #FFFFFF',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              cursor: 'pointer'
            }}
            title="Upload photo"
          >
            📷
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoSelect}
            accept="image/*"
            style={{ display: 'none' }}
          />
        </div>

        {/* User Info */}
        <div style={{ flex: 1, minWidth: '220px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 800, margin: '0 0 4px', color: isDark ? '#FFFFFF' : '#125238' }}>
            {fullName || 'Selamawit Kebede'}
          </h2>
          <p style={{ fontSize: '13.5px', color: isDark ? '#9CA3AF' : '#5C544E', margin: '0 0 12px' }}>
            ✉️ {email} &nbsp;|&nbsp; 📞 {phone || 'Not set'}
          </p>

          {/* Active Fasting Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#125238', color: '#FFFFFF', padding: '6px 14px', borderRadius: '12px', fontSize: '13px', fontWeight: 700 }}>
            <span>{activeFastingConfig.badge}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          
          {/* Section 1: Personal & Biometrics */}
          <div style={{
            backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
            border: `1px solid ${isDark ? '#374151' : '#E2D8D2'}`,
            borderRadius: '20px',
            padding: '24px'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#125238', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>👤</span> {language === 'am' ? 'ግላዊ መረጃ እና ባዮሜትሪክስ' : '1. Personal & Biometrics'}
            </h3>

            {/* Full Name */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '6px', color: isDark ? '#D1D5DB' : '#4B5563' }}>
                {language === 'am' ? 'ሙሉ ስም' : 'Full Name'}
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => handleFieldChange(setFullName, e.target.value)}
                disabled={!isEditing}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: `1px solid ${isDark ? '#4B5563' : '#D1D5DB'}`,
                  backgroundColor: isDark ? '#374151' : '#FFFFFF',
                  color: isDark ? '#FFFFFF' : '#1F2937',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Phone */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '6px', color: isDark ? '#D1D5DB' : '#4B5563' }}>
                {language === 'am' ? 'ስልክ ቁጥር' : 'Phone Number'}
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => handleFieldChange(setPhone, e.target.value)}
                disabled={!isEditing}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: `1px solid ${isDark ? '#4B5563' : '#D1D5DB'}`,
                  backgroundColor: isDark ? '#374151' : '#FFFFFF',
                  color: isDark ? '#FFFFFF' : '#1F2937',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Age & Biological Sex */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '6px', color: isDark ? '#D1D5DB' : '#4B5563' }}>
                  {language === 'am' ? 'ዕድሜ (ዓመት)' : 'Age (years)'}
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => handleFieldChange(setAge, e.target.value)}
                  disabled={!isEditing}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: `1px solid ${isDark ? '#4B5563' : '#D1D5DB'}`,
                    backgroundColor: isDark ? '#374151' : '#FFFFFF',
                    color: isDark ? '#FFFFFF' : '#1F2937',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '6px', color: isDark ? '#D1D5DB' : '#4B5563' }}>
                  {language === 'am' ? 'ጾታ' : 'Biological Sex'}
                </label>
                <select
                  value={biologicalSex}
                  onChange={(e) => handleFieldChange(setBiologicalSex, e.target.value)}
                  disabled={!isEditing}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: `1px solid ${isDark ? '#4B5563' : '#D1D5DB'}`,
                    backgroundColor: isDark ? '#374151' : '#FFFFFF',
                    color: isDark ? '#FFFFFF' : '#1F2937',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="female">Female (ሴት)</option>
                  <option value="male">Male (ወንድ)</option>
                  <option value="other">Other / Preferred not to say</option>
                </select>
              </div>
            </div>

            {/* Height, Weight, Target Weight */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: isDark ? '#D1D5DB' : '#4B5563' }}>
                  {language === 'am' ? 'ቁመት (ሴ.ሜ)' : 'Height (cm)'}
                </label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => handleFieldChange(setHeightCm, e.target.value)}
                  disabled={!isEditing}
                  style={{
                    width: '100%',
                    padding: '10px 8px',
                    borderRadius: '12px',
                    border: `1px solid ${isDark ? '#4B5563' : '#D1D5DB'}`,
                    backgroundColor: isDark ? '#374151' : '#FFFFFF',
                    color: isDark ? '#FFFFFF' : '#1F2937',
                    fontSize: '13.5px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: isDark ? '#D1D5DB' : '#4B5563' }}>
                  {language === 'am' ? 'ክብደት (ኪ.ግ)' : 'Weight (kg)'}
                </label>
                <input
                  type="number"
                  value={weightKg}
                  onChange={(e) => handleFieldChange(setWeightKg, e.target.value)}
                  disabled={!isEditing}
                  style={{
                    width: '100%',
                    padding: '10px 8px',
                    borderRadius: '12px',
                    border: `1px solid ${isDark ? '#4B5563' : '#D1D5DB'}`,
                    backgroundColor: isDark ? '#374151' : '#FFFFFF',
                    color: isDark ? '#FFFFFF' : '#1F2937',
                    fontSize: '13.5px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: isDark ? '#D1D5DB' : '#4B5563' }}>
                  {language === 'am' ? 'ግብ (ኪ.ግ)' : 'Target (kg)'}
                </label>
                <input
                  type="number"
                  value={targetWeightKg}
                  onChange={(e) => handleFieldChange(setTargetWeightKg, e.target.value)}
                  disabled={!isEditing}
                  style={{
                    width: '100%',
                    padding: '10px 8px',
                    borderRadius: '12px',
                    border: `1px solid ${isDark ? '#4B5563' : '#D1D5DB'}`,
                    backgroundColor: isDark ? '#374151' : '#FFFFFF',
                    color: isDark ? '#FFFFFF' : '#1F2937',
                    fontSize: '13.5px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Activity Level */}
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '6px', color: isDark ? '#D1D5DB' : '#4B5563' }}>
                {language === 'am' ? 'የእንቅስቃሴ ደረጃ' : 'Activity Level'}
              </label>
              <select
                value={activityLevel}
                onChange={(e) => handleFieldChange(setActivityLevel, e.target.value)}
                disabled={!isEditing}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: `1px solid ${isDark ? '#4B5563' : '#D1D5DB'}`,
                  backgroundColor: isDark ? '#374151' : '#FFFFFF',
                  color: isDark ? '#FFFFFF' : '#1F2937',
                  fontSize: '13.5px',
                  boxSizing: 'border-box'
                }}
              >
                {ACTIVITY_LEVEL_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.id}>
                    {language === 'am' ? opt.labelAm : opt.labelEn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 2: Ethiopian Dietary & Fasting Preferences */}
          <div style={{
            backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
            border: `1px solid ${isDark ? '#374151' : '#E2D8D2'}`,
            borderRadius: '20px',
            padding: '24px'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#125238', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🍲</span> {language === 'am' ? 'የባህል ጾም እና የምግብ ምርጫዎች' : '2. Ethiopian Fasting & Diet'}
            </h3>

            {/* Fasting Practice Selector */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '8px', color: isDark ? '#D1D5DB' : '#4B5563' }}>
                {language === 'am' ? 'የጾም ስርዓት' : 'Fasting Practice'}
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {FASTING_PRACTICE_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={!isEditing}
                    onClick={() => handleFieldChange(setFastingPractice, opt.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      border: fastingPractice === opt.id ? '2px solid #125238' : `1px solid ${isDark ? '#4B5563' : '#E5E7EB'}`,
                      backgroundColor: fastingPractice === opt.id ? (isDark ? 'rgba(18, 82, 56, 0.3)' : '#F6ECE5') : (isDark ? '#374151' : '#FFFFFF'),
                      color: fastingPractice === opt.id ? '#125238' : (isDark ? '#FFFFFF' : '#374151'),
                      fontWeight: fastingPractice === opt.id ? 700 : 500,
                      cursor: isEditing ? 'pointer' : 'default',
                      textAlign: 'left',
                      fontSize: '13.5px'
                    }}
                  >
                    <span style={{ fontSize: '16px' }}>{opt.icon}</span>
                    <span>{language === 'am' ? opt.labelAm : opt.labelEn}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Fasting Strictness */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '6px', color: isDark ? '#D1D5DB' : '#4B5563' }}>
                {language === 'am' ? 'የጾም ጥብቅነት ደረጃ' : 'Fasting Strictness'}
              </label>
              <select
                value={fastingStrictness}
                onChange={(e) => handleFieldChange(setFastingStrictness, e.target.value)}
                disabled={!isEditing}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: `1px solid ${isDark ? '#4B5563' : '#D1D5DB'}`,
                  backgroundColor: isDark ? '#374151' : '#FFFFFF',
                  color: isDark ? '#FFFFFF' : '#1F2937',
                  fontSize: '13.5px',
                  boxSizing: 'border-box'
                }}
              >
                {FASTING_STRICTNESS_OPTIONS.map(s => (
                  <option key={s.id} value={s.id}>
                    {language === 'am' ? s.labelAm : s.labelEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Dietary Restrictions Chips */}
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '8px', color: isDark ? '#D1D5DB' : '#4B5563' }}>
                {language === 'am' ? 'የአመጋገብ ድንበሮች (Dietary Tags)' : 'Dietary Restrictions'}
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {DIETARY_RESTRICTION_CHIPS.map(chip => {
                  const isSelected = dietaryRestrictions.includes(chip.id);
                  return (
                    <button
                      key={chip.id}
                      type="button"
                      disabled={!isEditing}
                      onClick={() => toggleDietaryRestriction(chip.id)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        border: isSelected ? '2px solid #125238' : `1px solid ${isDark ? '#4B5563' : '#D1D5DB'}`,
                        backgroundColor: isSelected ? '#125238' : (isDark ? '#374151' : '#FFFFFF'),
                        color: isSelected ? '#FFFFFF' : (isDark ? '#D1D5DB' : '#4B5563'),
                        fontSize: '12.5px',
                        fontWeight: isSelected ? 700 : 500,
                        cursor: isEditing ? 'pointer' : 'default',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {language === 'am' ? chip.labelAm : chip.labelEn}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 3: Clinical & Medical Flags */}
          <div style={{
            backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
            border: `1px solid ${isDark ? '#374151' : '#E2D8D2'}`,
            borderRadius: '20px',
            padding: '24px'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#125238', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🏥</span> {language === 'am' ? 'ክሊኒካዊ እና የጤና ሁኔታዎች' : '3. Clinical & Medical Flags'}
            </h3>

            <p style={{ fontSize: '13px', color: isDark ? '#9CA3AF' : '#6B7280', marginBottom: '14px', lineHeight: '1.4' }}>
              {language === 'am'
                ? 'ምርመራ የተደረገባቸውን የጤና ሁኔታዎች ይምረጡ፤ EthioNutri AI የምግብ ጥቆማዎችን በተለየ ሁኔታ ያዘጋጃል።'
                : 'Select diagnosed medical conditions to customize micronutrient alerts and RDA goals automatically.'}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {CLINICAL_CONDITION_CHIPS.map(cond => {
                const isSelected = medicalConditions.includes(cond.id) || medicalConditions.includes(cond.name);
                return (
                  <button
                    key={cond.id}
                    type="button"
                    disabled={!isEditing}
                    onClick={() => toggleMedicalCondition(cond.id)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '14px',
                      border: isSelected ? '2px solid #904d11' : `1px solid ${isDark ? '#4B5563' : '#E2D8D2'}`,
                      backgroundColor: isSelected ? 'rgba(144, 77, 17, 0.12)' : (isDark ? '#374151' : '#FFF8F5'),
                      color: isSelected ? '#904d11' : (isDark ? '#E5E7EB' : '#374151'),
                      fontSize: '13px',
                      fontWeight: isSelected ? 700 : 500,
                      cursor: isEditing ? 'pointer' : 'default',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span>{cond.icon}</span>
                    <span>{language === 'am' ? cond.labelAm : cond.labelEn}</span>
                    {isSelected && <span style={{ marginLeft: '4px', fontWeight: 800 }}>✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: App Preferences & Live Target Summary Box */}
          <div style={{
            backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
            border: `1px solid ${isDark ? '#374151' : '#E2D8D2'}`,
            borderRadius: '20px',
            padding: '24px'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#125238', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>⚙️</span> {language === 'am' ? 'የመተግበሪያ ቅንብሮች እና ዕለታዊ ግቦች' : '4. App Preferences & Target Summary'}
            </h3>

            {/* Language Selector */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '6px', color: isDark ? '#D1D5DB' : '#4B5563' }}>
                {language === 'am' ? 'የቋንቋ መምረጫ' : 'Preferred Language'}
              </label>
              <select
                value={preferredLanguage}
                onChange={(e) => handleFieldChange(setPreferredLanguage, e.target.value)}
                disabled={!isEditing}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: `1px solid ${isDark ? '#4B5563' : '#D1D5DB'}`,
                  backgroundColor: isDark ? '#374151' : '#FFFFFF',
                  color: isDark ? '#FFFFFF' : '#1F2937',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              >
                <option value="en">English 🇬🇧</option>
                <option value="am">አማርኛ (Amharic) 🇪🇹</option>
              </select>
            </div>

            {/* Theme Mode */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '6px', color: isDark ? '#D1D5DB' : '#4B5563' }}>
                {language === 'am' ? 'የገጽታ ቀለም (Theme Mode)' : 'Theme Mode'}
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  type="button"
                  disabled={!isEditing}
                  onClick={() => handleFieldChange(setThemeMode, 'light')}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '12px',
                    border: themeMode === 'light' ? '2px solid #125238' : `1px solid ${isDark ? '#4B5563' : '#E5E7EB'}`,
                    backgroundColor: themeMode === 'light' ? '#F6ECE5' : (isDark ? '#374151' : '#FFFFFF'),
                    color: themeMode === 'light' ? '#125238' : (isDark ? '#9CA3AF' : '#4B5563'),
                    fontWeight: themeMode === 'light' ? 700 : 500,
                    cursor: isEditing ? 'pointer' : 'default',
                    fontSize: '13px'
                  }}
                >
                  ☀️ Light Mode
                </button>
                <button
                  type="button"
                  disabled={!isEditing}
                  onClick={() => handleFieldChange(setThemeMode, 'dark')}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '12px',
                    border: themeMode === 'dark' ? '2px solid #125238' : `1px solid ${isDark ? '#4B5563' : '#E5E7EB'}`,
                    backgroundColor: themeMode === 'dark' ? 'rgba(18, 82, 56, 0.4)' : (isDark ? '#374151' : '#FFFFFF'),
                    color: themeMode === 'dark' ? '#FFFFFF' : (isDark ? '#9CA3AF' : '#4B5563'),
                    fontWeight: themeMode === 'dark' ? 700 : 500,
                    cursor: isEditing ? 'pointer' : 'default',
                    fontSize: '13px'
                  }}
                >
                  🌙 Dark Mode
                </button>
              </div>
            </div>

            {/* Live Calculated Target Summary Box */}
            <div style={{
              backgroundColor: isDark ? '#111827' : '#FFF8F5',
              border: '1px solid #125238',
              borderRadius: '16px',
              padding: '16px'
            }}>
              <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#125238', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>🔥</span> {language === 'am' ? 'የተሰላ ዕለታዊ የካሎሪ እና የብረት ግብ' : 'Calculated Daily Nutritional Summary'}
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px' }}>
                <div style={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF', padding: '10px', borderRadius: '10px', border: `1px solid ${isDark ? '#374151' : '#E2D8D2'}` }}>
                  <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 700 }}>BMR / TDEE</div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#125238' }}>{calculatedBmr} / {calculatedTdee} kcal</div>
                </div>

                <div style={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF', padding: '10px', borderRadius: '10px', border: `1px solid ${isDark ? '#374151' : '#E2D8D2'}` }}>
                  <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 700 }}>Daily Calorie Goal</div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#904d11' }}>{calculatedDailyCalories} kcal</div>
                </div>

                <div style={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF', padding: '10px', borderRadius: '10px', border: `1px solid ${isDark ? '#374151' : '#E2D8D2'}` }}>
                  <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 700 }}>Macros Target</div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: isDark ? '#E5E7EB' : '#374151' }}>
                    P: {proteinTargetG}g | C: {carbsTargetG}g | F: {fatsTargetG}g
                  </div>
                </div>

                <div style={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF', padding: '10px', borderRadius: '10px', border: `1px solid ${isDark ? '#374151' : '#E2D8D2'}` }}>
                  <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 700 }}>Iron RDA Target</div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#125238' }}>{ironRdaMg} mg/day</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Save / Discard Actions Bar */}
        {(isDirty || isEditing) && (
          <div style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
            border: '2px solid #125238',
            borderRadius: '20px',
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
            zIndex: 999
          }}>
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#125238' }}>
              {isDirty ? (language === 'am' ? '⚠️ ያልተቀመጡ ለውጦች አሉ' : '⚠️ Unsaved profile changes') : (language === 'am' ? 'የመገለጫ አርትዖት ሁነታ' : 'Profile Edit Mode')}
            </span>

            {isDirty && (
              <button
                type="button"
                onClick={handleDiscard}
                disabled={isSaving}
                style={{
                  backgroundColor: 'transparent',
                  color: isDark ? '#E5E7EB' : '#6B7280',
                  border: `1px solid ${isDark ? '#4B5563' : '#D1D5DB'}`,
                  borderRadius: '12px',
                  padding: '8px 16px',
                  fontWeight: 700,
                  fontSize: '13.5px',
                  cursor: 'pointer'
                }}
              >
                {language === 'am' ? 'ተው (Discard)' : 'Discard'}
              </button>
            )}

            <button
              type="submit"
              disabled={isSaving}
              style={{
                backgroundColor: '#125238',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                padding: '10px 24px',
                fontWeight: 800,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(18, 82, 56, 0.25)'
              }}
            >
              {isSaving ? (
                <>
                  <span>⌛</span>
                  {language === 'am' ? 'በማስቀመጥ ላይ...' : 'Saving...'}
                </>
              ) : (
                <>✨ {language === 'am' ? 'ለውጦችን አስቀምጥ' : 'Save Changes'}</>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Profile;
