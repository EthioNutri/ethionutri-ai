import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { getAvatarUrl } from '../utils/imageHelper';
import { getUserProfile, updateUserProfile } from '../services/userService';
import { calculateNutritionGoals } from '../utils/nutritionCalculator';
import { 
  User, Phone, Mail, Camera, Lock, Unlock, Check, AlertCircle, Activity, 
  Heart, Baby, Wheat, Milk, Leaf, Moon, Sun, Target, Settings, Utensils, 
  Stethoscope, Sparkles, X, RefreshCw
} from 'lucide-react';

const FASTING_PRACTICE_OPTIONS = [
  { id: 'orthodox_tsom', labelEn: 'Ethiopian Orthodox (Tsom)', labelAm: 'የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ (ጾም)', icon: Leaf, badge: 'Orthodox Fasting Active' },
  { id: 'ramadan', labelEn: 'Islamic Fasting (Ramadan & Sunnah)', labelAm: 'የእስልምና ጾም (ረመዳን እና ሱና)', icon: Moon, badge: 'Ramadan Fasting Active' },
  { id: 'none', labelEn: 'None (No religious fasts)', labelAm: 'ምንም ጾም አልከተልም', icon: Sun, badge: 'Fasting Inactive' }
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
  { id: 'anemia', name: 'Anemia', labelEn: 'Anemia (Iron Deficiency Alerts)', labelAm: 'የደም ማነስ (የብረት እጥረት alerts)', icon: AlertCircle },
  { id: 'type2_diabetes', name: 'Diabetes', labelEn: 'Type 2 Diabetes (Carb Targets)', labelAm: 'የስኳር በሽታ (የካርቦሃይድሬት ክትትል)', icon: Activity },
  { id: 'hypertension', name: 'Hypertension', labelEn: 'Hypertension (Low Sodium)', labelAm: 'የደም ግፊት (የጨው መጠን መቆጣጠሪያ)', icon: Heart },
  { id: 'pregnancy_lactation', name: 'Pregnancy', labelEn: 'Pregnancy / Lactation Support', labelAm: 'እርግዝና / ጡት ማጥባት', icon: Baby },
  { id: 'celiac', name: 'Gluten-sensitive', labelEn: 'Gluten-Sensitive / Celiac', labelAm: 'ግሉተን አለመስማማት', icon: Wheat },
  { id: 'lactose_intolerant', name: 'Lactose-intolerant', labelEn: 'Lactose Intolerance', labelAm: 'የወተት ተዋጽኦ አለመስማማት', icon: Milk }
];

const HEALTH_OBJECTIVE_OPTIONS = [
  { 
    id: 'weight_management', 
    titleEn: 'Weight Management & Vitality', 
    titleAm: 'የክብደት መቆጣጠሪያ እና ጤና', 
    descEn: 'Nutrient-dense traditional foods (Teff, Barley, Flaxseed) tailored for steady weight goals.', 
    descAm: 'ለተመጣጣኝ ክብደት የተዘጋጁ የኢትዮጵያ እህል ዓይነቶች።' 
  },
  { 
    id: 'high_protein_strength', 
    titleEn: 'High-Protein & Active Strength', 
    titleAm: 'ከፍተኛ ፕሮቲን እና የጡንቻ ጥንካሬ', 
    descEn: 'Plant and animal protein pairing (Shiro, Misir, Ayib, Meat) for active muscle recovery.', 
    descAm: 'የጡንቻ ጥንካሬን ለመገንባት የሚያግዙ በፕሮቲን የበለፀጉ ምግቦች።' 
  },
  { 
    id: 'blood_sugar_cardio', 
    titleEn: 'Blood Sugar & Cardiovascular Balance', 
    titleAm: 'የደም ስኳር እና የልብ ጤንነት', 
    descEn: 'Low-glycemic legumes, traditional herbs, and anti-inflammatory greens.', 
    descAm: 'የደም ስኳር እና ግፊትን ለመቆጣጠር የሚረዱ ዝቅተኛ ካርቦሃይድሬት ምግቦች።' 
  }
];

const ACTIVITY_LEVEL_OPTIONS = [
  { id: 'sedentary', labelEn: 'Sedentary (Little to no exercise, desk work)', labelAm: 'አነስተኛ እንቅስቃሴ (የቢሮ ስራ)' },
  { id: 'lightly_active', labelEn: 'Lightly Active (1-3 workout days/week)', labelAm: 'ቀላል እንቅስቃሴ (1-3 ቀናት በሳምንት)' },
  { id: 'moderately_active', labelEn: 'Moderately Active (3-5 workout days/week)', labelAm: 'መካከለኛ እንቅስቃሴ (3-5 ቀናት በሳምንት)' },
  { id: 'very_active', labelEn: 'Very Active (6-7 heavy workout days/week)', labelAm: 'ከፍተኛ እንቅስቃሴ (6-7 ቀናት በሳምንት)' }
];

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';


﻿const Profile = () => {
  const { user, updateUserProfile: updateAuthUser } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme, isDark } = useTheme();

  const fileInputRef = useRef(null);

  const [initialData, setInitialData] = useState({});
  const [isEditing, setIsEditing] = useState(true);
  const [isDirty, setIsDirty] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(DEFAULT_AVATAR);
  
  const [age, setAge] = useState(28);
  const [biologicalSex, setBiologicalSex] = useState('female');
  const [heightCm, setHeightCm] = useState(168);
  const [weightKg, setWeightKg] = useState(62);
  const [targetWeightKg, setTargetWeightKg] = useState(60);
  const [activityLevel, setActivityLevel] = useState('moderately_active');
  const [dailyCalorieTarget, setDailyCalorieTarget] = useState(2000);

  const [fastingPractice, setFastingPractice] = useState('orthodox_tsom');
  const [fastingStrictness, setFastingStrictness] = useState('strict_vegan');
  const [dietaryRestrictions, setDietaryRestrictions] = useState([]);

  const [medicalFlags, setMedicalFlags] = useState([]);
  const [healthObjective, setHealthObjective] = useState('weight_management');

  const [preferredLanguage, setPreferredLanguage] = useState('en');
  const [themeMode, setThemeMode] = useState('light');

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [validationError, setValidationError] = useState('');

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
      
      const rawFlags = userObj.medicalFlags || hp.medicalFlags || userObj.medical_conditions || hp.healthConditions || [];
      const fetchedFlags = Array.isArray(rawFlags) ? rawFlags : [rawFlags];

      const rawRestrictions = userObj.dietary_restrictions || hp.dietaryRestrictions || userObj.dietaryRestrictions || [];
      const fetchedRestrictions = Array.isArray(rawRestrictions) ? rawRestrictions : [rawRestrictions];

      const fetchedLang = userObj.preferred_language || userObj.languagePreference || userObj.preferredLanguage || language || 'en';
      const fetchedTheme = userObj.theme_mode || userObj.themeMode || theme || 'light';
      const fetchedCalorieTarget = ng.dailyCalorieGoal || userObj.daily_calorie_target || userObj.dailyCalorieTarget || 2000;
      const fetchedObjective = hp.healthObjective || userObj.healthObjective || 'weight_management';

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
        medicalFlags: fetchedFlags,
        dietaryRestrictions: fetchedRestrictions,
        preferredLanguage: fetchedLang,
        themeMode: fetchedTheme,
        dailyCalorieTarget: Number(fetchedCalorieTarget),
        healthObjective: fetchedObjective
      };

      setInitialData(parsedState);
      populateFormState(parsedState);
      
      if (fetchedLang && fetchedLang !== language) setLanguage(fetchedLang);
      if (fetchedTheme && fetchedTheme !== theme) setTheme(fetchedTheme);
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
    setMedicalFlags(s.medicalFlags || []);
    setDietaryRestrictions(s.dietaryRestrictions || []);
    setPreferredLanguage(s.preferredLanguage || 'en');
    setThemeMode(s.themeMode || 'light');
    setDailyCalorieTarget(s.dailyCalorieTarget || 2000);
    setHealthObjective(s.healthObjective || 'weight_management');
    setIsDirty(false);
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleFieldChange = (setter, value) => {
    setter(value);
    setIsDirty(true);
  };

  const calculatedGoals = calculateNutritionGoals({
    age, biologicalSex, heightCm, weightKg, targetWeightKg, activityLevel, healthObjective, medicalFlags
  });
  
  const calculatedBmr = calculatedGoals.bmr;
  const calculatedTdee = calculatedGoals.tdee;
  const calculatedDailyCalories = calculatedGoals.calories;
  const proteinTargetG = calculatedGoals.protein;
  const carbsTargetG = calculatedGoals.carbs;
  const fatsTargetG = calculatedGoals.fats;
  const ironRdaMg = calculatedGoals.ironMg || (biologicalSex === 'female' && age < 50 ? 18 : 8);
  const sodiumRdaMg = calculatedGoals.sodiumMg || 2300;

  const toggleMedicalCondition = (id) => {
    setIsDirty(true);
    setMedicalFlags(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const toggleDietaryRestriction = (id) => {
    setIsDirty(true);
    setDietaryRestrictions(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

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
          if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
        } else {
          if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
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

  const handleDiscard = () => {
    populateFormState(initialData);
    setValidationError('');
    setToastMessage(language === 'am' ? 'ለውጦች ተሰርዘዋል' : 'Changes discarded');
    setTimeout(() => setToastMessage(''), 2500);
  };

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
        full_name: fullName, fullName, phone, phoneNumber: phone,
        age: Number(age) || 28, biological_sex: biologicalSex, biologicalSex,
        height_cm: Number(heightCm) || 170, heightCm: Number(heightCm) || 170,
        weight_kg: Number(weightKg) || 65, weightKg: Number(weightKg) || 65,
        target_weight_kg: Number(targetWeightKg) || Number(weightKg) || 65,
        targetWeightKg: Number(targetWeightKg) || Number(weightKg) || 65,
        activity_level: activityLevel, activityLevel,
        fasting_practice: fastingPractice, fastingPractice,
        fasting_strictness: fastingStrictness, fastingStrictness,
        medicalFlags, medical_conditions: medicalFlags,
        dietary_restrictions: dietaryRestrictions, dietaryRestrictions,
        preferred_language: preferredLanguage, preferredLanguage, languagePreference: preferredLanguage,
        theme_mode: themeMode, themeMode, avatar: avatarUrl,
        daily_calorie_target: calculatedDailyCalories, healthObjective
      };

      const res = await updateUserProfile(payload);
      if (res) {
        const updatedUser = res.user || res;
        setInitialData(updatedUser);
        populateFormState(updatedUser);
        setIsDirty(false);

        if (preferredLanguage && preferredLanguage !== language) setLanguage(preferredLanguage);
        if (themeMode && themeMode !== theme) setTheme(themeMode);
        if (updateAuthUser) updateAuthUser(updatedUser);

        setToastMessage(language === 'am' ? 'መገለጫዎ በጥሩ ሁኔታ ተዘምኗል!' : 'Profile updated successfully!');
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


﻿  return (
    <div style={{
      maxWidth: '1140px', margin: '0 auto', padding: '24px 20px 120px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: isDark ? '#F3F4F6' : '#1F2937',
      backgroundColor: isDark ? '#111827' : '#F9FAFB', minHeight: '100vh'
    }}>
      {toastMessage && (
        <div style={{
          position: 'fixed', top: '24px', right: '24px', zIndex: 9999,
          backgroundColor: '#059669', color: '#FFFFFF', padding: '12px 24px',
          borderRadius: '12px', fontWeight: 600, boxShadow: '0 10px 25px rgba(5, 150, 105, 0.25)',
          display: 'flex', alignItems: 'center', gap: '10px'
        }}>
          <Check size={18} /><span>{toastMessage}</span>
        </div>
      )}

      {validationError && (
        <div style={{
          backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEF2F2',
          border: '1px solid #FCA5A5', color: isDark ? '#FCA5A5' : '#991B1B',
          padding: '12px 18px', borderRadius: '12px', marginBottom: '20px',
          fontSize: '14px', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={18} /><span>{validationError}</span>
          </div>
          <button onClick={() => setValidationError('')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>
      )}

      <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#111827', margin: 0, letterSpacing: '-0.02em' }}>
            {language === 'am' ? 'የተጠቃሚ መገለጫ እና የጤና ቅንብሮች' : 'User Profile & Clinical Preferences'}
          </h1>
          <p style={{ fontSize: '14px', color: isDark ? '#9CA3AF' : '#6B7280', margin: '4px 0 0' }}>
            {language === 'am' ? 'ባዮሜትሪክስ፣ የባህል ጾም አመጋገብ እና የሕክምና መረጃዎችዎን ያስተካክሉ።' : 'Manage biometrics, Ethiopian Orthodox & Islamic fasting adherence, and clinical nutrition targets.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          style={{
            backgroundColor: isEditing ? (isDark ? '#374151' : '#F3F4F6') : '#059669',
            color: isEditing ? (isDark ? '#F3F4F6' : '#374151') : '#FFFFFF',
            border: `1px solid ${isEditing ? (isDark ? '#4B5563' : '#D1D5DB') : 'transparent'}`,
            borderRadius: '12px', padding: '10px 18px', fontWeight: 600, fontSize: '14px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px'
          }}
        >
          {isEditing ? <Lock size={16} /> : <Unlock size={16} />}
          <span>{isEditing ? 'Lock Profile View' : 'Edit Profile'}</span>
        </button>
      </div>

      <div style={{
        backgroundColor: isDark ? '#1F2937' : '#FFFFFF', border: `1px solid ${isDark ? '#374151' : '#E5E7EB'}`,
        borderRadius: '16px', padding: '24px', marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap'
      }}>
        <div style={{ position: 'relative' }}>
          <img src={getAvatarUrl(avatarUrl)} alt={fullName} style={{ width: '88px', height: '88px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #059669' }} />
          <button type="button" onClick={() => fileInputRef.current?.click()} style={{ position: 'absolute', bottom: '0', right: '0', backgroundColor: '#059669', color: '#FFFFFF', border: '2px solid #FFFFFF', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Camera size={14} />
          </button>
          <input type="file" ref={fileInputRef} onChange={handlePhotoSelect} accept="image/*" style={{ display: 'none' }} />
        </div>

        <div style={{ flex: 1, minWidth: '220px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 6px', color: isDark ? '#FFFFFF' : '#111827' }}>{fullName || 'Selamawit Kebede'}</h2>
          <div style={{ display: 'flex', gap: '16px', color: isDark ? '#9CA3AF' : '#6B7280', fontSize: '13.5px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={14} /> {email}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={14} /> {phone || 'Not set'}</span>
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: isDark ? 'rgba(5, 150, 105, 0.15)' : '#ECFDF5', color: isDark ? '#34D399' : '#065F46', border: `1px solid ${isDark ? 'rgba(5, 150, 105, 0.3)' : '#A7F3D0'}`, padding: '4px 12px', borderRadius: '20px', fontSize: '12.5px', fontWeight: 600 }}>
            <activeFastingConfig.icon size={14} />
            <span>{activeFastingConfig.badge}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <div style={{
          backgroundColor: isDark ? '#1F2937' : '#ECFDF5', border: `1px solid ${isDark ? '#059669' : '#A7F3D0'}`,
          borderRadius: '16px', padding: '24px', marginBottom: '28px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ backgroundColor: '#059669', color: '#FFFFFF', padding: '8px', borderRadius: '10px' }}>
                <Activity size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#065F46', margin: 0 }}>
                  {language === 'am' ? 'የተሰላ ዕለታዊ የካሎሪ እና የአልሚ ምግብ ግብ' : 'Calculated Daily Nutritional Summary'}
                </h3>
                <span style={{ fontSize: '12px', color: isDark ? '#9CA3AF' : '#047857' }}>
                  Derived from your age, biometrics, target weight delta, and active clinical flags.
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: isDark ? '#34D399' : '#047857', fontWeight: 600, backgroundColor: isDark ? 'rgba(5, 150, 105, 0.2)' : '#D1FAE5', padding: '6px 12px', borderRadius: '20px' }}>
              <RefreshCw size={12} /><span>Live Engine Sync</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            <div style={{ backgroundColor: isDark ? '#111827' : '#FFFFFF', padding: '14px 16px', borderRadius: '12px', border: `1px solid ${isDark ? '#374151' : '#E5E7EB'}` }}>
              <div style={{ fontSize: '11px', color: isDark ? '#9CA3AF' : '#6B7280', fontWeight: 600, textTransform: 'uppercase' }}>BMR / TDEE</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#111827', marginTop: '2px' }}>{calculatedBmr} / {calculatedTdee} <span style={{fontSize: '13px', fontWeight: 400}}>kcal</span></div>
            </div>

            <div style={{ backgroundColor: isDark ? '#111827' : '#FFFFFF', padding: '14px 16px', borderRadius: '12px', border: `1px solid ${isDark ? '#374151' : '#E5E7EB'}` }}>
              <div style={{ fontSize: '11px', color: isDark ? '#9CA3AF' : '#6B7280', fontWeight: 600, textTransform: 'uppercase' }}>Daily Calorie Goal</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#059669', marginTop: '2px' }}>{calculatedDailyCalories} <span style={{fontSize: '13px', fontWeight: 400}}>kcal</span></div>
            </div>

            <div style={{ backgroundColor: isDark ? '#111827' : '#FFFFFF', padding: '14px 16px', borderRadius: '12px', border: `1px solid ${isDark ? '#374151' : '#E5E7EB'}` }}>
              <div style={{ fontSize: '11px', color: isDark ? '#9CA3AF' : '#6B7280', fontWeight: 600, textTransform: 'uppercase' }}>Macros Target (P/C/F)</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: isDark ? '#F3F4F6' : '#1F2937', marginTop: '4px' }}>P: {proteinTargetG}g | C: {carbsTargetG}g | F: {fatsTargetG}g</div>
            </div>

            <div style={{ backgroundColor: isDark ? '#111827' : '#FFFFFF', padding: '14px 16px', borderRadius: '12px', border: `1px solid ${isDark ? '#374151' : '#E5E7EB'}` }}>
              <div style={{ fontSize: '11px', color: isDark ? '#9CA3AF' : '#6B7280', fontWeight: 600, textTransform: 'uppercase' }}>Iron Target</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#111827', marginTop: '2px' }}>{ironRdaMg} <span style={{fontSize: '13px', fontWeight: 400}}>mg/day</span></div>
            </div>

            {medicalFlags.includes('hypertension') && (
              <div style={{ backgroundColor: isDark ? 'rgba(239, 68, 68, 0.1)' : '#FEF2F2', padding: '14px 16px', borderRadius: '12px', border: '1px solid #FCA5A5' }}>
                <div style={{ fontSize: '11px', color: '#DC2626', fontWeight: 700, textTransform: 'uppercase' }}>Low Sodium Ceiling</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#DC2626', marginTop: '2px' }}>{sodiumRdaMg} <span style={{fontSize: '13px', fontWeight: 400}}>mg/day</span></div>
              </div>
            )}

            {medicalFlags.includes('type2_diabetes') && (
              <div style={{ backgroundColor: isDark ? 'rgba(245, 158, 11, 0.1)' : '#FFFBEB', padding: '14px 16px', borderRadius: '12px', border: '1px solid #FCD34D' }}>
                <div style={{ fontSize: '11px', color: '#D97706', fontWeight: 700, textTransform: 'uppercase' }}>Strict Carb Ceiling</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#D97706', marginTop: '2px' }}>{carbsTargetG}g max / day</div>
              </div>
            )}
          </div>

          {medicalFlags.includes('pregnancy_lactation') && (
            <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: `1px solid ${isDark ? 'rgba(5, 150, 105, 0.3)' : '#A7F3D0'}`, fontSize: '13px', color: isDark ? '#34D399' : '#065F46', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Baby size={16} /><span>Calories and key prenatal micronutrients (Iron 27mg/day, Folate, Calcium) elevated for pregnancy & lactation support.</span>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '28px' }}>
          <div style={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF', border: `1px solid ${isDark ? '#374151' : '#E5E7EB'}`, borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', borderBottom: `1px solid ${isDark ? '#374151' : '#F3F4F6'}`, paddingBottom: '12px' }}>
              <User size={18} style={{ color: '#059669' }} /><span>{language === 'am' ? '1. ግላዊ መረጃ እና ባዮሜትሪክስ' : '1. Personal & Biometrics'}</span>
            </h3>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '6px', color: isDark ? '#D1D5DB' : '#4B5563' }}>{language === 'am' ? 'ሙሉ ስም' : 'Full Name'}</label>
              <input type="text" value={fullName} onChange={(e) => handleFieldChange(setFullName, e.target.value)} disabled={!isEditing} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: `1px solid ${isDark ? '#4B5563' : '#D1D5DB'}`, backgroundColor: isDark ? '#374151' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#1F2937', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '6px', color: isDark ? '#D1D5DB' : '#4B5563' }}>{language === 'am' ? 'ስልክ ቁጥር' : 'Phone Number'}</label>
              <input type="text" value={phone} onChange={(e) => handleFieldChange(setPhone, e.target.value)} disabled={!isEditing} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: `1px solid ${isDark ? '#4B5563' : '#D1D5DB'}`, backgroundColor: isDark ? '#374151' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#1F2937', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '6px', color: isDark ? '#D1D5DB' : '#4B5563' }}>{language === 'am' ? 'ዕድሜ (ዓመት)' : 'Age (years)'}</label>
                <input type="number" value={age} onChange={(e) => handleFieldChange(setAge, e.target.value)} disabled={!isEditing} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: `1px solid ${isDark ? '#4B5563' : '#D1D5DB'}`, backgroundColor: isDark ? '#374151' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#1F2937', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '6px', color: isDark ? '#D1D5DB' : '#4B5563' }}>{language === 'am' ? 'ጾታ' : 'Biological Sex'}</label>
                <select value={biologicalSex} onChange={(e) => handleFieldChange(setBiologicalSex, e.target.value)} disabled={!isEditing} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: `1px solid ${isDark ? '#4B5563' : '#D1D5DB'}`, backgroundColor: isDark ? '#374151' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#1F2937', fontSize: '14px', boxSizing: 'border-box' }}>
                  <option value="female">Female (ሴት)</option><option value="male">Male (ወንድ)</option><option value="other">Other / Preferred not to say</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px', color: isDark ? '#D1D5DB' : '#4B5563' }}>{language === 'am' ? 'ቁመት (ሴ.ሜ)' : 'Height (cm)'}</label>
                <input type="number" value={heightCm} onChange={(e) => handleFieldChange(setHeightCm, e.target.value)} disabled={!isEditing} style={{ width: '100%', padding: '10px 8px', borderRadius: '10px', border: `1px solid ${isDark ? '#4B5563' : '#D1D5DB'}`, backgroundColor: isDark ? '#374151' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#1F2937', fontSize: '13.5px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px', color: isDark ? '#D1D5DB' : '#4B5563' }}>{language === 'am' ? 'ክብደት (ኪ.ግ)' : 'Weight (kg)'}</label>
                <input type="number" value={weightKg} onChange={(e) => handleFieldChange(setWeightKg, e.target.value)} disabled={!isEditing} style={{ width: '100%', padding: '10px 8px', borderRadius: '10px', border: `1px solid ${isDark ? '#4B5563' : '#D1D5DB'}`, backgroundColor: isDark ? '#374151' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#1F2937', fontSize: '13.5px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px', color: isDark ? '#D1D5DB' : '#4B5563' }}>{language === 'am' ? 'ግብ (ኪ.ግ)' : 'Target (kg)'}</label>
                <input type="number" value={targetWeightKg} onChange={(e) => handleFieldChange(setTargetWeightKg, e.target.value)} disabled={!isEditing} style={{ width: '100%', padding: '10px 8px', borderRadius: '10px', border: `1px solid ${isDark ? '#4B5563' : '#D1D5DB'}`, backgroundColor: isDark ? '#374151' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#1F2937', fontSize: '13.5px', boxSizing: 'border-box' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '6px', color: isDark ? '#D1D5DB' : '#4B5563' }}>{language === 'am' ? 'የእንቅስቃሴ ደረጃ' : 'Activity Level'}</label>
              <select value={activityLevel} onChange={(e) => handleFieldChange(setActivityLevel, e.target.value)} disabled={!isEditing} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: `1px solid ${isDark ? '#4B5563' : '#D1D5DB'}`, backgroundColor: isDark ? '#374151' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#1F2937', fontSize: '13.5px', boxSizing: 'border-box' }}>
                {ACTIVITY_LEVEL_OPTIONS.map(opt => <option key={opt.id} value={opt.id}>{language === 'am' ? opt.labelAm : opt.labelEn}</option>)}
              </select>
            </div>
          </div>

          <div style={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF', border: `1px solid ${isDark ? '#374151' : '#E5E7EB'}`, borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', borderBottom: `1px solid ${isDark ? '#374151' : '#F3F4F6'}`, paddingBottom: '12px' }}>
              <Target size={18} style={{ color: '#059669' }} /><span>{language === 'am' ? '2. ግላዊ የሰው ሰራሽ አስተዋፅኦ ማስተካከያ' : '2. Personalized AI Calibration'}</span>
            </h3>

            <p style={{ fontSize: '13px', color: isDark ? '#9CA3AF' : '#6B7280', margin: 0, lineHeight: '1.4' }}>Select your primary health objective to guide EthioNutri AI macro balancing and meal suggestions.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {HEALTH_OBJECTIVE_OPTIONS.map(obj => {
                const isSelected = healthObjective === obj.id;
                return (
                  <button key={obj.id} type="button" disabled={!isEditing} onClick={() => handleFieldChange(setHealthObjective, obj.id)} style={{ padding: '14px 16px', borderRadius: '12px', border: isSelected ? '2px solid #059669' : `1px solid ${isDark ? '#4B5563' : '#E5E7EB'}`, backgroundColor: isSelected ? (isDark ? 'rgba(5, 150, 105, 0.12)' : '#ECFDF5') : (isDark ? '#374151' : '#FFFFFF'), textAlign: 'left', cursor: isEditing ? 'pointer' : 'default', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ marginTop: '2px', width: '18px', height: '18px', borderRadius: '50%', border: `2px solid ${isSelected ? '#059669' : (isDark ? '#9CA3AF' : '#D1D5DB')}`, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: isSelected ? '#059669' : 'transparent', color: '#FFFFFF', flexShrink: 0 }}>
                      {isSelected && <Check size={12} strokeWidth={3} />}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: isSelected ? (isDark ? '#34D399' : '#065F46') : (isDark ? '#F3F4F6' : '#1F2937') }}>{language === 'am' ? obj.titleAm : obj.titleEn}</div>
                      <div style={{ fontSize: '12px', color: isDark ? '#9CA3AF' : '#6B7280', marginTop: '2px' }}>{language === 'am' ? obj.descAm : obj.descEn}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF', border: `1px solid ${isDark ? '#374151' : '#E5E7EB'}`, borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', borderBottom: `1px solid ${isDark ? '#374151' : '#F3F4F6'}`, paddingBottom: '12px' }}>
              <Utensils size={18} style={{ color: '#059669' }} /><span>{language === 'am' ? '3. የባህል ጾም እና የምግብ ምርጫዎች' : '3. Ethiopian Fasting & Diet'}</span>
            </h3>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '8px', color: isDark ? '#D1D5DB' : '#4B5563' }}>{language === 'am' ? 'የጾም ስርዓት' : 'Fasting Practice'}</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {FASTING_PRACTICE_OPTIONS.map(opt => {
                  const isSelected = fastingPractice === opt.id;
                  const IconComp = opt.icon;
                  return (
                    <button key={opt.id} type="button" disabled={!isEditing} onClick={() => handleFieldChange(setFastingPractice, opt.id)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px', border: isSelected ? '2px solid #059669' : `1px solid ${isDark ? '#4B5563' : '#E5E7EB'}`, backgroundColor: isSelected ? (isDark ? 'rgba(5, 150, 105, 0.12)' : '#ECFDF5') : (isDark ? '#374151' : '#FFFFFF'), color: isSelected ? (isDark ? '#34D399' : '#065F46') : (isDark ? '#F3F4F6' : '#374151'), fontWeight: isSelected ? 600 : 500, cursor: isEditing ? 'pointer' : 'default', textAlign: 'left', fontSize: '13.5px' }}>
                      <IconComp size={16} style={{ color: isSelected ? '#059669' : (isDark ? '#9CA3AF' : '#6B7280') }} />
                      <span>{language === 'am' ? opt.labelAm : opt.labelEn}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '6px', color: isDark ? '#D1D5DB' : '#4B5563' }}>{language === 'am' ? 'የጾም ጥብቅነት ደረጃ' : 'Fasting Strictness'}</label>
              <select value={fastingStrictness} onChange={(e) => handleFieldChange(setFastingStrictness, e.target.value)} disabled={!isEditing} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: `1px solid ${isDark ? '#4B5563' : '#D1D5DB'}`, backgroundColor: isDark ? '#374151' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#1F2937', fontSize: '13.5px', boxSizing: 'border-box' }}>
                {FASTING_STRICTNESS_OPTIONS.map(s => <option key={s.id} value={s.id}>{language === 'am' ? s.labelAm : s.labelEn}</option>)}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '8px', color: isDark ? '#D1D5DB' : '#4B5563' }}>{language === 'am' ? 'የአመጋገብ ድንበሮች (Dietary Tags)' : 'Dietary Restrictions'}</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {DIETARY_RESTRICTION_CHIPS.map(chip => {
                  const isSelected = dietaryRestrictions.includes(chip.id);
                  return (
                    <button key={chip.id} type="button" disabled={!isEditing} onClick={() => toggleDietaryRestriction(chip.id)} style={{ padding: '6px 12px', borderRadius: '20px', border: isSelected ? '1.5px solid #059669' : `1px solid ${isDark ? '#4B5563' : '#D1D5DB'}`, backgroundColor: isSelected ? (isDark ? 'rgba(5, 150, 105, 0.2)' : '#D1FAE5') : (isDark ? '#374151' : '#FFFFFF'), color: isSelected ? (isDark ? '#34D399' : '#065F46') : (isDark ? '#D1D5DB' : '#4B5563'), fontSize: '12.5px', fontWeight: isSelected ? 600 : 500, cursor: isEditing ? 'pointer' : 'default', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {isSelected && <Check size={12} />}
                      <span>{language === 'am' ? chip.labelAm : chip.labelEn}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF', border: `1px solid ${isDark ? '#374151' : '#E5E7EB'}`, borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', borderBottom: `1px solid ${isDark ? '#374151' : '#F3F4F6'}`, paddingBottom: '12px' }}>
              <Stethoscope size={18} style={{ color: '#059669' }} /><span>{language === 'am' ? '4. ክሊኒካዊ እና የጤና ሁኔታዎች' : '4. Clinical & Medical Flags'}</span>
            </h3>

            <p style={{ fontSize: '13px', color: isDark ? '#9CA3AF' : '#6B7280', margin: 0, lineHeight: '1.4' }}>Select diagnosed conditions to customize nutrient ceilings and micronutrient RDA targets automatically.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
              {CLINICAL_CONDITION_CHIPS.map(cond => {
                const isSelected = medicalFlags.includes(cond.id) || medicalFlags.includes(cond.name);
                const IconComp = cond.icon;
                return (
                  <button key={cond.id} type="button" disabled={!isEditing} onClick={() => toggleMedicalCondition(cond.id)} style={{ padding: '10px 12px', borderRadius: '10px', border: isSelected ? '1.5px solid #059669' : `1px solid ${isDark ? '#4B5563' : '#E5E7EB'}`, backgroundColor: isSelected ? (isDark ? 'rgba(5, 150, 105, 0.15)' : '#ECFDF5') : (isDark ? '#374151' : '#FFFFFF'), color: isSelected ? (isDark ? '#34D399' : '#065F46') : (isDark ? '#E5E7EB' : '#374151'), fontSize: '12.5px', fontWeight: isSelected ? 600 : 500, cursor: isEditing ? 'pointer' : 'default', display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'left' }}>
                    <IconComp size={16} style={{ color: isSelected ? '#059669' : (isDark ? '#9CA3AF' : '#6B7280'), flexShrink: 0 }} />
                    <span style={{ flex: 1 }}>{cond.name}</span>
                    {isSelected && <Check size={14} style={{ flexShrink: 0 }} />}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF', border: `1px solid ${isDark ? '#374151' : '#E5E7EB'}`, borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', borderBottom: `1px solid ${isDark ? '#374151' : '#F3F4F6'}`, paddingBottom: '12px' }}>
              <Settings size={18} style={{ color: '#059669' }} /><span>{language === 'am' ? '5. የመተግበሪያ ቅንብሮች' : '5. App Preferences'}</span>
            </h3>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '6px', color: isDark ? '#D1D5DB' : '#4B5563' }}>{language === 'am' ? 'የቋንቋ መምረጫ' : 'Preferred Language'}</label>
              <select value={preferredLanguage} onChange={(e) => handleFieldChange(setPreferredLanguage, e.target.value)} disabled={!isEditing} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: `1px solid ${isDark ? '#4B5563' : '#D1D5DB'}`, backgroundColor: isDark ? '#374151' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#1F2937', fontSize: '14px', boxSizing: 'border-box' }}>
                <option value="en">English (UK/US)</option><option value="am">አማርኛ (Amharic)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '6px', color: isDark ? '#D1D5DB' : '#4B5563' }}>{language === 'am' ? 'የገጽታ ቀለም (Theme Mode)' : 'Theme Mode'}</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button type="button" disabled={!isEditing} onClick={() => handleFieldChange(setThemeMode, 'light')} style={{ padding: '10px', borderRadius: '10px', border: themeMode === 'light' ? '2px solid #059669' : `1px solid ${isDark ? '#4B5563' : '#E5E7EB'}`, backgroundColor: themeMode === 'light' ? '#ECFDF5' : (isDark ? '#374151' : '#FFFFFF'), color: themeMode === 'light' ? '#065F46' : (isDark ? '#9CA3AF' : '#4B5563'), fontWeight: themeMode === 'light' ? 600 : 500, cursor: isEditing ? 'pointer' : 'default', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Sun size={16} /> Light Mode
                </button>
                <button type="button" disabled={!isEditing} onClick={() => handleFieldChange(setThemeMode, 'dark')} style={{ padding: '10px', borderRadius: '10px', border: themeMode === 'dark' ? '2px solid #059669' : `1px solid ${isDark ? '#4B5563' : '#E5E7EB'}`, backgroundColor: themeMode === 'dark' ? 'rgba(5, 150, 105, 0.2)' : (isDark ? '#374151' : '#FFFFFF'), color: themeMode === 'dark' ? '#FFFFFF' : (isDark ? '#9CA3AF' : '#4B5563'), fontWeight: themeMode === 'dark' ? 600 : 500, cursor: isEditing ? 'pointer' : 'default', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Moon size={16} /> Dark Mode
                </button>
              </div>
            </div>
          </div>
        </div>

        {(isDirty || isEditing) && (
          <div style={{
            position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
            backgroundColor: isDark ? '#1F2937' : '#FFFFFF', border: `1px solid ${isDark ? '#374151' : '#E5E7EB'}`,
            borderRadius: '16px', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '16px',
            boxShadow: '0 12px 32px rgba(0,0,0,0.15)', zIndex: 999
          }}>
            <span style={{ fontSize: '13.5px', fontWeight: 600, color: isDark ? '#FFFFFF' : '#111827' }}>
              {isDirty ? (language === 'am' ? 'ያልተቀመጡ ለውጦች አሉ' : 'Unsaved profile changes') : (language === 'am' ? 'የመገለጫ አርትዖት ሁነታ' : 'Profile Edit Mode')}
            </span>

            {isDirty && (
              <button type="button" onClick={handleDiscard} disabled={isSaving} style={{ backgroundColor: 'transparent', color: isDark ? '#E5E7EB' : '#6B7280', border: `1px solid ${isDark ? '#4B5563' : '#D1D5DB'}`, borderRadius: '10px', padding: '8px 16px', fontWeight: 600, fontSize: '13.5px', cursor: 'pointer' }}>
                {language === 'am' ? 'ተው (Discard)' : 'Discard'}
              </button>
            )}

            <button type="submit" disabled={isSaving} style={{ backgroundColor: '#059669', color: '#FFFFFF', border: 'none', borderRadius: '10px', padding: '10px 20px', fontWeight: 600, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)' }}>
              {isSaving ? (
                <><RefreshCw size={16} className="animate-spin" /><span>{language === 'am' ? 'በማስቀመጥ ላይ...' : 'Saving...'}</span></>
              ) : (
                <><Sparkles size={16} /><span>{language === 'am' ? 'ለውጦችን አስቀምጥ' : 'Save Changes'}</span></>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Profile;
